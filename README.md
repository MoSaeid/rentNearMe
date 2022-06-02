# rentNearMe
## rentNearMe is web-bassed application for rent, buy and sell real estate, houses, lands and flats.
## the tech used: NodeJS, Express.js, mongoDB and mongoose.js, ejs, bootstrap5, passport (for auth), and other npm packages 
**THIS APP UNDER DEVELOPMENT, NOT FOR PRODUCTION**
### KNOWING BUGS:
- The Reviews stay in the DB after the post(AD) removed
- If you add rent(AD) detials with numbers, app crashs (e.g. { title: '2', location: '3', description: '3', price: '3', image: '3' } ) //fixed: the image cann't be number

# things to improve
- database efficiency
- better design (UI/UX)

# TODO:
- catchAsync and ExpressError , wrap all async functions in catchAsync, and complete Error handling
- Validations, in front and backend
- the UI/UX is trash, please re-design it.
- migrate to mongoose 6
- use Google (OAuth) authentication strategies for Passport
- use google maps to show geo locations in the map
