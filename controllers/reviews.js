const rentGround = require('../models/rentGround.js');
const Review = require('../models/reviews.js')
const catchAsync = require('../utils/catchAsync.js');

module.exports.createReview = async (req, res) => {
	const rentground_data = await rentGround.findById(req.params.id);
	const review = new Review(req.body);
	review.author = req.user._id;
	rentground_data.reviews.push(review);
	await review.save();
	await rentground_data.save();
	req.flash('success', 'Created new Review!');
	res.redirect(`/rentgrounds/${req.params.id}`)

}

module.exports.deleteReview = catchAsync(async (req, res) => {
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
})