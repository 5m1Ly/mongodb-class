import Cache from './utils/cache';
import { MongoClient, ObjectId } from 'mongodb'

class Sql {

	constructor() {

		// Get database & login info
		const { clust, db, user, pass } = JSON.parse(process.env.MONGO)

		// pass the connection url parameter to the MongoClient class
		this.client = new MongoClient(`mongodb+srv://${user}:${pass}@${clust}.ioxay.mongodb.net/${db}?retryWrites=true&w=majority`)
		this.database = this.client.db(db)

	}

	// check if the connection can be established
	ping = async () => {

		let retval = false;

		try {
			await this.client.connect();
			retval = true;
		} catch(err) {
			console.error(e)
		} finally {
			await this.client.close();
		}

		return retval;

	}

	// insert the data in the mongodb collection
	insert = async (table, data) => {

		let retval = false;

		try {

			// create connection
			await this.client.connect();

			// get the table
			const col = this.database.collection(table)

			// get the row id the data is inserted in to
			const info = await col.insertOne(data);
			const index = info.insertedId.toString();

			// cache the inserted data
			Cache.add(table, index, data)

			// set retval to true if the insert went success full
			retval = true

		} catch(err) {

			console.error(err);

		} finally {

			// close the client when your done
			await this.client.close();

		}

		return retval;

	}

	// fetch data from the mongodb collection
	fetch = async (table, index, callback) => {

		let retval

		try {

			// Check if the cached data is availble
			await Cache.get(table, index, data => retval = data ? data : null);

			if (!retval) {

				// create connection
				await this.client.connect();

				// get the correct table
				const col = this.database.collection(table)

				// Find one document
				retval = await col.findOne({ _id: ObjectId(index) });

			}

		} catch (err) {

			console.log(err);

		} finally {

			// close the client when your done
			await this.client.close();

			if (!callback) return retval
			else callback(retval)

		}

	}

}

export default Sql;