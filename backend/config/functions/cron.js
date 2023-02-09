const ScheduledTasks = {
    // formatted as: 'cron time format': <function to run>
    // time format: [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
    // simple example - every monday at 1am.
    // '0 1 * * 1': () => {}
};

module.exports = ScheduledTasks;
