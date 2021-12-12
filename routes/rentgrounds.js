const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const middleware = require('../middleware');
const rentgrounds = require('../controllers/rentgrounds');

router.route('/rentgrounds')
    .get(rentgrounds.renderRentgrounds)
    .post(middleware.isLoggedIn, rentgrounds.createRentground)

router.get('/rentgrounds/new',
middleware.isLoggedIn,
rentgrounds.newForm)

router.route('/rentgrounds/:id')
    .get(rentgrounds.showRentground)
    .put(middleware.isLoggedIn, middleware.isAuthor, rentgrounds.updateRentground)
    .delete(middleware.isLoggedIn, rentgrounds.deleteRentground)


router.get('/rentgrounds/:id/edit',
middleware.isLoggedIn, middleware.isAuthor
,rentgrounds.renderEditRentground)

module.exports = router;