const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: "user" },
  address: [{ type: String, required: true, unique: true, trim: true }],
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  avatarUrl: {
    type: String,
    trim: true,
    default:
      "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png",
  },
  animals: [{type: Schema.Types.ObjectId, ref: "Animal"}]
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
