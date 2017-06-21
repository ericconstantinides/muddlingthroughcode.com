# Why I'm ditching the LAMP stack and embracing the MERN stack

>"Hi my name is Eric and I build websites."

I've said that to people for years. From the time I started web development I've been a LAMP (Linux, Apache, MySQL, PHP) stack developer. I've built well over [20 enterprise-level](https://www.ericconstantinides.com/) [Drupal](https://www.drupal.org/) and [Wordpress](https://wordpress.org/) sites in addition to coding [hundreds of thousands of lines of custom CSS and UI JavaScript](https://www.ericconstantinides.com/snippets). My entire professional life has been a back and forth between the front-end and the LAMP stack - never mastering either. Although I've gravitated towards the front-end, I've always maintained that I'm a true full LAMP stack developer - while never really mastering either the front-end or the back-end.

I _am_ good at "building websites." But companies like [SquareSpace](https://www.squarespace.com/) and [Shopify](https://www.shopify.com/) are automating these skills and making them obsolete. In staying on the LAMP stack I have been holding on to a dying format. I have been avoiding the inevitable for too long. By teetering in the middle I was spearheading my own demise. To evolve I had to update my skills. I had to ditch what wasn't working and master what I really loved.

Today I'm ditching the LAMP stack and finding something new. This is the start of my journey into being a web application developer. I'm tackling this from the point of view of an expert and a complete novice. This is humbling and embarrassing and something I have to do.

>"Hi my name is Eric and I build web apps."

My journey began 6 months ago when literally all I knew was that I needed to learn a front-end framework in order to update content on a Drupal site better. That led me to a standoff between either [React](https://facebook.github.io/react/) or [Angular](https://angularjs.org/)([Vue](https://vuejs.org/) wasn't much of a thing yet). After [crunching some numbers](https://www.youtube.com/watch?v=KMX1mFEmM3E), I found the general consensus was that React has more [top-level tech companies using it](https://github.com/facebook/react/wiki/sites-using-react). It was settled, I was [learning React](https://www.youtube.com/watch?v=MhkGQAoc7bc&list=PLoYCgNOIyGABj2GQSlDRjgvXtqfDxKm5b).

In order to learn React you need to know [ES6/ES2015](https://css-tricks.com/lets-learn-es2015/) and [JSX](https://www.youtube.com/watch?v=m_d7xofR1RQ). Uh oh. So the new first thing I had to do was to [learn ES2015](https://www.youtube.com/watch?v=HIS8juawTmM&list=PLVHlCYNvnqYouIVj3IgK3RmzpnWMaoqkw). Then I quickly moved on to learning [React along with Webpack and Babel](https://www.youtube.com/watch?v=uextYhQGP6k). I was quickly overwhelmed. I didn't even know what a [router](https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669) was. I didn't understand what an [MVC](https://www.youtube.com/watch?v=1IsL6g2ixak) was. I was trying to grock React before really grocking the stack. So I backed up. Way back. I had to understand the stack.

## My new stack.

I love JavaScript and after learning ES2015 I have been pushing myself to become an expert in it; I knew my stack would have to be full-time JS. So I chose [Node.js](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp) for the backend.

And, THE web framework that you use for Node is [Express.js](https://expressjs.com/).

Then the database. Since I'm starting anew, I'm going with the most JavaScripty looking NoSQL option available: [MongoDB](https://www.mongodb.com). I'm going to love throwing JSON objects at it. After doing some cursory research on it, I'm absolutely loving it compared to relational databases. Bye-bye MySQL, don't let the tables hit you on the way out.

## The MERN stack.

I decided my first site would be to convert [ericconstantinides.com](https://www.ericconstantinides.com) from static HTML / Apache / JS to a Node / Express / JS site. I don't want to involve any React or anything too intense yet. I just wanted to get used to having a simple site up and running with my new stack. I converted most of the data to JSON and was able to get it working in a few days. That wasn't so bad!

I also decided that all of my personal websites will now be up and running on [my GitHub account](github.com/ericconstantinides). I want people to know who I am and what I'm about. No more playing in the dark.

Where do I host? I use [Digital Ocean](https://www.digitalocean.com/) for all my Drupal sites, but I wanted something specific for my new stack. I looked into [AWS](https://aws.amazon.com/) but it is too complex (for now) to get up and running right away. For the time being I decided on [Heroku](https://www.heroku.com/). They have a nice freemium model that is easy to get up and going - although I ended up paying $7/month so that the site would have instant spin-up (good job, Heroku).

My next project is a simple [Node To Do app](https://github.com/ericconstantinides/erics-node-todo). I already had a front-end only To Do app but I wanted this one to be on a Node server, work with Mongo, and have a full [RESTful API](https://www.youtube.com/watch?v=7YcW25PHnAA). There are a ton of tutorials that tell you how to do a RESTful API but it ended up being a lot more work than I had intended. In the end though, I'm very happy with it.

I'm also putting this site in Node. I'm making it dead simple and putting all the blog posts in markdown files. I found an NPM package [marked](https://www.npmjs.com/package/marked) which enables me to load in all of my posts.

Eventually, I'll be rewriting [bottomlessbrunch.com](http://www.bottomlessbrunch.com) from the ground up using MongoDB, Express, React, and Node. My goal for bottomlessbrunch is to have a fast web app that will curl sites around the US find happy hour, reverse happy hour, and bottomless brunch locations. It'll link in to Yelp, Open Table.

For the first time in a long time I'm excited again about code. It's been a long time coming.