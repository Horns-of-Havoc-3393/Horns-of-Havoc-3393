(function() {
  const STATUS_KEY = 'maintenanceStatus';
  const REDIRECT_KEY = 'recentRedirect';
  const MAINTENANCE_PAGE = 'fixin.html';
  const HOME_PAGE = 'index.html';
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiDeBbVEyi5nhvpBnmGBe-FTcpZhoYCUbNHO07WqqCWiwQVSd_E0aoR4K89hwW85MubBM05y09MjO5/pub?gid=0&single=true&output=csv';
  const REQUEST_INTERVAL = 1000; // 1 second
  const REQUEST_COUNT = 100;
  const REQUIRED_CONFIRMATIONS = 3; // consecutive new status to confirm

  let burstIntervalId = null;
  let lastFetchedStatus = null;
  let consecutiveCount = 0;

  // Clean ?reload from URL
  if (window.location.search.includes('reload')) {
    history.replaceState({}, '', window.location.pathname);
  }

  // Check if this load is redirect-triggered
  const isRedirectReload = sessionStorage.getItem(REDIRECT_KEY) === 'TRUE';
  sessionStorage.removeItem(REDIRECT_KEY);

  // Fetch status
  function fetchStatus(source) {
    fetch(sheetUrl)
      .then(r => r.text())
      .then(csv => {
        const liveStatus = csv.split('\n')[0].split(',')[0].trim().toUpperCase();
        console.log(`[FETCH-${source}] Live status: ${liveStatus}`);
        handleRedirect(liveStatus, source);
      })
      .catch(err => console.error(`[FETCH-${source}] Error fetching status:`, err));
  }

  // Handle redirect with confirmation
  function handleRedirect(fetchedStatus, source) {
    const storedStatus = localStorage.getItem(STATUS_KEY);
    console.log(`[HANDLE-${source}] Stored: ${storedStatus}, Fetched: ${fetchedStatus}`);

    if (fetchedStatus !== storedStatus) {
      // Status differs → check consecutive
      if (fetchedStatus === lastFetchedStatus) {
        consecutiveCount++;
      } else {
        lastFetchedStatus = fetchedStatus;
        consecutiveCount = 1;
      }

      console.log(`[HANDLE-${source}] Consecutive unconfirmed: ${consecutiveCount}/${REQUIRED_CONFIRMATIONS}`);

      if (consecutiveCount >= REQUIRED_CONFIRMATIONS) {
        console.log(`[HANDLE-${source}] Confirmed status change → updating stored value and redirecting`);
        localStorage.setItem(STATUS_KEY, fetchedStatus);
        sessionStorage.setItem(REDIRECT_KEY, 'TRUE');

        if (burstIntervalId) {
          clearInterval(burstIntervalId);
          burstIntervalId = null;
          console.log(`[HANDLE-${source}] Burst stopped due to confirmed status change`);
        }

        if (fetchedStatus === 'TRUE') {
          console.log(`[HANDLE-${source}] Redirecting to maintenance page`);
          window.location.href = MAINTENANCE_PAGE + '?reload';
        } else {
          console.log(`[HANDLE-${source}] Redirecting to home page`);
          window.location.href = HOME_PAGE + '?reload';
        }
      }
    } else {
      // Status matches stored → reset counters
      lastFetchedStatus = null;
      consecutiveCount = 0;

      // Fix wrong page if needed
      if (fetchedStatus === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
        console.log(`[HANDLE-${source}] Wrong page → redirecting to maintenance`);
        sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
        window.location.href = MAINTENANCE_PAGE + '?reload';
      } else if (fetchedStatus === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
        console.log(`[HANDLE-${source}] Wrong page → redirecting to home`);
        sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
        window.location.href = HOME_PAGE + '?reload';
      }
    }
  }

  // Memory check on load
  const storedStatus = localStorage.getItem(STATUS_KEY);
  console.log(`[MEMORY] Stored status on load: ${storedStatus}`);
  if (storedStatus === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
    console.log('[MEMORY] Maintenance ON → redirecting immediately');
    sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
    window.location.href = MAINTENANCE_PAGE + '?reload';
    return;
  }
  if (storedStatus === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
    console.log('[MEMORY] Maintenance OFF → redirecting to home immediately');
    sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
    window.location.href = HOME_PAGE + '?reload';
    return;
  }

  // Burst checks
  function runBurstChecks() {
    console.log(`[BURST] Starting burst of ${REQUEST_COUNT} checks`);
    let count = 0;
    burstIntervalId = setInterval(() => {
      count++;
      fetchStatus(`BURST-${count}`);
      if (count >= REQUEST_COUNT) {
        clearInterval(burstIntervalId);
        burstIntervalId = null;
        console.log('[BURST] Burst completed');
        waitUntilNextHalfHour();
      }
    }, REQUEST_INTERVAL);
  }

  // Half-hour scheduling
  function waitUntilNextHalfHour() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const msToNextHalfHour = ((30 - (minutes % 30)) * 60 - seconds) * 1000;
    console.log(`[SCHEDULE] Waiting ${msToNextHalfHour / 1000}s until next half-hour burst`);
    setTimeout(runBurstChecks, msToNextHalfHour);
  }

  // Only run burst on user refresh, not redirect-triggered reload
  if (!isRedirectReload) {
    console.log('[USER BURST] User refresh detected → starting burst checks');
    runBurstChecks();
  } else {
    console.log('[INFO] Script-triggered reload → skipping user burst');
  }

  // Schedule half-hour bursts
  waitUntilNextHalfHour();
})();
  