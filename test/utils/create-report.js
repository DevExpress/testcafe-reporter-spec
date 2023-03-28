const buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
const pluginFactory       = require('../../lib');
const reporterTestCalls   = require('./reporter-test-calls');

module.exports = function createReport (withColors) {
    const outStream = {
        data: '',

        write: function (text) {
            this.data += text;
        }
    };

    const plugin = buildReporterPlugin(pluginFactory, outStream);

    plugin.chalk.enabled = !plugin.noColors && withColors;
    plugin.symbols       = { ok: '✓', err: '✖' };

    // NOTE: disable errors coloring if we don't have custom
    // error decorator. Default error colors may be prone to changing.
    if (plugin.chalk.enabled && !pluginFactory().createErrorDecorator) {
        const origFormatError = plugin.formatError;

        plugin.formatError = function () {
            plugin.chalk.enabled = false;

            const result = origFormatError.apply(plugin, arguments);

            plugin.chalk.enabled = true;

            return result;
        };
    }

    reporterTestCalls.forEach(function (call) {
        plugin[call.method].apply(plugin, call.args);
    });

    // NOTE: mock stack entries
    return outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');
};
