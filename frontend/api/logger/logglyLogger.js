export let LogglyLogger = {push: (param) => { console.log(param); }};

if (process.browser) {
    const Loggly = require('loggly-jslogger');
    LogglyLogger = new Loggly.LogglyTracker();
    LogglyLogger.push({
        logglyKey: process.env.NEXT_PUBLIC_LOGGLY_CUSTOMER_TOKEN,
        sendConsoleErrors : true,
    });
}
