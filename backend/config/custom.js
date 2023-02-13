import { ConfigKey } from "config/config-keys";

const customConfig = ({ env }) => ({
    [ConfigKey.frontendUrl]: env(ConfigKey.frontendUrl, 'https://realsy.homes'),

    [ConfigKey.seedAdminUsername]: env(ConfigKey.seedAdminUsername),
    [ConfigKey.seedAdminEmail]: env(ConfigKey.seedAdminEmail),
    [ConfigKey.seedAdminPassword]: env(ConfigKey.seedAdminPassword),

    [ConfigKey.allowDuplicateListings]: env.bool(ConfigKey.allowDuplicateListings, false),
    [ConfigKey.mockHomeJunctionApi]: env.bool(ConfigKey.mockHomeJunctionApi, false),
    [ConfigKey.disableTexts]: env.bool(ConfigKey.disableTexts, false),
    [ConfigKey.disableEmails]: env.bool(ConfigKey.disableEmails, false),

    [ConfigKey.defaultListingStatus]: env(ConfigKey.defaultListingStatus, 'pending_realsy'),
    [ConfigKey.defaultOfferStatus]: env(ConfigKey.defaultOfferStatus, 'pending_realsy'),
});

module.exports = customConfig;
