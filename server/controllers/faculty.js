const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Faculty = require("../models/faculty");
const Basic = require("../models/basicInformation");
const Professional = require("../models/professionalInformation");
const Address = require("../models/addressDetails");
const Security = require("../models/accountSecurity");
const Optional = require("../models/optionalQuestions");

async function handleFacultySignup(req,res){
 try {
  const username = String(req.body.username || "").trim(); const password = req.body.password;
  if(!username || typeof password!=="string" || password.length<8) return res.status(400).json({error:"Username and password (minimum 8 characters) required"});
  if(await Faculty.exists({username})) return res.status(409).json({error:"Username already exists"});
  const user=await Faculty.create({username,password:await bcrypt.hash(password,12)});
  res.status(201).json({message:"Account created",objId:user.id});
 }catch(e){if(e.code===11000)return res.status(409).json({error:"Username already exists"});res.status(500).json({error:"Signup failed"});}
}
async function handleFacultyLogin(req,res){
 try {
  const user=await Faculty.findOne({username:req.body.username});
  if(!user || !await bcrypt.compare(String(req.body.password||""),user.password)) return res.status(401).json({error:"Invalid username or password"});
  res.json({message:"Login successful",objId:user.id});
 }catch(e){res.status(500).json({error:"Login failed"});}
}
const parts=[
 ["basic_information","basicInfo",Basic],
 ["professional_information","professionalInfo",Professional],
 ["address_details","addressInfo",Address],
 ["account_security","accountSecurityInfo",Security],
 ["optional_questions","optionalQuestionsInfo",Optional]
];
async function handlePostFacultyProfile(req,res){
 try {
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({error:"Invalid faculty ID"});
  const user=await Faculty.findById(req.params.id);
  if(!user) return res.status(404).json({error:"Faculty not found"});
  const data=req.body.formData;
  if(!data || typeof data!=="object") return res.status(400).json({error:"Form data required"});
  for(const [formKey,refKey,Model] of parts){
   if(!data[formKey]) continue;
   const fields={...data[formKey],userId:user.id};
   // Never store plaintext security answers from a form.
   if(formKey==="account_security" && fields.security_answer){fields.security_answer=await bcrypt.hash(fields.security_answer,12);}
   if(user[refKey]) await Model.findByIdAndUpdate(user[refKey],fields,{runValidators:true});
   else {const doc=await Model.create(fields);user[refKey]=doc.id;}
  }
  await user.save();res.json({message:"Profile saved",objId:user.id});
 }catch(e){res.status(400).json({error:e.message || "Unable to save profile"});}
}
async function handleGetFacultyProfile(req,res){
 try {
  if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({error:"Invalid faculty ID"});
  const user=await Faculty.findById(req.params.id).populate(parts.map(([_,path])=>({path})));
  if(!user)return res.status(404).json({error:"Faculty not found"});
  const response={};for(const [_,key] of parts){response[key]=user[key] || null;}
  if(response.accountSecurityInfo){response.accountSecurityInfo={security_question:response.accountSecurityInfo.security_question};}
  res.json(response);
 }catch(e){res.status(500).json({error:"Unable to load profile"});}
}
async function handleFacultyAppraisal(_req,res){res.status(501).json({error:"Appraisal workflow is not implemented yet"});}
module.exports={handleFacultyLogin,handleFacultySignup,handlePostFacultyProfile,handleGetFacultyProfile,handleFacultyAppraisal};
