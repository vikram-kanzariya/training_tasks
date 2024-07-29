const cloudinary = require('cloudinary').v2;

exports.uploadcsvToCloudinary = async(file , folder)=>{
  try {
      const options = {folder};
      options.resource_type = "auto";
      return await cloudinary.uploader.upload(file , options);
  } catch (error) {
      console.log("Error While cloudinary upload: " + error)
  }
}