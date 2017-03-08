var wilkins = require('../');
wilkins.handleExceptions(new wilkins.transports.Console({ colorize: true, json: true }));

throw new Error('Hello, wilkins!');
