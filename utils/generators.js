/**
 * Generates a valid random IPv4 address
 * @returns {string} Random IPv4 address in format XXX.XXX.XXX.XXX
 */
function generateRandomIP() {
  const generateOctet = () => Math.floor(Math.random() * 255) + 1;
  return `${generateOctet()}.${generateOctet()}.${generateOctet()}.${generateOctet()}`;
}

module.exports = {
  generateRandomIP,
};
