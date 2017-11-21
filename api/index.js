
// api calls
const request = 				require('request')
const rp = 							require('request-promise')
const NLUV1 =           require('watson-developer-cloud/natural-language-understanding/v1');
const config =          require('../config')

const classifier = new NLUV1({
  username: config.watsonparsing.username,
  password: config.watsonparsing.password
});

const API_ID = process.env.REACT_APP_API_ID
const APP_KEY = process.env.REACT_APP_APP_KEY


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
