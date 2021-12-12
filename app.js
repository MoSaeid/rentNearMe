const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const rentGround = require('./models/rentGround.js');
const Review = require('./models/reviews.js')
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const rentgroundRoutes = require('./routes/rentgrounds')
const reviewsRoutes = require('./routes/reviews')
const authRoutes = require('./routes/auth')

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/rentAPP', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('FINE');
	})
	.catch(() => {
		console.log("BAD");
	})


app.use(express.urlencoded({
	extended: true
}));
app.use(methodOverride('_method'));

const sessionConfig = {
	secret: 'thisisshouldbebettersecrect!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
//Session
app.use(session(sessionConfig));
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // app.set('views', `${__dirname}/views`); this line is better than the path.join

//Routes
app.get('/', (req, res) => { // (Home)
	res.render('index');
})

app.use('/', rentgroundRoutes)
app.use('/', reviewsRoutes)
app.use('/', authRoutes)

app.all('*', (req, res, next) => { //404 error
	next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next) => {
	const {
		statusCode = 500
	} = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!'
	res.status(statusCode).render('error', {
		err
	})
})


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})