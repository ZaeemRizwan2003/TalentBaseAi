var createError = require('http-errors');
var express = require('express');
var path = require('path');
const dotenv = require('dotenv');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const blogRoutes=require('./routes/blog.route.js')
const studentRoutes = require('./routes/student.routes.js');
const startupRoutes = require('./routes/startup.routes.js');
const ecommerceRoutes = require('./routes/ecommerce.routes.js'); 
const digitalServiceRoutes = require('./routes/digitalservice.routes.js'); 
const podcastRoutes = require('./routes/podcast.routes.js'); 
const courseRoutes = require('./routes/course.routes');
const certificationRoutes = require('./routes/certification.routes');
const contactRoutes = require('./routes/contact.routes.js')
const updateRoutes = require('./routes/updates.routes.js')

const learningpathRoutes = require ('./routes/learningpath.routes.js')

const userRoutes=require('./routes/user.routes.js');

var app = express();
dotenv.config();
app.use("*", bodyParser.json());
const port = 5000;
const uri = process.env.MONGO_KEY;
mongoose.connect(uri)
  .then(() => console.log("Successful connection to MongoDB"))
  .catch(err => console.error('Error occurred in connecting to MongoDB', err));

app.use('/startup', startupRoutes);
app.use('/student', studentRoutes);
app.use('/blog', blogRoutes);
app.use('/ecommerce', ecommerceRoutes); 
app.use('/podcast', podcastRoutes);
app.use('/digitalservice',digitalServiceRoutes);
app.use('/users',userRoutes);
app.use('/learningpath',learningpathRoutes);
app.use('/courses', courseRoutes);
app.use('/certifications', certificationRoutes);
app.use('/startup',startupRoutes);
app.use('/student',studentRoutes);
app.use('/contact', contactRoutes);
app.use('/update', updateRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;


