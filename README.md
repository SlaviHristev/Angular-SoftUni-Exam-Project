# SoftUni-Angular-Exam-Project
# Car Shop Project
Welcome to the Car Shop Project! This is a web application where users can buy, sell, and explore various cars. The platform offers a range of features for both logged-in and non-logged-in users, including real-time chat and detailed user profiles. Below is an overview of the project's features, dependencies, and setup instructions.

# Features
## For All Users
* Home Page: View a selection of featured posts and general information about the platform.
* Catalog Page: Browse all available car posts.
* About Page: Learn more about the Car Shop platform.
* Contact Page: Reach out to the Car Shop team.
* Register Page: Create a new user account.
* Login Page: Log into an existing user account.
* Details Page: View detailed information about a specific post, including images and description.
* Other User Profile Page: View a specific user profile with all their created posts if there are any.
* Not Found Page: Displays a 404 error for invalid routes.
## For Logged-In Users
* Create Page: Create a new post to sell a car.
* Profile Page: View your profile, including your saved posts, created posts, and conversations.
* Edit Profile Page: Update your profile information, including your profile picture.
* Edit Post Page: Edit the details of a post you have created.
## Post Actions:
* Edit/Delete: Owners can edit or delete their posts.
* Save Post: Users can save posts for later viewing.
* Message Owner: Users can send messages to the post owner.
## Real-Time Features
* Real-Time Chat: Engage in real-time conversations with other users using socket.io.
## Profile Page
* Saved Posts: View all posts you have saved.
* Created Posts: View all posts you have created.
* Conversations: View and manage conversations with other users.
## Details Page for Non-Owners
* Owner Profile: Click on the owner's profile to view their information and posts.
* Message Owner: Send messages to the post owner directly from their profile page.
## Image Upload
* Create Post: Upload multiple images using the Cloudinary upload widget.
* Update Profile: Upload a profile picture.
## Smooth Transitions
* Angular Animations: Utilizing Angular Animations to create smooth and appealing transitions between pages.
# Dependencies
## Client
* Main Dependencies: Angular, Socket.io Client.
* Other Dependencies: @emailjs/browser
## API
* Main Dependencies: Bcrypt, Cookie-Parser, CORS, Dotenv, Express, JSONWebToken, Mongoose.
* Development Dependencies: Nodemon.
## Socket
* Main Dependency: Socket.io.
## Database
MongoDB: Used for storing all the data.
## Tools
* MongoDB Compass
# Setup Instructions
Prerequisites
* Node.js and npm installed.
* MongoDB instance running.
# Setting up client
* cd car-shop
* npm install
* ng serve
# Setting up API
* cd api
* npm install
* npm start
# Setting up socket
* cd socket
* npm install
* node index.js
# Setting up MongoDB Compass
* Open MongoDB Compass
* Connect to your MongoDB server by entering the connection string (mongodb://localhost:27017).
# Enviromental variables
* JWT_SECRET_KEY=your_jwt_secret

# Usage
* Register and Login: Users can register and login to the application.
* View Posts: Both logged in and non-logged in users can view posts on the home, catalog, and details pages.
* Create and Manage Posts: Logged in users can create posts, and post owners can edit or delete their posts.
* Save and Message: Logged in users who are not the owner of a post can save the post and message the owner.
* Profile Page: View your saved posts, created posts, and conversations.
* Real-time Chat: Enjoy real-time chat functionality with socket.io.
# Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.

# License
This project is licensed under the MIT License.
