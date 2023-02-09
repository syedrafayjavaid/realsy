const withBundleAnalyzer = require('@next/bundle-analyzer')({enabled: process.env.ANALYZE === 'true'})
const withSourceMaps = require('@zeit/next-source-maps');

/**
 * NextJS framework configuration
 */
module.exports = withSourceMaps(withBundleAnalyzer({
    webpack(config) {
        // don't include spec/test files in built package
        config.module.rules.push({
            test: /\.(spec|test).[jt]s(x)?$/,
            loader: 'ignore-loader',
        });
        config.module.rules.push({
            test: /__tests__/,
            loader: 'ignore-loader',
        });

        return config;
    },

    // require "page.js(x)" or "route.js" extension for page components
    // (this lets us co-locate non-page files with page components in the pages directory)
    pageExtensions: ["page.tsx", "page.ts", "page.js", "page.jsx", "route.ts", "route.js"],
}));
