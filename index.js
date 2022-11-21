const fs = require('fs');
const path = require('path');
const parserJson = require('./parsers/json.js');
const parserIni = require('./parsers/ini.js');

class DynamicConfig {
  constructor() {
    this.blowOnFuse = false;
    this.config = null
    this.fuseList = {};
    try {
      this.path = fs.realpathSync(process.env.CONFIG_PATH || path.dirname(process.argv[1])) + '/';
    } catch (error) {
      throw new Error('CONFIG_PATH does not exist');
    }
    try {
      this.pathUp = fs.realpathSync(this.path + '../') + '/';
    } catch (error) {
      this.pathUp = this.path;
    }
    this.script = path.basename(process.argv[1], '.js');
    this.env = process.env.NODE_ENV || 'development';
    this.configSplit = process.env.CONFIG_SPLIT || null;

    const fileList = [];
    if (process.env.CONFIG_FILE) {
      if (process.env.CONFIG_FILE.indexOf('/') == 0) {
        fileList.push(process.env.CONFIG_FILE);
      } else {
        fileList.push(`${this.path}${process.env.CONFIG_FILE}`);
      }
    }

    const supportedExtensions = ['json', 'ini'];
    const configType = (process.env.CONFIG_TYPE || '').toLowerCase();
    // Add paths to config files based on environment
    supportedExtensions.forEach((extension) => {
      if (!configType || configType === extension) {
        fileList.push(`${this.path}${this.script}/${this.env}.${extension}`);
        fileList.push(`${this.path}config/${this.env}.${extension}`);
        fileList.push(`${this.pathUp}config/${this.env}.${extension}`);
        fileList.push(`${this.path}${this.env}.${extension}`);
      }
    });
    // Add paths to default config files
    supportedExtensions.forEach((extension) => {
      if (!configType || configType === extension) {
        fileList.push(`${this.path}${this.script}/default.${extension}`);
        fileList.push(`${this.path}config/default.${extension}`);
        fileList.push(`${this.pathUp}config/default.${extension}`);
        fileList.push(`${this.path}default.${extension}`);
      }
    });

    fileList.forEach((file) => {
      try {
        if (this.config === null && fs.existsSync(file)) {
          let fileExtension = configType || path.extname(file).substring(1).toLowerCase();
          const data = fs.readFileSync(file, 'utf8');
          if (fileExtension === 'json') {
            this.config = new parserJson().parse(data);
          } else if (fileExtension === 'ini') {
            this.config = new parserIni().parse(data);
          } else {
            throw new Error(`Unsupported file extension: ${fileExtension}`);
          }
        }
      } catch (error) {
        this.config = null;
      }
    });

    if (this.config === null) {
      this.config = {};
    }
  }

  setConfiguration(config) {
    this.config = { ...config };
  }

  hasEnv(key) {
    const [envValue, envFound] = this.getEnv(key);
    return envFound;
  }

  hasConfig(key) {
    const [configValue, configFound] = this.getConfig(key);
    return configFound;
  }

  has(key) {
    return this.hasEnv(key) || this.hasConfig(key);
  }

  getEnv(key, defaultValue = null) {
    if (process.env[key] !== undefined) {
      return [process.env[key], true];
    }
    return [defaultValue, false];
  }

  getConfig(key, defaultValue = null) {
    if (key === undefined) {
      return [this.config, true];
    }
    if (this.config[key] === undefined) {
      if (key === '__configSplit') {
        return [this.configSplit || this.config['__configSplit'] || '.', true];
      }
      const keyParts = key.split(this.configSplit || this.config['__configSplit'] || '.');
      let config = this.config;
      while (keyParts.length > 0) {
        const keyPart = keyParts.shift();
        if (config[keyPart] === undefined) {
          return [defaultValue, false];
        }
        config = config[keyPart];
      }
      if (config !== undefined) {
        return [config, true];
      }
      return [defaultValue, false];
    }
    return [this.config[key], true];
  }

  get(key, defaultValue = null, throwOnDefault = false) {
    const [envValue, envFound] = this.getEnv(key, defaultValue);
    if (envFound) {
      return envValue;
    }
    const [configValue, configFound] = this.getConfig(key, defaultValue);
    if (configFound) {
      return configValue;
    }
    if (throwOnDefault) {
      throw new Error(`Key ${key} not found`);
    }
    return defaultValue;
  }

  set(key, value) {
    const keys = key.split(this.configSplit || this.config['__configSplit'] || '.');
    if (this.fuseList[keys.join('.')] === true) {
      if (this.blowOnFuse) {
        throw new Error(`Key ${key} is fused`);
      } else {
        return;
      }
    }
    let config = this.config;
    while (keys.length > 1) {
      const subkey = keys.shift();
      if (config[subkey] === undefined) {
        config[subkey] = {};
      }
      config = config[subkey];
    }
    const lastKey = keys.shift();
    if (value === undefined) {
      delete config[lastKey];
    } else {
      config[lastKey] = value;
    }
  }

  addFuse(...keys) {
    keys.forEach((key) => {
      if (Array.isArray(key)) {
        key.forEach((subkey) => {
          subkey = subkey.split(this.configSplit || this.config['__configSplit'] || '.').join('.');
          this.fuseList[subkey] = true;
        });
      } else {
        key = key.split(this.configSplit || this.config['__configSplit'] || '.').join('.');
        this.fuseList[key] = true;
      }
    });
  }

  fuseAll(obj = undefined, baseKey = '') {
    if (obj === undefined) {
      obj = this.config;
    }
    Object.keys(obj).forEach((key) => {
      if (baseKey !== '') {
        key = `${baseKey}${this.configSplit || this.config['__configSplit'] || '.'}${key}`;
      }
      this.addFuse(key);
      if (obj[key] === Object(obj[key])) {
        this.fuseAll(obj[key], key)
      }
    });
  }

  listFuseable(callback, obj = undefined, baseKey = '') {
    if (obj === undefined) {
      obj = this.config;
    }

    Object.keys(obj).forEach((key) => {
      let fullKey = key;
      if(baseKey !== '') {
        fullKey = `${baseKey}${this.configSplit || this.config['__configSplit'] || '.'}${fullKey}`;
      }
      if (obj[key] === Object(obj[key])) {
        callback(fullKey);
        this.listFuseable(callback, obj[key], fullKey);
      } else {
        callback(fullKey);
      }
    });
  }

  setBlowOnFuse() {
    this.blowOnFuse = true;
  }

  blowOnFuse() {
    return this.blowOnFuse;
  }

  getSplit() {
    return this.configSplit;
  }
  setSplit(split) {
    this.configSplit = split;
  }
}

const dynamicConfig = module.exports = new DynamicConfig();