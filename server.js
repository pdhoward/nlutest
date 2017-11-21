
////////////////////////////////////////////////////
////////  			RedisLab and HTTP SERVER     ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';
const config 	=       require('./config');
const express =       require('express');
const path  =         require('path');
const countries =     require('./countries/country')
const Redis =         require('ioredis');
const fs =            require("fs");

const app =  express();
const server =        require('http').Server(app);
const port = process.env.PORT || 3002;

let client = new Intercom.Client({token: config.intercom.token})

////////////////////////////////////////////////
let redisPort =     config.redis.port;
let redisHost =     config.redis.host;
let redisPassword = config.redis.password;

let redis = new Redis({
 port: redisPort,
 host: redisHost
});

let pub = new Redis({
 port: redisPort,
 host: redisHost

});

// cli command line
let action = process.argv[2];

// if the order.json file does not exist import the test spreadsheet with 8000+ order items
// to save json file set output to products/products.json -- else set to null
// Delete the order collection in session db on monglab if json file removed here

switch (action) {
  case "intercom":
    intercom()
    break;

  default:
    console.log('Error ' + '' + action + ' not recognized')
    break;
}

// subscribe to a channel
redis.subscribe(action, function (err, count) {
			console.log("Subscribed to " + count + " channel")
  });
// listen for orders
redis.subscribe('orders', function (err, count) {
  	 console.log("Subscribed to " + count + " channel")
  });

// log message when detected on redis channel
redis.on('message', function (channel, message) {
    console.log("Channel> " + channel + " Message> " + message);
  });

// publish messages randomly -- test runner for chaotic platform
// add a country name and avatar chosen randomly from arrays
// Note that the target in the config file refers to the host and port where the
// static assets reside which is chaotic dash
function streamintercom() {
//  let msgObj = banterfile[Math.floor(Math.random() * banterfile.length)];
//  msgObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
//  msgObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
//  let sendMsg = JSON.stringify(msgObj)
  pub.publish(action, sendMsg);

}

function intercom() {
  /*
  setInterval(function() {
  console.log('stream intercom');
  streambanter()
}, 5000)
*/
client.counts.appCounts(function(err, d) {
//client.users.list(function (err, d) {
    if (err) {
      err.body.errors.filter((item) => console.log(item))
    }
    console.log("----------APP COUNTS ------------")
    console.log(d.body)
    });

client.counts.conversationCounts(function(err, d) {
    if (err) {
      err.body.errors.filter((item) => console.log(item))
    }
    console.log("-------- Conversation COUNTS ------------")
    console.log(d.body)
    });

client.counts.companyUserCounts(function(err, d) {
    if (err) {
      err.body.errors.filter((item) => console.log(item))
    }
    console.log("-------Company USER Counts  ---------")
    d.body.company.user.filter((user) => {
      console.log(user)
    })
  });
client.users.listBy({ user_id: 'Acumen' }, function(err, d){
  if (err) {
    err.body.errors.filter((item) => console.log(item))
  }
  console.log("---------List By User ---------")
  console.log(d)
  })

}

// server spins up and listed for the cli command
server.listen(port, function() {
  console.log("Listening on port " + port)
})
