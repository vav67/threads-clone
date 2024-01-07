const express = require("express");

const { adm, } = require("../controllers/admin");
 

const router = express.Router();

//пути

router.route("/").get(adm);



module.exports = router;