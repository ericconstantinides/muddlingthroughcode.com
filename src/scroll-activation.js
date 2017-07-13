/**
 * Scroll Activation
 *
 * Summary
 *   Scroll Activation makes an element "active" when the top of its container
 *   is scrolled upon
 *
 * Usage
 *   .js-scroll-activation
 *      Add this class to the element you want to be the target of activation
 *
 * Element Options
 *    [data-keep-this-active]
 *      Keeps the item always active once activated; otherwise, the active
 *      will be removed after going back up.
 *    [data-target="TARGET_ID"]
 *      Add to the target element and any element you want to set 'is-active'.
 *      Be sure to use matching TARGET_IDs
 *    [data-activate-viewport-at-top]
 *      Activation matching occurs at the top of the viewport/window instead
 *      of the bottom
 *    [data-activate-this-at-bottom]
 *      Activation matching occurs at the bottom of the element instead of the
 *      top
 *    [data-manual-offset="NUMBER"] -or- [data-manual-offset="QUERY-SELECTOR"]
 *      Either:
 *       option 1. Offset by a NUMBER of pixels. Do not include "px".
 *       option 2. Offset by an element (like a header) using a QUERY-SELECTOR
 *    [data-scroll-over="QUERY-SELECTOR"]
 *      Will gradually fade the opacity of the "scroll-over" element once the
 *      primary element is within the scroll-over's top and bottom
 *
 * Creates
 *   .is-active
 *      This class gets added to both the .js-scroll-activation class and the
 *      [data-target="TARGET_ID"]
 */

;(function () {
  // cache the goods
  let w = window
  let d = document
  let items = [...d.getElementsByClassName('js-scroll-activation')]

  function init () {
    if (items.length) {
      items.forEach(item => {
        // cache all the constant variables:
        item.activationTargets = [...(d.querySelectorAll('[data-target=' + item.getAttribute('data-target') + ']'))]
        item.hasViewportActivatingAtTop = !!item.hasAttribute('data-activate-viewport-at-top')
        item.isActivatingAtBottom = !!item.hasAttribute('data-activate-this-at-bottom')
        item.isKeepingActive = !!item.hasAttribute('data-keep-this-active')

        // get the manual offset or if necessary, prepare the offsetElement
        item.manualOffset = 0
        if (item.hasAttribute('data-manual-offset')) {
          let offset = item.getAttribute('data-manual-offset')
          if (isNaN(offset)) {
            let offsetEl = d.querySelector(offset)
            if (offsetEl) { item.offsetEl = offsetEl } else { item.manualOffset = Number(offset) }
          }
        }
        if (item.hasAttribute('data-scroll-over')) {
          let scrollOverItem = d.querySelector(item.getAttribute('data-scroll-over'))
          if (scrollOverItem) item.scrollOverItem = scrollOverItem
        }
      })

      // wait half a second for other page items to finish
      w.setTimeout(() => checkScrollState(items), 500)

      // add the scroll listener
      d.addEventListener('scroll', () => checkScrollState(items))
    }
  }

  // perform as few hits to the DOM as necessary
  function changeState (direction, callee) {
    if (callee && this.isSameNode(callee)) return
    if (direction === 'activate') {
      if (!this.isActive) {
        this.classList.add('is-active')
        this.isActive = true
      }
    } else {
      if (this.isActive) {
        this.classList.remove('is-active')
        this.isActive = false
      }
    }
    if (this.activationTargets && this.activationTargets.length) {
      this.activationTargets.forEach(target => changeState.call(target, direction, this))
    }
  }

  // cycles through the scroll state of items and ajusts if necessary
  function checkScrollState (items) {
    items.forEach((item) => {
      // don't bother running if it's already active and keep-active is set:
      if (!item.isKeepingActive || !item.classList.contains('is-active')) {
        // get the items current top position:
        item.currentPxFromTop = item.getBoundingClientRect().top

        // get the height of the offsetEl
        if (typeof item.offsetEl !== 'undefined') { item.manualOffset = item.offsetEl.offsetHeight }
        if (item.isActivatingAtBottom) {
          item.offset = item.manualOffset - item.offsetHeight
        } else {
          item.offset = item.manualOffset
        }

        // is executing at the top of the viewport:
        if (item.hasViewportActivatingAtTop) {
          if (item.currentPxFromTop <= item.offset) {
            changeState.call(item, 'activate')
          } else {
            changeState.call(item, 'deactivate')
          }
        } else { // is executing at the bottom of the viewport:
          // take the items pixels from top, minus the height of the viewport, minus any manual Offset:
          if (item.currentPxFromTop - item.offset < w.innerHeight) {
            changeState.call(item, 'activate')
          } else {
            changeState.call(item, 'deactivate')
          }
        }

        if (item.scrollOverItem) {
          item.scrollOverItem.currentPxFromTop =
            item.scrollOverItem.getBoundingClientRect().top
          item.scrollOverItem.currentPxFromBottom =
            item.scrollOverItem.currentPxFromTop + item.scrollOverItem.offsetHeight
          // the decimal values are to not start or finish unless we're in the zone a little bit extra
          if (item.currentPxFromTop < item.scrollOverItem.currentPxFromBottom - item.scrollOverItem.offsetHeight * 0.1 &&
            item.currentPxFromTop > item.scrollOverItem.currentPxFromTop) {
            // we're in the middle zone, so we have to figure out how far we are
            // so we could either do it from the bottom or the top
            let diffFromTop = item.currentPxFromTop - item.scrollOverItem.currentPxFromTop -
              item.scrollOverItem.offsetHeight * 0.15
            let ratioFromTop = diffFromTop / (item.scrollOverItem.offsetHeight - item.scrollOverItem.offsetHeight * 0.15)
            item.scrollOverItem.style.opacity = ratioFromTop
            // so now we have ratioFromTop
          } else {
            item.scrollOverItem.style.opacity = 1
          }
        }
      }
    })
  }

  init(items)
})()
