(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tinyToast"] = factory();
	else
		root["tinyToast"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict'

	var tinyToast

	function createCssStyleSheet () {
	  // code taken from
	  // https://davidwalsh.name/add-rules-stylesheets
	  const style = document.createElement('style')
	  // WebKit hack :(
	  // style.appendChild(document.createTextNode(''))
	  document.head.appendChild(style)
	  return style.sheet
	}

	function insertStyle (className, sheet, style) {
	  // insert a rule for each style property
	  Object.keys(style).forEach((key) => {
	    const value = style[key]
	    sheet.insertRule(`.${className} { ${key}: ${value} }`, 0)
	  })
	}

	function createTinyToastStyle () {
	  const className = 'tinyToast'
	  const style = {
	    color: '#333',
	    position: 'fixed',
	    bottom: '0em',
	    right: '1em',
	    'background-color': '#7FFFD4',
	    'border-radius': '5px',
	    'border-width': '1px',
	    'border-color': '#73E1BC',
	    'border-style': 'solid',
	    padding: '1em 2em',
	    'z-index': 1000
	  }

	  const sheet = createCssStyleSheet()
	  insertStyle(className, sheet, style)
	  return className
	}

	function createDom () {
	  if (tinyToast) {
	    return tinyToast
	  }

	  const className = createTinyToastStyle()

	  tinyToast = document.createElement('h3')
	  tinyToast.classList.add(className)
	  document.body.appendChild(tinyToast)
	  return tinyToast
	}

	function createMessage (text) {
	  createDom().textContent = text
	}

	function closeMessage () {
	  if (tinyToast) {
	    document.body.removeChild(tinyToast)
	    tinyToast = null
	  }
	}

	function maybeDefer (fn, timeoutMs) {
	  if (timeoutMs) {
	    setTimeout(fn, timeoutMs)
	  } else {
	    fn()
	  }
	}

	function hide (timeoutMs) {
	  maybeDefer(closeMessage, timeoutMs)
	}

	var tinyToastApi = {
	  show: function show (text) {
	    createMessage(text)
	    return tinyToastApi
	  },
	  hide: hide
	}

	module.exports = tinyToastApi


/***/ }
/******/ ])
});
;