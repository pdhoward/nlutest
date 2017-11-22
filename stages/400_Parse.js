'use strict';

///////////////////////////////////////////////////////////////
////////            stages for message interaction     ///////
///////                      c 2018 xio               ////////
/////////////////////////////////////////////////////////////
const clone =             require('clone-deep')
const request = 					require('request')
const { parseMessage } =	require('../api')

// parse - uses nlu to identify parts of the text

exports.parse = (obj) => {
  return new Promise((resolve, reject) => {
    console.log("--------{Parse} Stage (watson understanding) ---------")

    // call watson nlu to determine parts of the text
    parseMessage(obj, function(error, response) {

        return response

      })
    })
  }
