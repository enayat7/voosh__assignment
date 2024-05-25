# Voosh_assignment
# first install node environment to run javascript code
# run npm i      - it will download all dependencies
# after that go to src directory and then run -- node index.js  or nodemon index.js
# Here we go, we can test all our endpoints




so baseUrl_sample will be  http://localhost:3000

EndPoints are

# 1. /google
// for authentication using googel

# 2. /register
//  to register user with name, email password, isProfile, bio, number,

# 3.  /login
// require email and password  or if you have valid jwt token

# 4.  /all-profile-details
// if user is admin he can show all public and private profile
// if not admin then will only able to see public profile

# 5.  /upload-edit-photo
// user can upload the photo
// user also can change the photo using same url

# 6.  edit-profile
// user can edit all profile details 

# 7. /make-admin/:id
// make any user admin


# I have also uplade it on render you can test all the endpoints and it base url is 
# BASE_URL of hosted backend on render website
# https://voosh-assignment-2.onrender.com
# you can test all the end points in the value


# finally one important note while uploading photo
# I dont know why this error occur in the file  multer.middleware.js  in line no.8
# cb(null, "../public") this line works when test locally in macbook
# cb(null, "./public") this changes work while hosting. But the exact reasion i dont know.


