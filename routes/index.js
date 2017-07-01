module.exports = function (siteMeta) {
  const marked = require('marked')
  const express = require('express')
  const fs = require('fs')
  const slug = require('slug')
  const Feed = require('feed')
  const router = express.Router()

  const dateUtils = require('../utilities/dateUtils')

  function teaserBreak (string, addOn) {
    let teaser = string.substr(0, string.indexOf('[//]:#((teaserBreak))'))
    if (teaser === '') return string
    return (teaser + addOn)
  }

  // prepare RSS
  let feed = new Feed({
    title: siteMeta.website.name,
    description: siteMeta.website.description,
    id: siteMeta.website.url,
    link: siteMeta.website.url,
    image: siteMeta.website.url + siteMeta.website.primaryImage.path,
    favicon: siteMeta.website.url + '/favicon.ico',
    copyright: '© ' + new Date().getFullYear() + ' ' + siteMeta.owner.name,
    // updated: new Date(2013,06,14), // optional, default = today
    // generator: '', // optional, default = 'Feed for Node.js'
    feedLinks: {
      rss: siteMeta.website.url + '/rss',
      json: siteMeta.website.url + '/json',
      atom: siteMeta.website.url + '/atom'
    },
    author: {
      name: siteMeta.owner.name,
      email: siteMeta.owner.email,
      link: siteMeta.owner.url
    }
  })

  feed.addCategory('Node.js')
  feed.addCategory('Express')

  let about
  // get posts, filter inactive, and sort by reversed date
  let posts = require('../content/posts/posts.json')
    .filter(postObj => postObj.active)
    .filter(postObj => new Date(dateUtils.cleanDate(postObj.date)) <= new Date())
    .sort((a, b) => new Date(dateUtils.cleanDate(b.date)) - new Date(dateUtils.cleanDate(a.date)))
  fs.readFile('./content/about.md', 'utf8', (err, aboutContent) => {
    if (err) throw err
    about = marked(aboutContent)
  })

  let siteMap = []
  siteMap.push({
    loc: siteMeta.website.url,
    changefreq: 'weekly',
    priority: 0.5
  })

  // pull the content out of the files:
  posts.forEach((postObj, index) => {
    postObj.slug = slug(postObj.title).toLowerCase()
    fs.readFile(`./content/posts/${postObj.file}`, 'utf8', (err, postText) => {
      if (err) throw err
      postObj.teaser = marked(teaserBreak(postText,
        `<p class="more-link__p"><span class="more-link__outer"><a class="more-link" href="/posts/${postObj.slug}">Read On</a></span></p>`))
      postObj.content = marked(postText)
      postObj.dateDisplay = dateUtils.prettyDate(postObj.date)

      // set up the primary image
      if (typeof postObj.primaryImage !== 'undefined' && typeof postObj.primaryImage.image !== 'undefined') {
        if (typeof postObj.primaryImage.containerClass === 'undefined') postObj.primaryImage.containerClass = ''
      } else {
        postObj.primaryImage = false
      }
      // add this post into the feed:
      feed.addItem({
        title: postObj.title,
        id: siteMeta.website.url + '/' + postObj.slug,
        link: siteMeta.website.url + '/' + postObj.slug,
        description: postObj.description,
        content: postObj.content,
        author: [{
          name: siteMeta.owner.name,
          email: siteMeta.owner.email,
          link: siteMeta.owner.url
        }],
        date: new Date(dateUtils.cleanDate(postObj.date)),
        image: (postObj.primaryImage ? siteMeta.website.url + postObj.primaryImage.image : '')
      })
      // Assign the first date to the last modified
      if (typeof siteMap[0].lastmod === 'undefined') {
        siteMap[0].lastmod = new Date(dateUtils.cleanDate(postObj.date)).toISOString().substr(0, 10)
      }
      siteMap.push({
        loc: siteMeta.website.url + '/posts/' + postObj.slug,
        lastmod: new Date(dateUtils.cleanDate(postObj.date)).toISOString().substr(0, 10),
        changefreq: 'weekly',
        priority: 0.5
      })
    })

    router.get(`/posts/${postObj.slug}`, (req, res, next) => {
      res.render('post', {
        title: postObj.title + ' ' + siteMeta.website.name,
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
      title: siteMeta.website.name + ' ' + siteMeta.website.tagline,
      ogTitle: siteMeta.website.name,
      posts: posts,
      pageUrl: `/`,
      primaryImage: false,
      className: 'post-index',
      description: siteMeta.website.description,
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
    res.set('Content-Type', 'application/xml')
    res.render('sitemap', {
      siteMap: siteMap
    })
  })
  return router
}
