const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedin, isReviewAuthor } = require('../middlewares');

const reviews = require('../controllers/reviews');

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');

router.post('/', isLoggedin, validateReview, wrapAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedin, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;
