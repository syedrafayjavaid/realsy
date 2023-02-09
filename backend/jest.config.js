/**
 * Config for Jest testing framework
 */
module.exports = {
    // rootDir: "./__tests__",
    testEnvironment: "node",
    coverageDirectory: "./coverage",
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    testRegex: "(spec|test)\\.js$",
    globalSetup: "./__tests__/bootstrap-tests.js",
    setupFilesAfterEnv: [
        './__tests__/bootstrap-tests-post-env.js',
    ],
    testPathIgnorePatterns: [
        '.cache',
        '.ebextensions',
        '.elasticbeanstalk',
        '.tmp',
        'build',
        'exports',
        'node_modules',
    ],
    runner: "groups",
    forceExit: true,
};
