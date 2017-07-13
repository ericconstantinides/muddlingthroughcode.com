# Optimizing Images

For years I've been annoyed at websites having big beautiful PNGs taking monumental amount of time to load. Over the years, I've created this method to vastly cut down the size of PNGs while both retaining quality _and_ maintaining alpha transparency.

These instructions show how to optimize PNGs for display on the web.

## Setup
1. These instructions are created for Mac users. Windows optimizations will be similar, but with different programs
1. Download and install the following 2 open-source programs:
 * **ImageAlpha:** <https://pngmini.com/>
 * **ImageOptim:** <https://imageoptim.com/mac>

{{teaserbreak}}

## Instructions
1. In **PhotoShop** or other image editing software, load the image you'd' to optimize.
 1. Remove any background so you have a transparent image
 1. Trim the image so there is absolutely no padding between the image side and the actual image
 1. **Save for Web** `SHIFT-OPTION-COMMAND-S` the image:
   1. Save as a **PNG-24 transparent PNG**. DO NOT save it as a 256 color, 8-bit PNG.
1. After saving, open the image in **ImageAlpha**:
 1. On the left hand side of ImageAlpha, you'll see the following areas:
   1. **Media Cut (pngquant)** Leave this setting alone
   1. **Colors** This is the setting to change. Only change with the slider and not by finite numbers (ie, stay at 2,4,8,16,32,64,128,256 colors). Do not go above 256 colors as that defeats the purpose of optimization.
   1. **Options**
     * **Dithered** Keep checked. Only uncheck if there is an unintentional gradient you'd like to remove
     * **IE6-friendly** alpha_ Always keep _unchecked_. Nobody uses IE6 anymore.
   1. **Backgrounds** Used to test how the PNG will look on different backgrounds. The green usually work best but depends on the image.
 1. On the bottom you'll see the following areas:
   1. **Image Size** Shows your image optimization success
   1. **Smooth scaling** Always keep checked
   1. **zoom slider** Move to ½x on Retina systems to see the image Retinafied
 1. To optimize image:
   1. Choose a contrasting _background_ to fully see the outlines
   1. Move the **Colors** slider as far left as possible without a noticeable loss in quality
     * Take special note on how the image outlines look against the background
     * More complex, non-gradient PNGs can look good down to 16 colors
     * Very simple non-gradient PNGs can look good down to 4 colors
     * Gradient PNGs may have to go as high as 128 colors and sometimes (rarely) 256 colors
 1. When satisfied, save the image:
   1. `File` → `Save as` -or- `[SHIFT-COMMAND-S]`
   1. Name it the same or overwrite the original file (I usually overwrite it)
   1. Check **Optimize with ImageOptim**
1. **ImageOptim** will now optimize the image
1. Celebrate!

## Try it yourself!

Practice on the **logo-monkey-with-a-banana-before.png** and match it to the **logo-monkey-with-a-banana-after.png**

1. Monkey is reduced and trimmed with **PhotoShop**.
1. Monkey is optimized in **ImageAlpha** at 16 colors (8 colors show aberrations on the monkey's outline)
1. After optimization, Monkey is **95% smaller** with virtually no loss in quality

<div class="breakout--auto" style="display:flex;justify-content:space-around;align-items:flex-end;">
  <figure class="u-ta-c">
    <h3>Before</h3>
   <img width="200px" src="/images/logo-monkey-with-a-banana-before.png?text">
   <p class="u-d-i text-small">70kb(!) before optimization</p>
  </figure>
  <figure class="u-ta-c">
   <h3>After</h3>
   <img width="200px" src="/images/logo-monkey-with-a-banana-after.png">
   <p class="u-d-i text-small">5kb(!) after optimization</p>
  </figure>
</div>