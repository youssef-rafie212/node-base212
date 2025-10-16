// loggerMiddleware.js
import chalk from "chalk";

export const loggerMiddleware = (req, res, next) => {
    const start = Date.now();

    // store original send function
    const originalSend = res.send;

    let responseBody;
    res.send = function (body) {
        responseBody = body; // capture response body
        return originalSend.call(this, body);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        const date = new Date();

        const pad = (n) => n.toString().padStart(2, "0");

        const timestamp =
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
                date.getDate()
            )} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
                date.getSeconds()
            )}`;

        console.log(
            chalk.blue.bold(
                "\n================= 📦 REQUEST LOG ================="
            )
        );
        console.log(chalk.gray(`🕒 Timestamp: ${timestamp}`));

        console.log(chalk.cyan("➡  Method:"), chalk.yellow(req.method));
        console.log(chalk.cyan("➡  URL:   "), chalk.green(req.originalUrl));

        if (Object.keys(req.query).length > 0)
            console.log(chalk.cyan("➡  Query:"), req.query);

        if (Object.keys(req.body).length > 0)
            console.log(chalk.cyan("➡  Body: "), req.body);

        console.log(
            chalk.cyan("➡  Status:"),
            res.statusCode >= 400
                ? chalk.red(res.statusCode)
                : chalk.green(res.statusCode)
        );

        console.log(chalk.cyan("➡  Response:"), tryParseJson(responseBody));
        console.log(chalk.cyan("➡  Time:"), chalk.magenta(`${duration}ms`));

        console.log(
            chalk.blue.bold(
                "==================================================\n"
            )
        );
    });

    next();
};

const tryParseJson = (data) => {
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
};
