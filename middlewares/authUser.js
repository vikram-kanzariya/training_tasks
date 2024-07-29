const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../models/index');
const { session } = db;

exports.authUser = async(req , res, next) => {

  let token = req.cookies?.token || req.body?.token || req.header('Authorization')?.replace("Bearer " , "");

  if(!token){
      return res.redirect('/login');
  }
  else{
      let decoded = jwt.verify(token , process.env.JWT_SECRET , { 
        expiresIn : '1h' });

      let user = await session.findOne({ 
        where:{ userId:decoded.id , token:token } , 
        raw:true 
      });

      // console.log("User: " , user);
   
        req.user = user;
        req.token = token;
           
      if(!req.user){
        return res.redirect('/login');
      }
      next();
  }
}

exports.restrictLogin = async(req , res , next) => {
  if(!req.cookies.token){
    // Redirect To Login Page
    next();
  }
  else{
    let decoded = jwt.verify(req.cookies.token , process.env.JWT_SECRET);

    let result = await session.findAndCountAll({
      where:{
        userId:decoded.id,
        token:req.cookies.token
      },
      raw:true
    });

    // console.log(result);

    if(result.count && result.rows[0].token == req.cookies.token){
      // Redirect To Home-Page
      return res.redirect('/details');
    }
    else{
      // Redirect To Login Page
      next();
    }
  }
}