'use strict';

///////////////////////////////////////////////////////////////
////////            stages for message interaction     ///////
///////                      c 2018 xio               ////////
/////////////////////////////////////////////////////////////
const clone =             require('clone-deep')
const request = 					require('request')
const { Api,
        searchAgents } =	require('../api')
const { getAllAgents,
        getNextAction } =	require('../api')

// parse - uses nlu to identify parts of the text

exports.intent = (obj) => {
  return new Promise((resolve, reject) => {
    console.log("--------INTENT Stage (watson classifier) ---------")
    // natural language classifier - determine next best action based on
    // no context and no direct messaging for a text received
    // and pull the agent from the agent array

    if (obj.state.direct === true ) {
      console.log("intent detected direct")
      obj.state.intent=false            // direct calls detected on earlier stage
      resolve(obj)                     //  so no need to analyze message for intent
      return
    }
    console.log("intent detected")
    obj.state.intent=true

    // call watson classifier to analyze message for intent
    getNextAction(obj, function(error, response) {
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
