const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");

const { adm, } = require("../controllers/admin");
 

const router = express.Router();

//пути

//router.route("/admin").put(isAuthenticatedUser, adm);
router.route("/admin/:ii").get(isAuthenticatedUser, adm);
//router.route("/get-user/:id").get(isAuthenticatedUser, getUser);


module.exports = router;