const mongoose = require('mongoose');

const connectToDb = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://ateraryan45:2006ryan@cluster0.hdflzyn.mongodb.net/?retryWrites=true&w=majority'
		);
		console.log('Connected to DB...');
	} catch (err) {
		console.log('Failed to connect to DB...');
		console.error(err);
	}
};

module.exports = {
	connectToDb: connectToDb,
	User: require('./User'),
};
