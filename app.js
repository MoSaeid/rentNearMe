const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const rentGround = require('./models/rentGround.js');
const Review = require('./models/reviews.js')
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');


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


//Middleware functions
function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		// req.session.returnTo = req.originalUrl
		req.flash('error', 'You must be signed in first!');
		return res.redirect('/login');
	}
	next();
}

async function isAuthor(req, res, next){
    const { id } = req.params;
    const rentground_data = await rentGround.findById(id);
    if (!rentground_data.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/rentgrounds/${id}`);
    }
    next();
}
	
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
app.get('/', (req, res) => {// (Home)
	res.render('index');
})

app.get('/rentgrounds', async (req, res) => { //(List) show all database in this page
	const rentground_data = await rentGround.find();
	res.render('./rentground/rentground', {
		rentground_data
	});
})

app.get('/rentgrounds/new', isLoggedIn, async (req, res) => { //(Add) -to add new record in database

	res.render('rentground/new');
})

app.post('/rentgrounds', isLoggedIn, catchAsync(async (req, res) => { //POST reqeust to add data in database
	const rentground_data = req.body;
	rentground_data.author = req.user._id;
	const blah = new rentGround(rentground_data);
	await blah.save();
	req.flash('success', 'Successfuly added to the database!');
	res.redirect(`/rentgrounds/${blah._id}`)
}))



app.get('/rentgrounds/:id', async (req, res) => { // to show spicific record details in the page (via ID)
	try {
		const rentground_data = await rentGround.findById(req.params.id).populate('reviews').populate('author');
		if (!rentground_data) {
			req.flash('error', 'Opps, this Ad not avalible!!');
			return res.redirect('/rentgrounds')
		}
		res.render('rentground/show', {
			rentground_data
		});
	
	} catch (error) {
		res.redirect('/');
	}
})


app.get('/rentgrounds/:id/edit', isLoggedIn, isAuthor, async (req, res) => { // to edit specific record via ID
	const rentground_data = await rentGround.findById(req.params.id);
	res.render('rentground/edit', {
		rentground_data
	});

})

app.put('/rentgrounds/:id', isLoggedIn, isAuthor, async (req, res) => { // PUT request to edit data (from "rentgrounds/:id/edit" rout)
	const {id} = req.params;
	const rentground_data = await rentGround.findByIdAndUpdate(id, {...req.body});
	req.flash('success', 'Successfuly updated!');
	res.redirect(`/rentgrounds/${rentground_data._id}`);
});

app.delete('/rentgrounds/:id',isLoggedIn, async (req, res) => { // DELETE request by clicking delete button from ('/rentgrounds/:id' route)
	const {id} = req.params;
	await rentGround.findByIdAndDelete(id);
	req.flash('success', 'Succesfully deleted the AD!');
	res.redirect('/rentgrounds');
});

//Reviews Routes
app.post('/rentground/:id/review',isLoggedIn, async (req, res) => {
	console.log(req.params);
	const rentground_data = await rentGround.findById(req.params.id);
	const review = new Review(req.body);
	review.author = req.user._id;
	rentground_data.reviews.push(review);
	await review.save();
	await rentground_data.save();
	req.flash('success', 'Created new Review!');
	res.redirect(`/rentgrounds/${req.params.id}`)

})

app.delete('/rentgrounds/:id/reviews/:reviewId',isLoggedIn, catchAsync(async (req, res) => {
	const {
		id,
		reviewId
	} = req.params;
	await rentGround.findByIdAndUpdate(id, {
		$pull: {
			reviews: reviewId
		}
	});
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Succesfully deleted review!');
	res.redirect(`/rentgrounds/${id}`);
}))

//User Auth
app.get('/register', async (req, res) => {
	res.render('auth/register');
})

app.post('/register', async (req, res) => {
	try {
		const {
			username,
			email,
			password
		} = req.body;
		const user = new User({
			email,
			username
		});
		const registeredUser = await User.register(user, password);
		req.flash('success', 'You registerd successfully, welcome to RentNearME');
		res.redirect('/rentgrounds');

	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/rentgrounds');

	}


})

app.get('/login', async (req, res) => {
	res.render('auth/login');
})

app.post('/login', passport.authenticate('local', {
	failureFlash: true,
	failureRedirect: '/login'
}), async (req, res) => {
	req.flash('success', 'welcome back!');
	res.redirect('/rentgrounds')
})

app.get('/logout', async (req, res) => {
	req.logout();
	req.flash('success', 'GOODBYE :)');
	res.redirect('/');
})

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