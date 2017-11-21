
// api calls
const request = 				require('request')
const rp = 							require('request-promise')
const NLUV1 =           require('watson-developer-cloud/natural-language-understanding/v1');
const config =          require('../config')

const classifier = new NLUV1({
  username: config.watsonparsing.username,
  password: config.watsonparsing.password,
  version_date: NLUV1.VERSION_DATE_2017_02_27
});

 //////////////////////////////////////////////////////////////////////////
///////////// Watson NLU Interaction - Discern Next Action //////////////
////////////////////////////////////////////////////////////////////////
  exports.parseMessage = (obj, cb) => {
    const token = obj.message.token

    classifier.analyze({
      text: obj,
      features: {
        keywords: {},
        entities: {}
        }
      },
      function(err, response) {
        if (err) return cb(err)
          console.log(response)
          return cb(null, response)
        });
      }
