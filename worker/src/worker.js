console.log('Worker started - demo background worker');
setInterval(()=> { console.log('Worker heartbeat', new Date().toISOString()) }, 30_000);
