var marked = require('marked');
var express = require('express');
const fs = require('fs');
var router = express.Router();

/* GET home page. */
// let blog;
let about;
let posts = require('../content/posts/posts.json').reverse();
fs.readFile('./content/about.md', 'utf8', (err, aboutContent) => {
  if (err) throw err;
  about = marked(aboutContent);
});

// pull the content out of the files:
posts.forEach((postData) => fs.readFile(`./content/posts/${postData.file}`, 'utf8', (err, postContent) => {
  if (err) throw err;
  postData.content = marked(postContent);
}));

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    posts: posts,
    about: about
  });
});

module.exports = router;
