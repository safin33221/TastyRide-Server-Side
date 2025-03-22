const Ad = require("../model/adModel");

const addAd = async (req, res) => {
  const { title, description, image, addedBy } = req.body;
  console.log(req.body);
  try {
    const newAd = new Ad({
      title,
      description,
      image,
      addedBy,
      status: "pending"
    });

    await newAd.save();
    res
      .status(201)
      .send({ success: true, message: "Ad Created Successfully", data: newAd });
  } catch (error) {
    console.error("Error in addAd:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

const getAllAd = async (req, res) => {
  try {
    const ads = await Ad.find();
    res
      .status(201)
      .send({ success: true, message: "Ad Fetched Successfully", data: ads });
  } catch (error) {
    console.error("Error in get all ads:", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

const getAdByUser = async (req, res) => {
    const {email} = req.params
  try {
    const ads = await Ad.find({addedBy:email})
    if(ads.length === 0) return res.status(400).send({success: false, message: "No ads added from this user"})
    res
      .status(201)
      .send({ success: true, message: "Ad Fetched Successfully", data: ads });
  } catch (error) {
    console.error("Error in get ads by user", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
};

const deleteAd = async (req, res) => {
  const {id} = req.params
  try {
    const result = await Ad.findByIdAndDelete({_id:id})
    res
      .status(201)
      .send({ success: true, message: "Ad Deleted Successfully", data: result });
  } catch (error) {
    console.error("Error in get ads by user", error);
    res
      .status(500)
      .send({ success: false, message: "Server Error", error: error.message });
  }
}

module.exports = { addAd, getAllAd, getAdByUser, deleteAd };
