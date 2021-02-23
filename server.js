/*
This code serve all possible request between client and server
*/
const express = require('express')
const shortId = require('shortid')
const httpError = require('http-errors')
const mongoose = require('mongoose')
const ShortUrl = require('./models/schema')
const port = 3000

const app = express()
app.use(express.urlencoded({ extended: false }))

/*
Setting up MongoDB connection
default port is 27017
*/
mongoose
  .connect('mongodb://localhost:27017', {
    dbName: 'shortUrl',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.log('Error in establishing connection...'))

////

/*
EJS is a simple templating language that lets you generate 
HTML markup with plain JavaScript
*/
app.set('view engine', 'ejs')

/* GET home page. */
app.get('/', async (req, res) => {
  res.render('index')
})

/*
POST request which takes original URL as an input parameter.
Check is original URL exist in MongoDBDB already
if no, generates shortened URL and stores it in MongoDB.
*/
app.post('/', async (req, res) => {
    const { originalUrl } = req.body    
    const urlExists = await ShortUrl.findOne({ originalUrl })
    // console.log(urlExists)
    if (urlExists) {
      res.render('index', {
        short_url: `${req.headers.host}/${urlExists.alternateUrl}`,
        url: originalUrl
      })
      return
    }
    // console.log(urlExists)
    const shortUrl = new ShortUrl({ originalUrl: originalUrl, alternateUrl: shortId.generate() })
    const result = await shortUrl.save()
    res.render('index', {
      short_url: `${req.headers.host}/${result.alternateUrl}`,
      url: originalUrl
    })
})
/////

/*
GET request to check if shortened url exixt
if yes, re-route it to original url.
*/
app.get('/:alternateUrl', async (req, res) => {
    const { alternateUrl } = req.params
    const result = await ShortUrl.findOne({ alternateUrl })
    // console.log(alternateUrl, result)
    if (!result) {
      throw httpError.NotFound('URL does not exist.')
    }
    res.redirect(result.originalUrl)
})
////

app.listen(port, () => console.log(`Sever listening to port ${port}...`))
