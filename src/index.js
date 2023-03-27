export default function () {
    return {
        noColors:       false,
        startTime:      null,
        afterErrorList: false,
        testCount:      0,
        skipped:        0,

        reportTaskStart (startTime, userAgents, testCount) {
            this.startTime = startTime;
            this.testCount = testCount;

            const writeData = {
                startTime,
                userAgents,
                testCount,
            };

            this.setIndent(1)
                .useWordWrap(true)
                .write(this.chalk.bold('Running tests in:'), writeData)
                .newline();

            userAgents.forEach(ua => {
                this
                    .write(`- ${this.chalk.blue(ua)}`, writeData)
                    .newline();
            });
        },

        reportFixtureStart (name, path, meta) {
            this.setIndent(1)
                .useWordWrap(true);

            if (this.afterErrorList)
                this.afterErrorList = false;
            else
                this.newline();

            const writeData = { name, path, meta };

            this.write(name, writeData)
                .newline();
        },

        _renderErrors (errs, writeData) {
            this.setIndent(3)
                .newline();

            errs.forEach((err, idx) => {
                const prefix = this.chalk.red(`${idx + 1}) `);

                this.newline()
                    .write(this.formatError(err, prefix), writeData)
                    .newline()
                    .newline();
            });
        },

        reportTestDone (name, testRunInfo, meta) {
            const hasErr  = !!testRunInfo.errs.length;
            let symbol    = null;
            let nameStyle = null;

            if (testRunInfo.skipped) {
                this.skipped++;

                symbol    = this.chalk.cyan('-');
                nameStyle = this.chalk.cyan;
            }
            else if (hasErr) {
                symbol    = this.chalk.red.bold(this.symbols.err);
                nameStyle = this.chalk.red.bold;
            }
            else {
                symbol    = this.chalk.green(this.symbols.ok);
                nameStyle = this.chalk.grey;
            }

            let title = `${symbol} ${nameStyle(name)}`;

            this.setIndent(1)
                .useWordWrap(true);

            if (testRunInfo.unstable)
                title += this.chalk.yellow(' (unstable)');

            if (testRunInfo.screenshotPath)
                title += ` (screenshots: ${this.chalk.underline.grey(testRunInfo.screenshotPath)})`;

            const writeData = {
                name,
                testRunInfo,
                meta,
            };

            this.write(title, writeData);

            this._renderReportData(testRunInfo.reportData, testRunInfo.browsers, writeData);

            if (hasErr)
                this._renderErrors(testRunInfo.errs, writeData);

            this.afterErrorList = hasErr;

            this.newline();
        },

        _renderReportData (reportData, browsers, writeData) {
            if (!reportData)
                return;

            if (!Object.values(reportData).some(data => data.length))
                return;

            const renderBrowserName = browsers.length > 1;
            const dataIndent        = browsers.length > 1 ? 3 : 2;

            this.newline()
                .setIndent(1)
                .write('Report data:');

            browsers.forEach(({ testRunId, prettyUserAgent }) => {
                const browserReportData = reportData[testRunId];

                if (!browserReportData)
                    return;

                if (renderBrowserName) {
                    this.setIndent(2)
                        .newline()
                        .write(prettyUserAgent, writeData);
                }

                browserReportData.forEach(data => {
                    this.setIndent(dataIndent)
                        .newline()
                        .write(`- ${data}`, writeData);
                });
            });
        },

        _renderWarnings (warnings, writeData) {
            this.newline()
                .setIndent(1)
                .write(this.chalk.bold.yellow(`Warnings (${warnings.length}):`), writeData)
                .newline();

            warnings.forEach(msg => {
                this.setIndent(1)
                    .write(this.chalk.bold.yellow('--'), writeData)
                    .newline()
                    .setIndent(2)
                    .write(msg, writeData)
                    .newline();
            });
        },

        reportTaskDone (endTime, passed, warnings) {
            const durationMs  = endTime - this.startTime;
            const durationStr = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
            let footer        = passed === this.testCount ?
                this.chalk.bold.green(`${this.testCount} passed`) :
                this.chalk.bold.red(`${this.testCount - passed}/${this.testCount} failed`);

            footer += this.chalk.grey(` (${durationStr})`);

            if (!this.afterErrorList)
                this.newline();

            this.setIndent(1)
                .useWordWrap(true);

            const writeData = {
                endTime,
                passed,
                warnings,
            };

            this.newline()
                .write(footer, writeData)
                .newline();

            if (this.skipped > 0) {
                this.write(this.chalk.cyan(`${this.skipped} skipped`), writeData)
                    .newline();
            }

            if (warnings.length)
                this._renderWarnings(warnings, writeData);
        },
    };
}
