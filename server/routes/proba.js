const express = require("express");
const {
  hom, homlog,
 
} = require("../controllers/proba");
 
const router = express.Router();

 

 

router.route("/").get(hom);
router.route("/homlog").get(homlog);
 

module.exports = router;