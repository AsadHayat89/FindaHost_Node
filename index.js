const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
var multer = require('multer');
const filestack = require('filestack-js');
const Stackclient = filestack.init('AoZD7isNqTxiQcPKyyUSBz');
const mongoose = require("mongoose");
const PropertyScheme= require("./Model/propertyMode");
const client = mongoose.connect("mongodb+srv://asad:asad123@cluster0.pog5yuk.mongodb.net/?retryWrites=true&w=majority");
const Bid=require("./Model/bid");
const { Upload } = require('filestack-js/build/main/lib/api/upload');
const Property = mongoose.model('Property', PropertyScheme);
const UserScehem=require("./Model/Profile");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 10, // maximum 5 files
  },
});


router.post('/api/signup', upload.any(), async (req, res) => {
  const { fullName, userName, email, password,type } = req.body;
 

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await UserScehem.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    if(type==0 || type==1){
      const user = await UserScehem.create({ fullName, userName, email, password: hashedPassword,type });
      const token = jwt.sign({ userId: user._id }, 'secretKey');
      res.status(201).json({ token });
    }
    else{
      res.status(400).json({ error: "User type Should be Host or Landlord" });
    }
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/api/login', upload.any(),async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserScehem.findOne({ email });
    if (!user) throw new Error('User not found');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Invalid login credentials');

    const token = jwt.sign({ userId: user._id }, 'secretKey');
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/api/profile', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secretKey');
    const user = await UserScehem.findById(decoded.userId);
    if (!user) throw new Error('User not found');
    const { fullName, userName, email } = user;
    res.status(200).json({ fullName, userName, email });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/api/testingProperty', upload.array('images'),  async (req, res)=>{
 
 
  try {
    // Get the uploaded files from the request
    const files = req.files;

    // Upload the files to Filestack
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const uploadResponse = await Stackclient.upload(file.buffer);

        return uploadResponse.url;
      })
    );

    // Send the file URLs back to the client
  //  res.send({ fileUrls });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while uploading the files' });
  }
        
      //res.status(200).json({ urls });
    });


router.post('/api/uploadProperty', upload.array('images'),  async (req, res) => {
    const files = req.files;
    const Property_Name=req.body.Property_Name;
    const Email =req.body.Email;
    const Property_Type=req.body.Property_Type;
    const Property_PriceMoney =req.body.Property_PriceMoney;
    const Property_Guest_Room=req.body.Property_Guest_Room;
    const Property_Bath_Room =req.body.Property_Bath_Room;
    const Property_Bed_Room=req.body.Property_Bed_Room;
    const Property_Description =req.body.Property_Description;
    const Property_Rule=req.body.Property_Rule;
    const Property_Country =req.body.Property_Country;
    const Property_State=req.body.Property_State;
    const Property_City =req.body.Property_City;
    const Property_Address=req.body.Property_Address;
    const Property_PostalCode =req.body.Property_PostalCode;
    const features=req.body.features;
    const Amenties =req.body.Amenties;
    const featuresarray=features.substring(1, features.length - 1).split(",");
    const Amentiesarray=Amenties.substring(1, Amenties.length - 1).split(",");
    if (Amenties instanceof Array) {
        console.log("myArray is an array");
    }
    

    Promise.all(
      files.map(file => Stackclient.upload(file.buffer))
    )
      .then(responses => {
        const urls = responses.map(response => response.url);
        console.log(urls);
        const newProperty = new Property({
            Property_Name,
            Property_Type,
            Email,
            Property_PriceMoney,
            Property_Guest_Room,
            Property_Bath_Room,
            Property_Bed_Room,
            Property_Description,
            Property_Rule,
            Property_Country,
            Property_State,
            Property_City,
            Property_Address,
            Property_PostalCode,
            features:featuresarray,
            Amenties:Amentiesarray,
            images:urls
          });
          newProperty.save()
          .then((data) => {
            console.log(data);
            // fs.readdir('upload/', (err, files) => {
            //   if (err) throw err;
            
            //   for (const file of files) {
            //     fs.unlink(`upload/${file}`, err => {
            //       if (err) throw err;
            //     });
            //   }
            // });
            res.status(201).json({ "responce": [data] });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ "responce": 'Error saving property to database' });
          });
          
        //res.status(200).json({ urls });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error });
      });

    
      

  });
 
router.post('/api/bidProperty',upload.any(), async (req, res) => {
  const landlordEmail =req.body.landlordEmail;
  const propertyId=req.body.propertyId;
  const bid =req.body.bid;
  const status=req.body.status;
  const Email=req.body.Email;
  console.log(bid);
  try {
      const bidc = new Bid({landlordEmail,propertyId,Email,bid,status});
      await bidc.save().then((data)=>{
        res.status(200).json({"reponce":[data]});
      }).catch((err)=>{
        res.status(500).json({"reponce":[err]});
        
      });
      
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });  

router.post('/api/UpdateBid',upload.any(), async (req, res) => {
    const id  = req.body.ID;
    const status  = req.body.status;
    console.log(id);
    try {
      const collection = await Bid.findByIdAndUpdate(id, { status }, { new: true });
      res.json(collection);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  

router.post('/api/bidallBidByEmail',upload.any(), async (req, res) => {
    
    const Emailnew=req.body.Email;
    try {
        Bid.find({ Email: Emailnew }).then((data)=>{
          res.status(200).json({"reponce":data});
        }).catch((err)=>{
          res.status(500).json({"reponce":[err]});
          
        });
        
      } catch (err) {
        console.log(err);
        res.status(400).send(err);
      }
  }); 
    
router.post('/api/GetallBids',upload.array(), async (req, res) => {
    
  const Emailnew=req.body.Email;
  try {
      Bid.find({ landlordEmail: Emailnew }).then((data)=>{
        res.status(200).json({"reponce":data});
      }).catch((err)=>{
        res.status(500).json({"reponce":[err]});
        
      });
      
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

router.post('/api/GetPropertyByEmail', upload.array(), (req,res)=>{
    const Emailnew = req.body.Email;
    Property.find({ Email: Emailnew })
      .then(data => {
        res.status(200).json({"responce":data});
        console.log(data);
      })
      .catch(err => {
        res.status(500).json({"Failed":err});
        console.log(err);
      });
});

router.get('/api/GetAllProperty',  (req,res)=>{
    Property.find({})
      .then(data => {
        res.status(200).json({"responce":data});
        console.log(data);
      })
      .catch(err => {
        res.status(500).json({"Responce":err});
        console.log(err);
      });
});

router.get('/',(req,res)=>{
    res.send("sdfsd");
});




const port = process.env.PORT || 3000;
router.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
