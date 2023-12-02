const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	uId: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	idNo: { type: Number, required: true },
	phoneNo: { type: String, required: true },
	location: { type: String, required: true },
});

module.exports = mongoose.model('users', UserSchema);
