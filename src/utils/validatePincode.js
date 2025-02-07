const axios = require("axios");

exports.validatePincode = async (country, pin) => {
  try {
    const response = await axios.get(
      `https://api.zippopotam.us/${country}/${pin}`
    );
    return !!response.data;
  } catch (error) {
    return false;
  }
};
