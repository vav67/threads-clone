const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "модель Please enter your Name"],
    },
    userName: {
      type: String,
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "модель Please enter your email"],
    },
    password: {
      type: String,
      required: [true, "модель Please enter your password"],
    },
    avatar: {
      public_id: {
        type: String,
        required: [true, "модель Please upload one profile picture"],
      },
      url: {
        type: String,
        required: [true, "модель +Please upload one profile picture"],
      },
    },
    followers: [    //кто на меня подписан
      {
        userId: {
          type: String,
        },
      },
    ],
    following: [   //   на кого я подписан
      {
        userId: {
          type: String,
        },
      },
    ],
    podpisani: [   // сам  добавил токен Firebase , тех кто на меня подписан
    {
      usertoken: {
        type: String,
      },
    },
  ],
  podpisaniNumber: { type: Number, default:0,  },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password 
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
