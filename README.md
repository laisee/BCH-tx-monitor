# BCH Transaction Monitor

[![Node.js CI](https://github.com/laisee/BCH-tx-monitor/actions/workflows/node.js.yml/badge.svg)](https://github.com/laisee/BCH-tx-monitor/actions/workflows/node.js.yml)
[![Dependabot Updates](https://github.com/laisee/BCH-tx-monitor/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/laisee/BCH-tx-monitor/actions/workflows/dependabot/dependabot-updates)

Heroku node.js app for monitoring one or more BCH addresses for transactions

Instructions:

1. check out the code
2. install required libs:
   `npm install`
3. add new heroku app
4. assign one or more BCH addresses to the Heroku config setting => "heroku config:set BCH_ADDRESS_LIST=XXX,YYY,ZZZ"
   assign separate addresses by use of commas
5. run the code using command below:
   `node app.js`
