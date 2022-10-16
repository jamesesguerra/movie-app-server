require('dotenv').config();
const express = require('express')
const cors = require('cors')


const app = express()

app.use(express.json());
app.use(cors());

app.use('/lists', require('./controllers/list'))

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" })
	}

	next(err)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log('listening...'))
