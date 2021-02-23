/*
This file is used for creation of MongoDB Schema.
*/
const mongoose = require('mongoose')

/*Define schema*/
const DBSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  alternateUrl: {
    type: String,
    required: true,
  },
})

/*Compile model from schema*/
const ShortUrl = mongoose.model('shortUrl', DBSchema)
module.exports = ShortUrl
