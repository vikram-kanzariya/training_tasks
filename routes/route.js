const express = require('express');
const { registerUser, getRegisterForm, activateUser, verifyUser, getLoginForm, LoginUser, userData, logout, getForgotForm, forgotLink, resetForm, upatePassword, logoutAllDevices, logoutOtherDevices, updateUser, deleteUser,  } = require('../controller/userController');
const { authUser , restrictLogin } = require('../middlewares/authUser');
const { newMedicineForm, addMedicines, findMedicines, markAsDone } = require('../controller/medicineController');
const uploadCsv = require('../controller/reportController');
const generateCSVFiles = require('../services/generateCsv');

const userRouter = express.Router();


userRouter.get("/register" , getRegisterForm);
userRouter.post("/register" , registerUser);

userRouter.post('/update-user/:id' , updateUser)

userRouter.get("/token" , activateUser);
userRouter.get("/verify" , verifyUser);

userRouter.get("/login" , restrictLogin , getLoginForm);
userRouter.post("/login" , LoginUser);

userRouter.get("/logout" , authUser , logout);
userRouter.get("/logoutAllDevices" , authUser, logoutAllDevices);
userRouter.get("/logout-other-devices" , authUser, logoutOtherDevices);

userRouter.get("/details" , authUser , userData);
userRouter.get("/delete-user/:id" ,  deleteUser);

userRouter.get("/forgot" , getForgotForm);
userRouter.post("/forgot" , forgotLink);

userRouter.get("/reset" , resetForm);
userRouter.post("/reset" , upatePassword);

userRouter.get("/add-medicine" , authUser , newMedicineForm);
userRouter.post("/add-medicine" , authUser , addMedicines);

userRouter.get("/find" , findMedicines);
userRouter.get("/generate-report" , authUser , generateCSVFiles);

userRouter.get('/mark-done' , markAsDone);

userRouter.get('/getReports' , authUser ,  uploadCsv.getAllReports);

module.exports = userRouter;