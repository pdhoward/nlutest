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
    parseMessage(message, function(error, response) {
      	let agent = searchAgents(response.top_class)
        obj.classifier = clone(response)
        obj.intent = {}
        obj.intent.agent = agent              // default is banter bot

        awaitDirectReplies(obj).then((workobj) => {
          let replyObj = clone(workobj)
          resolve(replyObj)
            }).catch((error) => {
                console.log(error)
                reject(error)
          })
      })
    })
  }

///////////////////////////////////////////////////////
/////       functions to manage workflow           ///
/////  Based on identify intent -- and agent      ///
////      pulse microservice for response        ////
////////////////////////////////////////////////////

// wraps the mainline function to permit .then()

async function awaitDirectReplies(msgObj) {
    const allReplies = await directReplies(msgObj)
    return allReplies
}

// mainline async function
async function directReplies (obj) {
    const api = new Api()

    let apiparm = { url: obj.intent.agent.url,
                    qs: {text: obj.message.Body},
                    headers: { "Content-Type": "application/json" } };

    let response = await api.getAgentResponse(apiparm)
    let parseBody = JSON.parse(response)
    obj.intent.response = clone(parseBody)
    obj.intent.reply = parseBody.reply

    return obj
  }
