requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    }
  },
  baseUrl:"./",
  paths: {
    'jquery'           : 'js/lib/jquery',
    'jquery-mobile'    : 'js/lib/jquery.mobile.min',
    'underscore'       : 'js/lib/underscore-amd',
    'three'            : 'js/lib/three.min',
    'PointerLockControls' : 'js/lib/PointerLockControls',
    'Post'             : 'js/post',
    'physijs'          : 'js/lib/physi',
    'App'	             : 'js/script'
  }
});

require(['App']);
