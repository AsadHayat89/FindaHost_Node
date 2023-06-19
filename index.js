const express = require('express');
const router = express();
const fs = require('fs');
const jwt = require('jsonwebtoken');
var multer = require('multer');
var AuthController=require('./Controller/AuthController');
var PropertController=require('./Controller/PropertyController');
var BidController=require('./Controller/BidController');
const filestack = require('filestack-js');
const Stackclient = filestack.init('AoZD7isNqTxiQcPKyyUSBz');
const mongoose = require("mongoose");
const PropertyScheme= require("./Model/propertyMode");
const client = mongoose.connect("mongodb+srv://asad:asad123@cluster0.pog5yuk.mongodb.net/?retryWrites=true&w=majority");
const Bid=require("./Model/bid");
const { Upload } = require('filestack-js/build/main/lib/api/upload');

const UserScehem=require("./Model/Profile");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 10, // maximum 5 files
  },
});

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with the allowed origin(s) or set it dynamically based on the request origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Specify the allowed HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Specify the allowed headers

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

router.post('/api/signup', upload.any(), AuthController.SignUP);

router.post('/api/login', upload.any(),AuthController.Login);

router.get('/api/profile', AuthController.Profile);

router.post('/api/GetUserByMail',upload.any(), AuthController.GetUserByEmail);

// router.post('/api/testingProperty', upload.array('images'),  async (req, res)=>{
 
 
//   try {
//     // Get the uploaded files from the request
//     const files = req.files;

//     // Upload the files to Filestack
//     const fileUrls = await Promise.all(
//       files.map(async (file) => {
//         const uploadResponse = await Stackclient.upload(file.buffer);

//         return uploadResponse.url;
//       })
//     );

//     // Send the file URLs back to the client
//   //  res.send({ fileUrls });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'An error occurred while uploading the files' });
//   }
        
//       //res.status(200).json({ urls });
//     });


router.post('/api/uploadProperty', upload.array('images'),  PropertController.UploadPropert);
 
router.post('/api/bidProperty',upload.any(), BidController.BidProperty);  

router.post('/api/UpdateBid',upload.any(), BidController.updateBid);
  

router.post('/api/bidallBidByEmail',upload.any(), BidController.bidAllBidByEmail); 
    
router.post('/api/GetallBids',upload.array(), BidController.getallBids);

router.post('/api/GetBidById',upload.array(), BidController.GetBidById);

router.post('/api/GetPropertyByEmail', upload.array(), PropertController.getPropertByEmail);

router.post('/api/GetPropertyById', upload.array(), PropertController.getPropertById);

router.get('/api/GetAllProperty',  PropertController.getAllProperty);

router.get('/',(req,res)=>{
    res.send("sdfsd");
});




const port = process.env.PORT || 3000;
router.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
