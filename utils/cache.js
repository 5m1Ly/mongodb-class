export class DataCacher {

	constructor() {

		// array to store temp data
		this.temp = []

		// object to store cached data
		this.data = {}

		// boolean to determine the caching state
		this.state = false

	}

	// toggles the caching state
	toggleActiveState = () => this.state = !this.state;

	// caches temp newly added data
	cache = async () => {

		// turn the caching state on
		toggleActiveState();

		while (this.temp.length > 0) {

			// get data from the temporary storage
			const { catogory, index, data } = this.temp.shift();

			// if the catagory is undefined set it equal to an array
			if (!this.data[catogory]) this.data[catogory] = [];

			// add the data to the data caching object
			this.data[catogory][index] = data;

		}

		// turn the caching state off
		toggleActiveState();

	}

	// adds new data to cache
	add = (catogory, index, data) => {

		// add the data to the temporary storage
		this.temp.push({
			catogory,
			index,
			data
		})

		// start caching data if state is inactive
		if (!this.state) this.cache();

	}

	// gets cached data
	get = async (catagory, index, callback) => {

		try {

			// get catagory if it exists
			const cat = this.cache[catagory];

			// get the data from the index location
			const data = cat[index];

			// return the fetched data in a callback if it exists
			if (!callback) return data;
			else callback(data);

		} catch(err) {

			console.error(err);

		}

	}

}

// create a new instance of the class here to globaly cache data
const Cache = new DataCacher();
export default Cache;


/*
	// if you dont want to globaly cache data export the class instead
	export default DataCacher;
*/