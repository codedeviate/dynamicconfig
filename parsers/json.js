export default class parserJson {
  constructor() {
    this.type = 'json';
  }

  parse(data) {
    return JSON.parse(data);
  }
};