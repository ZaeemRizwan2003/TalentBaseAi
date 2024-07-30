const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const blogRoutes = require('./routes/blog.route.js');
const studentRoutes = require('./routes/student.routes.js');
const startupRoutes = require('./routes/startup.routes.js');
const ecommerceRoutes = require('./routes/ecommerce.routes.js');
const digitalServiceRoutes = require('./routes/digitalservice.routes.js');
const podcastRoutes = require('./routes/podcast.routes.js');
const courseRoutes = require('./routes/course.routes');
const certificationRoutes = require('./routes/certification.routes');
const contactRoutes = require('./routes/contact.routes.js');
const updateRoutes = require('./routes/updates.routes.js');
const industryRoutes = require('./routes/industry.routes.js');
const learningpathRoutes = require('./routes/learningpath.routes.js');
const userRoutes = require('./routes/user.routes.js');

const app = express();
dotenv.config();

const port = 5000;
const uri = process.env.MONGO_KEY;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Successful connection to MongoDB'))
  .catch((err) => console.error('Error occurred in connecting to MongoDB', err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: uri }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use('/startup', startupRoutes);
app.use('/student', studentRoutes);
app.use('/blog', blogRoutes);
app.use('/ecommerce', ecommerceRoutes);
app.use('/podcast', podcastRoutes);
app.use('/digitalservice', digitalServiceRoutes);
app.use('/users', userRoutes);
app.use('/learningpath', learningpathRoutes);
app.use('/courses', courseRoutes);
app.use('/certifications', certificationRoutes);
app.use('/contact', contactRoutes);
app.use('/update', updateRoutes);
app.use('/industry', industryRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
