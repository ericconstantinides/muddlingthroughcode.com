## Demo
[Here's a demo of css-overflow on images](www.ericconstantinides.github.io/css-overflow)

## Summary

CSS Overflow encourages overlap! Overlap to your pleasure. CSS Overflow will bend for you. CSS Overflow keeps BODY text within the the $site-width, while automatically extending images (or anything else) all the way out to the viewport.

CSS Overflow uses a flexbox container with min height of 55vmin (so just over half of vh or vw)

## Here's how it works:

CSS Overflow works because we have a few (newer) things at our disposal:
* `SASS`
* `calc` in CSS (killer feature #1)
* `vw` in CSS (killer feature #2)
* `media-queries` (killer feature #3)

When the viewport is <em>inside</em> the `$site-width`, body and image percentages are essentially taken at face value. When you're <em>outside</em> the `$site-width`, body and image percentages are `calc`ulated.

## The Structure:
<pre>
──.css-overflow (plus classes below)
        │
        ├─.css-overflow__body
        └─.css-overflow__image-container
                └─img
</pre>
.css-overflow classes:
<pre>
   .has-image-left         = image left (body right):
   .has-image-right        = image right (body left):
   .has-image-width-25p    = image width 25%:
   .has-image-width-33_3p  = image width 33.3%:
   .has-image-width-40p    = image width 40%:
   .has-image-width-50p    = image width 50%:
   .has-image-width-60p    = image width 60%:
   .has-image-width-66_6p  = image width 66.6%:
   .has-image-width-75p    = image width 75%:
   .has-body-width-25p     = body width  25%   (optional. body defaults to equal 100%)
   .has-body-width-33_3p   = body width  33.3% (optional. body defaults to equal 100%)
   .has-body-width-40p     = body width  40%   (optional. body defaults to equal 100%)
   .has-body-width-50p     = body width  50%   (optional. body defaults to equal 100%)
   .has-body-width-60p     = body width  60%   (optional. body defaults to equal 100%)
   .has-body-width-66_6p   = body width  66.6% (optional. body defaults to equal 100%)
   .has-body-width-75p     = body width  75%   (optional. body defaults to equal 100%)
   .is-vertical            = ignores widths and displays image then body
   .has-body-top           = moves body text to the top instead of center in css-overflow
</pre>
## The following are distinct classes from above that will overflow a single element:
 Structure and classes:
<pre>
──.css-overflow--full-browser-width     = overflows out to the entire viewport
──.css-overflow--site-container-width   = overflows out to the $site-width
──.css-overflow--inner-body-width       = overflows out to the $body-width
</pre>
The Variables in make-css-overflow:
<pre>
$image-percentage: the percentage that the image takes up
$body-percentage: the percentage that the body takes up.
</pre>
