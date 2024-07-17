# BCH Transaction Monitor

[![Node.js CI](https://github.com/laisee/BCH-tx-monitor/actions/workflows/node.js.yml/badge.svg)](https://github.com/laisee/BCH-tx-monitor/actions/workflows/node.js.yml)

Heroku node.js app for monitoring one or more BCH addresses for transactions

Instructions:

1. check out the code
2. add new heroku app
3. assign one or more BCH addresses to the Heroku config setting => "heroku config:set BCH_ADDRESS_LIST=XXX,YYY,ZZZ"
   assign separate addresses by use of commas
