Picture Element
==============

Picture Polyfill

##The HTML Element
```html
<picture>
    <source srcset="http://retina-images.complexcompulsions.com/img/settings-large.png 500w, http://retina-images.complexcompulsions.com/img/settings-small.png 2x 600w" media="(min-height: 500px)" />
    <source srcset="http://retina-images.complexcompulsions.com/img/settings-large.png 2x"/>
    <img src="http://retina-images.complexcompulsions.com/img/settings-small.png" />
</picture>
```

##Picture Element Demo
 * http://shum.nl/pictureelement

##Browser Support
* IE 6+
* Chrome
* Firefox 3.6+
* Opera
* Safari
* iOS 
* Android 2.3+

##Things u need
* pictureElement.js

##Embedded Polyfills
* https://github.com/weblinc/media-match
