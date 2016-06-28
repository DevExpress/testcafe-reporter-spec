var TestRunErrorFormattableAdapter = require('testcafe').embeddingUtils.TestRunErrorFormattableAdapter;
var UncaughtErrorOnPage            = require('testcafe').embeddingUtils.testRunErrors.UncaughtErrorOnPage;
var ActionElementNotFoundError     = require('testcafe').embeddingUtils.testRunErrors.ActionElementNotFoundError;
var testCallsite                   = require('./test-callsite');


function makeErrors (errDescrs) {
    return errDescrs.map(function (descr) {
        return new TestRunErrorFormattableAdapter(descr.err, descr.metaInfo);
    });
}

module.exports = [
    {
        method: 'reportTaskStart',
        args:   [
            new Date('1970-01-01T00:00:00.000Z'),
            [
                'Chrome',
                'Firefox'
            ],
            6
        ]
    },
    {
        method: 'reportFixtureStart',
        args:   [
            'fixture1',
            './fixture1.js'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'fixture1test1',
            [],
            74000,
            true,
            '/screenshots/1445437598847'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'fixture1test2',
            makeErrors([
                {

                    err: new UncaughtErrorOnPage('Some error', 'http://example.org'),

                    metaInfo: {
                        userAgent:      'Chrome',
                        screenshotPath: '/screenshots/1445437598847/errors',
                        callsite:       testCallsite,
                        testRunState:   'inTest'
                    }
                },
                {
                    err: new ActionElementNotFoundError(),

                    metaInfo: {
                        userAgent:    'Firefox',
                        callsite:     testCallsite,
                        testRunState: 'inTest'
                    }
                }
            ]),
            74000,
            false,
            '/screenshots/1445437598847'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'fixture1test3',
            [],
            74000,
            false,
            null
        ]
    },
    {
        method: 'reportFixtureStart',
        args:   [
            'fixture2',
            './fixture2.js'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'fixture2test1',
            [],
            74000,
            false,
            null
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'fixture2test2',
            [],
            74000,
            false,
            null
        ]
    },
    {
        method: 'reportFixtureStart',
        args:   [
            'fixture3',
            './fixture3.js'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'fixture3test1',
            makeErrors([
                {
                    err: new ActionElementNotFoundError(),

                    metaInfo: {
                        userAgent:    'Firefox',
                        callsite:     testCallsite,
                        testRunState: 'inBeforeEach'
                    }
                }
            ]),
            74000,
            true,
            null
        ]
    },
    {
        method: 'reportTaskDone',
        args:   [
            new Date('1970-01-01T00:15:25.000Z'),
            4
        ]
    }
];
