self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-results') {
        event.waitUntil(syncResults());
    }
});

async function syncResults() {
    try {
        const response = await fetch('https://api.bdg88xyz.com/api/webapi/GetNoaverageEmerdList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pageSize: 10,
                pageNo: 1,
                typeId: 1,
                language: 0,
                random: '4a0522c6ecd8410496260e686be2a57c',
                signature: '334B5E70A0C9B8918B0B15E517E2069C',
                timestamp: Math.floor(Date.now() / 1000)
            })
        });
        const data = await response.json();
        const latest = data?.data?.list[0];
        if (latest) {
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'result',
                    data: {
                        period: latest.issueNumber,
                        apiResult: parseInt(latest.number, 10) % 10 >= 5 ? 'BIG' : 'SMALL'
                    }
                });
            });
        }
    } catch (err) {
        console.error('Sync failed:', err);
    }
}