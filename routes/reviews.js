const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const middleware = require('../middleware');
const reviews = require('../controllers/reviews');

//Reviews Routes
router.post('/rentground/:id/review', middleware.isLoggedIn, reviews.createReview);

router.delete('/rentgrounds/:id/reviews/:reviewId', middleware.isLoggedIn, reviews.deleteReview)

module.exports = router;