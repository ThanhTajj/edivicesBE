const dns = require('dns');
dns.setServers(['8.8.8.8']);
console.log('Resolving _mongodb._tcp.cluster0.umqlyxq.mongodb.net with 8.8.8.8...');
dns.resolveSrv('_mongodb._tcp.cluster0.umqlyxq.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('Error resolving SRV:', err);
    } else {
        console.log('SRV Records:', addresses);
    }
});
