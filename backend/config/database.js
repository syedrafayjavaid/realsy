import {ConfigKey} from "config/config-keys";

const databaseConfig = ({env}) => ({
    defaultConnection: "default",
    connections: {
        default: {
            connector: "bookshelf",
            settings: {
                client: env(ConfigKey.databaseClient, 'postgres'),
                host: env(ConfigKey.rdsHost) ?? env(ConfigKey.databaseHost, 'localhost'),
                port: env.int(ConfigKey.rdsPort) ?? env.int(ConfigKey.databasePort, 5432),
                database: env(ConfigKey.rdsDatabaseName) ?? env(ConfigKey.databaseName, 'realsy'),
                username: env(ConfigKey.rdsUsername) ?? env(ConfigKey.databaseUsername, 'realsy'),
                password: env(ConfigKey.rdsPassword) ?? env(ConfigKey.databasePassword, 'realsy'),
                schema: 'public',
            },
            options: {
                useNullAsDefault: env(ConfigKey.databaseClient, 'postgres') === 'sqlite',
            },
        },
    },
});

module.exports = databaseConfig;
