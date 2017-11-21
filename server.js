
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
const port = process.env.PORT || 5000;


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
  case "parse":
    parse()
    break;

  default:
    console.log('Error ' + '' + action + ' not recognized')
    break;
}

// subscribe to a channel
redis.subscribe('product', function (err, count) {
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
function streamparse() {
//  let msgObj = banterfile[Math.floor(Math.random() * banterfile.length)];
//  msgObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
//  msgObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
//  let sendMsg = JSON.stringify(msgObj)
  pub.publish(action, sendMsg);

}

function parse() {
  setInterval(function() {
  console.log('watson test');
  }, 5000)
}

// server spins up and listed for the cli command
server.listen(port, function() {
  console.log("Listening on port " + port)
})
