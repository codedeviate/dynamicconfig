# DynamicConfig

Dynamic configuration storage that can use files and/or environment.

Different sets of configuration can be used.

### Default values
Configuration files can have a fallback configuration file.
```javascript
...
const devConf = new DynamicConfiguration();
...
const hostname = dynConf.get("hostname", "localhost");
```
If the hostname isn't found neither in the environment nor in the configuration then the value localhost will be returned.

### Throw an error if nothing was found
Getting values from the configuration can have a default value or can throw an error if not found.

```javascript
...
const dynConf = new DynamicConfiguration();
...
const hostname = dynConf.get("hostname", null, true);
```
If hostname doesn't exist neither in the environment nor in the configuration file then an error will be thrown.