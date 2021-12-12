const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegister = async (req, res) => {
	res.render('auth/register');
}
module.exports.register = async (req, res) => {
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


}
module.exports.renderLogin = async (req, res) => {
	res.render('auth/login');
}
module.exports.login =  async (req, res) => {
	req.flash('success', 'welcome back!');
	res.redirect('/rentgrounds')
}

module.exports.logout = async (req, res) => {
	req.logout();
	req.flash('success', 'GOODBYE :)');
	res.redirect('/');
}