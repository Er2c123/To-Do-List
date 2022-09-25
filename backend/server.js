const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors');
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const todoItemsModel = require('./model/todoItems');
const { nextTick } = require('process')
const todoItems = require('./model/todoItems')
const PORT = process.env.PORT || 9999

//remove secret key and mongodb uri
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ericj:9jFaBVsnu4HsKR8Z@cluster0.ttqhj7y.mongodb.net/?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
app.use(cors());
if(process.env.NODE_ENV === 'production'){
	app.use(express.static('client2/todo-list-mern2/build'))
}

//A bearer token is being passed from the frontend to the backend. The api call needs to break up the 
//data to only store the token sequence.
app.post('/api/change-password', async (req, res) => {
	const { newpassword: plainTextPassword } = req.body
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	let parsedTokenData = JSON.parse(token);
	parsedTokenData = parsedTokenData.data;

	try {
		jwt.verify(parsedTokenData, JWT_SECRET, (err, user) => {
			if (err) {
				console.log(err);
				console.log("incorrect token")
				res.json({ message: "incorrect token" });
			}
		}
		)

		//verify the token with the secret key to make sure it has not been inappropriately modified
		const user = jwt.verify(parsedTokenData, JWT_SECRET)
		const _id = user.id;

		const password = await bcrypt.hash(plainTextPassword, 10);
		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

//Lean is called to convert from mongoose to JSON object
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (user == null) {
		return res.json({ status: 'error', error: 'Incorrect username' })
	}
	else if (await bcrypt.compare(password, user.password)) {

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		res.json({ status: 'ok', data: token })
	}
	else {

		res.json({ status: 'error', error: 'Invalid username/password' })
	}


})


app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body



	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too short. Should be at least 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)


	try {
		const response = await User.create({
			username,
			password
		})
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	const todoItemDoc = await todoItemsModel.create({ username: username, items: [] });

	res.json({ status: 'ok' })
})

app.post('/api/item', async (req, res) => {
	const username = req.body.username;
	const item = req.body.itemText;

	const addedItem = await todoItemsModel.updateOne(
		{ username: username },
		{ $push: { items: item } }
	);
	//lean is called to convert from mongoose to JSON
	const newItemList = await todoItemsModel.findOne({ username: username }).lean();
	res.json(newItemList.items);
	return;
	
})

//A bearer token is being passed from the frontend to the backend. The api call needs to break up the 
//data to only store the token sequence.
app.post('/api/items', async (req, res) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401);
	let parsedTokenData = JSON.parse(token);
	parsedTokenData = parsedTokenData.data;

	try {
		jwt.verify(parsedTokenData, JWT_SECRET, (err, user) => {
			if (err) {
				res.json({ message: "incorrect token" });
			}
		}
		)
		const user = jwt.verify(parsedTokenData, JWT_SECRET)
		const username = user.username;
		//lean is called to convert from mongoose to JSON
		const currUser = await todoItemsModel.findOne({ username: username }).lean();
		res.json(currUser.items);

	} catch (err) {
		res.json({ status: 'error', error: ';))' })
	}

})

app.put('/api/item/:id', async (req, res) => {
	try {
		const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id, { $set: req.body });
		res.status(200).json('Item Updated');
	} catch (err) {
		res.json(err);
	}
})

app.post('/api/item/remove', async (req, res) => {

	const username = req.body.username;
	const item = req.body.item;

	try {
		//finds document with corresponding username; deletes corresponding item from items array
		const deleteItem = await todoItemsModel.updateOne({ "username": username }, { '$pull': { "items": item } });
		res.status(200).json('Item Deleted');
		return;
	} catch (err) {
		res.json(err);
		return;
	}
})
app.post('/api/item/update', async (req, res) => {
	try {
		//isUpdating is the string of the todolist item that is being changed
		//updateItemText is the string that isUpdating will be changed into 

		const username = req.body.username;
		const updateItemText = req.body.updateItemText;
		const isUpdating = req.body.isUpdating;

		let toUpdateDoc = await todoItemsModel.findOne({ "username": username }).lean()
		let items = toUpdateDoc.items;

		for (let i = 0; i < items.length; i++) {
			if (items[i] == isUpdating) {
				items[i] = updateItemText;
				break;
			}
		}

		toUpdateDoc = await todoItemsModel.findOne({ "username": username })
		toUpdateDoc.items = items;
		await toUpdateDoc.save();

	} catch (err) {
		console.log(err);
	}
	res.json("done")
})


app.listen(PORT, () => {
	console.log('Server up at 9999')
})
