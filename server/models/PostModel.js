const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String,   },
    image: { public_id: {type: String, }, url: {  type: String,  },  },
    user: { type: Object, },
    likesNumber: { type: Number, default:0,  },
    likes: [ 
      {          name: {  type: String, },  // 11 - 34-22
              userName: { type: String, },
              userId: {   type: String,  },
              userAvatar: { type: String, },
              },    ],
    
   
    replies: [ 
                { user: { type: Object,  },
                  title: { type: String, },
                  image: { public_id: { type: String,}, url: { type: String, }, },
                  likesNumber: { type: Number,  default:0, },
                  likes: [
                           {   name: {  type: String, },   // 11 - 34-22
                               userName: { type: String, },
                              userId: { type: String,  },
                              userAvatar: { type: String, },
                           },  
                         ],
//------------------------
 // 9-59-41 10-01-50 модели переименую поле replies в reply
     //replies: [ добавляем
     reply: [ 
      { user: { type: Object,  },
        title: { type: String, },
        image: { public_id: { type: String,}, url: { type: String, }, },
        likesNumber: { type: Number,  default:0, },
        likes: [
                 {   name: {  type: String, },  // 11 - 34-22
                    userName: { type: String, },
                    userId: { type: String,  },
                    userAvatar: { type: String, },
                 },   
                ],
      },
    ],

//-----------------------------

                },
              ],
  
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
