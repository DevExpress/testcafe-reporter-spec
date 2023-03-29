const createCallsiteRecord = require('callsite-record');

function someFunc () {
    throw new Error('Hey ya!');
}

try {
    someFunc();
}
catch (err) {
    const callsiteRecord = createCallsiteRecord(err);

    callsiteRecord.stackFrames.splice(callsiteRecord.stackFrames.length - 8, 8);

    module.exports = callsiteRecord;
}

