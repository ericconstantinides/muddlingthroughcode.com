## Demo
[Here's a demo of css-overflow on images](https://ericconstantinides.github.io/css-overflow/)

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

## The Structure

### css-o HTML structure

    <div class="css-o [plus classes below]">
      <div class="css-o__body">
        <!-- YOUR BODY TEXT GOES HERE -->
      </div>
      <div class="css-o__image-container">
        <img src="path/to/your/image">
      </div>
    </div>

### css-o classes:

* **Image Side**:
 * `css-o--image-left`         image left, body right
 * `css-o--image-right`        image right, body left
* **Image Width**:
 * `css-o--image-width-25p`    image width 25%,   body width 75%
 * `css-o--image-width-33_3p`  image width 33.3%, body width 66.6%
 * `css-o--image-width-40p`    image width 40%,   body width 60%
 * `css-o--image-width-50p`    image width 50%,   body width 50%
 * `css-o--image-width-60p`    image width 60%,   body width 40%
 * `css-o--image-width-66_6p`  image width 66.6%, body width 33.3%
 * `css-o--image-width-75p`    image width 75%,   body width 25%
* **Body Width (optional)**
 * `css-o--body-width-25p`   force body width 25%   _(optional)_
 * `css-o--body-width-33_3p` force body width 33.3% _(optional)_
 * `css-o--body-width-40p`   force body width 40%   _(optional)_
 * `css-o--body-width-50p`   force body width 50%   _(optional)_
 * `css-o--body-width-60p`   force body width 60%   _(optional)_
 * `css-o--body-width-66_6p` force body width 66.6% _(optional)_
 * `css-o--body-width-75p`   force body width 75%   _(optional)_
* **Special**
 * `css-o--vertical`         ignores widths and displays image then body
 * `css-o--body-top`         vertically align text to the top instead of center


## The following are distinct classes from above that will overflow a single element:

Structure and classes:

<pre>
css-o--full-browser-width     = overflows out to the entire viewport
css-o--site-container-width   = overflows out to the $site-width
css-o--inner-body-width       = overflows out to the $body-width
</pre>

## The Variables in make-css-overflow:

<pre>
$image-percentage: the percentage that the image takes up
$body-percentage: the percentage that the body takes up.
</pre>
