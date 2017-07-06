# How I got Node.js up and running on the AWS EC2

This post is a collection of notes that I took moving over from Heroku to AWS. I was with Heroku for a few weeks and wanted to add this site to it. However, on getting it all set up, I soon found out that my $7/month was only good for one app. Every single other app I wanted to spin up without sleeping would be an extra $7. Meh, no thanks.

I knew I had gotten a free tier of AWS so I figured now was a good a time as any.

So in this post I'm going to link to the sites I found that led me to getting up running:

Here were my goals:
* Node
* Git integration
* SSL using lets encrypt and automatically renewed
* Full-time forwarding to www.

After trying my luck on youtube, I finally found this 2-part MASSIVELY well written article:

[Tutorial: Creating and managing a Node.js server on AWS, part 1](https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-1-d67367ac5171)

[Tutorial: Creating and managing a Node.js server on AWS, part 2](https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-2-5fbdea95f8a1)

However, my setup ended up differing from his. He was using a single IP, but I need to have both `www` and `*.` be working (in my experience it's a lot easier to add SSL to `www` than the root domain). I was trying (eh, muddling) to use the server block configuration to get the www to work, but I realized, I wasn't forwarding that subdomain. So instead of having the `A Name` point directly to my `elastic IP`, I found this [article on using `Route 53`](http://techgenix.com/namecheap-aws-ec2-linux/) to use [NameCheap](//www.namecheap.com) and AWS.

After setting everything up, I realized I could just use my [Digital Ocean](//www.digitalocean.com) networking tab for free (side note, Digital Oceans GUI and UX are massively better than AWS). So in the end, I'm going from NameCheap to Digital Ocean, to AWS.

At this point, I had a single site up, but I wanted to have both muddlingthroughcode.com _and_ ericconstantinides.com served on the same server. That was the whole point of this.

My nginx server block file ended up like this:

    server {
      server_name   muddlingthroughcode.com;
      rewrite ^(.*) https://www.muddlingthroughcode.com$1 permanent;
    }

    server {
      server_name   ericconstantinides.com;
      rewrite ^(.*) https://www.ericconstantinides.com$1 permanent;
    }

    server {
      listen       80;
      server_name  www.ericconstantinides.com;

      location / {
        # Redirect any http requests to https
        return 301 https://$server_name$request_uri;
      }
    }

    server {
      listen       80;
      server_name  www.muddlingthroughcode.com;

      location / {
        # Redirect any http requests to https
        return 301 https://$server_name$request_uri;
      }
    }

    server {
      listen       443 ssl;
      server_name  www.ericconstantinides.com;
      ssl_certificate /etc/letsencrypt/live/www.ericconstantinides.com/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/www.ericconstantinides.com/privkey.pem;
      add_header Strict-Transport-Security “max-age=31536000”;

      location / {
        proxy_pass http://127.0.0.1:3010;
      }
    }

    server {
      listen       443 ssl;
      server_name  www.muddlingthroughcode.com;
      ssl_certificate /etc/letsencrypt/live/www.muddlingthroughcode.com/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/www.muddlingthroughcode.com/privkey.pem;
      add_header Strict-Transport-Security “max-age=31536000”;

      location / {
        proxy_pass http://127.0.0.1:3000;
      }
    }

Took get the SSL certificate up and running, I followed this article:

<img src="/images/digital-ocean-networking-for-muddling-through-code.png">