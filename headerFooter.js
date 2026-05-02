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

  // Find header and footer lines, capturing their type labels
  let headerIdx = -1;
  let footerIdx = -1;
  let beginLabel = null;
  let endLabel = null;
  for (let i = 0; i < lines.length; i++) {
    const beginMatch = lines[i].trim().match(/^-----BEGIN ([\w ]+) MESSAGE-----$/);
    if (beginMatch) {
      headerIdx = i;
      beginLabel = beginMatch[1];
    } else {
      const endMatch = lines[i].trim().match(/^-----END ([\w ]+) MESSAGE-----$/);
      if (endMatch) {
        footerIdx = i;
        endLabel = endMatch[1];
        break;
      }
    }
  }

  if (headerIdx === -1 || footerIdx === -1 || footerIdx <= headerIdx || beginLabel !== endLabel) {
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
  return /-----BEGIN [\w ]+ MESSAGE-----/.test(text) &&
         /-----END [\w ]+ MESSAGE-----/.test(text);
};