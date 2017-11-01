const marked = require('marked')
const express = require('express')
// const path = require('path')

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const slug = require('slug')
const Feed = require('feed')

const cheerio = require('cheerio')

const router = express.Router()

const siteMeta = require('../content/site-meta.config.js')
const dateUtils = require('../utilities/dateUtils')
const TEASERBREAK = '{{teaserbreak}}'

function teaserBreak (postText) {
  // make sure it's lowercase
  postText = postText.replace(TEASERBREAK.toUpperCase(), TEASERBREAK)
  const postArray = postText.split(TEASERBREAK)
  const strippedPost = typeof postArray[1] !== 'undefined'
    ? postArray[0] + postArray[1]
    : postArray[0]
  return {
    teaserMd: postArray[0],
    postMd: strippedPost
  }
}

function postGettingPosts (posts) {
  router.get('/', (req, res, next) => {
    res.render('index', {
      title: siteMeta.website.name + ' ' + siteMeta.website.tagline,
      ogTitle: siteMeta.website.name,
      posts: posts,
      pageUrl: `/`,
      primaryImage: false,
      className: 'post-index',
      description: siteMeta.website.description
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
}

// prepare RSS
let feed = new Feed({
  title: siteMeta.website.name,
  description: siteMeta.website.description,
  id: siteMeta.website.url,
  link: siteMeta.website.url,
  image: siteMeta.website.url + siteMeta.website.primaryImage.path,
  favicon: siteMeta.website.url + '/favicon.ico',
  copyright: '&copy; ' + new Date().getFullYear() + ' ' + siteMeta.owner.name,
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

let siteMap = []
siteMap.push({
  loc: siteMeta.website.url,
  changefreq: 'weekly',
  priority: 0.5
})

function getPost (fileName) {
  return fs.readFileAsync(`./content/posts/${fileName}`, 'utf8')
}

function getAllPosts (postMetaJson) {
  // load all posts in parallel:
  let promises = postMetaJson.map(postMetaObj => getPost(postMetaObj.file))
  // return promise that is resolved when all posts are done loading
  return Promise.all(promises)
}

// get posts, filter inactive, and sort by reversed date
let postMetaJson = require('../content/posts.json')
  .filter(postObj => postObj.active)
  .filter(postObj => new Date(dateUtils.cleanDate(postObj.date)) <= new Date())
  .sort(
    (a, b) =>
      new Date(dateUtils.cleanDate(b.date)) -
      new Date(dateUtils.cleanDate(a.date))
  )

getAllPosts(postMetaJson)
  .then(postsMarkdown => {
    postMetaJson.forEach((postObj, index, posts) => {
      const { teaserMd, postMd } = teaserBreak(postsMarkdown[index])
      postObj.content = marked(postMd)

      postObj.title = ''
      const $post = cheerio.load(postObj.content)
      if (typeof $post('h1') !== 'undefined') {
        postObj.title = $post('h1').first().text()
        $post('h1').first().remove()
        postObj.content = $post.html()
      }
      postObj.slug = slug(postObj.title).toLowerCase()

      postObj.teaser =
        marked(teaserMd) +
        `<p class="more-link__p">
          <span class="more-link__outer">
          <a class="more-link" href="/posts/${postObj.slug}">Read On</a>
          </span>
        </p>`

      const $postTeaser = cheerio.load(postObj.teaser)
      if (typeof $postTeaser('h1') !== 'undefined') {
        postObj.title = $postTeaser('h1').first().text()
        $postTeaser('h1').first().remove()
        postObj.teaser = $postTeaser.html()
      }

      postObj.dateDisplay = dateUtils.prettyDate(postObj.date)

      // set up the primary image
      if (
        typeof postObj.primaryImage !== 'undefined' &&
        typeof postObj.primaryImage.image !== 'undefined'
      ) {
        if (typeof postObj.primaryImage.containerClass === 'undefined') { postObj.primaryImage.containerClass = '' }
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
        author: [
          {
            name: siteMeta.owner.name,
            email: siteMeta.owner.email,
            link: siteMeta.owner.url
          }
        ],
        date: new Date(dateUtils.cleanDate(postObj.date)),
        image: postObj.primaryImage
          ? siteMeta.website.url + postObj.primaryImage.image
          : ''
      })
      // Assign the first date to the last modified
      if (typeof siteMap[0].lastmod === 'undefined') {
        siteMap[0].lastmod = new Date(dateUtils.cleanDate(postObj.date))
          .toISOString()
          .substr(0, 10)
      }
      siteMap.push({
        loc: siteMeta.website.url + '/posts/' + postObj.slug,
        lastmod: new Date(dateUtils.cleanDate(postObj.date))
          .toISOString()
          .substr(0, 10),
        changefreq: 'weekly',
        priority: 0.5
      })

      router.get(`/posts/${postObj.slug}`, (req, res, next) => {
        res.render('post', {
          title: postObj.title + ' ' + siteMeta.website.name,
          ogTitle: `${postObj.title}`,
          post: postObj,
          pageUrl: `/posts/${postObj.slug}`,
          className: 'post-page',
          description: postObj.description
        })
      })
      postGettingPosts(posts)
    })
  })
  .catch(err => console.log('Catch: ', err))

module.exports = router
