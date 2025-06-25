# Chai Aur Backend - Social Media API

A comprehensive backend API for a social media platform built with Node.js, Express, and MongoDB. This project provides user authentication, tweet management, video sharing, and social features like subscriptions, comments, likes, and watch history.

## 🚀 Features

### User Management
- **User Registration & Authentication**: Secure user registration with email/username and password
- **JWT Authentication**: Access and refresh token-based authentication
- **Profile Management**: Update account details, avatar, and cover image
- **Password Management**: Secure password change functionality
- **User Profiles**: Get user channel profiles with subscription statistics

### Social Features
- **Tweet System**: Create, read, update, and delete tweets
- **User Tweets**: Fetch tweets by username
- **Subscription System**: Follow/unfollow other users, get your subscriptions, and see your subscribers
- **Watch History**: Track video viewing history
- **Like System**: Like/unlike videos, comments, and tweets
- **Comment System**: Comment on videos and tweets
- **Playlist Management**: Create and manage video playlists

### Media Management
- **Video Upload**: Upload videos with thumbnails
- **Cloudinary Integration**: Cloud-based media storage
- **File Upload**: Secure file upload with Multer middleware
- **Image Processing**: Avatar and cover image management

### Security Features
- **Password Hashing**: Bcrypt encryption for passwords
- **JWT Tokens**: Secure access and refresh token system
- **Middleware Protection**: Route protection with authentication middleware
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Comprehensive request validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Password Hashing**: Bcrypt
- **Development**: Nodemon, Prettier

## 📁 Project Structure

```
Backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── user.controller.js
│   │   ├── tweet.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   └── subscription.controller.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   ├── tweet.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   └── subscription.model.js
│   ├── routes/              # API routes
│   │   ├── user.routes.js
│   │   ├── tweet.route.js
│   │   ├── video.route.js
│   │   ├── comment.route.js
│   │   ├── like.route.js
│   │   └── subscription.route.js
│   ├── middlewares/         # Custom middleware
│   │   ├── Auth.middleware.js
│   │   └── multer.middleware.js
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── AsyncHandler.js
│   │   └── cloudinary.js
│   ├── db/                  # Database configuration
│   │   └── index.js
│   ├── app.js              # Express app configuration
│   ├── index.js            # Server entry point
│   └── constanst.js        # Constants
├── public/                 # Static files
│   └── temp/              # Temporary file storage
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_MongoDB_Connection_URI
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: multipart/form-data

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "avatar": [file],
  "coverImage": [file] (optional)
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

#### Logout User
```http
POST /users/logout
Authorization: Bearer <access_token>
```

#### Refresh Access Token
```http
POST /users/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### User Management Endpoints

#### Get Current User
```http
GET /users/current-user
Authorization: Bearer <access_token>
```

#### Update Account Details
```http
PATCH /users/update-account
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Change Password
```http
POST /users/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "oldPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### Update Avatar
```http
PATCH /users/changeAvatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "avatar": [file]
}
```

#### Update Cover Image
```http
PATCH /users/changecoverImage
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "coverImage": [file]
}
```

#### Get User Channel Profile
```http
GET /users/c/:username
Authorization: Bearer <access_token>
```

#### Get Watch History
```http
GET /users/watchHistory
Authorization: Bearer <access_token>
```

### Tweet Endpoints

#### Create Tweet
```http
POST /tweets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "This is my first tweet!"
}
```

#### Get User Tweets
```http
GET /tweets/user/:username
Authorization: Bearer <access_token>
```

#### Update Tweet
```http
PATCH /tweets/:tweetId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Updated tweet content"
}
```

#### Delete Tweet
```http
DELETE /tweets/:tweetId
Authorization: Bearer <access_token>
```

### Video Endpoints

#### Get All Videos
```http
GET /videos
Authorization: Bearer <access_token>
```

#### Publish a Video
```http
POST /videos
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "title": "My Video Title",
  "description": "Video description",
  "videoFile": [file],
  "thumbnail": [file]
}
```

#### Get Video by ID
```http
GET /videos/:videoId
Authorization: Bearer <access_token>
```

#### Update Video
```http
PATCH /videos/:videoId
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "description": "Updated description",
  "thumbnail": [file]
}
```

#### Delete Video
```http
DELETE /videos/:videoId
Authorization: Bearer <access_token>
```

#### Toggle Publish Status
```http
PATCH /videos/toggle/publish/:videoId
Authorization: Bearer <access_token>
```

### Comment Endpoints

#### Get All Comments for a Video
```http
GET /comments/:videoId
Authorization: Bearer <access_token>
```
- Returns all comments related to the specified video.

#### Add a Comment to a Video
```http
POST /comments/:videoId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Nice video!"
}
```

#### Update a Comment
```http
PATCH /comments/c/:commentId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Updated comment text"
}
```

#### Delete a Comment
```http
DELETE /comments/c/:commentId
Authorization: Bearer <access_token>
```

**MongoDB Aggregation $match Example:**
```js
{
  $match: {
    video: new mongoose.Types.ObjectId(videoId)
  }
}
```

### Like Endpoints

#### Like/Unlike a Video
```http
POST /likes/toggle/v/:videoId
Authorization: Bearer <access_token>
```

#### Like/Unlike a Comment
```http
POST /likes/toggle/c/:commentId
Authorization: Bearer <access_token>
```

#### Like/Unlike a Tweet
```http
POST /likes/toggle/t/:tweetId
Authorization: Bearer <access_token>
```

#### Get All Liked Videos by User
```http
GET /likes/videos
Authorization: Bearer <access_token>
```

### Subscription Endpoints

#### Subscribe/Unsubscribe to a Channel
```http
POST /subscription/c/:channelId
Authorization: Bearer <access_token>
```
- Subscribes the current user to the channel with id `channelId` if not already subscribed, otherwise unsubscribes.

#### Get All Channels a User is Subscribed To
```http
GET /subscription/c/:subscriberId
Authorization: Bearer <access_token>
```
- Returns all channels the user (subscriber) is subscribed to.
- **Note:** The `subscriberId` should be the user's own ID.

#### Get All Subscribers of a Channel
```http
GET /subscription/u/:channelId
Authorization: Bearer <access_token>
```
- Returns all users who are subscribed to the channel with id `channelId`.

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token for API access
2. **Refresh Token**: Long-lived token for refreshing access tokens
3. **Cookies**: Tokens are stored in HTTP-only cookies for security

### Protected Routes
Most endpoints require authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 📊 Database Models

### User Model
- `username`: Unique username (lowercase, indexed)
- `email`: Unique email address
- `fullName`: User's full name
- `avatar`: Cloudinary URL for profile picture
- `coverImage`: Cloudinary URL for cover image
- `watchHistory`: Array of video ObjectIds
- `password`: Hashed password
- `refreshToken`: JWT refresh token

### Tweet Model
- `owner`: Reference to User model
- `content`: Tweet text content
- `timestamps`: Created and updated timestamps

### Video Model
- `videoFile`: Cloudinary URL for video file
- `thumbnail`: Cloudinary URL for video thumbnail
- `title`: Video title
- `description`: Video description
- `duration`: Video duration in seconds
- `views`: View count
- `isPublished`: Publication status
- `owner`: Reference to User model

### Comment Model
- `content`: Comment text
- `video`: Reference to Video (the video this comment belongs to)
- `owner`: Reference to User
- `timestamps`: Created and updated timestamps

### Like Model
- `comment`: Reference to Comment
- `video`: Reference to Video
- `likedBy`: Reference to User
- `tweet`: Reference to Tweet
- `timestamps`: Created and updated timestamps

### Playlist Model
- `name`: Playlist name
- `description`: Playlist description
- `videos`: Array of Video references
- `owner`: Reference to User
- `timestamps`: Created and updated timestamps

### Subscription Model
- `subscriber`: Reference to User (the follower, i.e., the user who is subscribing)
- `channel`: Reference to User (the followed, i.e., the channel being subscribed to)
- `timestamps`: Created and updated timestamps

**To get all channels a user is subscribed to, query by `subscriber`.**
**To get all subscribers of a channel, query by `channel`.**

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Security**: Secure token generation and verification
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Multer middleware with file type validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with custom error classes

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

- `MONGODB_URI`: Production MongoDB connection string
- `ACCESS_TOKEN_SECRET`: Strong secret for access tokens
- `REFRESH_TOKEN_SECRET`: Strong secret for refresh tokens
- `CLOUDINARY_*`: Cloudinary configuration
- `CORS_ORIGIN`: Allowed origin for CORS

### Production Considerations
- Use HTTPS in production
- Set appropriate CORS origins
- Configure proper MongoDB indexes
- Set up monitoring and logging
- Use environment-specific configurations

## 🎯 Future Enhancements

- [ ] Video upload and streaming endpoints
- [ ] Real-time notifications
- [ ] Search functionality
- [ ] Pagination for large datasets
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
