const Bid=require("../Model/bid");
const Property = require("../Model/propertyMode");
exports.BidProperty=async (req, res) => {
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
    };

exports.GetBidById=async(req,res)=>{
  const id=req.body.id;
  Bid.findById(id)
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

exports.updateBid=async (req, res) => {
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
    
  };

exports.bidAllBidByEmail=async (req, res) => {
    
  const Emailnew = req.body.Email;
  try {
    let bids; // Store the bids in a variable accessible in the outer scope
    Bid.find({ Email: Emailnew })
      .then((data) => {
        bids = data; // Store the retrieved bids in the outer variable
        const propertyIds = bids.map((bid) => bid.propertyId);
        return Property.find({ _id: { $in: propertyIds } }); // Find property details based on the extracted IDs
      })
      .then((propertyDetails) => {
        const response = bids.map((bid) => {
          const property = propertyDetails.find((property) => bid.propertyId.toString() === property._id.toString());
          return { ...bid._doc, propertyDetails: property };
        });
        res.status(200).json({ response });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
    
  };

exports.getallBids=async (req, res) => {
    
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
    };