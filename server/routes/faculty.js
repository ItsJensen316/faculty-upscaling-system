const express = require("express");
const {
  handleFacultyLogin,
  handleFacultySignup,
  handlePostFacultyProfile,
  handleGetFacultyProfile,
  handleFacultyAppraisal,
} = require("../controllers/faculty");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ok");
});
router.post("/login", handleFacultyLogin);
router.post("/signup", handleFacultySignup);
router.get("/profile/:id", handleGetFacultyProfile);
router.post("/profile/:id", handlePostFacultyProfile);
router.post("/appraisal", handleFacultyAppraisal);


module.exports = router;
