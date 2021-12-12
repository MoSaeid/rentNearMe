# rentNearMe
web app 

##KNOWING BUGS:
- The Reviews stay in the DB after the post(AD) removed
- If you add rent(AD) detials with numbers, app crashs (e.g. { title: '2', location: '3', description: '3', price: '3', image: '3' } ) //fixed: the image cann't be number

#thing to improve
- database efficiency
- better design (UI/UX)

#TODO:
- catchAsync and ExpressError , wrap all async functions in catchAsync, and complete Error handling
- Validations, in front and backend
