var marked = require('marked');
var express = require('express');
const fs = require('fs');
var router = express.Router();


/* GET home page. */
let blog;
router.get('/', function(req, res, next) {
  fs.readFile('./content/posts/muddling-01.md','utf8',(err, data) => {
    if (err) throw err;
    blog = marked(data);
  });
  res.render('index', {
    title: 'Express',
    blog: blog
  });
});

module.exports = router;
