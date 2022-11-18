# DynamicConfig

Dynamic configuration storage that can use files and/or environment.

Different sets of configuration can be used.

### Default values
Configuration files can have a fallback configuration file.
```javascript
...
const devConf = new DynamicConfig();
...
const hostname = dynConf.get("hostname", "localhost");
```
If the *hostname* isn't found neither in the environment nor in the configuration then the value *localhost* will be returned.

### Throw an error if nothing was found
Getting values from the configuration can have a default value or can throw an error if not found.

```javascript
...
const dynConf = new DynamicConfig();
...
const hostname = dynConf.get("hostname", null, true);
```
If hostname doesn't exist neither in the environment nor in the configuration file then an error will be thrown.

## Examples

### Force type of config
```bash
server:/dynamicconfig/ $ CONFIG_TYPE=ini node example/basic.js
```
This will only use files with an *ini* extention

### Set execution environment
```bash
server:/dynamicconfig/ $ ENV_TYPE=development node example/basic.js
```
This will use a config files named *development.\**. If none is found it will try to find a config file named *default.\**.

### Set execution environment and force type of config
```bash
server:/dynamicconfig/ $ ENV_TYPE=development CONFIG_TYPE=json node example/basic.js
```
This will use a config files named *development.json*. If none is found it will try to find a config file named *default.json*.

