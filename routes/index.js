var marked = require('marked')
var express = require('express')
const fs = require('fs')
const slug = require('slug')
const Feed = require('feed')
const sitemapGenerator = require('sitemap')
var router = express.Router()

const WEBSITE = {
  url: 'https://www.muddlingthroughcode.com',
  name: '{ muddling through code }',
  description: 'Welcome to { muddling through code }. This is my journey to ' +
    'learn, grow, and /* occasionally */ muddle through code.',
  tagline: 'To learn, sometimes you gotta muddle'
}
const EMAIL = 'eric@ericconstantinides.com'
const OWNER = 'Eric Constantinides'
const OWNER_WEBSITE = 'https://www.ericconstantinides.com'

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
  let dateObj = new Date(dateString)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday']
  return `${weekdayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}

let sitemap = sitemapGenerator.createSitemap({
  hostname: WEBSITE.url,
  cacheTime: 600000,  // 600 sec cache period
  urls: [{url: '/', changefreq: 'weekly', priority: 1.0}]
})

// prepare RSS
let feed = new Feed({
  title: WEBSITE.name,
  description: WEBSITE.description,
  id: WEBSITE.url,
  link: WEBSITE.url,
  image: WEBSITE.url + '/images/see-no-evil-monkey-emoji--large.png',
  favicon: WEBSITE.url + '/favicon.ico',
  copyright: '© ' + new Date().getFullYear() + ' ' + OWNER,
  // updated: new Date(2013,06,14), // optional, default = today
  // generator: 'awesome', // optional, default = 'Feed for Node.js'
  feedLinks: {
    rss: WEBSITE.url + '/rss',
    json: WEBSITE.url + '/json',
    atom: WEBSITE.url + '/atom'
  },
  author: {
    name: OWNER,
    email: EMAIL,
    link: OWNER_WEBSITE.url
  }
})

feed.addCategory('Node.js')
feed.addCategory('Express')

let about
// get posts, filter inactive, and sort by reversed date
let posts = require('../content/posts/posts.json')
  .filter(postObj => postObj.active)
  .filter(postObj => new Date(cleanDate(postObj.date)) <= new Date())
  .sort((a, b) => new Date(cleanDate(b.date)) - new Date(cleanDate(a.date)))
fs.readFile('./content/about.md', 'utf8', (err, aboutContent) => {
  if (err) throw err
  about = marked(aboutContent)
})

// pull the content out of the files:
posts.forEach((postObj, index) => {
  postObj.slug = slug(postObj.title).toLowerCase()
  fs.readFile(`./content/posts/${postObj.file}`, 'utf8', (err, postText) => {
    if (err) throw err
    postObj.teaser = marked(teaserBreak(postText,
      `<p class="more-link__p"><span class="more-link__outer"><a class="more-link" href="/posts/${postObj.slug}">Read On</a></span></p>`))
    postObj.content = marked(postText)
    postObj.dateDisplay = prettyDate(postObj.date)

    // set up the primary image
    if (typeof postObj.primaryImage !== 'undefined' && typeof postObj.primaryImage.image !== 'undefined') {
      if (typeof postObj.primaryImage.containerClass === 'undefined') postObj.primaryImage.containerClass = ''
    } else {
      postObj.primaryImage = false
    }
    // add this post into the feed:
    feed.addItem({
      title: postObj.title,
      id: WEBSITE.url + '/' + postObj.slug,
      link: WEBSITE.url + '/' + postObj.slug,
      description: postObj.description,
      content: postObj.content,
      author: [{
        name: OWNER,
        email: EMAIL,
        link: OWNER_WEBSITE.url
      }],
      date: new Date(cleanDate(postObj.date)),
      image: (postObj.primaryImage ? WEBSITE.url + postObj.primaryImage.image : '')
    })
    // add to the sitemap
    sitemap.add({url: '/posts/' + postObj.slug, changefreq: 'weekly', priority: 0.5})
  })

  router.get(`/posts/${postObj.slug}`, (req, res, next) => {
    res.render('post', {
      title: postObj.title + ' ' + WEBSITE.name,
      ogTitle: `${postObj.title}`,
      post: postObj,
      pageUrl: `/posts/${postObj.slug}`,
      className: 'post-page',
      description: postObj.description,
      about: about
    })
  })
})

router.get('/', (req, res, next) => {
  res.render('index', {
    title: WEBSITE.name + ' ' + WEBSITE.tagline,
    ogTitle: WEBSITE.name,
    posts: posts,
    pageUrl: `/`,
    primaryImage: false,
    className: 'post-index',
    description: WEBSITE.description,
    about: about
  })
})

router.get('/rss', (req, res, next) => {
  res.send(feed.rss2())
})
router.get('/json', (req, res, next) => {
  res.send(feed.json1())
})
router.get('/atom', (req, res, next) => {
  res.send(feed.atom1())
})

router.get('/sitemap.xml', (req, res, next) => {
  res.header('Content-Type', 'application/xml')
  res.send(sitemap.toString())
})

module.exports = router
