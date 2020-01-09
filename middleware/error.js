const winston = require('winston');

module.exports = function(err, req, res, next) {
  console.log("Error catching");
  console.log(err);
  winston.error(err.message);

    // error
  // warn
  // info
  // verbose
  // debug 
  // silly

  res.status(500).send("Something failed");
}