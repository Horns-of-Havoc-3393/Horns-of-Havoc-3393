// (function() {
//   const STATUS_KEY = 'maintenanceStatus';
//   const MAINTENANCE_PAGE = 'fixin.html';
//   const HOME_PAGE = 'index.html';
//   const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiDeBbVEyi5nhvpBnmGBe-FTcpZhoYCUbNHO07WqqCWiwQVSd_E0aoR4K89hwW85MubBM05y09MjO5/pub?gid=0&single=true&output=csv';
//   const CHECK_INTERVAL = 30000; // 30 seconds

//   function handleRedirect(status, source) {
//     localStorage.setItem(STATUS_KEY, status);
//     if (status === 'TRUE' && !window.location.href.includes(MAINTENANCE_PAGE)) {
//       console.log(`[${source}] Maintenance mode ON — redirecting`);
//       window.location.href = MAINTENANCE_PAGE;
//     } else if (status === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
//       console.log(`[${source}] Maintenance mode OFF — redirecting to index.html`);
//       window.location.href = HOME_PAGE;
//     }
//   }

//   function fetchStatus(source) {
//     fetch(sheetUrl)
//       .then(response => response.text())
//       .then(csv => {
//         const rows = csv.split('\n');
//         const liveStatus = rows[0].split(',')[0].trim().toUpperCase(); // A1 cell
//         console.log(`[FETCH-${source}] Status from sheet: ${liveStatus}`);
//         handleRedirect(liveStatus, `LIVE-${source}`);
//       })
//       .catch(err => console.error(`[${source}] Error fetching maintenance status:`, err));
//   }

//   // 1️⃣ Instant memory check
//   const storedStatus = localStorage.getItem(STATUS_KEY);
//   if (storedStatus === 'TRUE') {
//     console.log('[MEMORY] Maintenance mode ON — redirecting immediately');
//     window.location.href = MAINTENANCE_PAGE;
//     return;
//   }
//   if (storedStatus === 'FALSE' && window.location.href.includes(MAINTENANCE_PAGE)) {
//     console.log('[MEMORY] Maintenance mode OFF — redirecting to index.html');
//     window.location.href = HOME_PAGE;
//     return;
//   }

//   // 2️⃣ First live check
//   fetchStatus('INITIAL');

//   // 3️⃣ Keep checking every X seconds
//   setInterval(() => {
//     fetchStatus('INTERVAL');
//   }, CHECK_INTERVAL);

// })();
