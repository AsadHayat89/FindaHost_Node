const Bid=require("../Model/bid");

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