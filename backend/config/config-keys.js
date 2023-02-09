/**
 * Specifies keys used for env/config vars (to avoid accessing env vars by magic strings)
 */
export const ConfigKey = {
    host: 'HOST',
    port: 'PORT',

    baseUrl: 'BASE_URL',
    frontendUrl: 'FRONTEND_URL',

    seedAdminUsername: 'SEED_ADMIN_USERNAME',
    seedAdminEmail: 'SEED_ADMIN_EMAIL',
    seedAdminPassword: 'SEED_ADMIN_PASSWORD',

    adminJwtSecret: 'ADMIN_JWT_SECRET',

    databaseClient: 'DATABASE_CLIENT',
    databaseHost: 'DATABASE_HOST',
    databasePort: 'DATABASE_PORT',
    databaseName: 'DATABASE_NAME',
    databaseUsername: 'DATABASE_USERNAME',
    databasePassword: 'DATABASE_PASSWORD',
    rdsHost: 'RDS_HOSTNAME',
    rdsPort: 'RDS_PORT',
    rdsDatabaseName: 'RDS_DB_NAME',
    rdsUsername: 'RDS_USERNAME',
    rdsPassword: 'RDS_PASSWORD',

    fileUploadProvider: 'FILE_UPLOAD_PROVIDER',
    uploadAwsAccessToken: 'FILE_UPLOAD_AWS_ACCESS_TOKEN',
    uploadAwsSecretToken: 'FILE_UPLOAD_AWS_SECRET_TOKEN',
    uploadAwsRegion: 'FILE_UPLOAD_AWS_REGION',
    uploadAwsBucket: 'FILE_UPLOAD_AWS_S3_BUCKET',

    disableTexts: 'DISABLE_TEXTS',
    disableEmails: 'DISABLE_EMAILS',
    disableRateLimit: 'DISABLE_RATE_LIMIT',

    defaultListingStatus: 'DEFAULT_LISTING_STATUS',
    allowDuplicateListings: 'ALLOW_DUPLICATE_LISTINGS',
    listingAdminEmail: 'LISTING_ADMIN_EMAIL',

    defaultOfferStatus: 'DEFAULT_OFFER_STATUS',

    testPhoneNumber: 'TEST_PHONE_NUMBER',
    testEmail: 'TEST_EMAIL',

    nexmoApiKey: 'NEXMO_API_KEY',
    nexmoApiSecret: 'NEXMO_API_SECRET',
    nexmoFromNumber: 'NEXMO_FROM_NUMBER',

    googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',

    campaignMonitorApiKey: 'CAMPAIGN_MONITOR_API_KEY',
    campaignMonitorListId: 'CAMPAIGN_MONITOR_LIST_ID',

    homeJunctionLicense: 'HOME_JUNCTION_LICENSE',
    homeJunctionApiUrl: 'HOME_JUNCTION_API_URL',
    mockHomeJunctionApi: 'MOCK_HOME_JUNCTION_API',

    docusignClientId: 'DOCUSIGN_CLIENT_ID',
    docusignAccountId: 'DOCUSIGN_ACCOUNT_ID',
    docusignAuthUrl: 'DOCUSIGN_AUTH_URL',
    docusignBaseUrl: 'DOCUSIGN_BASE_URL',
    docusignUserId: 'DOCUSIGN_USER_ID',
    docusignPrivateKey: 'DOCUSIGN_PRIVATE_KEY',

    emailProvider: 'EMAIL_PROVIDER',
    emailDefaultFrom: 'EMAIL_DEFAULT_FROM',
    emailDefaultReplyTo: 'EMAIL_DEFAULT_REPLY_TO',
    amazonSesKey: 'AMAZON_SES_KEY',
    amazonSesSecret: 'AMAZON_SES_SECRET',
    amazonSesUrl: 'AMAZON_SES_URL',

    logLevel: 'LOG_LEVEL',
    logglyCustomerToken: 'LOGGLY_CUSTOMER_TOKEN',
};
