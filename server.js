const {createServer} = require('http');
const next = require('next');
require('dotenv').config()

const app = next({
    dev: process.env.NODE_ENV !== 'production'
})
const PORT = process.env.PORT;
const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(PORT, err => {
        if(err) throw err;
        console.log(`Server is ready & listing on localhost:${PORT}`);
    })
})