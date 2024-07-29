const db = require('../models/index');
const jwt = require('jsonwebtoken');
const { User , session , Medicines , reports } = db;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { where, QueryTypes, Op } = require('sequelize');
const { authUser } = require('../middlewares/authUser');
const { toASCII } = require('punycode');
const { off } = require('process');
require('dotenv').config();

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}


exports.getRegisterForm = async(req , res) => {
  try {
    return res.render('register');
  } catch (error) {
    console.error("error: " + error);
    return res.json({ 
      success:false,
      message:"Some Error Occured During Page-Rendering"
     })
  }
}

exports.registerUser = async(req , res) => {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let number = req.body.number;
  let email = req.body.email;
  let passwd = req.body.passwd;
  let cpasswd = req.body.cpasswd;

  try {
    if(!fname || !lname || !email || !passwd || !cpasswd || !number){
      return res.json({message:"Please Enter All Data..."})
    }

    if(email && !isValidEmail){
      return res.json({ message:"Please Enter Valid Email"});
    }

    if(number && (number.length != 10)){
      return res.json({ 
        success:false,
        message:"Phone Number Should be of 10-Digits"
      });
    }

    if(passwd != cpasswd){
      return res.json({ 
        success:false,
        message:"Password & Confirm Password are not equal"
      });
    }

    let query = await User.findOne({
      where:{ email:email }
    });

    if(query){
      return res.json({
        success:false,
        message:"User Already Exists"
      });
    }

    let salt = Math.random().toString(36).slice(2 , 6); 
    passwd = passwd + salt;

    let bcryptSalt = bcrypt.genSaltSync(10);

    let hassedPassword = await bcrypt.hash(passwd , bcryptSalt);

    let verification_token = crypto.randomUUID();
    console.log(verification_token);

    const createUser = await User.create({
      firstName:fname,
      lastName:lname,
      phoneNumber:number,
      email:email,
      password:hassedPassword,
      pw_salt:salt,
      activation_token:verification_token,
    });


    if(createUser.length == 0){
      return res.json({ success:false , message:"Error While Registration" });
    }

    return res.json({
      success:true,
      message:"User Registered SuccessFully",
      token:verification_token,
      email:email
    });
  } catch (error) {
    console.error("Some Error Occured: " + error);
    throw error;
  }

}

exports.activateUser = async(req , res) => {
  try {
      
  let token = req.query.token;
  let email = req.query.email;

  if(!token || !email){
      return res.json({ message:"Some Error Occured..." });
  }

  let html = `
      <div class="activeUser">
          <h5> Thanks For Registration</h5>

          <p>Click on this Link to Activate Your Account</p>

          <a href="http://localhost:8000/verify/?token=${token}&email=${email}">http://localhost:8000/verify/?token=${token}&email=${email} </a>
      </div>
  `;

    return res.render('activate' , { html });
  } catch (error) {
      console.log(new Error(error))
  }
};


exports.verifyUser =  async(req , res) => {
  try {
    let token = req.query.token;
    let email = req.query.email;

    // ---> Check if Token Exists or Not
    let sql = await User.findAll({
      where:{
        activation_token:token,
        email:email
      }
    });

    if(sql.length <= 0){
      let  html = `
            <div class="verify-token"> 
                <p style="background-color:red">Token is Invalid...</P>
            </div>
        `;
        return res.render('activate' , { html }); 
    }
   

    let diff = new Date(Date.now()) - new Date(sql[0].createdAt);
    let minutes = Math.floor((diff % 86400000 ) / 60000 );


    if(minutes > 1 && sql[0].is_active == 0){

      sql = await User.destroy({
        where:{ activation_token:token }
      });


        let  html = `
                <div class="verify-token"> 
                    <p style="background-color:red">Token is Expired...</P>
                </div>
            `;
      return res.render('activate' , { html })
    }


    // ---> Update Activeated Status to true <---
    sql = await User.update(
      { is_active:1 },
      { where: { activation_token:token }}
    )

    let  html = `
    <div class="verify-token"> 
        <p style="background-color:green">Your Account is Activated Successfully</P>
        <a href="http://localhost:8000/login">Click here</a> to Login`;

    return res.render('activate' , {html})
  } catch (error) {
    console.error("Some Error" + error);
    throw error;
  }
}; 

exports.getLoginForm = async(req , res) => {

  return res.render('login');
}

exports.userData = async(req , res) => {
  const data = await User.findAll({ raw: true });

  const total = await Medicines.findAll({ 
    where:{
      userId:req.user.userId,
    },
    include:User,
    raw:true,
  });
  
  let totalRecords = total.length;
  let dataPerPage = 5;
  let lastPage = Math.ceil(totalRecords / dataPerPage);
  
  let page = req.query.page || 1;
  let offset = 0;
  if(page - 1 > 0){
    offset = dataPerPage * (page-1);
  }
  else{
    offset = 0;
  }


  const medicineData = await Medicines.findAll({ 
    where:{
      userId:req.user.userId,
    },
    include:User,
    raw:true,
    offset:offset,
    limit:dataPerPage,
  });


  return res.render('details' , { user:req.user , medicines:medicineData , page:page , lastPage:lastPage });
}

exports.LoginUser = async(req , res) => {
  try {
    let email = req.body.email.trim();
    let passwd = req.body.passwd.trim();

  if(!email || !passwd){
      return res.json({
          success:false,
          message:"Please Enter All Fields..."
      });
  }

  if(email && (!isValidEmail(email))){
      return res.json({
          success:false,
          message:"Please Enter Correct Credentials..."
      });
  }

  let sql = await User.findAll({ where:{ email:email } });

  // ---> Check if User Registered or Not <---
  if(sql.length <= 0){
      return res.json({
          success:false,
          message:"User does not exist or Invalid Credentials..."
      });
  }

  let userPassword = sql[0].password; // ---> Registered Password.
  let EnteredPassword = passwd + sql[0].pw_salt; // ---> User Entered Password.

  let id = sql[0].id;

  let payload = {
      id:id,
      firstName:sql[0].firstName,
      lastName:sql[0].lastName,
      email:sql[0].email, 
  };

  let token = jwt.sign(payload , process.env.JWT_SECRET);

  let { password:_ , ...newObj } = sql[0];
  newObj.token = token;

  if(await bcrypt.compare(EnteredPassword , userPassword)){    

      let sessionData = await session.create({
        userId:sql[0].id,
        firstName:sql[0].firstName,
        lastName:sql[0].lastName,
        email:sql[0].email,
        token:token,
      });
      
      // console.log("login Token: " , token)

      return res.cookie('token' , token).json({
          success:true,
          message:"Login success",
          uid:id,
          // token:token,
          token:newObj,
          data:sessionData
      });
  }
  else{
      console.log("Login failed")
      return res.json({
          success:false,
          message:"login failed",
      })
  }
  } catch (error) {
      console.log(new Error(error));
      throw error;
  }
};

exports.logout = async(req , res) => {
  try {
    await session.destroy({ 
      where:{ 
        userId:req.user.userId,
        token:req.cookies.token,
       }
    });

    return res.clearCookie('token').json({
      success:true,
      message:"Log-Out from this-Device is SuccessFull"
  });

  } catch (error) {
    console.error("Some Error: " + error);
    throw error;
  }
}

exports.logoutAllDevices = async(req , res) => {
  try {
    const getAllSessions = await session.findAll({ where:{ userId:req.user.userId} });

    let io = req.app.get('socketio');
    getAllSessions.forEach((data) => {
      io.emit(`log-out-${data.token}`)
    });

    const deleteSession = await session.destroy({ where:{ userId:req.user.userId } });

    return res.clearCookie('token').json({
      success:true,
      data:deleteSession,
      message:"Successfully Logged-Out from al Devices",
    });
  } catch (error) {
    console.error("Some Error:" + error);
    throw error;
  }
}

exports.logoutOtherDevices = async(req , res) => {
  try {
    const getAllSessions = await session.findAll({ where:{ userId:req.user.userId }});

    let io = req.app.get('socketio');
    getAllSessions.forEach((data) => {
      io.emit(`log-out-${data.token}`);
    });
  
    const logout_other_device = await session.destroy({
      where:{
        [Op.or]:{
          userId:{ [Op.ne]: req.user.userId },
          token:{ [Op.ne] : req.cookies.token }
          // token:{ [Op.ne] : req.user.token }
        }
      }
    });

    res.json({
      success:true,
      message:"SuccessFully Logged-out from Other Devices"
    });

  } catch (error) {
    console.error("Some Error: " , error);
    throw error;
  }
}

exports.getForgotForm = async(req , res) => {
  return res.render('forgot');
};

exports.forgotLink = async(req , res) => {
  try {
    let email = req.body.email.trim();
    
    if(!email){
        return res.json({
            success:false,
            message:"Email is Required..."
        });
    }

    let sql = await User.findAll({
      where:{ email:email },
    });
    
    if(sql.length <= 0){
        return res.json({
            success:false,
            message:"User Not Found...",
        });
      };

    return res.json({
        success:true,
        mail:email,
    });
  } 
  catch (error) {
    console.log(new Error(error))
  }
};

exports.resetForm = async(req , res) => {
  return res.render('resetPassword');
}

exports.upatePassword = async(req , res) => {
  try {
    let passwd = req.body.passwd;
    let cpasswd = req.body.cpasswd;
    let email = req.body.email;

    if(!passwd || !cpasswd){
        return res.json({
            success:false,
            message:"All Fields are Required..."
        });
    }

    if(passwd != cpasswd){
        return res.json({
            success:false,
            message:"Password Doesn't Match"
        });
    }

    // ---> Generating New Salt
    let salt = Math.random().toString(36).slice(2 , 6);
    passwd = passwd + salt;

    let bcryptSalt =  bcrypt.genSaltSync(10);
    let hashPassword = await bcrypt.hash(passwd , bcryptSalt);

    let sql = await User.update({
      password:hashPassword,
      pw_salt:salt,
    },
    { where:{ email:email } },
  );

    if(!sql){
      return res.json({
        success:false,
        message:"Error Occured During Paswword Reset",
      });
    };

    return res.json({
        success:true,
        message:"Password Updated Successfully...",
    });
  } catch (error) {
    console.log(new Error(error));
  }
};

exports.updateUser = async(req , res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    const updatedData = await User.update(userData , { where:{ id:userId }});

    return res.status(200).json({
      success:true,
      message:"User Updated Successfully",
      data:updatedData,
    });
  } catch (error) {
    console.error("Some Error: " , error);
    throw error;
  }
}

exports.deleteUser = async(req , res) => {
  try {
    const userId = req.params.id;

    await User.destroy({ where: { id: userId }})

    return res.json({
      success:true,
      message:"user succesfully deleted..."
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// exports.findAllSessions = async(req , res) => {
//   try {
//     const result = await session.findAndCountAll({});
//   } catch (error) {
//     console.error("Some error:", error);
//     throw error;
//   }
// }