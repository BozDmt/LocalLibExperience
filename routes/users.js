var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users',{ parag: 'users of the Local Library'});
});

module.exports = router;
