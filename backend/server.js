/**
 * The main server
 * Strapi allows starting with just "strapi start", but we use this file so we can transpile with Babel
 */
import strapi from 'strapi';

const server = strapi({
    autoReload: process.env.NODE_ENV === 'development',
});

server.start().then(() => console.log('API started'));
