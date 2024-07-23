var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/student.routes.js')
const startupRoutes = require('./routes/startup.routes.js')
const contactRoutes = require('./routes/contact.routes.js')
const updateRoutes = require('./routes/updates.routes.js')
var app = express();


app.use("*", bodyParser.json());
const port = 5000;
const uri = "mongodb+srv://admin:Zaeem123@zaeemrizwan.zi9jb8y.mongodb.net/TalentBaseAi";
mongoose.connect(uri)
  .then(() => console.log("Successful connection to MongoDB"))
  .catch(err => console.error('Error occured in connected to mongoDB', err));

app.use('/student', studentRoutes);
app.use('/startup', startupRoutes);
app.use('/contact', contactRoutes);
app.use('/update', updateRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;


