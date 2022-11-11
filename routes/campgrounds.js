const express = require('express');

const campground = require('../controllers/campgrounds');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedin, isAuthor, validateCampground } = require('../middlewares');

const router = express.Router();

router.route('/').get(campground.index).post(isLoggedin, validateCampground, wrapAsync(campground.createCampground));

router.get('/new', isLoggedin, campground.renderNewForm);

router
  .route('/:id')
  .get(wrapAsync(campground.showCampground))
  .put(isLoggedin, isAuthor, validateCampground, wrapAsync(campground.updateCampground))
  .delete(isLoggedin, isAuthor, wrapAsync(campground.deleteCampground));

router.get('/:id/edit', isLoggedin, isAuthor, wrapAsync(campground.renderEditForm));

module.exports = router;
