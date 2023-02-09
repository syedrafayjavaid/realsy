const babelConfig = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "12"
                }
            }
        ]
    ],
    plugins: [
        [
            "module-resolver",
            {
                "root": [ "./" ]
            }
        ],
    ],
    sourceMaps: true,
    test: /\.js$/,
    ignore: [
        'admin',
        "node_modules",
        '.ebextensions',
        ".elasticbeanstalk",
        ".tmp",
        "build",
        'exports',
        'build',
    ]
};

module.exports = babelConfig;
