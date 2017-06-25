var marked = require('marked');
var express = require('express');
const fs = require('fs');
const escape = require('escape-html');
const slug = require('slug');
var router = express.Router();

function teaserBreak(string, addOn) {
  let teaser = string.substr(0, string.indexOf('[//]:#((teaserBreak))'));
  if (teaser === '') return string;
  return (teaser + addOn);
}

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
    postObj.teaser = marked(teaserBreak(postText,`<p class="more-link__p"><span class="more-link__outer"><a class="more-link" href="/posts/${postObj.slug}">Read On</a></span></p>`));
    postObj.content = marked(postText);
  });
  router.get(`/posts/${postObj.slug}`, function(req, res, next) {
    res.render('post', {
      title: `${postObj.title} | Muddling Through Code`,
      post: postObj,
      className: 'post-page',
      description: postObj.description,
      about: about
    });
  });
});

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Muddling Through Code',
    posts: posts,
    className: 'post-index',
    description: 'Welcome to {muddling through code}. This is my journey to learn, grow, and /* occasionally */ muddle through code.',
    about: about
  });
});

module.exports = router;
