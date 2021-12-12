const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../controllers/auth')

//User Auth
router.route('/register')
	.get(auth.renderRegister)
	.post(auth.register);

router.route('/login')
	.get(auth.renderLogin)
	.post(passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}), auth.login);
	
router.get('/logout', auth.logout);

module.exports = router;