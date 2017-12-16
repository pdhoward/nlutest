## NLU Test

This is part of ChaoticBots series -- parse messages using Watson NLU

It features integration with the following technology platforms

* [Socket IO](http://socket.io)
* [REDIS](https://redislabs.com/)
* [MLab](https://mlab.com/welcome/)

## Development

Clone this repository
npm i to install the dependencies
Open a terminal and npm run start

## Notes
1. watson knowledge studio (wks) used to build an entity extractor, based on a dictionary of product names passed
2. the dictionary can be found in dictionary/productdictionary.csv
3. nlutest listens on a redis channel for test messages emulating an inquiry on products
4. watson nlu is tested at this point on the accuracy of identifying the product name -- some of which can be very complex
5. chaoticbanter is run with an option of product to publish the product inquiry to the redis channel
6. chaoticdash will listen to the redis channel and stream the broadcast to a webpage


See the server code for further information
