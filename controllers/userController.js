const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendVerificationMail = require("../utils/sendVerificationMail");
const createToken = (id, userName, userEmail) => {
  const payload = {
    userId: id,
    userName: userName,
    userEmail: userEmail,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password, boards: [], emailToken: jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24 * 3})});
    await newUser.save();
    sendVerificationMail(email, newUser.emailToken);
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

const verifyEmail = async (req, res)=>{
  const emailToken = req.body.emailToken; 
  // console.log(emailToken);
  if (!emailToken) {
    return res.status(400).json({ message: "Token not found" });
  }
  try{
    const user = await User.findOne({emailToken});
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
 
   // user.emailToken = null;
   await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  }catch(err){
    console.log(err.message);

  }
}
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id, user.name, user.email);
    res.status(200).json({ token });
  } catch (err) {
    console.log(err.message);
  }
};
const getUser = async (req, res) => {
  return res.status(200).json({ data: req.user });
};
const validateUserPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const matches = user.password.match(password);
    if (!matches) {
      return res.status(400).json({ message: "Old Password Does not match" });
    }
    res.status(200).json({ message: "Password matches" });
  } catch (err) {
    console.log(err.message);
  }
};
//update password
const updatePassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const matches = user.password.match(password);
    if (matches) {
      return res.status(400).json({
        message: "New Password should be different from old password",
      });
    }
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};
const updateUserName = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.name = name;
    await user.save();
    res.status(200).json({ message: "Username updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await User.findOneAndDelete({ email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
  getUser,
  validateUserPassword,
  updatePassword,
  updateUserName,
  deleteUser,
};
