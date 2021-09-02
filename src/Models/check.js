const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const checkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    protocol: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: "",
    },
    port: {
      type: String,
      default: "",
    },
    webhook: {
      type: String,
      default: "",
    },
    timeout: {
      type: Number,
      default: 500,
    },
    interval: {
      type: Number,
      default: 5000,
    },
    threshold: {
      type: Number,
      default: 1,
    },
    authentication: {
      username: {
        type: String,
        default: "",
      },
      password: {
        type: String,
        default: "",
      },
    },
    httpHeaders: [
      {
        type: String,
      },
    ],
    assert: {
      type: String,
      statusCode: {
        type: Number,
      },
    },
    tags: [
      {
        type: String,
      },
    ], 
    ignoreSSL: {
      type: Boolean,
      required: true,
    },
    createdby: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const check = mongoose.model("Check", checkSchema);
module.exports = check;
