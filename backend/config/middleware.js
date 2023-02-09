import { ConfigKey } from "config/config-keys";

const middlewareConfig = ({ env }) => ({
    timeout: 100,
    load: {
        before: [
            "responseTime",
            "logger",
            "cors",
            "responses",
            "gzip",
        ],
        order: [
            "Define the middlewares' load order by putting their name in this array is the right order",
        ],
        after: [
            "parser",
            "router",
        ],
    },
    settings: {
        favicon: {
            path: "favicon.ico",
            maxAge: 86400000,
        },
        public: {
            path: "./public",
            maxAge: 60000,
        },
        session: {
            enabled: true,
            client: "cookie",
            key: "strapi.sid",
            prefix: "strapi:sess:",
            secretKeys: ["mySecretKey1", "mySecretKey2"],
            httpOnly: true,
            maxAge: 86400000,
            overwrite: true,
            signed: false,
            rolling: false,
        },
        logger: {
            level: env(ConfigKey.logLevel, 'info'),
            exposeInContext: true,
            requests: true,
        },
        parser: {
            enabled: true,
            multipart: true,
            includeUnparsed: true,
        },
        gzip: {
            enabled: false,
        },
        responseTime: {
            enabled: false,
        },
        csp: {
            enabled: true,
            policy: ["block-all-mixed-content"],
        },
        p3p: {
            enabled: false,
            value: "",
        },
        hsts: {
            enabled: true,
            maxAge: 31536000,
            includeSubDomains: true,
        },
        xframe: {
            enabled: true,
            value: "SAMEORIGIN",
        },
        xss: {
            enabled: true,
            mode: "block",
        },
        cors: {
            enabled: false,
        },
        ip: {
            enabled: false,
            whiteList: ['http://23.20.82.14:3001', 'http://23.20.82.14:3000'],
            blackList: [],
        },
        language: {
            enabled: true,
            defaultLocale: "en_us",
            modes: [
                "query",
                "subdomain",
                "cookie",
                "header",
                "url",
                "tld",
            ],
            cookieName: "locale",
        },
    },
});

module.exports = middlewareConfig;
