const express = require("express");
const {
  createPost,
     getAllPosts,
     updateLikes,
  addReplies,
 updateReplyLikes,
       addReply,
             ppNotifi, //сам добавил
  updateRepliesReplyLike,
  deletePost, //13-16-19
} = require("../controllers/post");
 const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

//router.route("/create-post").post( createPost);
router.route("/create-post").post(isAuthenticatedUser, createPost);
router.route("/get-all-posts").get(isAuthenticatedUser, getAllPosts);

  router.route("/update-likes").put(isAuthenticatedUser, updateLikes);

 router.route("/add-replies").put(isAuthenticatedUser, addReplies);
 
 router.route("/update-replies-react").put(isAuthenticatedUser, updateReplyLikes);
 //сам правильнее так или 
 router.route("/update-reply-likes").put(isAuthenticatedUser, updateReplyLikes);
 
 
 router.route("/add-reply").put(isAuthenticatedUser, addReply);

 //сам пробую нотификацию
 router.route("/pp-notifi").put(isAuthenticatedUser,ppNotifi);
 
 
  router
   .route("/update-reply-react")
   .put(isAuthenticatedUser, updateRepliesReplyLike);
 
  router.route("/delete-post/:id").delete(isAuthenticatedUser, deletePost);

 
module.exports = router;
 