const fs = require('fs');
const { merge } = require('lodash');

const baseConfiguration = {
  browser: {
    headless: true
  },
  page: {
    url: 'https://www.ahgora.com.br/batidaonline'
  },
  device: {
    companyName: 'SYMPLA INTERNET SOLUCOES S/A'
  }
};

module.exports = {
  createConfiguration: file => {
    const userConfiguration = JSON.parse(fs.readFileSync(file, 'utf8'));
    return merge({}, baseConfiguration, userConfiguration);
  }
};
