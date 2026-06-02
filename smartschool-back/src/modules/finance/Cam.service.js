const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const API_ACCESSTOKEN = process.env.API_ACCESSTOKEN;

const createCharge = async ({ amount, customer_phone }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/collect/`,
      {
        amount: String(amount),
        from: customer_phone,
        description: "Test",
        external_reference: "1"
      },
      {
        headers: {
          Authorization: `Token ${API_ACCESSTOKEN}`,
          "Content-Type": "application/json",
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("Erreur Campay:", error.response?.data || error.message);
    throw error;
  }
};



const Status = async (refence)=> {

  try{
    const response  = await axios.get(`${BASE_URL}/transaction/${refence}`,
      {
        headers: {
          Authorization: `Token ${API_ACCESSTOKEN}`,
          "Content-Type": "application/json",
        }
      }
    )

    return response.data;
  }catch(error){
    console.error("Erreur Campay:", error.response?.data || error.message);
    throw error;
  }

}


module.exports = {
  createCharge,
  Status
};