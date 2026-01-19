const dns = require('dns');
console.log('Resolving _mongodb._tcp.cluster0.umqlyxq.mongodb.net...');
dns.resolveSrv('_mongodb._tcp.cluster0.umqlyxq.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('Error resolving SRV:', err);
    } else {
        console.log('SRV Records:', addresses);
    }
});
