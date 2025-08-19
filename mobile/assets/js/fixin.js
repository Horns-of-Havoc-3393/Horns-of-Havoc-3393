(function () {
  const STATUS_KEY = 'maintenanceStatus';
  const REDIRECT_KEY = 'recentRedirect';
  const RETURN_PAGE_KEY = 'returnPage';
  const MAINTENANCE_PAGE = 'fixin.html';
  const sheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiDeBbVEyi5nhvpBnmGBe-FTcpZhoYCUbNHO07WqqCWiwQVSd_E0aoR4K89hwW85MubBM05y09MjO5/pub?gid=0&single=true&output=csv';

  const REQUEST_INTERVAL = 1000; // ms between checks
  const REQUEST_COUNT = 100; // number of checks on full burst
  const REQUIRED_CONFIRMATIONS = 5; // consecutive confirmations required

  let burstIntervalId = null;
  let lastFetchedStatus = null;
  let consecutiveCount = 0;

  // Clean ?reload from URL
  if (window.location.search.includes('reload')) {
    history.replaceState({}, '', window.location.pathname);
  }

  // Detect if reload was triggered by redirect
  const isRedirectReload = sessionStorage.getItem(REDIRECT_KEY) === 'TRUE';
  sessionStorage.removeItem(REDIRECT_KEY);

  /** Fetch status from Google Sheet */
  function fetchStatus(source) {
    fetch(sheetUrl)
      .then((r) => r.text())
      .then((csv) => {
        const liveStatus = csv.split('\n')[0].split(',')[0].trim().toUpperCase();
        console.log(`[FETCH-${source}] Live status: ${liveStatus}`);
        handleRedirect(liveStatus, source);
      })
      .catch((err) => console.error(`[FETCH-${source}] Error fetching status:`, err));
  }

  /** Handle redirects and confirmations */
  function handleRedirect(fetchedStatus, source) {
    const storedStatus = localStorage.getItem(STATUS_KEY);
    console.log(`[HANDLE-${source}] Stored: ${storedStatus}, Fetched: ${fetchedStatus}`);

    if (fetchedStatus !== storedStatus) {
      // status changed → need confirmations
      if (fetchedStatus === lastFetchedStatus) {
        consecutiveCount++;
      } else {
        lastFetchedStatus = fetchedStatus;
        consecutiveCount = 1;
      }

      console.log(
        `[HANDLE-${source}] Consecutive unconfirmed: ${consecutiveCount}/${REQUIRED_CONFIRMATIONS}`
      );

      if (consecutiveCount >= REQUIRED_CONFIRMATIONS) {
        console.log(`[HANDLE-${source}] Confirmed status change`);
        localStorage.setItem(STATUS_KEY, fetchedStatus);
        sessionStorage.setItem(REDIRECT_KEY, 'TRUE');

        if (burstIntervalId) {
          clearInterval(burstIntervalId);
          burstIntervalId = null;
          console.log(`[HANDLE-${source}] Burst stopped after confirmation`);
        }

        if (fetchedStatus === 'TRUE') {
          // Save current page before redirect
          sessionStorage.setItem(RETURN_PAGE_KEY, window.location.href);
          console.log(`[HANDLE-${source}] Redirecting → maintenance page`);
          window.location.href = MAINTENANCE_PAGE + '?reload';
        } else {
          // Restore previous page or fallback
          const returnPage = sessionStorage.getItem(RETURN_PAGE_KEY) || 'index.html';
          console.log(`[HANDLE-${source}] Redirecting → return page: ${returnPage}`);
          window.location.href = returnPage + '?reload';
        }
      }
    } else {
      // status matches stored → reset
      lastFetchedStatus = null;
      consecutiveCount = 0;

      // Ensure correct page
      if (fetchedStatus === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
        sessionStorage.setItem(RETURN_PAGE_KEY, window.location.href);
        console.log(`[HANDLE-${source}] Wrong page → fixing to maintenance`);
        sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
        window.location.href = MAINTENANCE_PAGE + '?reload';
      } else if (
        fetchedStatus === 'FALSE' &&
        window.location.href.includes(MAINTENANCE_PAGE)
      ) {
        const returnPage = sessionStorage.getItem(RETURN_PAGE_KEY) || 'index.html';
        console.log(`[HANDLE-${source}] Wrong page → fixing to ${returnPage}`);
        sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
        window.location.href = returnPage + '?reload';
      }
    }
  }

  /** Memory check on load */
  const storedStatus = localStorage.getItem(STATUS_KEY);
  console.log(`[MEMORY] Stored status on load: ${storedStatus}`);
  if (storedStatus === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
    sessionStorage.setItem(RETURN_PAGE_KEY, window.location.href);
    console.log('[MEMORY] Maintenance ON → redirect immediately');
    sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
    window.location.href = MAINTENANCE_PAGE + '?reload';
    return;
  }
  if (storedStatus === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
    const returnPage = sessionStorage.getItem(RETURN_PAGE_KEY) || 'index.html';
    console.log('[MEMORY] Maintenance OFF → return immediately');
    sessionStorage.setItem(REDIRECT_KEY, 'TRUE');
    window.location.href = returnPage + '?reload';
    return;
  }

  /** Burst checks */
  function runBurstChecks(checkCount = REQUEST_COUNT) {
    console.log(`[BURST] Starting burst of ${checkCount} checks`);
    let count = 0;
    burstIntervalId = setInterval(() => {
      count++;
      fetchStatus(`BURST-${count}`);
      if (count >= checkCount) {
        clearInterval(burstIntervalId);
        burstIntervalId = null;
        console.log('[BURST] Burst completed');
        waitUntilNextHalfHour();
      }
    }, REQUEST_INTERVAL);
  }

  /** Wait until next half-hour mark */
  function waitUntilNextHalfHour() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const msToNextHalfHour = ((30 - (minutes % 30)) * 60 - seconds) * 1000;
    console.log(
      `[SCHEDULE] Waiting ${msToNextHalfHour / 1000}s until next half-hour burst`
    );
    setTimeout(runBurstChecks, msToNextHalfHour);
  }

  // Run appropriate burst depending on reload type
  if (!isRedirectReload) {
    console.log('[USER BURST] Manual refresh → full burst');
    runBurstChecks(REQUEST_COUNT);
  } else {
    console.log('[AUTO BURST] Redirect reload → half burst');
    runBurstChecks(Math.floor(REQUEST_COUNT / 2));
  }

  // Always schedule the next half-hour burst
  waitUntilNextHalfHour();
})();
