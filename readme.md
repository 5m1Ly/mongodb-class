# MongoDB class
The class within the sql file establishes a connection with the mongodb cluster and allows you to insert and fetch data from the cluster database or fetch from the cached data.

## Contents
- Enviorment Variable
- Sql Class
- Caching

### Enviorment Variable
Before you can use the class you need to add the following details to your .env.local file (if you don't have it there is a backup file within the repo)
```
MONGO={"clust": "[cluster]", "db": "[database]", "user": "[username]", "pass": "[password]"}
```
replace the following
- \[cluster\] -> to the name of you cluster
- \[database\] -> to the name of your database
- \[username\] -> to your username
- \[password\] -> to your password

### Sql Class

#### New instance
create a instance of the class as follows
```js
import Sql from './sql.js';
const sql = new Sql();
```

#### Properties
| prop     | value  | use case                   |
|----------|--------|----------------------------|
| client   | Object | holds the MongoDB client   |
| database | Object | holds the MongoDB database |

#### Methods
1. ping

	<small>_If you want to test the connection you can use the ping command_</small>

	<strong>Info</strong>
	| call       | async | return value |
	|------------|-------|--------------|
	| sql.ping() | yes   | boolean      |

	<strong>Example</strong>
	```js
	const check = async () => {
		const state = await sql.ping()
		console.log(state ? "MongoDB connection established!" : "Not connected to MongoDB...")
	}
	```

1. insert

	<small>_This method adds data to your mongodb cluster, when finished it auto matically caches the insterted data to improof preformance_</small>

	<strong>Info</strong>
	| call         | async | return value |
	|--------------|-------|--------------|
	| sql.insert() | yes   | boolean      |

	<strong>Parameters</strong>
	| param | value  | optional |
	|-------|--------|----------|
	| table | String | no       |
	| data  | Object | no       |

	<strong>Example</strong>
	```js
	sql.insert("users", userdata);
	```

1. fetch

	<small>_This method checks the cached data if the data is allready exists on the server, when this isn't the case it fetches te data from the cluster database and returns the data asked for_</small>

	<strong>Info</strong>
	| call        | async | return value |
	|-------------|-------|--------------|
	| sql.fetch() | yes   | boolean      |

	<strong>Parameters</strong>
	| param    | value    | optional |
	|----------|----------|----------|
	| table    | String   | no       |
	| index    | String   | no       |
	| callback | Function | yes      |

	<strong>Example</strong>
	```js
	sql.fetch("users", "sdoa812bdo8d0a8h081", (userdata) => {
		console.log(userdata)
	});
	```

### Caching
There are 2 ways of caching data with this class either globally or locally. you can cache data gobally by using the Cache constant you can import from the cache.js file if you want to cache data locally you can use the DataCacher class also imported from the cache.js file.

#### Local Caching
When you want to cache data locally you should import the DataCacher class from the cache.js file and create a new instance of the class like shown below this caches within the module (file/script) and can't be shared across files unless exported
```js
import { DataCacher } from './utils/cache';
const Cache = new DataCacher();
```

#### Global Caching
The default export Cache is a instance of the DataCacher class that has been instanciated within the cache.js file this way the cached data can be shared across diffrent modules (files/scripts).
```js
import Cache from './utils/cache';
```

#### Properties
| prop  | value   | use case                       |
|-------|---------|--------------------------------|
| temp  | Array   | temp data storage              |
| data  | Object  | cached data storage            |
| state | Boolean | true when processing temp data |

#### Methods
1. add

	<small>_With this method you can add data to the caching queue_</small>

	<strong>Info</strong>
	| call        | async | return value |
	|-------------|-------|--------------|
	| Cache.add() | no    | none         |

	<strong>Parameters</strong>
	| param    | value  | optional |
	|----------|--------|----------|
	| catagory | String | no       |
	| index    | String | no       |
	| data     | Object | no       |

	<strong>Example</strong>
	```js
	Cache.add("users", userdata.index, userdata)
	```

1. get

	<small>_With this method you can fetch cached data_</small>

	<strong>Info</strong>
	| call        | async | return value |
	|-------------|-------|--------------|
	| Cache.get() | yes   | data         |

	<strong>Parameters</strong>
	| param    | value    | optional |
	|----------|----------|----------|
	| catagory | String   | no       |
	| index    | String   | no       |
	| callback | Function | yes       |

	<strong>Example</strong>
	```js
	// without callback

	// option 1
	const userdata = Cache.get("users", "sdoa812bdo8d0a8h081");

	// option 2
	const userdata = await Cache.get("users", "sdoa812bdo8d0a8h081");

	// with callback
	Cache.get("users", "sdoa812bdo8d0a8h081", (userdata) => {
		console.log(userdata)
	})
	```