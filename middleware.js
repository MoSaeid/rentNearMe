const rentGround = require('./models/rentGround.js');

module.exports.isLoggedIn = function (req, res, next) {
	if (!req.isAuthenticated()) {
		// req.session.returnTo = req.originalUrl
		req.flash('error', 'You must be signed in first!');
		return res.redirect('/login');
	}
	next();
}

module.exports.isAuthor = async function (req, res, next) {
	const {
		id
	} = req.params;
	const rentground_data = await rentGround.findById(id);
	if (!rentground_data.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/rentgrounds/${id}`);
	}
	next();
}
