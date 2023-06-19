const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PropertyScheme =new mongoose.Schema({
    Property_Name: {
        type: String,
        required: true
      },
      Property_Type: {
        type: String,
        required: true
      },
      Email: {
        type: String,
        required: true,
      },
      Property_PriceMoney: {
        type: Number,
        required: true
      },
      Property_Guest_Room: {
        type: Number,
        required: true
      },
      Property_Bath_Room: {
        type: Number,
        required: true
      },
      Property_Bed_Room: {
        type: Number,
        required: true
      },
      Property_Description: {
        type: String,
        required: true
      },
      Property_Rule: {
        type: String,
        required: true
      },
      Property_Country: {
        type: String,
        required: true
      },
      Property_State: {
        type: String,
        required: true
      },
      Property_City: {
        type: String,
        required: true
      },
      Property_Address: {
        type: String,
        required: true
      },
      Property_PostalCode: {
        type: String,
        required: true
      },
      features: {
        type: [String],
        required: true
      },
      Amenties: {
        type: [String],
        required: true
      },
        images: {
            type: [String],
            required: true
          }
  });

  
module.exports = mongoose.model('Property', PropertyScheme);
