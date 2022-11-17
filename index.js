import fs from 'fs';
import path from 'path';
import parserJson from './parsers/json.js';

export class EnvConfig {
  constructor() {
    this.config = null
    try {
      this.path = fs.realpathSync(process.env.CONFIG_PATH || path.dirname(process.argv[1])) + '/';
    } catch (error) {
      throw new Error('CONFIG_PATH does not exist');
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

    console.log('fileList', fileList);

    fileList.forEach((file) => {
      if(this.config === null && fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf8');
        if(file.match(/\.json$/)) {
          try {
            this.config = new parserJson().parse(data);
          } catch (error) {
            this.config = null;
          }
        }
      }
    });

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
    this.config[key] = value;
  }

  getSplit() {
    return this.configSplit;
  }
  setSplit(split) {
    this.configSplit = split;
  }
}

