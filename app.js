const express = require('express');
const mongoose = require('mongoose');
const rentGround = require('./models/rentGround.js');
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const Review = require('./models/reviews.js')

const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/rentAPP', 
	{
	 useNewUrlParser: true,
	 useUnifiedTopology: true,
	 useCreateIndex: true,
	 useFindAndModify: false
	})
.then(()=>{
	console.log('FINE');
	})
.catch(()=>{
	console.log("BAD");
	})


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views')); // app.set('views', `${__dirname}/views`); this line is better than the path.join

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/rentgrounds', async (req, res) => { //show all database in this page
	const rentground_data = await rentGround.find();
	res.render('./rentground/rentground', {rentground_data});
})

app.get('/rentgrounds/new', async (req, res) =>{//to add new record in database
	res.render('rentground/new');
})

app.post('/rentgrounds', catchAsync(async (req, res) =>{//POST reqeust to add data in database
	
		const blah = new rentGround(req.body);
		await blah.save();
		console.log(req.body);
		res.redirect(`/rentgrounds/${blah._id}`)	
	}))



app.get('/rentgrounds/:id', async (req, res) => {// to show spicific record details in the page (via ID)
	const rentground_data = await rentGround.findById(req.params.id).populate('reviews');
	res.render('rentground/show', {rentground_data});
})


app.get('/rentgrounds/:id/edit', async (req, res) =>{// to edit specific record via ID
	const rentground_data = await rentGround.findById(req.params.id);
	res.render('rentground/edit', {rentground_data});
	console.log(rentground_data)
	
})

app.put('/rentgrounds/:id', async (req, res) => {// PUT request to edit data (from "rentgrounds/:id/edit" rout)
	const {id} = req.params;
	const rentground_data =await rentGround.findByIdAndUpdate(id,{...req.body});
	res.redirect(`/rentgrounds/${rentground_data._id}`);
	console.log(rentground_data);
});

app.delete('/rentgrounds/:id', async (req, res) => {// DELETE request by clicking delete button from ('/rentgrounds/:id' route)
	const {id} = req.params;
	await rentGround.findByIdAndDelete(id);
	res.redirect('/rentgrounds');
});

app.post('/rentgrounds/:id/reviews', async (req, res) => {
	const rentground_data = await rentGround.findById(req.params.id)
	const reviews = new Review(req.body)
	rentground_data.reviews.push(reviews)
	await rentground_data.save()
	await reviews.save()
	res.redirect(`/rentgrounds/${req.params.id}`)

})

app.delete('/rentgrounds/:id/reviews/:reviewId', catchAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await rentGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rentgrounds/${id}`);
}))

app.all('*', (req, res, next) =>{ //404 error
    next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})