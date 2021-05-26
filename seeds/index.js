const mongoose = require('mongoose');
const cities = require('./cities.js');
const seedHelper = require('./seedHelper.js');
const rentGround = require('../models/rentGround.js');

mongoose.connect('mongodb://localhost:27017/rentAPP', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('gooood')
})
.catch(err => {
    console.log('fffffffail', err)
})

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await rentGround.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new rentGround({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(seedHelper.descriptors)} ${sample(seedHelper.places)}`
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
