
// api calls
const request = 				require('request')
const rp = 							require('request-promise')
const ClassifierV1 =    require('watson-developer-cloud/natural-language-classifier/v1');
const config =          require('../config')

const classifier = new ClassifierV1({
  username: config.watsonclassifier.username,
  password: config.watsonclassifier.password
});

const API_ID = process.env.REACT_APP_API_ID
const APP_KEY = process.env.REACT_APP_APP_KEY

//////////////////////////////////////////////////////////////////////////
//////////////////// Load an aray of agents on start ////////////////////
////////////////////////////////////////////////////////////////////////
getAgentArray = (cb) => {
  let agentCall = { url: config.testdb.url,
                    headers: { "Content-Type": "application/json",
                               "Authorization": "token" } };
  rp(agentCall).then(function(body) {
      return cb(body)
    }) }

let agentStore = {}
getAgentArray(function(body){
  agentStore = Object.assign({}, JSON.parse(body))
})

//////////////////////////////////////////////////////////////////////////
//////////////////        TEST FUNCTION ES6          ////////////////////
////////////////////////////////////////////////////////////////////////
exports.fetchRecipes = (food = '') => {
  food = food.trim()

  return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
    .then((res) => res.json())
    .then(({ hits }) => hits.map(({ recipe }) => recipe))
}
/////////////////////////////////////////////////
//// constructor to instantiate key functions //
///////////////////////////////////////////////
exports.Api = class Api {
    constructor () {
        this.user = { id: 1, name: 'test' }
        this.friends = [ this.user, this.user, this.user ]
        this.photo = 'not a real photo'
      }

    getUser () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.user)}, 500)
      })
    }

    getAgentConfig (agent) {
      return new Promise((resolve, reject) => {
        resolve(this.searchAgents(agent))
      })
    }

    getFriends (userId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.friends.slice())}, 500)
        })
      }

    getAgentResponse (apiparm) {
      return new Promise((resolve, reject) => {
        request.get(apiparm, function (error, response, body) {
                  if (error) {
                      console.log(error)
                      reject(error)}
                  resolve(body)
            })
      })
    }
    searchAgents (agent) {
      return agentStore[agent]
    }

    throwError () {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Intentional Error')), 200)
      })
    }
  }


//////////////////////////////////////////////////////////////////////////
//////////////////// Fetch context from db store/////////////////////////
////////////////////////////////////////////////////////////////////////

exports.getContext = (obj, cb) => {
  const token = obj.message.token             // note - token is pulled from req in routes
  const sessionid = {
    sender: obj.message.From,
    receiver: obj.message.To
  }
  let contextOneCall = { url: "http://localhost:5002/api/onecontext",
                         qs: { session: sessionid },
                         headers: { "Content-Type": "application/json",
                                    "Authorization": token } };
  rp(contextOneCall).then(function(body) {
      return cb(body)
    })
  }


  //////////////////////////////////////////////////////////////////////////
  //////////////////// Fetch all agents from dbstore //////////////////////
  ////////////////////////////////////////////////////////////////////////

  exports.getAllAgents = (obj, cb) => {
    const token = obj.message.token
    const sessionid = {
      sender: req.query.From,
      receiver: req.query.To
    }
    let agentCall = { url: "http://localhost:5002/api/agent",
											qs: {text: req.query.Body},
											headers: { "Content-Type": "application/json",
													        "Authorization": token } };
    rp(agentCall).then(function(body) {
        return cb(body)
      })
    }

  //////////////////////////////////////////////////////////////////////////
  //////////////// Search Agent Store for Ahent Config    /////////////////
  ////////////////////////////////////////////////////////////////////////

  exports.searchAgents = (agent) => {
    return agentStore[agent]
  }

 //////////////////////////////////////////////////////////////////////////
///////////// Watson NLU Interaction - Discern Next Action //////////////
////////////////////////////////////////////////////////////////////////
  exports.parseMessage = (obj, cb) => {
    const token = obj.message.token

    classifier.classify({
      text: obj.message.Body,
      classifier_id: config.watsonclassifier.classifier1 },
      function(err, response) {
        if (err) return cb(err)
          return cb(null, response)
        });
      }
