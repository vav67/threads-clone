const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");

const { adm, admsubsc } = require("../controllers/admin");
 

const router = express.Router();

//пути

 router.route("/subsc").put(isAuthenticatedUser, admsubsc);
router.route("/admin/:ii").get(isAuthenticatedUser, adm);
//router.route("/get-user/:id").get(isAuthenticatedUser, getUser);


module.exports = router;