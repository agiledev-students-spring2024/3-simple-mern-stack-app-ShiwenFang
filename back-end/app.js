require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about-us', (req, res) => {
  res.json({
    title: "About Us",
    content: [
      "Hello! My name is Shiwen Fang, and I am a undergraduate from New York University, where I completed a double major in Mathematics and Computer Science, complemented by a minor in Economics. My academic journey has been an enriching blend of rigorous coursework, collaborative projects, and practical application, shaping me into a detail-oriented and analytical thinker.",
      "Outside of academics and professional pursuits, I am deeply interested in cultural exchange and diversity. My experiences as an international student have given me a unique perspective on the importance of understanding and appreciating different cultures. I enjoy participating in cultural events and discussions, as they offer opportunities to learn and grow in an increasingly interconnected world.",
      "I love creating In my free time, I like to engage in activities that challenge me both mentally and physically. I am an avid chess player, a hobby that helps me develop strategic thinking and patience. I also enjoy outdoor activities like hiking and cycling, which allow me to connect with nature and maintain a healthy lifestyle. that improves the lives of those around me."
    ],
    imageUrl: "https://lh3.googleusercontent.com/drive-viewer/AEYmBYSMfTKY7yEGaEW_26NIqN61oGuJgxoyEC2M7gHIPHWBkxo7QeeJ1vXsw6o2aAll78MnDqBHAnL-mkFHoUVI5wWU_bHacA=s1600"
  });
});

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
