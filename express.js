const express = require('express')
const app = express()


const sgMail = require('@sendgrid/mail')
var bodyParser = require('body-parser')

require('dotenv').config()
var cors = require('cors')
app.use(bodyParser.json())
app.use(cors())

const port =  process.env.EXPRESS_Port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/', (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log(process.env.SENDGRID_API_KEY)
  console.log(req.body)
  const msg = {
      to: req.body.to, 
      bcc: req.body.bcc,
      replyTo : req.body.replyTo,
      from: req.body.from, 
      subject:req.body.subject, //'Sending with SendGrid is Fun',
      //text: req.body.message,// 'and easy to do anywhere, even with Node.js',
     // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
     content: [
      {
        type: 'text/html',
        value: `<h2>${req.body.subject}</h2>
        <p><strong>${req.body.name}: </strong>${req.body.message}</p>
        <h2>Sender Contact Information:</h2>
        <p><strong>Name: </strong>${req.body.name}</p>
        <p><strong>Phone: </strong>${req.body.phone}</p>
        <p><strong>Email: </strong>${req.body.email}</p>
        <p>%open-track%</p>`    
      }
    ],
    trackingSettings: {
      clickTracking: {
        enable: true,
        enableText: false
      },
      openTracking: {
        enable: true,
        substitutionTag: '%open-track%'
      },
      subscriptionTracking: {
        enable: false
      }
    }
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('🎉 Email Sent /!')
        res.sendStatus(200)
      })
      .catch((error) => {
        console.error(error)
        console.log(error.response.body)
        res.sendStatus(400)
      })
})
