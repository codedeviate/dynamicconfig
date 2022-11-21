class parserJson {
  constructor() {
    this.type = 'json';
  }

  parse(data) {
    return JSON.parse(data);
  }
};

module.exports = parserJson;