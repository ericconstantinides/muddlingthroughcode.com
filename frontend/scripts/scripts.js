//------------------------------------------------------------------------------
//
//  Scroll Activation
//
//  Summary
//    Scroll Activation makes a section "active" when it's entire container is scrolled upon
//
//  Usage
//    .js-scroll-activation
//       Add this class to the container you'd like to make active on scrolling.
//
//  Optional
//    .js-scroll-activation--keep-active
//       Keeps the section always active once activated; otherwise, the active
//       will be removed after going back up.
//     [data-target="TARGET_ID]
//       Add to the target element and any element you'd like to set 'active'
//     [data-page-position="top"]
//       Activates js-page-position on the top of the container instead of the bottom
//
//  Creates
//    .is-active
//       This class gets added to both the .js-scroll-activation class and the
//       [data-target="TARGET_ID]
//
//------------------------------------------------------------------------------
;(function() {
  function currentScrollPos() {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }
  var scrollActivation = function(items) {
    ;[...items].forEach((item) => {
      if (!(item.classList.contains('js-scroll-activation--stop'))) {
        // scrollActivationTop: where the element starts on the entire page in px.
        var itemTopPos = item.getBoundingClientRect().top
        var scrollOffset = 0
        if (item.getAttribute('data-scroll-offset')) {
          scrollOffset = Number(item.getAttribute('data-scroll-offset')) // force it to be a number
        }

        if (item.getAttribute('page-position') === 'top') {
          var windowOffset = 0
        } else {
          var windowOffset = w.innerHeight
        }
        if (!(item.classList.contains('js-scroll-activation--keep-active')
              && item.classList.contains('is-active'))) {
          var targets = document.querySelectorAll('[data-target=' + item.getAttribute('data-target') + ']')

          if (item.getAttribute('data-page-position') === 'top') {
            if ( itemTopPos <= scrollOffset ) {
              item.classList.add('is-active')
              if (targets) targets.forEach(target => target.classList.add('is-active'))
            } else {
              item.classList.remove('is-active')
              if (targets) targets.forEach(target => target.classList.remove('is-active'))
            }

          } else {
            if ( currentScrollPos() > (itemTopPos - windowOffset - scrollOffset) ) {
              item.classList.add('is-active')
              if (targets) targets.forEach(target => target.classList.add('is-active'))
            } else {
              item.classList.remove('is-active')
              if (targets) targets.forEach(target => target.classList.remove('is-active'))
            }
          }
        }
      }
    })
  }

  function init() {
    if (items.length) {
      window.setTimeout(() => scrollActivation(items), 500)
      document.addEventListener('scroll', ( () => scrollActivation(items)))
    }
  }

  var w = window
  var items = document.getElementsByClassName('js-scroll-activation')
  init(items)
})()