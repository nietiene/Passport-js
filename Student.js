const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const studentRoute = require("./studentRoute.js");
require("dotenv").config();

const student = express();
student.set(bodyParser.urlencoded({extended: true}));
student.set("view engine", "ejs");
student.use(bodyParser.json());
student.set("/student", studentRoute);

const URL = process.env.URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected successfully"))
  .catch((err) => console.error("Error", err));
  
student.get('/', (req, res) => {
    res.send("Welcome to student managment system");
});

const PORT = process.env.PORT;
student.listen(PORT, () => console.log(`http://localhost:${PORT}`));