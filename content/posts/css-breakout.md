## Summary

What CSS Breakout does appears very simple. It "breaks" out of a normal container to either the inner, outer, or the maximum browser boundaries. Extremely little HTML work is required.

## Working Demo

Move your browser in and out and see how it works.
<div class="dash-overlay">
  <div class="css-breakout--inner-container u-p-r">
    <img style="width:100%" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  </div>
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--inner-container"</code></span></span>
  <p class="">Stays within the body-container. Only "touches" the sides in mobile</p>
  <div class="css-breakout--outer-container u-p-r">
    <img style="width:100%" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  </div>
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--outer-container"</code></span></span>
  <p class="">Will always "touch" the site-width.</p>
  <div class="css-breakout--max u-p-r">
    <img style="width:100%" src="/images/NYC_Top_of_the_Rock_Pano-condensed.jpg" alt="New York City, Top of the Rock Panoramic">
  </div>
  <span class="class-overlay__outer"><span class="class-overlay__inner"><code class="class-overlay">.css-breakout--max"</code></span></span>
  <p class="">Will always "touch" the edge of the browser</p>
</div>

## Why would you want to do this?

Say you're in a WYSWYG and you'd like to push your content to the outer edges of the screen. Using CSS Breakout, you can. This solution relies on only CSS so it's fast and extremely portable.

## The Structure

### css-breakout HTML structure

    <div class="body-container">
      <YOUR_ELEMENT class="css-breakout--inner-container"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--outer-container"></<YOUR_ELEMENT>
      <YOUR_ELEMENT class="css-breakout--max"></<YOUR_ELEMENT>
    </div>

## The Variables that make CSS-Breakout work

### css-breakout classes to put on the breakout items:

 * `css-breakout--inner-container`
 * `css-breakout--outer-container`
 * `css-breakout--max`

These are the variables that make CSS Breakout run. I've included my values but you can use whatever values you like.

* `$root-pixels: 18px` How we go back and forth between ems and pxs.
* `$site-width: 900px` The maximum site width
* `$site-padding: 0.5em` The site's padding
* `$body-width: 700px` The inner body width
* `$body-padding: 2em` The inner body padding

## The nitty gritty of how it works

Sometimes I wonder how I did this. It's a little confusing. But here goes: CSS Breakout works because we have a few (newer) things at our disposal:

* `SASS`
* `calc` in CSS
* `vw` in CSS
* `media-queries`

I have 2 `container` widths that I use. The first one is a `site-container` which is the outer limits to my content. The other one I use I call a `body-container`. I use `body container` for blogs content because it's easier to read skinnier pages.