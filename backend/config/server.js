import { ConfigKey } from "config/config-keys";

const serverConfig = ({ env }) => ({
    host: env(ConfigKey.host, 'localhost'),
    port: env.int(ConfigKey.port, 3001),
    proxy: false,
    url: env(ConfigKey.baseUrl, `http://localhost:3001`),
    admin: {
        autoOpen: false,
        auth: {
            secret: env(ConfigKey.adminJwtSecret),
        },
    },
});

module.exports = serverConfig;
