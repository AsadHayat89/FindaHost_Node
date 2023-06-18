const PropertyScheme= require("../Model/propertyMode");
const mongoose = require("mongoose");
const Property = mongoose.model('Property', PropertyScheme);

exports.getAllProperty= (req,res)=>{
    Property.find({})
      .then(data => {
        res.status(200).json({"responce":data});
      })
      .catch(err => {
        res.status(500).json({"Responce":err});
        console.log(err);
      });
};

exports.getPropertByEmail=(req,res)=>{
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
};

exports.getPropertById=(req,res)=>{
  const id = req.body.id;
  Property.findById(id)
    .then(data => {
      if (data) {
        res.status(200).json({ "response": data });
        console.log(data);
      } else {
        res.status(404).json({ "Failed": "Property not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ "Failed": err });
      console.log(err);
    });
};

exports.UploadPropert=async (req, res) => {
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

    
      

  };