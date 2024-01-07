 
const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  userDetails,
     getAllUsers,
     followUnfollowUser,

  getNotification,
  getUser,

  updateUserAvatar,
  updateUserInfo,

} = require("../controllers/user");

const { isAuthenticatedUser } = require("../middleware/auth");
const { mmongodbMiddleware } = require("../middleware/mmongodbMiddleware");
 
const router = express.Router();

router.route("/registration").post(createUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

 
//router.route("/users").get( getAllUsers);
//4-37-24 заменил на
router.route("/users").get(isAuthenticatedUser, getAllUsers);
//подписка 4-54-10 айди пользователя для изменения подписки(отписка или подписка)
router.route("/add-user").put(isAuthenticatedUser, followUnfollowUser);

// Роут с middleware для MongoDB, аутентификации и контроллера
router.route("/me").get(isAuthenticatedUser, userDetails);
//router.route("/me").get( mmongodbMiddleware, isAuthenticatedUser, userDetails);

router.route("/get-notifications").get(isAuthenticatedUser, getNotification);
router.route("/get-user/:id").get(isAuthenticatedUser, getUser);


router.route("/update-avatar").put(isAuthenticatedUser, updateUserAvatar);
router.route("/update-profile").put(isAuthenticatedUser, updateUserInfo);



module.exports = router;
