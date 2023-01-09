require("dotenv").config()
const express = require("express")
const cors = require('cors')
const app = express()
const router = require('./api');

app.use(cors())
app.use(express.json())



const morgan = require('morgan');
app.use(morgan('dev'));

// Setup your Middleware and API Router here
app.get('/', function (req, res) {
    res.send({msg: 'Main Page!'})
  })

app.use('/api', router);


router.use('*', (req, res,) => {
  res.status(404).send({
    error: 'unknownpage',
    name: 'badURL',
    message: 'wrong route'
  });
 
})

router.use((error, req, res, next) => {
    
    res.send({
      error: error.error,
      name: error.name,
      message: error.message
    });
  });

module.exports = app;

