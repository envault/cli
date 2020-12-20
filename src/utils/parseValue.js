module.exports = (value = '') => {
    const end = value.length - 1;

    const isDoubleQuoted = value[0] === '"' && value[end] === '"';
    const isSingleQuoted = value[0] === "'" && value[end] === "'";

    // If no single or double quotes detected, trim whitespace
    if (! isSingleQuoted && ! isDoubleQuoted) return value.trim();

    // Remove quotes
    value = value.substring(1, end);

    // If double quoted, expand new lines
    if (isDoubleQuoted) {
        value = value.replace(/\\n/g, '\n');
    };

    return value;
};