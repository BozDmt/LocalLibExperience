const escapeApostrophe = (value) => {
    return value.replace(/'/g, '&#x27;');
};

module.exports = escapeApostrophe