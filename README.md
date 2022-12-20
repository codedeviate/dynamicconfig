# DynamicConfig

Dynamic configuration storage that can use files and/or environment.

Different sets of configuration can be used.

If present, a default configuration file will always be merged without overwriting previous data.


## Installation
Installing from NPM
```bash
npm install @codedv8/dynamicconfig --save
```

Installing from GitHub
```bash
npm install https://github.com/codedeviate/dynamicconfig.git --save
```


## Typescript
Batteries are included.

This module contains a typescript declaration.


## Fused entries
Keys can be protected by a fuse.

A fused key can't have its value changed by calling the set function.

After calling the function setBlowOnFuse any attempt to set a fused value will result in throwing an exception. This value can not be unset.


```javascript
const dynConf = require('@codedv8/dynamicconfig');
...
dynConf.addFuse('fused.value');
...
dynConf.set('fused.value', 'new value');
```
This will result in throwing an exception.


```javascript
const dynConf = require('@codedv8/dynamicconfig');
...
dynConf.addFuse('fused.value');
...
dynConf.set('fused.value', 'new value');
```
This will just return quietly without changing any values.


## Fallback and default configuration
First of all a configuration matching the enviroment will be loaded. After that the module will search for a default configuration that will be merged without overwriting existing data.


## Usage


### Force type of config
```bash
CONFIG_TYPE=ini node example/basic.js
```
This will only use files with an *ini* extention


### Set execution environment
```bash
NODE_ENV=development node example/basic.js
```
This will use a config files named *development.\**.
If none is found it will still try to find a config file named *default.\**.


### Set execution environment and force type of config
```bash
NODE_ENV=development CONFIG_TYPE=json node example/basic.js
```
This will use a config files named *development.json*.
If none is found it will still try to find a config file named *default.json*.


## Code usage

Output the current configuration
```javascript
const devConf = require('@codedv8/dynamicconfig');
console.log(JSON.stringify(devConf.get(), null, '  '));
```

Get *PORT* with default value *3070*
```javascript
const devConf = require('@codedv8/dynamicconfig');
const PORT = devConf.get('PORT', 3070);
```

Get and set values without fuse and with fuse
```javascript
const devConf = require('@codedv8/dynamicconfig');
console.log('PORT :', devConf.get('PORT', 3070));
devConf.set('PORT', 3071);
console.log('PORT :', devConf.get('PORT', 3070));
devConf.addFuse('PORT');
console.log('PORT :', devConf.get('PORT', 3070));
devConf.set('PORT', 3072);
console.log('PORT :', devConf.get('PORT', 3070));
```
This will print
```
PORT : 3070
PORT : 3071
PORT : 3071
PORT : 3071
```


Get and set values without fuse and with fuse where fuses are set to blow
```javascript
const devConf = require('@codedv8/dynamicconfig');
devConf.setBlowOnFuse();
console.log('PORT :', devConf.get('PORT', 3070));
devConf.set('PORT', 3071);
console.log('PORT :', devConf.get('PORT', 3070));
devConf.addFuse('PORT');
console.log('PORT :', devConf.get('PORT', 3070));
devConf.set('PORT', 3072);
console.log('PORT :', devConf.get('PORT', 3070));
```
This will print
```
PORT : 3070
PORT : 3071
PORT : 3071
/xxxx/xxxx/xxxx/dynamicconfig/index.js:XXX
        throw new Error(`Key ${key} is fused`);
        ^
Error: Key PORT is fused
...
```


### Examples in TypeScript
Get *PORT* with default value *3070*
```typescript
import devConf from '@codedv8/dynamicconfig'

const PORT = devConf.get('PORT', 3070)
```


## Functions


### get(key, defaultValue = null, throwOnDefault = false): value
Will try to find the *key* from the environment or the config (in that order). If the key isn't found then the default value will be returned. If not default value has been supplied then null will be retruned.

If the parameter throwOnDefault is set to true then an exception will be thrown if the key isn't found.

If the key is omitted (or set to undefined) the config object wil be returned.


### getAsString(key, defaultValue = "", throwOnDefault = false): value
The same as *get* but returns a string.

NULL will be returned as an empty string.

### getAsInt(key, defaultValue = "", throwOnDefault = false): int
The same as *get* but returns the value as an integer.

- NULL will be returned as 0
- false will be returned as 0
- true will be returned as 1

### getAsFloat(key, defaultValue = "", throwOnDefault = false): float
The same as *get* but returns the value as a float.

- NULL will be returned as 0
- false will be returned as 0
- true will be returned as 1

### getAsBoolean(key, defaultValue = "", throwOnDefault = false): boolean
The same as *get* but returns the value as a boolean.

- NULL will be returned as false


### getConfig(key, defaultValue = null): [value, keyFound]
Will try to find the key in the config.

The return value is an array where the first value is the values that is returned. The second value is a boolean that indicated if the value was found or not.


### getEnv(key, defaultValue = null): [value, keyFound]
Will try to find the key in the environment.

The return value is an array where the first value is the values that is returned. The second value is a boolean that indicated if the value was found or not.


### has(key): boolean
Returns a boolean that indicates if the key can be found in either the environment or the config.


### hasConfig(key): boolean
Returns a boolean that indicates if the key can be found in the config.


### hasEnv(key): boolean
Returns a boolean that indicates if the key can be found in the environment.


### set(key, value)
Sets a key in the config to the supplied value


### envPopulate(key)
Will copy the settings found under the supplied key to process.env making them accessible for other parts of the system.

Keys that already exists in process.env will not be overwritten.

If the value for the supplied key is an object then this object will be iterated and subkeys and their respective values will be added. Otherwise the value for the supplied key will be used with the key name.


### addFuse(key)
Will create a fuse for the supplied key

If multiple arguments is supplied then fuses will be created for these keys as well.

If an array is supplied as an argument then the values of this array will be used as keys to fuse.


### fuseAll()
Will create a fuse for all keys in the config.


### listFuseable(callback)
Will loop through the config and call the callback with the key for this entry making it possible to call addFuse for specific entries.


### setBlowOnFuse()
Will set the internal flag to true which will throw an exception when trying to alter an existing entry.


### blowOnFuse(): boolean
Returns true if an exception will be thrown when trying to set a fused key.

Returns false if set will return quietly when trying to set a fused key.


### setConfiguration(object)
Set the entire configuration object.

If the new configuration contain any fused entries it will be the same as setting an fused entry.

If the setting of a new object fails due to fused values then the entire configuration will be reverted back to the previous state.


### mergeConfiguration(object)
Merge a configuration without overwriting existing values.


### getSplit(): string
Get the split character used for *get* and *set*


### setSplit(delimiter)
Set the split character used for *get* and *set*


## Config file priority
If a config file is added from the env variable CONFIG_FILE then this have the top priority.

After that priority is grouped by type and path.

*json* files have higher priority than *ini* files.

First the module looks for a subdirectory called *config* at the same path where your *package.json* is located.

If that is not found then it searches the parent directory for at directory called *config*.

If that is not found then it searches for a subdirectory in the same location as the *package.json* with the same basename as the executed file.

If that is not found then it searches in the same directory as your *package.json*


### CONFIG_FILE and CONFIG_PATH
The base dirctory is the same directory as the entry file. But ths can be altered by adding the environment variable CONFIG_PATH

By adding environment variable *CONFIG_FILE* the value here will top the priority list. Note that if the file given doesn't exist then the standard priority list will be used.

If the *CONFIG_FILE* is a relative path then the default path will be used. If the *CONFIG_PATH* is an absolute path then this will be used.


#### Examples ####
So if we wish to load a development configuration from an entry file called server.js in a directory called serverapp then the following order is processed
```bash
node server.js
```
 1. <path to apps>/serverapp/config/development.json',
 2. <path to apps>/config/development.json',
 3. <path to apps>/serverapp/server/development.json',
 4. <path to apps>/serverapp/development.json',
 5. <path to apps>/serverapp/config/development.ini',
 6. <path to apps>/config/development.ini',
 7. <path to apps>/serverapp/server/development.ini',
 8. <path to apps>/serverapp/development.ini',
 9. <path to apps>/serverapp/config/default.json',
 10. <path to apps>/config/default.json',
 11. <path to apps>/serverapp/server/default.json',
 12. <path to apps>/serverapp/default.json',
 13. <path to apps>/serverapp/config/default.ini',
 14. <path to apps>/config/default.ini',
 15. <path to apps>/serverapp/server/default.ini',
 16. <path to apps>/serverapp/default.ini'


```bash
CONFIG_FILE=test.json node server.js
```
 1. <path to apps>/serverapp/test.json
 2. <path to apps>/serverapp/config/development.json',
 3. <path to apps>/config/development.json',
 4. <path to apps>/serverapp/server/development.json',
 5. <path to apps>/serverapp/development.json',
 6. <path to apps>/serverapp/config/development.ini',
 7. <path to apps>/config/development.ini',
 8. <path to apps>/serverapp/server/development.ini',
 9. <path to apps>/serverapp/development.ini',
 10. <path to apps>/serverapp/config/default.json',
 11. <path to apps>/config/default.json',
 12. <path to apps>/serverapp/server/default.json',
 13. <path to apps>/serverapp/default.json',
 14. <path to apps>/serverapp/config/default.ini',
 15. <path to apps>/config/default.ini',
 16. <path to apps>/serverapp/server/default.ini',
 17. <path to apps>/serverapp/default.ini'


```bash
CONFIG_PATH=/server/app node server.js
```
1. /server/app/config/development.json
2. /server/config/development.json
3. /server/app/server/development.json
4. /server/app/development.json
5. /server/app/config/development.ini
6. /server/config/development.ini
7. /server/app/server/development.ini
8. /server/app/development.ini
9. /server/app/config/default.json
10. /server/config/default.json
11. /server/app/server/default.json
12. /server/app/default.json
13. /server/app/config/default.ini
14. /server/config/default.ini
15. /server/app/server/default.ini
16. /server/app/default.ini


```bash
CONFIG_PATH=/server/app CONFIG_FILE=test.json node server.js
```
1. /server/app/test.json
2. /server/app/config/development.json
3. /server/config/development.json
4. /server/app/server/development.json
5. /server/app/development.json
6. /server/app/config/development.ini
7. /server/config/development.ini
8. /server/app/server/development.ini
9. /server/app/development.ini
10. /server/app/config/default.json
11. /server/config/default.json
12. /server/app/server/default.json
13. /server/app/default.json
14. /server/app/config/default.ini
15. /server/config/default.ini
16. /server/app/server/default.ini
17. /server/app/default.ini


```bash
CONFIG_PATH=/server/app CONFIG_FILE=/config/absolute/test.json node server.js
```
1. /config/absolute/test.json
2. /server/app/config/development.json
3. /server/config/development.json
4. /server/app/server/development.json
5. /server/app/development.json
6. /server/app/config/development.ini
7. /server/config/development.ini
8. /server/app/server/development.ini
9. /server/app/development.ini
10. /server/app/config/default.json
11. /server/config/default.json
12. /server/app/server/default.json
13. /server/app/default.json
14. /server/app/config/default.ini
15. /server/config/default.ini
16. /server/app/server/default.ini
17. /server/app/default.ini


## Default values
Configuration files can have a fallback configuration file.
```javascript
...
const dynConf = require('@codedv8/dynamicconfig');
...
const hostname = dynConf.get("hostname", "localhost");
```
If the *hostname* isn't found neither in the environment nor in the configuration then the value *localhost* will be returned.


### Throw an error if nothing was found
Getting values from the configuration can have a default value or can throw an error if not found.


```javascript
...
const dynConf = require('@codedv8/dynamicconfig');
...
const hostname = dynConf.get("hostname", null, true);
```
If hostname doesn't exist neither in the environment nor in the configuration file then an error will be thrown.

