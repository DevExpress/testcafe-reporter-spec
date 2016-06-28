export default function () {
    return {
        noColors:     false,
        startTime:    null,
        afterErrList: false,
        testCount:    0,

        reportTaskStart (startTime, userAgents, testCount) {
            var uaList = userAgents
                .map(ua => this.chalk.blue(ua))
                .join(', ');

            this.startTime = startTime;
            this.testCount = testCount;

            this.setIndent(0)
                .useWordWrap(true)
                .write(this.chalk.bold(`Running tests in: ${uaList}`))
                .newline();
        },

        reportFixtureStart (name, path) {
            var title = `${name} (${this.chalk.underline(path)})`;

            this.setIndent(1)
                .useWordWrap(true);

            if (this.afterErrList)
                this.afterErrList = false;
            else
                this.newline();

            this.write(title)
                .newline();
        },

        reportTestDone (name, errs, durationMs, unstable, screenshotPath) {
            var hasErr    = !!errs.length;
            var nameStyle = hasErr ? this.chalk.red.bold : this.chalk.gray;
            var symbol    = hasErr ? this.chalk.red.bold(this.symbols.err) : this.chalk.green(this.symbols.ok);
            var title     = `${symbol} ${nameStyle(name)}`;

            this.setIndent(2)
                .useWordWrap(true);

            if (unstable)
                title += this.chalk.yellow(' (unstable)');

            if (screenshotPath)
                title += ` (screenshots: ${this.chalk.underline(screenshotPath)})`;

            this.write(title);

            if (hasErr) {
                this.setIndent(4)
                    .newline();

                errs.forEach((err, idx) => {
                    var prefix = this.chalk.red(`${idx + 1}) `);

                    this.newline()
                        .write(this.formatError(err, prefix))
                        .newline()
                        .newline();
                });
            }

            this.afterErrList = hasErr;

            this.newline();
        },

        reportTaskDone (endTime, passed) {
            var durationMs  = endTime - this.startTime;
            var durationStr = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
            var footer      = passed === this.testCount ?
                              this.chalk.bold.green(`${this.testCount} passed`) :
                              this.chalk.bold.red(`${this.testCount - passed}/${this.testCount} failed`);

            footer += this.chalk.gray(` (${durationStr})`);

            this.setIndent(1)
                .useWordWrap(true);

            if (!this.afterErrList)
                this.newline();

            this.newline()
                .write(footer)
                .newline();
        }
    };
}
