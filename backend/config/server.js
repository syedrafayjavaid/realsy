import { ConfigKey } from "config/config-keys";

const serverConfig = ({ env }) => ({
    host: env(ConfigKey.host, 'localhost'),
    port: env.int(ConfigKey.port, 3001),
    proxy: true,
    url: env(ConfigKey.baseUrl, `https://realsy.homes`),
    admin: {
        autoOpen: false,
        auth: {
            secret: env(ConfigKey.adminJwtSecret),
        },
    },
});

module.exports = serverConfig;
