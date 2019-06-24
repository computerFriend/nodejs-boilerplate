let app = require('express')(),
  fs = require('fs'),
  https = require('https');

let context,
  config,
  PORT,
  LOCAL,
  dbManager,
  encrypter,
  winnerFinder,
  httpsServer,
  encryptionKeyMap,
  HEALTHCHECK = "/admin/healthcheck";

var cacheData = [];

module.exports.init = function(mainContext) {
  context = mainContext;
  config = context.config;
  dbManager = context.dbManager;
  encrypter = context.encrypter;
  winnerFinder = context.winnerFinder;



  PORT = parseInt(config.PORT, 10) || 8000;
  LOCAL = config.LOCAL || false;

  if (config.HEALTHCHECK) HEALTHCHECK = config.HEALTHCHECK;

  if (!LOCAL) {
    var privateKey = fs.readFileSync('/etc/node/privkey1.pem');
    var certificate = fs.readFileSync('/etc/node/cert1.pem');

    httpsServer = https.createServer({
      key: privateKey,
      cert: certificate
    }, app);
  }


  app.use(rawBodyParser);

  app.all('*', function(req, res) {
    res.end('Default Hello');
  });

}

module.exports.listen = function(callback) {
  if (!LOCAL) {
    httpsServer.listen(PORT);
    context.server = httpsServer;
    console.log(`Listening on port ${PORT}...`);
    callback();
  } else {
    let server = app.listen(PORT, () => {
      context.server = server;
      console.log(`Listening on port ${PORT}...`);
      callback();
    });
  }

};

function rawBodyParser(req, res, next) {
  var data = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    req.rawBody = data;
    next();
  });

}
