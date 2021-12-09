const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//User Auth
router.get('/register', async (req, res) => {
	res.render('auth/register');
})

router.post('/register', async (req, res) => {
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

router.get('/login', async (req, res) => {
	res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
	failureFlash: true,
	failureRedirect: '/login'
}), async (req, res) => {
	req.flash('success', 'welcome back!');
	res.redirect('/rentgrounds')
})

router.get('/logout', async (req, res) => {
	req.logout();
	req.flash('success', 'GOODBYE :)');
	res.redirect('/');
})

module.exports = router;