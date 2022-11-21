# DynamicConfig

Dynamic configuration storage that can use files and/or environment.

Different sets of configuration can be used.

## Installation
```bash
npm install dynamicconfig --save
```
## Typescript
Batteries are included.

This module contains a typescript declaration.

## Fused entries
Keys can be protected by a fuse.

A fused key can't have its value changed by calling the set function.

If the configuration class is instantiated without any boolean parameter then the attempt to set a fused value will result in throwing an exception. The the class is instantiated with false as a parameter then set will quietly return when an attempt is made to set a fused value.

```javascript
const dynConf = new DynamicConfig();
...
dynConf.addFuse('fused.value');
...
dynConf.set('fused.value', 'new value');
```
This will result in throwing an exception.

```javascript
const dynConf = new DynamicConfig(false);
...
dynConf.addFuse('fused.value');
...
dynConf.set('fused.value', 'new value');
```
This will just return quietly without changing any values.

## Functions

### get(key, defaultValue = null, throwOnDefault = false): value
Will try to find the *key* from the environment or the config (in that order). If the key isn't found then the default value will be returned. If not default value has been supplied then null will be retruned.

If the parameter throwOnDefault is set to true then an exception will be thrown if the key isn't found.

If the key is omitted (or set to undefined) the config object wil be returned.

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

### addFuse(key)
Will create a fuse for the supplied key

If multiple arguments is supplied then fuses will be created for these keys as well.

If an array is supplied as an argument then the values of this array will be used as keys to fuse.

### fuseAll()
Will create a fuse for all keys in the config.

### listFuseable(callback)
Will loop through the config and call the callback with the key for this entry making it possible to call addFuse for specific entries.

### blowOnFuse(): boolean
Returns true if an exception will be thrown when trying to set a fused key.

Returns false if set will return quietly when trying to set a fused key.

### setConfiguration(object)

### getSplit(): string

### setSplit(delimiter)

## Config file priority
If a config file is added from the env variable CONFIG_FILE then this have the top priority.

After that priority is grouped by type and path.

*json* files have higher priority than *ini* files.

Files in a subdirectory with the same name as the base part of the entry file will have higher priority.

Files in a subdirectory with the name config will come next.

After that configs in the same directory will be processed.

There is a fallback to a config file with the base name *default*. The priority here will be
1. subdirectory with the same basename as the entry file
2. subdirectory called config
3. config file located in the same directory

### CONFIG_FILE and CONFIG_PATH
The base dirctory is the same directory as the entry file. But ths can be altered by adding the environment variable CONFIG_PATH

By adding environment variable *CONFIG_FILE* the value here will top the priority list. Note that if the file given doesn't exist then the standard priority list will be used.

If the *CONFIG_FILE* is a relative path then the default path will be used. If the *CONFIG_PATH* is an absolute path then this will be used.

#### Examples ####
So if we wish to load a development configuration from an entry file called server.js then the following order is processed
```bash
node server.js
```
1. ./server/development.json
2. ./config/development.json
3. ./development.json
4. ./server/development.ini
5. ./config/development.ini
6. ./development.ini
7. ./server/default.json
8. ./config/default.json
9. ./default.json
10. ./server/default.ini
11. ./config/default.ini
12. ./default.ini

```bash
CONFIG_FILE=test.json node server.js
```
1. ./test.json
2. ./server/development.json
3. ./config/development.json
4. ./development.json
5. ./server/development.ini
6. ./config/development.ini
7. ./development.ini
8. ./server/default.json
9. ./config/default.json
10. ./default.json
11. ./server/default.ini
12. ./config/default.ini
13. ./default.ini

```bash
CONFIG_PATH=/server/config node server.js
```
1. /server/config/test.json
1. /server/config/server/development.json
2. /server/config/config/development.json
3. /server/config/development.json
4. /server/config/server/development.ini
5. /server/config/config/development.ini
6. /server/config/development.ini
7. /server/config/server/default.json
8. /server/config/config/default.json
9. /server/config/default.json
10. /server/config/server/default.ini
11. /server/config/config/default.ini
12. /server/config/default.ini

```bash
CONFIG_PATH=/server/config CONFIG_FILE=test.json node server.js
```
1. /server/config/test.json
2. /server/config/server/development.json
3. /server/config/config/development.json
4. /server/config/development.json
5. /server/config/server/development.ini
6. /server/config/config/development.ini
7. /server/config/development.ini
8. /server/config/server/default.json
9. /server/config/config/default.json
10. /server/config/default.json
11. /server/config/server/default.ini
12. /server/config/config/default.ini
13. /server/config/default.ini

```bash
CONFIG_PATH=/server/config CONFIG_FILE=/config/absolute/test.json node server.js
```
1. /config/absolute/test.json
2. /server/config/server/development.json
3. /server/config/config/development.json
4. /server/config/development.json
5. /server/config/server/development.ini
6. /server/config/config/development.ini
7. /server/config/development.ini
8. /server/config/server/default.json
9. /server/config/config/default.json
10. /server/config/default.json
11. /server/config/server/default.ini
12. /server/config/config/default.ini
13. /server/config/default.ini


## Default values
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
CONFIG_TYPE=ini node example/basic.js
```
This will only use files with an *ini* extention

### Set execution environment
```bash
NODE_ENV=development node example/basic.js
```
This will use a config files named *development.\**. If none is found it will try to find a config file named *default.\**.

### Set execution environment and force type of config
```bash
NODE_ENV=development CONFIG_TYPE=json node example/basic.js
```
This will use a config files named *development.json*. If none is found it will try to find a config file named *default.json*.

