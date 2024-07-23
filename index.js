var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const studentRoutes=require('./routes/student.routes.js')
const startupRoutes=require('./routes/startup.routes.js')
const blogRoutes=require('./routes/blog.route.js')
var app = express();


app.use("*", bodyParser.json());
const port = 5000;
const uri = "mongodb://localhost:27017/TalentBaseAi";
mongoose.connect(uri)
  .then(() => console.log("Successful connection to MongoDB"))
  .catch(err => console.error('Error occured in connected to mongoDB', err));

app.use('/student', studentRoutes);
app.use('/startup', startupRoutes);
app.use('/blog', blogRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
