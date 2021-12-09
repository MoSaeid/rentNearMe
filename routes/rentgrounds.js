const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const middleware = require('../middleware');
const rentgrounds = require('../controllers/rentgrounds');

router.get('/rentgrounds', rentgrounds.renderRentgrounds)

router.get('/rentgrounds/new',
middleware.isLoggedIn,
rentgrounds.newForm)

router.post('/rentgrounds',
middleware.isLoggedIn,
rentgrounds.createRentground)

router.get('/rentgrounds/:id', rentgrounds.showRentground)

router.get('/rentgrounds/:id/edit',
middleware.isLoggedIn, middleware.isAuthor
,rentgrounds.renderEditRentground)

router.put('/rentgrounds/:id', 
middleware.isLoggedIn, middleware.isAuthor, 
rentgrounds.updateRentground);

router.delete('/rentgrounds/:id', 
middleware.isLoggedIn, 
rentgrounds.deleteRentground);

module.exports = router;