var marked = require('marked')
var express = require('express')
const fs = require('fs')
const escape = require('escape-html')
const slug = require('slug')
const Feed = require('feed')
var router = express.Router()

function teaserBreak (string, addOn) {
  let teaser = string.substr(0, string.indexOf('[//]:#((teaserBreak))'))
  if (teaser === '') return string
  return (teaser + addOn)
}

function cleanDate (dateString) {
  dateString = dateString.replace('-', ',')
  dateString = dateString.replace('/', ',')
  return dateString
}
function prettyDate (dateString) {
  dateString = cleanDate(dateString)
  dateObj = new Date(dateString)
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  return `${weekdayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}


// prepare RSS
let feed = new Feed({
  title: '{ muddling through code }',
  description: 'Welcome to {muddling through code}. This is my journey to learn, grow, and /* occasionally */ muddle through code.',
  id: 'https://www.muddlingthroughcode.com/',
  link: 'https://www.muddlingthroughcode.com/',
  image: 'https://www.muddlingthroughcode.com/images/see-no-evil-monkey-emoji--large.png',
  favicon: 'https://www.muddlingthroughcode.com/favicon.ico',
  copyright: 'All rights reserved, Eric Constantinides',
  // updated: new Date(2013, 06, 14), // optional, default = today
  // generator: 'awesome', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://www.muddlingthroughcode.com/json',
    atom: 'https://www.muddlingthroughcode.com/atom',
  },
  author: {
    name: 'Eric Constantinides',
    email: 'eric@ericconstantinides.com',
    link: 'https://www.ericconstantinides.com'
  }
})

feed.addCategory('Node.js')
feed.addCategory('JavaScript')

let about
let posts = require('../content/posts/posts.json').reverse()
fs.readFile('./content/about.md','utf8', (err, aboutContent) => {
  if (err) throw err
  about = marked(aboutContent)
})

// pull the content out of the files:
posts.forEach((postObj,index) => {
  // don't run this code if it's not active:
  if (!postObj.active) {
    posts.splice(index,1)
    return
  }
  postObj.slug = slug(postObj.title).toLowerCase()
  fs.readFile(`./content/posts/${postObj.file}`, 'utf8', (err, postText) => {
    if (err) throw err
    postObj.teaser = marked(teaserBreak(postText,`<p class="more-link__p"><span class="more-link__outer"><a class="more-link" href="/posts/${postObj.slug}">Read On</a></span></p>`))
    postObj.content = marked(postText)
    postObj.dateDisplay = prettyDate(postObj.date)

    // set up the primary image
    if (typeof postObj.primaryImage !== 'undefined' && typeof postObj.primaryImage.image !== 'undefined') {
      if (typeof postObj.primaryImage.containerClass === 'undefined') postObj.primaryImage.containerClass = '';
    } else {
      postObj.primaryImage = false;
    }

    // add this post into the feed:
    feed.addItem({
      title: postObj.title,
      id: 'https://www.muddlingthroughcode.com/' + postObj.slug,
      link: 'https://www.muddlingthroughcode.com/' + postObj.slug,
      description: postObj.description,
      content: postObj.content,
      author: [{
        name: 'Eric Constantinides',
        email: 'eric@ericconstantinides.com',
        link: 'https://www.ericconstantinides.com'
      }],
      date: new Date(cleanDate(postObj.date))
      // image: post.image
    })
  })


  router.get(`/posts/${postObj.slug}`, function(req, res, next) {
    let protocol = req.secure ? 'https://' : 'http://'
    res.render('post', {
      title: `${postObj.title} { muddling through code }`,
      ogTitle: `${postObj.title}`,
      post: postObj,
      hostname: protocol + req.headers.host,
      pageUrl: `/posts/${postObj.slug}`,
      className: 'post-page',
      description: postObj.description,
      about: about
    })
  })
})

router.get('/', function(req, res, next) {
  let protocol = req.secure ? 'https://' : 'http://'
  posts.forEach((postObj,index) => {
    if (!postObj.active) {
      posts.splice(index,1)
      return
    }
  })
  res.render('index', {
    title: '{ muddling through code } To learn, sometimes you gotta muddle',
    ogTitle: '{ muddling through code }',
    posts: posts,
    hostname: protocol + req.headers.host,
    pageUrl: `/`,
    primaryImage: false,
    className: 'post-index',
    description: 'Welcome to { muddling through code }. This is my journey to learn, grow, and /* occasionally */ muddle through code.',
    about: about
  })
})

router.get('/rss', function(req, res, next) {
  res.send(feed.rss2())
})

module.exports = router
