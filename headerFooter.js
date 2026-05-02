// headerFooter.js
module.exports.addHeaderFooter = function(message, type = 'plp') {
  const header = `-----BEGIN ${type.toUpperCase()} MESSAGE-----`;
  const footer = `-----END ${type.toUpperCase()} MESSAGE-----`;
  return `${header}\n${message}\n${footer}\n`;
};

/**
 * Strip PLP-style header and footer from a message.
 * Returns the message body, or throws if the wrapper is malformed.
 */
module.exports.stripHeaderFooter = function(text) {
  const lines = text.split('\n');

  // Find header and footer lines
  let headerIdx = -1;
  let footerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^-----BEGIN \w+ MESSAGE-----$/.test(lines[i].trim())) {
      headerIdx = i;
    } else if (/^-----END \w+ MESSAGE-----$/.test(lines[i].trim())) {
      footerIdx = i;
      break;
    }
  }

  if (headerIdx === -1 || footerIdx === -1 || footerIdx <= headerIdx) {
    throw new Error('Invalid message format: missing or malformed header/footer');
  }

  // Extract body between header and footer
  const body = lines.slice(headerIdx + 1, footerIdx).join('\n');
  return body;
};

/**
 * Check if text contains a PLP-style wrapper.
 */
module.exports.hasWrapper = function(text) {
  return /-----BEGIN \w+ MESSAGE-----/.test(text) &&
         /-----END \w+ MESSAGE-----/.test(text);
};