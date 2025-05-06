// headerFooter.js
module.exports.addHeaderFooter = function(message, type = 'plp') {
  const header = `-----BEGIN ${type.toUpperCase()} MESSAGE-----`;
  const footer = `-----END ${type.toUpperCase()} MESSAGE-----`;
  return `${header}\n${message}\n${footer}\n`;
};