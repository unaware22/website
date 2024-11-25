const http = require('http');
const url = require('url');

// API Key untuk autentikasi
const API_KEY = '2GPw3B19CI1Ogg3rDgvUuZidCemshPLP';

// Data jadwal restoran
const schedules = {
    monday: "09.00 - 22.00",
    tuesday: "09.00 - 22.00",
    wednesday: "09.00 - 22.00",
    thursday: "09.00 - 22.00",
    friday: "09.00 - 23.00",
    saturday: "10.00 - 23.00",
    sunday: "Closed",
};

// Membuat server HTTP
const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;
    const endpoint = url.parse(req.url, true).pathname;

    // Set header CORS agar bisa diakses dari frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Periksa endpoint dan API Key
    if (endpoint === '/api/schedule') {
        if (query.api_key === API_KEY) {
            res.writeHead(200);
            res.end(JSON.stringify(schedules));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Invalid API Key' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

// Jalankan server pada port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
