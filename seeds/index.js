const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose
  .connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('Connection Open!!');
  })
  .catch((err) => {
    console.log('ERROR!!');
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100) + 10;
    const camp = new Campground({
      author: '636cd1d3ec1ea6f64ceba0fa',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora tempore voluptatem fuga nobis non dolor consequuntur molestiae labore excepturi, iure qui mollitia molestias eveniet, provident, error dolorum. Itaque, ipsam soluta.',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.disconnect();
});
