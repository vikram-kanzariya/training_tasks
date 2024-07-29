const cloudinary = require('cloudinary').v2;

const configuration = async() => {
  try {
    cloudinary.config({
      cloud_name:process.env.CLOUD_NAME,
      api_key:process.env.API_KEY,
      api_secret:process.env.API_SECRET,
      
    });
  } catch (error) {
    console.error("Error: " , error);
    throw error;
  }
}

module.exports = configuration;