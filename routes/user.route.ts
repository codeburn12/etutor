import { authUser, authUserRoles } from './../middleware/auth';
// Import the express module
import express from 'express';
// Import the userRegistration controller function from '../controllers/user.controller'
import { userRegistration, activateUser, loginUser, logoutUser, updateUserAvatar, updateUserPassword, updatedAccessToken, getUserInfo, socialAuth, updateUserInfo} from '../controllers/user.controller';

// Create a new router instance using Express's Router
const userRouter = express.Router();

// Define a POST route for user registration at '/registration'
userRouter.post('/registration', userRegistration);

// Define a POST route for user activation at '/activate-user'
userRouter.post('/activate-user', activateUser);

// Define a POST route for user login at '/login'
userRouter.post('/login', loginUser);

// Define a GET route for user logout at '/logout'
userRouter.get('/logout', authUser,logoutUser);
// userRouter.get('/logout', authUser, authUserRoles("admin"), logoutUser);

// Define a GET route for refreshtoken at '/refreshtoken'
userRouter.get('/refreshtoken', updatedAccessToken);

// Define a GET route for userInfo at '/me'
userRouter.get('/me', authUser, getUserInfo);

// Define a POST route for social authentication at '/socialAuth'
userRouter.post('/socialAuth', socialAuth);

// Define a PUT route for update user details at '/updateUser'
userRouter.put('/updateUserInfo', authUser, updateUserInfo);

// Define a PUT route for update user details at '/updateUser'
userRouter.put('/updateUserPassword', authUser, updateUserPassword);

// Define a PUT route for update user avatar at '/updateUserAvatar'
userRouter.put('/updateUserAvatar', authUser, updateUserAvatar);


// Export the userRouter to be used in other parts of the application
export default userRouter;
