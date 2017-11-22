
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
const { parse } =     require('./stages')

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

// subscribe to a channel
redis.subscribe('product', function (err, count) {
			console.log("Subscribed to " + count + " channel")
  });

// log message when detected on redis channel
redis.on('message', function (channel, message) {
    console.log("Channel> " + channel + " Message> " + message);
    awaitThread(message).then((workObj) => {
    console.log("-------ROUTE AWAIT COMPLETED-------")
    console.log(workObj)
    return
  }).catch((err) => {
    console.log("ERROR IN THREAD PROCESSING")
    console.log(err)
  })
  });

async function thread(message) {
  let stage400 = await parse(message)
  return stage400
  }
  // execute function and assess results
async function awaitThread(msg) {
      const workObj = await thread(msg)
      console.log("--------STAGES COMPLETED-------")
      console.log(workObj)
  }

function streamparse() {
//  let msgObj = banterfile[Math.floor(Math.random() * banterfile.length)];
//  msgObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
//  msgObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
//  let sendMsg = JSON.stringify(msgObj)
  pub.publish(action, sendMsg);
}
/*
function parse() {
  setInterval(function() {
  console.log('watson test');
  }, 5000)
}
*/
// server spins up and listed for the cli command
server.listen(port, function() {
  console.log("Listening on port " + port)
})
