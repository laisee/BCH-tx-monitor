const addr        = require('./utils/address');
const bodyParser  = require('body-parser');
const express 	  = require('express');
const axios       = require('axios');

const app         = express()

// assign app settings from envvironment || defaults
const port    = process.env.PORT || 8080;
const name    = process.env.HEROKU_APP_NAME || 'Unknown Name';
const version = process.env.HEROKU_RELEASE_VERSION || 'Unknown Version';

const deposit_address_list = addr.getAddressList('bch');
const update_url         = process.env.API_UPDATE_URL;
const BCH_TX_URL = 'https://bch-chain.api.btc.com/v3/address/';
const SATOSHI_NUMBER = 100000000;

// parse application/json
app.use(bodyParser.json())

// set the home page route
app.get('/', function(req, res) {
  res.json({"name": name,"version": version}); 	
});

//
// Retrieve last transaction sent to pre-sale/sale BCH address
//
app.post('/transaction/update', function(req, res) {
  const errors = [];
  const promises = [];
  let count = 0;
  let total = 0;
    
  for (var address of deposit_address_list) {
    const url = BCH_TX_URL + address +'/tx';
    console.log("Checking for txns at addy "+address+" using URL "+url);
    promises.push(
      axios.get(url)
      .then(function(response) {
        const body = response.data;
        if (body.data.total_count > 0) {
          for (var txn of body.data.list) {
            let data = {};
            data["wallet_address"] = txn.inputs[0].prev_addresses[0];
            data["tx_id"] = txn.hash;
            data["tx_hash"] = txn.hash;
            data["amount"] = txn.balance_diff/SATOSHI_NUMBER;
            data["currency"] = 'BCH';
            count++;
            total += txn.balance_diff/SATOSHI_NUMBER;;
            axios.post(update_url, data)
            .then(function (response) {
              if (response.status == 200) {
                console.log("Updated "+txn.hash+ " successfully for sending wallet"+data.wallet_address+" and amount "+data.amount);
              } else {
                console.log("txn update "+txn.hash+ " for wallet "+data.wallet_address+" failed. status was "+response.status);
                errors.push("Error " +response.status+"  while updating wallet "+data.wallet_address);
              }
            })
            .catch(function (error) {
              console.log("txn update "+txn.hash+ " for wallet "+data.wallet_address+" failed with error: "+error.message);
              errors.push("Error while updating wallet "+data.wallet_address+" - "+error.message);
            });
          }
          const ts = +new Date();
        } else {
          console.log("Address "+address+" has zero transactions");
        }
      })
      .catch(function (err) {
        errors.push("Error while updating transactions for BCH address "+address+" - "+err);;
      })
    );
  }
  Promise.all(promises)
  .then(function(values) {
     if (errors && errors.length > 0) {
       res.send({ status: 500, errors: errors });
     } else {
       res.send({ status: 200, errors: errors });
     }
  });
});

// Start the app listening to default port
app.listen(port, function() {
   console.log(name + ' app is running on port ' + port);
});
