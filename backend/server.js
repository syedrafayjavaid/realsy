/**
 * The main server
 * Strapi allows starting with just "strapi start", but we use this file so we can transpile with Babel
 */
import strapi from 'strapi';

const server = strapi({
    autoReload: process.env.NODE_ENV === 'development',
});

server.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.start().then(() => console.log('API started'));
