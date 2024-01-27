const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");

const { adm, } = require("../controllers/admin");
 

const router = express.Router();

//пути

router.route("/admin").put(isAuthenticatedUser, adm);



module.exports = router;