const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const csurf = require('csurf');
const { isProduction } = require('./config/keys');

const usersRouter = require('./routes/api/users');
const tweetsRouter = require('./routes/api/tweets');
const csrfRouter = require('./routes/api/csrf');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./models/User');

const usersRouter = require('./routes/api/users');

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development because React will be on the React
  // development server (http://localhost:3000). (In production, React files
  // will be served statically on the Express server.)
  app.use(cors());
}

// Set the _csrf token and create req.csrfToken method to generate a hashed
// CSRF token
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Attach Express routers
app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter);
app.use('/api/csrf', csrfRouter);

module.exports = app;

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});
  
const serverErrorLogger = debug('backend:error');
  
  // Express custom error handler that will be called whenever a route handler or
  // middleware throws an error or invokes the `next` function with a truthy value
app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      statusCode,
      errors: err.errors
    })
});
  
module.exports = app;

router.post('/register', async (req, res, next) => {
    // Check to make sure no one has already registered with the proposed email or
    // username.
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
    });
  
    if (user) {
      // Throw a 400 error if the email address and/or username already exists
      const err = new Error("Validation Error");
      err.statusCode = 400;
      const errors = {};
      if (user.email === req.body.email) {
        errors.email = "A user has already registered with this email";
      }
      if (user.username === req.body.username) {
        errors.username = "A user has already registered with this username";
      }
      err.errors = errors;
      return next(err);
    }
});



router.post('/register', async (req, res, next) => {
    // Check to make sure no one has already registered with the proposed email or
    // username.
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
});
  
if (user) {
      // Throw a 400 error if the email address and/or email already exists
      const err = new Error("Validation Error");
      err.statusCode = 400;
      const errors = {};
      if (user.email === req.body.email) {
        errors.email = "A user has already registered with this email";
      }
      if (user.username === req.body.username) {
        errors.username = "A user has already registered with this username";
      }
      err.errors = errors;
      return next(err);
}
  
    // Otherwise create a new user
const newUser = new User({
      username: req.body.username,
      email: req.body.email
});
  
bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
        if (err) throw err;
        try {
          newUser.hashedPassword = hashedPassword;
          const user = await newUser.save();
          return res.json({ user });
        }
        catch(err) {
          next(err);
        }
      })
    });
});
  
module.exports = router;