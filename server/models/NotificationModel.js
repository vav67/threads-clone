const mongoose = require("mongoose");
//как хранение истории уведомлений 
const notificationSchema = new mongoose.Schema(
    {
        creator:{
            type: Object,
        },
        type:{
            type: String,
        },
        title:{
            type: String,
        },
        postId:{    //13-47-10
            type:String,
        },
        userId:{
            type: String,
        }
    },{timestamps: true}
);

module.exports = mongoose.model("Notification", notificationSchema);