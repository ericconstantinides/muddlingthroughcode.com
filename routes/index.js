var marked = require('marked');
var express = require('express');
const fs = require('fs');
const escape = require('escape-html');
const slug = require('slug');
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
posts.forEach((postObj) => {
  postObj.slug = slug(postObj.title).toLowerCase();
  fs.readFile(`./content/posts/${postObj.file}`, 'utf8', (err, postText) => {
    if (err) throw err;
    if (postObj.filetype === 'markdown') postObj.content = marked(postText);
    else postObj.content = '<pre>' + escape(postText) + '</pre>';
  });
  router.get(`/posts/${postObj.slug}`, function(req, res, next) {
    res.render('post', {
      title: `${postObj.title} | Muddling Through Code`,
      post: postObj,
      about: about
    });
  });
});

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Muddling Through Code',
    posts: posts,
    about: about
  });
});

module.exports = router;
