import { log } from "@clack/prompts";
import chalk from "chalk";
import terminalLink from "terminal-link";
import { hasTTY } from "std-env";
export const isInteractive = hasTTY;
export const green = "#4FFF54";
export const purple = "#735BF3";
export function chalkGreen(text) {
    return chalk.hex(green)(text);
}
export function chalkPurple(text) {
    return chalk.hex(purple)(text);
}
export function chalkGrey(text) {
    return chalk.hex("#878C99")(text);
}
export function chalkError(text) {
    return chalk.hex("#E11D48")(text);
}
export function chalkWarning(text) {
    return chalk.yellow(text);
}
export function chalkSuccess(text) {
    return chalk.hex("#28BF5C")(text);
}
export function chalkLink(text) {
    return chalk.underline.hex("#D7D9DD")(text);
}
export function chalkWorker(text) {
    return chalk.hex("#FFFF89")(text);
}
export function chalkTask(text) {
    return chalk.hex("#60A5FA")(text);
}
export function chalkRun(text) {
    return chalk.hex("#A78BFA")(text);
}
export function logo() {
    return `${chalk.hex(green).bold("Trigger")}${chalk.hex(purple).bold(".dev")}`;
}
// Mar 27 09:17:25.653
export function prettyPrintDate(date = new Date()) {
    let formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(date);
    // Append milliseconds
    formattedDate += "." + ("00" + date.getMilliseconds()).slice(-3);
    return formattedDate;
}
export function prettyError(header, body, footer) {
    const prefix = "Error: ";
    const indent = Array(prefix.length).fill(" ").join("");
    const spacing = "\n\n";
    const prettyPrefix = chalkError(prefix);
    const withIndents = (text) => text
        ?.split("\n")
        .map((line) => `${indent}${line}`)
        .join("\n");
    const prettyBody = withIndents(body?.trim());
    const prettyFooter = withIndents(footer);
    log.error(`${prettyPrefix}${header}${prettyBody ? `${spacing}${prettyBody}` : ""}${prettyFooter ? `${spacing}${prettyFooter}` : ""}`);
}
export function prettyWarning(header, body, footer) {
    const prefix = "Warning: ";
    const indent = Array(prefix.length).fill(" ").join("");
    const spacing = "\n\n";
    const prettyPrefix = chalkWarning(prefix);
    const withIndents = (text) => text
        ?.split("\n")
        .map((line) => `${indent}${line}`)
        .join("\n");
    const prettyBody = withIndents(body);
    const prettyFooter = withIndents(footer);
    log.warn(`${prettyPrefix}${header}${prettyBody ? `${spacing}${prettyBody}` : ""}${prettyFooter ? `${spacing}${prettyFooter}` : ""}`);
}
export function cliLink(text, url, options) {
    return terminalLink(text, url, {
        fallback: (text, url) => `${text} ${url}`,
        ...options,
    });
}
//# sourceMappingURL=cliOutput.js.map