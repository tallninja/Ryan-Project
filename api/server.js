const express = require('express');
const cors = require('cors');
const { connectToDb, User } = require('./models');
const api = require('./api.js');
const WebSocket = require('ws');
const http = require('http');

const app = express();

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({ server });

const clients = [];

wss.on('connection', (ws) => {
	console.log('Client connected');
	clients.push(ws);

	ws.on('close', () => {
		// Remove disconnected client from the array
		clients.splice(clients.indexOf(ws), 1);
		console.log('Client disconnected');
	});
});

app.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		return res.status(200).json(users);
	} catch (err) {
		console.error('An error occured');
		res.status(500).send();
	}
});

app.get('/users/:rfId', async (req, res) => {
	try {
		const user = await User.findOne({ rfId: req.params['reqId'] });
		if (!user) return res.status(404).send();
		return res.status(200).json(user);
	} catch (error) {
		console.error('An error occured');
		res.status(500).send();
	}
});

app.post('/users', async (req, res) => {
	try {
		const { name, idNo, phoneNo, location } = req.body;
		const params = new URLSearchParams();
		params.append('name', name);
		params.append('idNo', idNo);
		params.append('phoneNo', phoneNo);
		params.append('location', location);
		await api.post('/register', params);
		return res.status(200).send();
	} catch (err) {
		console.error('An error occured', err);
		res.status(500).send();
	}
});

app.put('/users/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user)
			return res
				.status(404)
				.json({ status: 400, message: `User with id: ${id} does not exist.` });
		Object.assign(user, req.body);
		const updatedUser = await user.updateOne({ $set: user });
		return res.status(200).json(updatedUser);
	} catch (err) {
		console.error('An error occured', err);
		res.status(500).send();
	}
});

app.delete('/users/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user)
			return res
				.status(404)
				.json({ status: 400, message: `User with id: ${id} does not exist.` });
		await user.deleteOne();
		return res.status(204).send();
	} catch (err) {
		console.error('An error occured', err);
		res.status(500).send();
	}
});

app.post('/register', async (req, res) => {
	console.log(req.body);
	try {
		const { uId } = req.body;
		const existingUser = await User.findOne({ uId });
		if (existingUser) return res.status(400).send();
		const user = await User.create(req.body);
		const savedUser = await user.save();
		return res.status(201).json(savedUser);
	} catch (err) {
		console.error('An error occured', err);
		res.status(500).send();
	}
});

app.post('/scan', async (req, res) => {
	try {
		const { uId } = req.body;
		const user = await User.findOne({ uId });
		if (!user) return res.status(404).send();
		clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(user));
			}
		});

		return res.status(200).send();
	} catch (err) {
		console.error('An error occured', err);
		res.status(500).send();
	}
});

server.listen(5000, (err) => {
	if (err) console.error('An error ocuured');
	console.log('Server started successfully');
});
