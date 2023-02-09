/**
 * Jest testing framework config
 */
module.exports = {
    rootDir: "./",
    "transform": {
        "^.+\\.(j|t)s(x)?$": "babel-jest",
        ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css"
    },
    "moduleNameMapper": {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    runner: "groups",
    globalSetup: './__tests__/bootstrap-tests.js',
    testRegex: "(spec|test)\\.(j|t)s(x)?$",
    testPathIgnorePatterns: [
        '.next',
        '.ebextensions',
        '.elasticbeanstalk',
        'node_modules',
    ],
    setupFilesAfterEnv: ['jest-canvas-mock'],
};
