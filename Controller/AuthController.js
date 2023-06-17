const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserScehem=require("../Model/Profile");
const jwt = require('jsonwebtoken');
exports.SignUP=async (req, res) => {
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
  };

exports.Login=async (req, res) => {
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
  };

  exports.Profile=async (req, res) => {
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
  };