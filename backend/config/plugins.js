import { ConfigKey } from "config/config-keys";

const pluginConfig = ({ env }) => {
    let config = {
        upload: {
            provider: env(ConfigKey.fileUploadProvider) || 'local',
            providerOptions: {
                accessKeyId: env(ConfigKey.uploadAwsAccessToken),
                secretAccessKey: env(ConfigKey.uploadAwsSecretToken),
                region: env(ConfigKey.uploadAwsRegion),
                params: {
                    Bucket: env(ConfigKey.uploadAwsBucket),
                },
            },
        },
    };

    if (!env.bool(ConfigKey.disableEmails)) {
        config.email = {
            provider: env(ConfigKey.emailProvider, 'amazon-ses'),
            providerOptions: {
                key: env(ConfigKey.amazonSesKey),
                secret: env(ConfigKey.amazonSesSecret),
                amazon: env(ConfigKey.amazonSesUrl),
            },
            settings: {
                defaultFrom: env(ConfigKey.emailDefaultFrom, 'system@realsyhomes.com'),
                defaultReplyTo: env(ConfigKey.emailDefaultReplyTo, 'system@realsyhomes.com'),
            },
        };
    }

    return config;
};

module.exports = pluginConfig;
