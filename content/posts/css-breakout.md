## Summary

What CSS Breakout does appears very simple. It "breaks" out of a normal container to either the inner, outer, or the maximum browser boundaries. Extremely little HTML work is required.

<img src="/images/css-breakout.gif">

## Live Demo

Move your browser in and out and see how it works.

<div class="dash-overlay">
  <img class="css-breakout--to-skinny-container" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--to-skinny-container</code></span></span>
  <p class="">Stays within the skinny-container. Only "touches" the sides on smaller viewports.</p>
  <img class="css-breakout--to-site-container" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--to-site-container</code></span></span>
  <p class="">Will always "touch" the site-width.</p>
  <img class="css-breakout--to-max" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--to-max</code></span></span>
  <p class="">Will always "touch" the edge of the browser</p>
  <div class="css-breakout--to-site-container">
    <div style="background:whitesmoke; padding:0.25em 0.5em">
      <h4>Works with Text just as well!</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu ornare velit, a porta dui. Pellentesque tincidunt, diam porttitor sodales eleifend, risus turpis porttitor felis, non aliquet sapien diam ullamcorper est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu ornare velit, a porta dui. Pellentesque tincidunt, diam porttitor sodales eleifend, risus turpis porttitor felis, non aliquet sapien diam ullamcorper est.</p>
    </div>
  </div>
</div>

## Why do I need to do this?

Say you're in a WYSIWYG and you'd like to push your content to the outer edges of the screen. Using CSS Breakout, you can. This solution relies on only CSS so it's fast and extremely portable.

## The Structure

### css-breakout HTML structure

    <div class="skinny-container">
      <YOUR_ELEMENT class="css-breakout--to-skinny-container"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--to-site-container"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--to-max"></<YOUR_ELEMENT>
    </div>

## The Variables that make CSS-Breakout work

### css-breakout classes to put on the breakout items:

 * `css-breakout--to-skinny-container`
 * `css-breakout--to-site-container`
 * `css-breakout--to-max`

These are the variables that make CSS Breakout run. I've included my values but you can use whatever values you like.

* `$root-pixels: 18px` How we go back and forth between ems and pxs.
* `$site-width: 900px` The maximum site width
* `$site-padding: 0.5em` The site's padding
* `$skinny-width: 700px` The inner body width
* `$skinny-padding: 2em` The inner body padding

## The nitty gritty of how it works

Sometimes I wonder how I did this. It's a little confusing. But here goes: CSS Breakout works because we have a few (newer) things at our disposal:

* `SASS`
* `calc` in CSS
* `vw` in CSS
* `media-queries`

I have 2 `container` widths that I use. The first one is a `site-container` which is the outer limits to my content. The other one I use I call a `skinny-container`. I use `body container` for blogs content because it's easier to read skinnier pages.

Putting it all together took a lot of figuring things out and a lot of trial and error.

The strategy to get it working correctly is to:
* find the center
* figure out the proper width

There are 2 parts to getting this to work: The first part is to push the left margin into the center of the page. The second part is to pull it back.

There are 3 properties we care about:
* width
* max-width
* margin-left

* viewport
*
