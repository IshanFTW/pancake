# Pancake Money Transfer App
A full-stack web application that allows users to sign up, sign in, view their dashboard, and send money to other users. The frontend is built with React and TypeScript, while the backend is powered by Node.js and Express.

## Features
* User authentication (Sign up, Sign in) 
* Dashboard displaying user details and available balance
* Ability to send money to other users
* Real-time validation for insufficient balance during money transfer
* Responsive design
## Tech Stack
### Frontend:
* React with TypeScript
* Tailwind CSS for styling
* Axios for HTTP requests
* React Router for navigation
### Backend:
* Node.js with Express
* MongoDB with Mongoose for database management
* JWT for authentication

## Installation
### Prerequisites:
* Node.js (v14 or later)
* MongoDB (Local or Cloud)
* Git
### Clone the Repository:
```
git clone https://github.com/yourusername/pancake.git
cd pancake
```

### Backend Setup:
1. Navigate to the backend directory:
```
cd backend
```
2. Install the required dependencies:
```
npm install
```
3. Create a .env file in the backend directory with the following contents:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
4. Start the backend server:
```
npm start
```
## Frontend Setup:
1. Navigate to the frontend directory:
```
cd ../frontend
```
2. Install the required dependencies:
```
npm install
```
Create a .env file in the frontend directory with the following contents:
```
REACT_APP_API_URL=http://localhost:3000/api/v1
```
Start the frontend server:
```
npm run dev
```
### Running the Application:
1. Ensure both frontend and backend servers are running.
2. Visit http://localhost:3000 to view the application.
