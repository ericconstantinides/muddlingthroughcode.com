CSS Breakout appears to be very simple. It "breaks" out of a normal container to either a skinny container, site container, or to the maximum browser boundaries. No closing and then reopening of a div tree is necessary. Absolutely no special HTML structure is required. And it's all done in pure CSS - no javascript is used whatsoever.

<img class="css-breakout--to-site" src="/images/css-breakout.gif">

## Why do I need this?

One of the primary uses of CSS Breakout is to break out of a content container created from within a WYSIWYG. Without CSS Breakout it is very messy and usually not even possible. By using CSS Breakout you can finally break out of containers gracefully. This solution relies on only CSS so it's fast and extremely portable.


CSS Breakout works because we have a few (newer) things at our disposal: `SASS`, `calc`, `vw`, `media-queries`. Combine them together with some logic and you get CSS Breakout.

### The old way:

    <div class="site-container">
      <div class="skinny-container">
        <!-- your text -->
      </div>
    </div>
    <img src="wide-image">
    <div class="site-container">
      <div class="skinny-container">
        <!-- your text -->
      </div>
    </div>

### The new way:

    <div class="site-container">
      <div class="skinny-container">
        <!-- your text -->
        <img class="css-breakout--to-max" src="wide-image">
        <!-- your text -->
      </div>
    </div>


[//]:#((teaserBreak))

## Live Demo

Move your browser in and out and see how it works.

<div class="dash-overlay">
  <img class="css-breakout--to-skinny" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--to-skinny</code></span></span>
  <p class="">Stays within the skinny-width. Only "touches" the sides on smaller viewports.</p>
  <img class="css-breakout--to-site" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--to-site</code></span></span>
  <p class="">Will always "touch" the site-width, but no further.</p>
  <img class="css-breakout--to-max" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--to-max</code></span></span>
  <p class="">Will always "touch" the edge of the browser.</p>
  <div class="css-breakout--to-site" style="background:whitesmoke; padding:0.25em 0.5em">
    <h4>Works with Text just as well!</h4>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu ornare velit, a porta dui. Pellentesque tincidunt, diam porttitor sodales eleifend, risus turpis porttitor felis, non aliquet sapien diam ullamcorper est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu ornare velit, a porta dui. Pellentesque tincidunt, diam porttitor sodales eleifend, risus turpis porttitor felis, non aliquet sapien diam ullamcorper est.</p>
  </div>
</div>

## CSS-Breakout Setup

### HTML structure

    <div class="[site-container, skinny-container]">
      <YOUR_ELEMENT class="css-breakout--auto"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--to-skinny"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--to-site"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--to-max"></<YOUR_ELEMENT>
    </div>

    <!-- Can also be nested -->

    <div class="site-container">
      <div class="skinny-container">
        [...]
      </div>
    </div>

### Classes to be used on the breakout items:

 * `css-breakout--to-auto` automatically breaks out on thinner viewports regardless of container.
 * `css-breakout--to-skinny` Stays within the skinny-width. Only "touches" the sides on smaller viewports.
 * `css-breakout--to-site` Will always "touch" the site-width, but no further.
 * `css-breakout--to-max` Will always "touch" the edge of the browser.

These are the variables that make CSS Breakout run. I've included my values but you can use whatever values you like.

* `$root-pixels: 18px` How we go back and forth between ems, rems and pxs. Pixels only.
* `$site-width: 900px` The maximum site width. Can use ems, rems, or px.
* `$site-padding: 0.5em` The site's padding. Can use ems, rems, or px.
* `$skinny-width: 700px` The inner body width. Can use ems, rems, or px.
* `$skinny-padding: 2em` The inner body padding. Can use ems, rems, or px.

## How CSS Breakout works

I use two `container`s on my sites. The primary one is `site-container` (other libraries call it `container` but I prefer `site-container` as `container` is too broad a term and makes troubleshooting more tedious). `site-container` is the outer limits to my content. I use `skinny-container` for blog content because blog content is easier to read on skinnier pages.

There are 3 levels of media-queries for the breakout: within the container and the padding, within the padding of the container, and outside of the container.

If we're within the container, we simply negate the site padding using `margin-left: $[site,skinny]-padding * -1`. Then we put `width: 100vw` and voila, it works!

If we're outside of the container, we put the width at `100vw` as well. This is where the magic comes in. To get to the center of the container on a center-aligned site, all we have to do is `margin-left: 50%`. At this point, we have full-width item at exactly the center of the site. Now we have to pull back to the left edge of the page which is exactly `-50vw` away. So we can use CSS `calc` to do this automatically: `margin-left: calc(50vw -50%)`.

The hardest part are the "tweener" areas - when the content is wider than the container, but still smaller than the site with padding. Tweener margins are calculated by halving the width of their container and then css `calc` with `-50vw`.

## Caveats

* make sure you don't have `overflow: hidden` on any of the containing elements.
* if you change your padding using media queries, css-breakout will probably break. You'll have to adjust accordingly.
* Safari _sometimes_ displays CSS Breakout incorrectly at certain viewports. It seems to be a browser bug but it's not so bad that most people would notice.
* CSS-breakout only works on center aligned sites.