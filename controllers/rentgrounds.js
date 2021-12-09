const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const rentGround = require('../models/rentGround.js');

module.exports.renderRentgrounds = async (req, res) => { //(List) show all database in this page
	const rentground_data = await rentGround.find();
	res.render('./rentground/rentground', {
		rentground_data
	});
}

module.exports.newForm = async (req, res) => { //(Add) -to add new record in database

	res.render('rentground/new');
}

module.exports.createRentground = catchAsync(async (req, res) => { //POST reqeust to add data in database
	const rentground_data = req.body;
	rentground_data.author = req.user._id;
	const blah = new rentGround(rentground_data);
	await blah.save();
	req.flash('success', 'Successfuly added to the database!');
	res.redirect(`/rentgrounds/${blah._id}`)
})

module.exports.showRentground = async (req, res) => { // to show spicific record details in the page (via ID)
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
}
module.exports.renderEditRentground = async (req, res) => { // to edit specific record via ID
	const rentground_data = await rentGround.findById(req.params.id);
	res.render('rentground/edit', {
		rentground_data
	});

}
module.exports.updateRentground = async (req, res) => { // PUT request to edit data (from "rentgrounds/:id/edit" rout)
	const {
		id
	} = req.params;
	const rentground_data = await rentGround.findByIdAndUpdate(id, {...req.body});
	req.flash('success', 'Successfuly updated!');
	res.redirect(`/rentgrounds/${rentground_data._id}`);
}
module.exports.deleteRentground = async (req, res) => { // DELETE request by clicking delete button from ('/rentgrounds/:id' route)
	const {
		id
	} = req.params;
	await rentGround.findByIdAndDelete(id);
	req.flash('success', 'Succesfully deleted the AD!');
	res.redirect('/rentgrounds');
}