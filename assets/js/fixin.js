(function() {
  const STATUS_KEY = 'maintenanceStatus';
  const MAINTENANCE_PAGE = 'fixin.html';
  const HOME_PAGE = 'index.html';
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiDeBbVEyi5nhvpBnmGBe-FTcpZhoYCUbNHO07WqqCWiwQVSd_E0aoR4K89hwW85MubBM05y09MjO5/pub?gid=0&single=true&output=csv';

  // Step 1: Check stored value first
  const storedStatus = localStorage.getItem(STATUS_KEY);
  if (storedStatus === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
    console.log('[MEMORY] Maintenance mode ON — redirecting immediately');
    window.location.href = MAINTENANCE_PAGE;
    return; // stop here to avoid flash of content
  }
  if (storedStatus === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
    console.log('[MEMORY] Maintenance mode OFF — redirecting to index.html');
    window.location.href = HOME_PAGE;
    return;
  }

  // Step 2: Fetch latest status
  fetch(sheetUrl)
    .then(response => response.text())
    .then(csv => {
      const rows = csv.split('\n');
      const liveStatus = rows[0].split(',')[0].trim().toUpperCase(); // A1 cell
      console.log(`[FETCH] Maintenance status from sheet: ${liveStatus}`);

      // Update stored value
      localStorage.setItem(STATUS_KEY, liveStatus);

      // Redirect if state changed
      if (liveStatus === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
        console.log('[LIVE] Maintenance mode ON — redirecting now');
        window.location.href = MAINTENANCE_PAGE;
      } else if (liveStatus === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
        console.log('[LIVE] Maintenance mode OFF — redirecting to index.html');
        window.location.href = HOME_PAGE;
      }
    })
    .catch(err => console.error('Error fetching maintenance status:', err));
})();
