const express = require('express');

const { campgroundSchema } = require('../schemas');

const Campground = require('../models/campground');

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const isLoggedin = require('../middlewares');

const app = express();
const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

router.get('/new', isLoggedin, (req, res) => {
  res.render('campgrounds/new');
});

router.post(
  '/',
  isLoggedin,
  validateCampground,
  wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedin,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

router.put(
  '/:id',
  isLoggedin,
  validateCampground,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
