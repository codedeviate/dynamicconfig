const fs = require('fs');
const path = require('path');
const parserJson = require('./parsers/json.js');
const parserIni = require('./parsers/ini.js');

class DynamicConfig {
  constructor() {
    this.doBlowOnFuse = false;
    this.config = null
    this.fuseList = {};
    try {
      if (process.env.CONFIG_PATH !== undefined) {
        this.path = process.env.CONFIG_PATH;
      } else {
        let s = path.dirname(process.argv[1])
        if (s.indexOf('node_modules') > -1) {
          s = s.substring(0, s.indexOf('node_modules') - 1)
        }
        while (s !== '/') {
          if (fs.existsSync(path.join(s, 'package.json'))) {
            break;
          } else {
            const parts = s.split(path.sep);
            parts.pop();
            s = parts.join(path.sep);
          }
        }
        if (fs.existsSync(s + '/package.json')) {
          this.path = s;
        } else {
          this.path = path.dirname(process.argv[1])
        }
      }
      this.path = fs.realpathSync(this.path) + '/';
    } catch (error) {
      throw new Error('CONFIG_PATH does not exist');
    }
    /* istanbul ignore next: Just a failsafe that really shouldn't be able to happen */
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
        fileList.push(`${this.path}config/${this.env}.${extension}`);
        fileList.push(`${this.pathUp}config/${this.env}.${extension}`);
        fileList.push(`${this.path}${this.script}/${this.env}.${extension}`);
        fileList.push(`${this.path}${this.env}.${extension}`);
      }
    });
    // Add paths to default config files
    supportedExtensions.forEach((extension) => {
      if (!configType || configType === extension) {
        fileList.push(`${this.path}config/default.${extension}`);
        fileList.push(`${this.pathUp}config/default.${extension}`);
        fileList.push(`${this.path}${this.script}/default.${extension}`);
        fileList.push(`${this.path}default.${extension}`);
      }
    });

    let addedDefault = false;
    this.config = {};
    fileList.forEach((file) => {
      let readDefault = false;
      if (addedDefault === false && path.basename(file).match(/default\./)) {
        readDefault = true;
      }
      try {
        if ((readDefault || Object.keys(this.config).length === 0) && fs.existsSync(file)) {
          let fileExtension = configType || path.extname(file).substring(1).toLowerCase();
          const data = fs.readFileSync(file, 'utf8');
          /* istanbul ignore else */
          if (fileExtension === 'json') {
            this.mergeConfiguration(new parserJson().parse(data));
            /* istanbul ignore else */
            if (readDefault) {
              addedDefault = true;
            }
          } else if (fileExtension === 'ini') {
            this.mergeConfiguration(new parserIni().parse(data));
            /* istanbul ignore else */
            if (readDefault) {
              addedDefault = true;
            }
          } else /* istanbul ignore next: For non-supported file types */ {
            throw new Error(`Unsupported file extension: ${fileExtension}`);
          }
        }
      } catch (error) /* istanbul ignore next: If we failed totally */ {
        this.config = {};
      }
    });

    /* istanbul ignore next: If we failed totally */
    if (this.config === null) {
      this.config = {};
    }
  }

  setConfiguration(config) {
    const oldConfig = this.config;
    this.config = { ...config };
    const self = this;
    let foundError = false;
    this.listFuseable((key) => {
      if (self.fuseList[key] !== undefined) {
        foundError = true;
      }
    });
    if (foundError) {
      this.config = oldConfig;
      if (this.doBlowOnFuse) {
        throw new Error(`Key ${key} already exists`);
      }
      return false;
    }
    return true;
  }

  getValueKeys(obj = undefined) {
    if (obj === undefined) {
      obj = this.config;
    }
    const keys = [];
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof (obj[key]) === 'object' && !Array.isArray(obj[key])) {
        this.getValueKeys(obj[key]).forEach((subKey) => {
          keys.push(`${key}.${subKey}`);
        });
      } else {
        keys.push(key);
      }
    });
    return keys;
  }

  mergeConfiguration(config, root = undefined) {
    if (root === undefined) {
      this.getValueKeys(config).forEach((key) => {
        if (this.fuseList[key] !== undefined) {
          if (this.doBlowOnFuse) {
            throw new Error(`Key ${key} already exists`);
          }
          return false;
        }
      });
      root = this.config;
    }
    /* istanbul ignore else */
    if (typeof (config) === 'object' && !Array.isArray(config)) {
      Object.keys(config).forEach((key) => {
        if (root[key] === undefined) {
          if (typeof (config[key]) === 'object' && !Array.isArray(config[key])) {
            root[key] = { ...config[key] };
          } else {
            root[key] = config[key];
          }
        } else {
          if (typeof (root[key]) === 'object' && !Array.isArray(root[key])) {
            this.mergeConfiguration(config[key], root[key]);
          }
        }
      });
    } else {
      /* istanbul ignore next */ 
      if (root === undefined) {
        root = config;
      }
    }
    return true;
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
    // Check if key is an array
    if (Array.isArray(key)) {
      for(const keyItem of key) {
        if (this.has(keyItem)) {
          return true;
        }
      }
      return false;
    }
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
      if(typeof(key) !== 'string') {
        return [defaultValue, false];
      }
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
      /* istanbul ignore else */
      if (config !== undefined) {
        return [config, true];
      }
      // Unreachable code but used as failsafe
      /* istanbul ignore next */
      return [defaultValue, false];
    }
    return [this.config[key], true];
  }

  get(key, defaultValue = null, throwOnDefault = false) {
    // Check if key is an array
    if(Array.isArray(key)) {
      // Loop through the array
      for(const item of key) {
        // Check if the key exists
        if(this.has(item)) {
          // Return the value
          return this.get(item);
        }
      }
      // Throw an error if the key does not exist and throwOnDefault is true
      if (throwOnDefault) {
        throw new Error(`Key ${key} not found`);
      }
        // If the key does not exist, return the default value
      return defaultValue;
    }
    // Check if the key if found in the environment variables
    const [envValue, envFound] = this.getEnv(key, defaultValue);
    if (envFound) {
      return envValue;
    }
    // Check if the key if found in the configuration
    const [configValue, configFound] = this.getConfig(key, defaultValue);
    if (configFound) {
      return configValue;
    }
    // Throw an error if the key does not exist and throwOnDefault is true
    if (throwOnDefault) {
      throw new Error(`Key ${key} not found`);
    }
    // If the key does not exist, return the default value
    return defaultValue;
  }

  getAsString(key, defaultValue = null, throwOnDefault = false) {
    const value = this.get(key, defaultValue, throwOnDefault);
    if (value === null) {
      return "";
    }
    return value.toString();
  }

  getAsInt(key, defaultValue = null, throwOnDefault = false) {
    const value = this.get(key, defaultValue, throwOnDefault);
    if (value === null) {
      return 0;
    }
    if (typeof (value) === 'number') {
      return value;
    }
    if (typeof (value) === 'boolean') {
      return value ? 1 : 0;
    }
    const parsedValue = parseInt(value.toString());
    if (isNaN(parsedValue)) {
      return 0;
    }
    return parsedValue;
  }

  getAsFloat(key, defaultValue = null, throwOnDefault = false) {
    const value = this.get(key, defaultValue, throwOnDefault);
    if (value === null) {
      return 0;
    }
    if (typeof (value) === 'number') {
      return value;
    }
    if (typeof (value) === 'boolean') {
      return value ? 1 : 0;
    }
    const parsedValue = parseFloat(value.toString());
    if (isNaN(parsedValue)) {
      return 0;
    }
    return parsedValue;
  }

  getAsBoolean(key, defaultValue = null, throwOnDefault = false) {
    const value = this.get(key, defaultValue, throwOnDefault);
    if (value === null) {
      return false;
    }
    if (typeof (value) === 'number') {
      return value ? true : false;
    }
    if (typeof (value) === 'boolean') {
      return value;
    }
    const valueLC = value.toString().toLowerCase();
    if(valueLC == "") {
      return false;
    }
    if(["false","0","null"].includes(valueLC)) {
      return false;
    }
    return true;
  }

  set(key, value) {
    if(typeof(key) !== 'string') {
      if (this.fuseList[key] === true) {
        if (this.doBlowOnFuse) {
          throw new Error(`Key ${key} is fused`);
        } else {
          return;
        }
      }
      this.config[key] = value;
      return
    }
    const keys = key.split(this.configSplit || this.config['__configSplit'] || '.');
    if (this.fuseList[keys.join('.')] === true) {
      if (this.doBlowOnFuse) {
        throw new Error(`Key ${key} is fused`);
      } else {
        return;
      }
    }
    let config = this.config;
    while (keys.length > 1) {
      const subkey = keys.shift();
      /* istanbul ignore else */
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

  is(key, value) {
    // Check if key is an array
    if (Array.isArray(key)) {
      let result = false;
      // Loop through the array
      for(const subKey of key) {
        result = result || (this.get(subKey) === value);
        if(result) break;
      }
      return result;
    }
    return this.get(key) === value;
  }

  isNot(key, value) {
    // Check if key is an array
    if (Array.isArray(key)) {
      let result = true;
      // Loop through the array
      for(const subKey of key) {
        result = result && (this.get(subKey) !== value);
      }
      return result;
    }
    return this.get(key) !== value;
  }

  envPopulate(key) {
    const [value, found] = this.getConfig(key);
    /* istanbul ignore else */
    if (found) {
      if (typeof (value) === 'object') {
        Object.keys(value).forEach((subkey) => {
          if (this.hasEnv(subkey) === false) {
            process.env[subkey] = value[subkey];
          }
        });
      } else {
        /* istanbul ignore else */
        if (this.hasEnv(key) === false) {
          process.env[key] = value;
        }
      }
    }
  }

  addFuse(...keys) {
    keys.forEach((key) => {
      if (Array.isArray(key)) {
        key.forEach((subkey) => {
          subkey = subkey.split(this.configSplit || this.config['__configSplit'] || '.').join('.');
          this.fuseList[subkey] = true;
        });
      } else if(typeof(key) !== 'string') {
        this.fuseList[key] = true;
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
      let subKey = key;
      if (baseKey !== '') {
        subKey = `${baseKey}${this.configSplit || this.config['__configSplit'] || '.'}${key}`;
      }
      this.addFuse(subKey);
      if (obj[key] === Object(obj[key])) {
        this.fuseAll(obj[key], subKey)
      }
    });
  }

  listFuseable(callback, obj = undefined, baseKey = '') {
    if (obj === undefined) {
      obj = this.config;
    }

    Object.keys(obj).forEach((key) => {
      let fullKey = key;
      if (baseKey !== '') {
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
    this.doBlowOnFuse = true;
  }

  blowOnFuse() {
    return this.doBlowOnFuse;
  }

  getSplit() {
    return this.configSplit || this.config['__configSplit'] || '.';
  }

  setSplit(split) {
    this.configSplit = split;
  }

  chain() {
    return new DynamicChain(this)
  }

}

class DynamicChain {
  config = undefined;
  chainValue = undefined;

  constructor(config) {
    this.config = config;
    this.chainValue = undefined;
  }

  reset() {
    this.chainValue = undefined
    return this;
  }

  is(key, value) {
    // Check if key is an array
    if (Array.isArray(key)) {
      let result = false;
      // Loop through the array
      for(const subKey of key) {
        result = result || (this.config.get(subKey) === value);
        if(result) break;
      }
      if (this.chainValue === undefined) {
        this.chainValue = result;
      } else {
        this.chainValue = this.chainValue && result;
      }
      return this;
    }
    if (this.chainValue === undefined) {
      this.chainValue = this.config.get(key) === value;
    } else {
      this.chainValue = this.chainValue && (this.config.get(key) === value);
    }
    return this;
  }

  isNot(key, value) {
    // Check if key is an array
    if (Array.isArray(key)) {
      let result = true;
      // Loop through the array
      for(const subKey of key) {
        result = result && (this.config.get(subKey) !== value);
      }
      if (this.chainValue === undefined) {
        this.chainValue = result;
      } else {
        this.chainValue = this.chainValue && result;
      }
      return this;
    }
    if (this.chainValue === undefined) {
      this.chainValue = this.config.get(key) !== value;
    } else {
      this.chainValue = this.chainValue && (this.config.get(key) !== value);
    }
    return this;
  }

  hasNotKey(key) {
    // Check if key is an array
    if (Array.isArray(key)) {
      let result = true;
      // Loop through the array
      for(const subKey of key) {
        result = result && (this.config.has(subKey) === false);
      }
      if (this.chainValue === undefined) {
        this.chainValue = result;
      } else {
        this.chainValue = this.chainValue && result;
      }
      return this;
    }
    if (this.chainValue === undefined) {
      this.chainValue = this.config.has(key) === false;
    } else {
      this.chainValue = this.chainValue && (this.config.has(key) === false);
    }
    return this;
  }

  hasKey(key) {
    // Check if key is an array
    if (Array.isArray(key)) {
      let result = false;
      // Loop through the array
      for(const subKey of key) {
        result = result || this.config.has(subKey);
        if(result) break;
      }
      if (this.chainValue === undefined) {
        this.chainValue = result;
      } else {
        this.chainValue = this.chainValue && result;
      }
      return this;
    }
    if (this.chainValue === undefined) {
      this.chainValue = this.config.has(key);
    } else {
      this.chainValue = this.chainValue && this.config.has(key);
    }
    return this;
  }

  result() {
    return this.chainValue;
  }

}

const dynamicConfig = new DynamicConfig();
module.exports = dynamicConfig;
module.exports.DynamicConfig = DynamicConfig;
module.exports.DynamicChain = DynamicChain;
module.exports.default = dynamicConfig;
