const express = require('express');
const { addAd, getAllAd, getAdByUser, deleteAd } = require('../controller/adController');

const router = express.Router()

// add ad 
router.post("/ad", addAd)

// get all ads 
router.get("/ad", getAllAd)

// get ad by user 
router.get("/ad/:email", getAdByUser)

//delete a ad
router.delete("/ad/:id", deleteAd)

module.exports = router