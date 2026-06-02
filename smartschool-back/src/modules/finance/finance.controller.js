const { Status } = require("./Cam.service");
const { createCharge } = require("./Cam.service");

const createGatewayCharge = async (req, res) => {
  try {
    const { matricule, amount, customer_phone } = req.body;

    // 🔍 Validation basique
    if (!matricule || !amount || !customer_phone) {
      return res.status(400).json({
        success: false,
        message: "matricule, amount et customer_phone sont requis"
      });
    }

    const result = await createCharge({
      amount,
      customer_phone,
    });

    return res.status(200).json({
      success: true,
      data: {
        matricule,
        ...result
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error?.response?.data || error.message || "Erreur interne"
    });
  }
};


const getstatus = async (req, res) => {
  const {reference} = req.body;

  try{
    const result = await Status(reference);
    return res.status(200).json({
      success:true,
      data: result
    })
  }catch(error){
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error?.response?.data || error.message || "Erreur interne"
    });
  }
}

module.exports = {
  createGatewayCharge,
  getstatus
};