const nconf = require('nconf');

nconf.argv().env().file({
  "file": "./config/local_env.json"
});

module.exports = Object.assign({ get: nconf.get.bind(nconf) }, nconf.get());
