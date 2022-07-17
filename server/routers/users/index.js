import express from 'express';
import ApplicationAuth from '../../controllers/authApplication/index.js';


const router = express.Router()
const authRoute = new ApplicationAuth();
// For Login
router.post('/login',authRoute.postLogin)
router.get('/user_details',authRoute.getUserDetails)

// For New User ##CreateAnAccount
router.post('/register',authRoute.postRegister)
export default router;