/**
 * Babel transpiler configuration
 */
module.exports = {
    "presets": [
        "next/babel"
    ],
    "plugins": [
        [
            "module-resolver",
            {
                // resolve modules from project root (instead of "../../../module")
                "root": ["./"],
                "extensions": [".ts", ".tsx", ".js", '.jsx'],
            }
        ]
    ],
    "env": {
        "production": {
            "plugins": [
                "react-remove-properties" // remove test IDs during production build
            ]
        }
    }
};
