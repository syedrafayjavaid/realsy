import {ConfigKey} from "config/config-keys";

const productionServerConfig = ({env}) => ({
    host: env(ConfigKey.host, 'localhost'),
    port: env.int(ConfigKey.port, 3001),
    proxy: true,
    url: 'https://api.realsyhomes.com',
    admin: {
        autoOpen: false,
        auth: {
            secret: env(ConfigKey.adminJwtSecret),
        },
    },
});

module.exports = productionServerConfig;
