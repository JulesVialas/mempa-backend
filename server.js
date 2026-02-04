const http = require('http');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Serveur Backend démarré sur le port ${port}`);
});