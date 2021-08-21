// Import libraries
const express = require("express")
const path = require("path")
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const mysql = require("mysql")
const config = require("./config")
require('dotenv').config()


// Add middleware 
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Use ejs as a view engine
app.set("view engine", "ejs")


// Instantiate DB Conection
const dbConnection = mysql.createConnection(config.dbConfig)
dbConnection.connect((err) => {
	if (err) {
		throw err
	}
	console.log(`Connected to DB`)
})


//Call function to render HOME PAGE without filters
router.get(`/`, function (req, res) {
	// Send ALL as request   (without filters)
	router.loadHOME(`ALL`, res)
})

//Call function to render HOME PAGE with filters
router.get(`/:filterby`, function (req, res) {
	const filter = req.params.filterby
	// Send filter as request  (with filters)
	router.loadHOME(filter, res)
})

//Render HOME PAGE
router.loadHOME = function (filters, res) {
	//Storage the filters in an object
	const oStatus = {
		status: filters
	}
	// Instantiate query with our without FILTERS
	let query = `SELECT * FROM tasks`
	if (filters != "ALL") {
		query += ` WHERE checked = ${filters}`
	}
	query += ` ORDER BY id ASC`
	// Consult database and render HOME PAGE
	dbConnection.query(query, (err, result) => {
		if (err) { throw err }
		//Send the result of the consult  and the filters
		res.render("index", { tasks: result, check: oStatus })
	})
}

//render  TASK PROFILE
router.get(`/task/:id`, function (req, res) {
	// Instantiate query filtering by ID
	const taskId = req.params.id
	const query = `SELECT * FROM tasks WHERE id = ${taskId} `
	// Consult database and render TASK PROFILE
	dbConnection.query(query, (err, result) => {
		if (err) { throw err }
		res.render("task", {
			task: result[0]
		})
	})
})

//Delete a task by id
router.post('/delete-task', function (req, res) {
	const query = `DELETE FROM tasks WHERE id = ${req.body.id}`
	dbConnection.query(query, (err, result) => {
		if (err) {
			throw err
		}
		res.writeHead(302)
		res.end()
	})
})

//Add a task
router.post(`/add-task-submit`, function (req, res) {
	const query = `INSERT INTO tasks (name, checked) VALUES ("${req.body.name}", 0)`
	dbConnection.query(query, (err, result) => {
		if (err) {
			throw err
		}
		// Consult database,  send response header to the request.
		res.writeHead(302, { Location: "/" })
		res.end()
	})
})

//Update the checked status of the task
router.post(`/check-task`, function (req, res) {
	const query = `UPDATE tasks SET checked = "${req.body.checked}" WHERE id = ${req.body.id}`
	dbConnection.query(query, (err, result) => {
		if (err) {
			throw err
		}
		res.writeHead(302)
		res.end()
	})
})


//Update the name of the task
router.post('/update-task-submit', function (req, res) {
	const query = `UPDATE tasks SET name = "${req.body.name}" WHERE id = ${req.body.id}`
	dbConnection.query(query, (err, result) => {
		if (err) {
			throw err
		}
		res.writeHead(302, { Location: "/" })
		res.end()
	})
})

// Run the app on port defined on config (config\index.js)
app.use(`/`, router)
app.listen(config.serverPort, () => {
	console.log(`express server at 8080`)
})