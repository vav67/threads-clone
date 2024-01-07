const express = require("express");
const {
  hom,
 
} = require("../controllers/proba");
 
const router = express.Router();

 

 

router.route("/").get(hom);

 

module.exports = router;