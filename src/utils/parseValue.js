module.exports = (value = '') => {
    const end = value.length - 1;

    const isDoubleQuoted = value[0] === '"' && value[end] === '"';
    const isSingleQuoted = value[0] === "'" && value[end] === "'";

    // If single or double quoted, remove quotes
    if (isSingleQuoted || isDoubleQuoted) {
        value = value.substring(1, end);

        // If double quoted, expand new lines
        if (isDoubleQuoted) {
            value = value.replace(/\\n/g, '\n');
        };
    } else {
        value = value.trim();
    };

    return value;
};