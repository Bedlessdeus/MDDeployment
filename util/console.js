const originConsole = console.log;

let consolePrefix = '';
let disabled = false;

const setPrefix = (prefix) => {
    consolePrefix = prefix;
};

const overrideConsole = () => {
    console.log = (message) => {
        if (disabled) return;
        originConsole(consolePrefix + message);
    }
};

export default {
    setPrefix,
    overrideConsole,
    disable: () => disabled = true,
    enable: () => disabled = false
}