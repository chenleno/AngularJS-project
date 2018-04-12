/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "admin/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 102);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxY2Q0MTBmYi00MDZhLTQ3NjctOWVjYS01NDQxZDI3N2YzZmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTA0RDdBODE0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTA0RDdBODA0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MmYxYjVmNS1iZTNiLTQxYjktODUxOC1kOGNmMWE4NjhjYjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MWNkNDEwZmItNDA2YS00NzY3LTllY2EtNTQ0MWQyNzdmM2ZlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EL6RkwAAAcBJREFUeNpi/P//PwM9ACPIon/3dwT/fnp88d/3dzn///1FHYOZ2RiYBVW+s8pYxjApuK8DW/TzSP03kCVsii4Mv5+fYfj39RUDp148AxO3OFjT90sLgWIvcYjFAcUkoGKLgGIvGDi0Ixn+//zI8Ov+HrBl7DYNXEwgBRBLXBlYRHUYWMUNwJp+v7wIdx2ruD4esUtIYnpg+s+b62CzQA7/+/EhJ0gMbBEouIA2gxUxi2iBvf33zTUGWDCSK8YsoMjw//dXBrhF4DBlYUeErYgmWOFfoMuIE7uGJKYFF2Nk5Yb7lglbRLKKQYPl1UXixLAEH7IYPNV93RBG0zTOHbCKEWwRw8sztM1M4iaMTAx0AoPToh/XVzP8+/6W9hb9/XCf4fvF+cAcvxuYP76RZBELyU77/4/h94vzDH9eX2VglTZnYJU0BTqXhXZxBMqUvx4dZvh2YQ64yKF5Yvj/8xPDz9ubGX492EfloEOvDtj5GNjk7BlYgMURTSwClY2sUqA4MiEqjki3CJjHQVUEq6wN0DJO2qQ6ULHPpuDEwMQpTF5VPlrWUWLRcxra8QLZohSYAJXBUyBORiQGOgCAAAMAAbfb3qXfPSQAAAAASUVORK5CYII="

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "98a0b71bfb1840bdf2c42f2e6f00442f.png";

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDlCNjgwNTZCNDc3MTFFN0FCNDZCMEI0REE0MUIzQTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDlCNjgwNTdCNDc3MTFFN0FCNDZCMEI0REE0MUIzQTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowOUI2ODA1NEI0NzcxMUU3QUI0NkIwQjREQTQxQjNBMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowOUI2ODA1NUI0NzcxMUU3QUI0NkIwQjREQTQxQjNBMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuDpuWAAAAZkSURBVHja7F1rbBRVFD6zszOlQKm29EHZYsEnAoUqIA81hYi0SggQTFCj/5QQSfmhWIPRmCZqiBqjGBOCaEMkghJ5qC31gTViVAR5FDCIIFogIE+hPHZ3dsdzb6d26E7bXdhHd/f7kq8z9zG7s/ebc849t7M7immaBPQcuDAEEAToAm6nysVvLe32wCqlppI3y5kDUv6qzS+V2+A/u8ZlVh35ubv+4YyfQPWCuVG1kLQQowMaLr09cETcLSRMSDH4ion7qPCgyK2SVURa6eOkFoyU5cDxneTftYLM80cpmufmXVXZtpvNrOP3n8Cv3YwYYoOSNZAyprxOqmc8kdZbUuyLOtEWk8HyTBQbD3MTi5IHQWzQSh8jResTKhTXibZYQJ+2nFz9h4rdm5ifsSh9IYiFNjclYPxRz/7K195WWBYbq9SzSJ+5mpTrSkTxLuZ6FkWHIHYEDTL2ribjQEN8XGVmLmVMX0lK73xRnMysZVHUtBdEBHC5bd7MMcNDxu8bpDiy7tj22IrCFqLP/EhaDONh5pK0F8Tf9CGZ/gtk7K8jtWgMKX0KyDi0SdaJtpjnJrm3yZhC7kxRnMdW8kJaC2KeO0zejQsoeGofuQpKWZTRZOz5mLxfLZRtcUkYedalV7zLJiM9Vg2LMi+tY4h58YR0G67sElIHjJZl83x88yJ1yP2kTXpVODJRXMKizE7roO4q4MRZUUjp5+FAm5eQc3APf5S0Cc9JfZgrq5SayekrSH77SoZwW4mCe/R8co96QqYrzE9ZlDHxXjrpGfmItfAnxWG3RSIniRFsSyhdXCClbUssW+h4qx9LGwtRMnOkq2pPFnkwVD2pL7CkthC7u2pVRCdX3jAKRjkPyZgTmdW1LX4SzUivGKLmh66Ei9lWUl9kyT3DGhkqSBEESRzEsntH6H0hSKIQOPRtaN3BLxHUEwX/zlqZIasl5ZZAjeRvWglBEoagQf7tyyRTBbgNCIIAEASCABAkReBOhQ+RMXstuYrGtk++jm4h75qZsJAeA0WBhSQSyWoNiCGwEMSN9LWQJI4bKWEhqRQ3EENgIYgnyENgIYgnsBAEdQCCOCGcO0scvn8IQWJ10rb7eTvt43DPFgSJ1Uyk7Mmo9IEgUYI6eAq5x1R1Lga3iT6Y9sYR2vhqdktlZOxYRsHjOyw3NUpaRrKKkfR5iPg6mSBmWQAEgSAABAEgCAQBIAgEASAIBAEgCAQBIAgEwRBAEACCQBDgKtHj/2MYPPYbBY/sdGxT+hWSenM5mS0nKbDva3LfOUfWB/Y3knnuWEhf1w1jSdF7w0JiAWPbmxQ42Cj3zZYT5P/h6fa2vesocPinK/qLvt7aSRQ8/Tcs5JqumMKhkleIsftzudUmPdvpcapn3P8W0wZfYz8yfnmf9KkvwUKi5sL4Cvdvmkv69NqI3Y+r/y1kXj4LlxUtmL6L5FvzEGmTl4ZYTVhiHtlKSvYguKxowVe/iANzJbmHT+u2b0gMObCRreMUZcz6AIJEA/4f3yPyniWt8pWrOl67t/qqrAqCOF3tf22lQNMy0md/EnbccArqSAyjETc4x/A3PMUzqsXkyhlEqY4ebyG+umdaheFEz9i2KtQSbr0PgsQT6o0V/Leiyz5K3zzSJr7R/qFun0FKVgEEickJhhkH7P3EckqyAouLEASAIBAEgCAQBIAgaQDHPOSRWQ90f+TaGoxeNwhrHGEhcFnAtbqsLnA98x5mGYYuLExnfs88Ey1BMqh1ZU88SrScORxWFRHWM4PM3cxGpnhGk3gGnzdSQcTvHy1kzmfmOHUI9upPrssnbc/sA64cn1x7WCi1KH6g5TTzHeZrzJZwY4hQ8cXOxBBoKVtkf1PALkZmHo/P850151hjWx+JhQS7e1Nf4QQ6XfkFRj/KE6rOLORB5suRBCMgbJyxxnaqU6NimmZIZXNzsz2oV9qC+jAE9cg9GHMP8zvmN/agXlxcHPEsSxy4zmKb/7ubeQdzhMUSpoZxl/AzDzGbLP7K3GwF8pjkIeKFN1i0v8Zg5hCmx6KQvog5yCpnp8iA/8s8zBR3bB8VzsQqCx5k/sk04pkYOkGcwH6LXeUzORZzHfaFYFnMTGtfPBRd/KxoL6uOrHLHh6U71fmYF7qou8S8bJV91iCLuvPWvrjoTlnbjvveWCvuGEOAHjb1AhKH/wQYAPblqDfh7svlAAAAAElFTkSuQmCC"

/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxY2Q0MTBmYi00MDZhLTQ3NjctOWVjYS01NDQxZDI3N2YzZmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTBBNzdDQzU0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTBBNzdDQzQ0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MmYxYjVmNS1iZTNiLTQxYjktODUxOC1kOGNmMWE4NjhjYjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MWNkNDEwZmItNDA2YS00NzY3LTllY2EtNTQ0MWQyNzdmM2ZlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+78W8bgAAALVJREFUeNpi/P//PwM1ARMDlcGogZQDFmyC3ydJLwdSbUB8GYc+IyCu5Mx7GkqsCycC8Tog1sVh2EogbifFyyeAOBpqqD6aYauAOByIzxHtZSg4BTV0DRCHQNWCXAby5nmSwhDN0EggXgvl4zWM2Fj+j0T/JyuWkYAxkjeZod7H60omAoatQDLgDDQyQJFiSKqBMJeFobnmLBBHAPFqaIwTbWA5Hq+dhVpUiU0j42h5SDEACDAAXvQrGp3sIRgAAAAASUVORK5CYII="

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxY2Q0MTBmYi00MDZhLTQ3NjctOWVjYS01NDQxZDI3N2YzZmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTAzRjZENkI0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTAzRjZENkE0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MmYxYjVmNS1iZTNiLTQxYjktODUxOC1kOGNmMWE4NjhjYjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MWNkNDEwZmItNDA2YS00NzY3LTllY2EtNTQ0MWQyNzdmM2ZlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+U0Mo/AAAAKFJREFUeNpi/P//PwM9ABMDnQDdLGIBEefv/0sAUn1ALEhA/TcgzgLihaRYYqjIBPdRPxGWgAAXEE8GYjlyg06ABD28QDwbiBnpEUduQJxEchyRCXqB+AgQv8IhD8o3H6hhET8Q3yCg5goQh4LU0Tp56wDxYnrlI2N6WcQ4PIugUYtGLRoBFn2goR0fkC0qBOL3NLDkPdRsBsbR5ha5ACDAAMYCG6RMiqBOAAAAAElFTkSuQmCC"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjgzNEJDMDlDNDU0MTFFN0I5QzJDMjA5OUUzNjRDQ0EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjgzNEJDMEFDNDU0MTFFN0I5QzJDMjA5OUUzNjRDQ0EiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCODM0QkMwN0M0NTQxMUU3QjlDMkMyMDk5RTM2NENDQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCODM0QkMwOEM0NTQxMUU3QjlDMkMyMDk5RTM2NENDQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv6cjB0AAACISURBVHjaYvz//z/DYAFMDIMIjDpm1DGjjhl1zKhjBgqwEFJw9ORZqllmbW48cqOpGoinArHIQDuGC4iLgTgLiG9D2WwD5ZhvoGQBxDuAWACIe4D4PBB7UC0BQwG5LTAtIN4OxIzDL2tDASM9HMM42gYedcyoY0YdM+qYUceMOmbUMaQDgAADAPzyEiJKVjP6AAAAAElFTkSuQmCC"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAAAyCAYAAABYpeleAAAKJklEQVR4nO2cfWwUxxnGf7t7d3bAGIRNcMGOXaA4oNapUgXqlDQxX5WTFKgKVEpatUJFpB9qG1siaqQ2jdp/iGpLSdWqlFRFSKEKTtUQgtyCCSlx4zZQSgxyW2oqXTCUr1p8BPDdeXf7x+zuzc3t3fnjDPi8j7Tau92Z2dmd5573nXffOe3Gi7PIE7RhlLXzddEAdw70PLSh+WwR4HtAL/At57tfuQAFhNGQyY8cOvAo8HegFZgD/Mz5/qhzPiBVgWIkZMpEolpgL7AHWKDUWeAc/z0wn1RSQUCqgsBwyaQOvg6UAT9FqM/KHPUfB4455cuc+i6x5PYDjEMMlUyqCulACPgG0AN8F+EXDQURp3wPsMFpRyZVoFLjFLnIlMmkNQB/BV5CKMxIUAZsddppIPCnxj2ykUk1aQYwD3gN2Afcl6c+3Oe09ypQ41xH9acCjAP4kcnPpE0Ffozwi1aNUV++ABx3rlNKYPrGHTQlaKkqQgj4KvA8UHEL+3UO+D6wE7AQQU450BkEPW8NhvWcZTLJRHIVoRNYlLeuDR/vAQ+TJBQERMo31OeZ7XvWZx9y9rIJ0aXtdhIJ5/o3b3MfJhLiwGngINAGHJDO2SR54ksq2WdSfSUj3z0NcMcjAswFvg78EXgLWMgQ44GqA+5WMkiqVoCJi88C7wKP4P/WIgV+sR2ZUAECTAF+h3glllWhZPVRTVzBKVN46VbMntewzu1HK65Em1nvnTOq6tGmzCTR1YJ9+ag4VrsRrbSSwcPPJdtY0orZ2451bn9K23r1Ot9rWtG25DXqmrEvdKfVBdArVmAsXEvirU2juscxQimwDaFQgwiOuJMizdlnJVPBKZNePhezaJoYuHmN4tisOuxr5xnseR3AIxKAFW0nsrYthUzG/GUkOpvS2jaq6r3z5knJb41d9kiil87GvPKBKFfXTOjexmS5yGS0knL08o6UdmO7lo/upvOHRcAyoAMw8XHG5dmcS6SCdMDDS1rRSmYQWrhGqE/sGtaFEwCYp7vQpt6DVlTqKUnR+g606dXY/VGK1osBju/b7J0jMhktMonEkR2Y3S0kOpvQq9cJdZPIplevQy+fm9Yfs7sFs7slpVx48aY7iTx+WIuY6bkESlEnP1MmE6pgYJ7uQq+px7rUi/Gx1Ri1Kwl9Yg0Aek09Wkk5dn8UO9aM2d1CbNdyitZ3pAxupPEVjzxGXbNQGokQRlU9+kc+7pEvcWhL1j6Fl25NEs1RJreuW9/PJN5GPIwQGTeI7IpQRjMnO+EFAyvaBos3YV04gRVtwzy+jdCDP0CbUoF19hh6+TwSB5/BHujz6mglMwgvaRX1L/4DvXoR1qVeAPTS2VhXzyTLFlei19QT2/kY9kAfkcZXcvZJ9o/GiTLNRpDJQvAjJd7kp0wF/YI19MkvY1fVo8+qI3FoC9rddcIpPt1JZNV2rLPdSTMVmQQIv8q6eoZ4+7OEF29i8DBoZXOxe9u9dsMNW9Aik6D4bhjoQyubg3Vuf0bH/K7vnBnS8cGjr/r6aLcRIYTP5Drhnu+kRsALMvNRm3Y/4fpmtOnVWCf2CJM3qw5jXiPalJnY5fMhfh0Q5tCF3R8l0dlEeEkr9pUPsKJt2AvXCBNXVuOZIK24EoD4gZ8QWfkC9rXz2P/7T9Y+3Xxptlc33LAF88xRtKJS7NhVzO4WMductuBOM3P/JelPu064a+a0gjJlGTFwgcGe17H7o5inuzwnO9HZhH3tPOapDuFAVyzwzukVK7Bj19OaSnS1EH7wKRJHdnjH7IE+4u1PYkXbiO/bjF69iERXS1pdFUbtRoqe2It1qVc45Me3Eapbi1G7kciq7WhTa/Jz//nD3xBEUjM6gALzizLBHuhLifcAaNOrKVrfgTF/GeGHmlIcXwC9agnW2WOibFlyNqbf0wCAMft+32uF65sxT+xJhhhil7EunUq9dnElxRvex5jzCHb8hjertAf6SLzTSuRzPyK+bzPmv7aN+J7HCG+QJXlxQpDJD3Z/lNiu5ZgnD5B4pzXN8TU++hnMf+8GQCuajH3llBcbim0XhAo98LxXXiuuJLJalJd9HOvc/qSjHZksrj3QR2znY8Tbn4T4dbTiaRh1zURW7xbq9nYrkcd/jjbNn7C3Cd2IVysZXaAJQ6ai9R1oJTOwzwufSJ6pGVX13mfAG0Rt6lwvpqTf00Do3kbib3xNKMjBZ9DL5xFeuhXAcd6PCYIoCC/dKlSw5tPYV4RKubNGrWQGoQc2oJfPJ/EnQU6zu0Uo1MoXMGo3jtETGRY+BJ4jRwqKduPFWW5KrgGEEW+Oi4C7gFNZ6o5r6BUrfF+JuOZQK65MDRMo33MdHypy1R9t+3nADaAJoUo3nS2GSFdJIF6vmIA9YckUYEjoQaRRnwQGpE0mk+lsvhHwABMXA8BFRC7+QeAvCOK46uNuFj7p1C6Z1JRYt9D75G8VykjwT+BpgpTdsYT8TF2CmAgCJUiaMneznPM2qWTyVSZ54J5ArBp5mpGvjxsJLgK/Rvw6ggUFYw+ZGC5ZZDK5m3tcVaa0d3Nqg26jbyIWFmwAvoTwp8YKcUQi1m+B61JfbNJ/CQHyA9UayebMJVGcVELJZPLgp0xuIZlQHyJW3+4Fvg08lM+7ca73NvAyYpmTe12508EKlfxDfZ7ymLtmTVYm2XdK+3HLPpM8YHKDhrSdAX4IfArxPwPpiTrDxyngl8BRUh081dlTzV1AqPxBJob7zF0yuQolf1eVKaOZkwdSJpMc4DwCPAU0IlYylI7gBvqB3wB/kDqp7jPNHgIi5Q8yIWQHXBYUU9l8xyEbmdxcXzmBXPVd3gQOAV8BVjO0vPFBYDewA7hGOonkTSVUoExjAzVzUrYGprLP6HKESB0U1VcaJJlioJpBC6FYl4FfIF4CfhNYnKXTfwZ+BfSRTiJ1CiqTKVCmsYWfOqljrU6G5HpAupJYzt70uZjccNjZh0iSKgo8iyDTJqBaqh9F+EXvkWpCVSKpttmPTGk3EWDUUGd0uTa5jgfVzLl7lUx+MzzTqR929q5v9S5wGPg88EXEVH8PqaF3PzVSlSlrtNXvZgKMCpkC137k8X32uf64wnW83XV0LmlcAsl7Qzqv5pCrplOeIeQyb0FYYGyhPs9s37M+ez9l0lBye0l1zEOkq5O8HwqZcpEol58UEOrWYFjPWfWZ1MqyMhj4mzqZVLK5k/OD5ciqSiC/+IU6/QxUaRwg27s597Ns/uQlLmpwcZDhmTmVRH5mLSDROEK2uJBLJHcgTVKVxl3q4q5UMEgGOeVkc79gqJ85yzRjC4g0TpAryOg3kLJ6uIRyiaKuXJDbyRQEk9uTrxmQaJxhqMlxmUyf7NNoJBfnqUnnapxK/RyYtALAcDMtZdMnf5ZVym8ZjOpMB7O0AsRI0nblEIIa4Mr0z2K5AmEBiQoAo8kB9yOATLRs5QMSFSDysaAgG6mGUyfAOMf/AUu2nD5jn00jAAAAAElFTkSuQmCC"

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/10/9.
 */
app.controller('PTlistCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$timeout', '$state', 'checkBtnService', function ($scope, staticData, $resource, commonService, $timeout, $state, checkBtnService) {
    //点位状态选项绑定
    $scope.stateGroup = staticData.deviceState;
    //点位类型绑定
    $scope.PTtype = staticData.PTtype;

    $scope.cityList = [];

    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数
    $scope.maxSize = staticData.pageMaxSize;

    //查询点位城市数据
    $scope.queryCity = function () {
        var $com = $resource($scope.app.host + '/api/cinema-point/point/pointLocation?pointType=');
        $com.get(function (res) {
            $scope.cityList = res.message;
        });
    };

    //查询待添加点位角标数值
    $scope.queryTipNum = function () {
        var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&pointName=&pointType=&pageNo=&pageSize=');
        $com.get(function (res) {
            $scope.tipNum = res.total;
        });
    };

    //查询列表
    $scope.query = function (province, city, district, pointName, pointType, state, pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=:state&pageNo=:pageNo&pageSize=:pageSize", {
            province: '@province',
            city: '@city',
            district: '@district',
            pointName: '@pointName',
            pointType: '@pointType',
            state: '@state',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType, state: state, pageNo: pageNo, pageSize: pageSize }, function (res) {
            $scope.countMap = res.countMap;
            $scope.datas = res.pointList.dataList;
            $scope.deviceList = res.pointList.dataList;

            if (res.pointList.pages == 0) {
                res.pointList.pages++;
            }
            $scope.numPages = res.pointList.pages;
            $scope.currentPage = res.pointList.pageNo;
            $scope.totalItems = res.pointList.total + 1;
        });
    };

    $scope.search = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize, e) {
        if (keyword) {
            keyword = keyword.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(selected, selected2, selected3, keyword, type, state, pageNo, pageSize);
            }
        } else {
            $scope.query(selected, selected2, selected3, keyword, type, state, pageNo, pageSize);
        }
    };

    //---初始查询----
    $scope.queryCity();
    $scope.queryTipNum();
    $scope.query('', '', '', '', '', '', 1, $scope.pageSize);

    $scope.c = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize) {
        $scope.selected2 = "";
        $scope.selected3 = "";
        $scope.query(selected, $scope.selected2, $scope.selected3, keyword, type, state, pageNo, pageSize);
    };

    $scope.c2 = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize) {
        $scope.selected3 = "";
        $scope.query(selected, selected2, $scope.selected3, keyword, type, state, pageNo, pageSize);
    };

    $scope.c3 = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize) {
        $scope.query(selected, selected2, selected3, keyword, type, state, pageNo, pageSize);
    };

    //查看详情
    $scope.PTdetail = function (id) {
        commonService.editPT(id);
    };

    //点位编辑
    $scope.editPT = function (id, bool) {

        checkBtnService.check("/api/cinema-point/point/:pointId", 'PUT').then(function () {
            commonService.editPT(id, bool).result.then(function () {

                $scope.query();
            });
        });
    };

    //每隔0.5s进行请求刷新
    $scope.refresh = function (taskId) {

        var $com = $resource($scope.app.host + '/api/cinema-point/point/:taskId/taskstate', { taskId: '@taskId' });

        $com.get({ taskId: taskId }, function (res) {
            if (res.success) {
                if (res.code == 'upload_success') {
                    $scope.onLoading = false;
                    //截图成功，打开截图模态框
                    commonService.showSS(res.data);
                } else {
                    $timeout(function () {
                        $scope.refresh(taskId);
                    }, 500);
                }
            } else {
                $scope.onLoading = false;
                commonService.ctrlError('操作', res.message);
            }
        });

        //测试
        //commonService.showSS()
    };

    //打开查看截图模态框
    $scope.showSS = function (pointId) {
        $scope.onLoading = true;

        //先请求截图接口，终端开始截图
        //var sendObj = {}
        //sendObj.pointId = pointId

        var $com = $resource($scope.app.host + "/api/cinema-point/point/:pointId/screenshot", { pointId: '@pointId' });
        $com.save({ pointId: pointId }, function (res) {

            if (res.success) {
                $scope.refresh(res.data.taskId);
            } else {
                commonService.ctrlError('操作', res.message);
                $scope.onLoading = false;
            }
        });

        //测试
        //$scope.refresh()
    };
    //添加点位
    $scope.addPoint = function () {
        commonService.addPoint();
    };
}]);

//添加点位列表
app.controller('addPTlistCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$timeout', function ($scope, staticData, $resource, commonService, $http, $timeout) {

    //点位类型绑定
    $scope.PTtype = staticData.PTtype;

    $scope.cityList = [];

    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数
    $scope.maxSize = staticData.pageMaxSize;

    //查询添加点位权限
    $scope.checkExamine = function () {

        var $com = $resource($scope.app.host + '/api/cinema-point/point');
        $com.save({}, function (res) {
            if (res.code == 'noPop' && res.access == "notpermission") {
                //没审核权限，只显示状态
                $scope.onlyShowState = true;
            } else if (res.access == "havepermmison") {
                //有审核权限，显示操作项
                $scope.onlyShowState = false;
            }
        });

        //var promise = $http({method: 'put', url: $scope.app.host + '/api/cinema-point/point'})
        //promise.then(function(res){
        //    if(res.data.code == 'noPop' && res.data.access == "notpermission"){
        //        //没审核权限，只显示状态
        //        $scope.onlyShowState = true
        //    }else if(res.data.access == "havepermmison"){
        //        //有审核权限，显示操作项
        //        $scope.onlyShowState = false
        //    }
        //})
    };

    //查询点位城市数据
    $scope.queryCity = function () {
        var $com = $resource($scope.app.host + '/api/cinema-point/point/pointLocation?pointType=');
        $com.get(function (res) {
            $scope.cityList = res.message;
        });
    };
    //查询待添加点位角标数值
    $scope.queryTipNum = function () {
        var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&pointName=&pointType=&pageNo=&pageSize=');
        $com.get(function (res) {
            $scope.tipNum = res.total;
        });
    };

    //查询列表
    $scope.query = function (province, city, district, pointName, pointType, pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/cinema-point/usefulPoint?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&pageNo=:pageNo&pageSize=:pageSize", {
            province: '@province',
            city: '@city',
            district: '@district',
            pointName: '@pointName',
            pointType: '@pointType',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType, pageNo: pageNo, pageSize: pageSize }, function (res) {
            $scope.datas = res.dataList;

            $scope.totalItems = res.total + 1;
            $scope.numPages = res.pages;
            if ($scope.numPages == 0) {
                $scope.numPages++;
            }
            $scope.currentPage = res.pageNo;
        });
    };

    $scope.search = function (selected, selected2, selected3, keyword, type, pageNo, pageSize, e) {
        if (keyword) {
            keyword = keyword.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(selected, selected2, selected3, keyword, type, pageNo, pageSize);
            }
        } else {
            $scope.query(selected, selected2, selected3, keyword, type, pageNo, pageSize);
        }
    };

    //点位添加
    $scope.examine = function (groupId) {

        var sendObj = {
            groupId: groupId
        };
        commonService.ctrlModal("addPT").result.then(function () {

            var $com = $resource($scope.app.host + '/api/cinema-point/point/add/point');
            $com.save({}, sendObj, function (res) {
                res.success ? commonService.ctrlSuccess("操作") : commonService.ctrlError("操作", res.message);
                $scope.query();
                $scope.queryTipNum();
            });
        });
    };

    $scope.c = function (selected, selected2, selected3, keyword, type) {
        $scope.selected2 = "";
        $scope.selected3 = "";
        $scope.query(selected, $scope.selected2, $scope.selected3, keyword, type);
    };

    $scope.c2 = function (selected, selected2, selected3, keyword, type) {
        $scope.selected3 = "";
        $scope.query(selected, selected2, $scope.selected3, keyword, type);
    };

    $scope.c3 = function (selected, selected2, selected3, keyword, type) {
        $scope.query(selected, selected2, selected3, keyword, type);
    };

    //---初始查询----
    $scope.checkExamine();
    $scope.queryCity();
    $scope.query('', '', '', '', '', 1, $scope.pageSize);
    $scope.queryTipNum();
}]);

//添加点位下终端设置主副屏
app.controller('addPTterminalCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', function ($scope, staticData, $resource, commonService, $http, $stateParams) {

    $scope.groupId = $stateParams.id;
    console.log($scope.groupId);
    $scope.datas = {};
    //屏幕绑定
    //$scope.mainScreen = false
    //$scope.otherScreen1 = false
    //$scope.otherScreen2 = false
    //$scope.otherScreen3 = false


    function creatObj() {
        for (var i = 0; i < $scope.datas.length; i++) {
            $scope.selectObj[$scope.datas[i].deviceScreenType] = 'aaaaa';
            if (i > 0) {
                $scope.otherScreen.push($scope.datas[i]);
            }
        }
    }
    //creatObj()

    $scope.queryTipNum = function () {
        var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&pointName=&pointType=&pageNo=&pageSize=');
        $com.get(function (res) {
            $scope.tipNum = res.total;
        });
    };
    $scope.queryTipNum();

    //查询添加点位权限
    $scope.query = function (groupId) {
        var $com = $resource($scope.app.host + "/api/cinema-point/point/:groupId/groupInfo", {
            groupId: '@groupId'
        });
        $com.get({ groupId: groupId }, function (data) {
            $scope.datas = data.message;
            $scope.selectObj = {};
            $scope.otherScreen = [];
            creatObj();
        });
    };
    $scope.query($scope.groupId);

    //设置屏幕
    $scope.setScreen = function (deviceId, num) {
        console.log(num == 2 && $scope.otherScreen1);
        if (num == 1 && $scope.mainScreen || num == 2 && $scope.otherScreen1 || num == 3 && $scope.otherScreen2 || num == 4 && $scope.otherScreen3) {
            commonService.ctrlError('操作', '该屏幕以被设置');
            return;
        }
        var screenData = {
            deviceScreenType: num,
            groupId: $scope.groupId
        };
        var $comUpdate = $resource($scope.app.host + "/api/cinema-point/point/:deviceId/setScreenType", { deviceId: '@deviceId' }, {
            'update': { method: 'PUT' }
        });

        $comUpdate.update({ deviceId: deviceId }, screenData, function (res) {
            if (res.success) {
                commonService.ctrlSuccess('设置');
                $scope.query($scope.groupId);
                //$state.go('app.order.checkSheetList')
            } else {
                //$('.btnSubmit').attr('disabled',false)
                //$scope.errorMsg = res.message
                commonService.ctrlError('设置', res.message);
            }
        });
    };

    //清空屏幕
    $scope.deleteScreenType = function () {
        var groupId = $scope.groupId;
        var $comUpdate = $resource($scope.app.host + "/api/cinema-point/point/:groupId/deleteScreenType", { groupId: '@groupId' }, {
            'update': { method: 'PUT' }
        });
        $comUpdate.update({ groupId: groupId }, {}, function (res) {
            if (res.success) {
                commonService.ctrlSuccess('设置');
                $scope.query($scope.groupId);
                //$state.go('app.order.checkSheetList')
            } else {
                //$('.btnSubmit').attr('disabled',false)
                //$scope.errorMsg = res.message
                commonService.ctrlError('设置', res.message);
            }
        });
    };
    //---测试数据---
    //
    //$scope.datas = [
    //    {
    //        "deviceId":"5f0137a9e57143dc975bfe932b60bd60",
    //        "deviceNewId": "123243432",
    //        "deviceMac": "AF:23:4A:2B:3C:5A",
    //        "deviceName": "1223",
    //        "deviceProvince": "湖北省",
    //        "deviceCity": "武汉",
    //        "deviceDistrict": "武昌区",
    //        "detailAddress": "武昌火车站",
    //        "isOnline":"Y",
    //        "deviceScreenType":1
    //    },
    //    {
    //        "deviceId":"5f0137a9e57143dc975bfe932b60bd60",
    //        "deviceNewId": "123243432",
    //        "deviceMac": "AF:23:4A:2B:3C:5A",
    //        "deviceName": "1223",
    //        "deviceProvince": "湖北省",
    //        "deviceCity": "武汉",
    //        "deviceDistrict": "武昌区",
    //        "detailAddress": "武昌火车站",
    //        "isOnline":"Y",
    //        "deviceScreenType":2               //1：主屏 2：副屏1 3：副屏2 4：副屏3   0：其它
    //    },
    //    {
    //        "deviceId":"6f0137a9e57c975bfe932b60bd60",
    //        "deviceNewId": "123243432",
    //        "deviceMac": "AF:23:4A:2B:3C:5A",
    //        "deviceName": "1223",
    //        "deviceProvince": "湖北省",
    //        "deviceCity": "武汉",
    //        "deviceDistrict": "武昌区",
    //        "detailAddress": "武昌火车站",
    //        "isOnline":"Y",
    //        "deviceScreenType":3              //1：主屏 2：副屏1 3：副屏2 4：副屏3   0：其它
    //    },
    //    {
    //        "deviceId":"9f0137a9e57143dc975bfe932b",
    //        "deviceNewId": "123243432",
    //        "deviceMac": "AF:23:4A:2B:3C:5A",
    //        "deviceName": "1223",
    //        "deviceProvince": "湖北省",
    //        "deviceCity": "武汉",
    //        "deviceDistrict": "武昌区",
    //        "detailAddress": "武昌火车站",
    //        "isOnline":"Y",
    //        "deviceScreenType":4               //1：主屏 2：副屏1 3：副屏2 4：副屏3   0：其它
    //    }
    //]

}]);

//查看点位截图控制器
app.controller('ShowSSCtrl', ['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'info', 'formatDateService', 'staticData', '$q', function ($scope, $modalInstance, $resource, $state, commonService, info, formatDateService, staticData, $q) {

    var host = staticData.hostUrl;
    var picHost = staticData.picHost;
    var deviceData = info.data;

    //$scope.deviceName = deviceData.deviceName
    //$scope.deviceId = deviceData.deviceId
    //$scope.time = formatDateService.getNowFormatDate()


    //---测试---

    //deviceData =  [
    //    {"md5": "589d36ea057a4b82a5244f31200f65e6","screenType":1},
    //    {"md5": "589d36ea057a4b82a5244f31200f65e6","screenType":2}
    //    ]

    //---测试结束---

    $scope.queryImg = function (md5) {

        var $com = $resource(host + '/api/background/mps-upload/file/' + md5);
        var defer = $q.defer();
        $com.get(function (res) {

            if (res.success) {
                $scope.path = picHost + res.data.path;
            } else {
                commonService.ctrlError('操作', res.message);
            }

            defer.resolve(res);
        });
        return defer.promise;
    };

    //获取原图地址

    angular.forEach(deviceData, function (item, index) {
        var res = 'imgSrc' + index;

        $scope.queryImg(item.md5).then(function () {
            $scope[res] = $scope.path;
        });
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//点位播放列表
app.controller('playListCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', 'adService', function ($scope, staticData, $resource, commonService, $http, $stateParams, adService) {

    $scope.statId = $stateParams.id;
    $scope.name = $stateParams.name;
    console.log($scope.statId);
    $scope.pointType = false;
    $scope.datas = {};
    //屏幕绑定
    //$scope.mainScreen = false
    //$scope.otherScreen1 = false
    //$scope.otherScreen2 = false
    //$scope.otherScreen3 = false

    //分页每页条目数
    $scope.pageSize = 20;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;
    //时间插件
    $scope.logSearchCond = staticData.logSearchCond;
    $scope.fromDate = undefined;
    $scope.fromHour = undefined;
    $scope.fromMin = undefined;

    $scope.option1 = {
        locale: 'zh-cn',
        format: 'YYYY-MM-DD',
        showClear: true,
        minDate: '2017-11-01'

    };
    $scope.option2 = {
        locale: 'zh-cn',
        format: 'HH',
        showClear: true
        //minDate: '2017-11-01 00:00'
        //maxDate: new Date()
        //debug: true
    };
    $scope.fromDate = new Date();
    $scope.startHour = new Date();
    $scope.endHour = '2017-11-01 23:00';

    //var datas = {"success":true,"code":null,"message":{"results":[{"timeRange":"00:00:00 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:00:15 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:00:34 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:00:54 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:01:09 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:01:28 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:01:43 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:02:02 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:02:22 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:02:37 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:02:56 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:03:11 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:03:30 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:03:50 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:04:05 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:04:24 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:04:39 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:04:58 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:05:18 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:05:33 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"}],"pageNo":1,"pageSize":20,"total":3441,"pages":173},"data":null}
    //查询
    $scope.query = function (pointId, beginTime, endTime, pageNo, pageSize) {
        var $com = $resource($scope.app.host + '/api/cinema-point/point/:pointId/playList?beginTime=:beginTime&endTime=:endTime&pageNo=:pageNo&pageSize=:pageSize', {
            pointId: '@pointId', beginTime: '@beginTime', endTime: '@endTime', pageNo: '@pageNo', pageSize: '@pageSize'
        });
        $com.get({ pointId: pointId, beginTime: beginTime, endTime: endTime, pageNo: pageNo, pageSize: pageSize }, function (res) {
            if (res.success) {
                $scope.datas = res.message.results;
                $scope.totalItems = res.message.total;
                $scope.numPages = res.message.pages;
                $scope.currentPage = res.message.pageNo;
                if ($scope.datas.length > 0) {
                    if ($scope.datas[0].materialName2 != null) {
                        $scope.pointType = true;
                    }
                }
                //console.log( $scope.datas)

                //$scope.totalItems = res.total;
                //$scope.numPages = res.pages;
                //$scope.currentPage = res.pageNo;
            }
        });
    };
    //$scope.query($scope.statId , ' ' , ' ' , 1 , 20)
    //条件搜索e
    $scope.search = function (fromDate, startHour, endHour, pageNo, pageSize) {
        if (fromDate) {
            var fromDate = $scope.fromDate._d;
            //console.log($scope.fromDate._d)
            if (!fromDate) {
                return;
            }
            var fromDateTrans = adService.formatDate(fromDate);
        }
        if (startHour) {
            var startHour = $scope.startHour._d;
            //console.log($scope.startHour._d)
            var startHourTrans = adService.formatHourTime(startHour);
        }
        if (endHour) {
            var endHour = $scope.endHour._d;
            var endHourTrans = adService.formatHourTime(endHour);
        }

        if (endHourTrans < startHourTrans) {
            //alert(0)
            commonService.ctrlError('结束时间不得早于开始时间');
        } else {
            //console.log(fromDateTrans + ' ' + startHourTrans)
            //console.log(fromDateTrans + ' ' + endHourTrans)
            var startTime = fromDateTrans + ' ' + startHourTrans;
            var endTime = fromDateTrans + ' ' + endHourTrans;
            $scope.query($scope.statId, startTime, endTime, pageNo, pageSize);
        }
    };

    $scope.return = function () {
        history.back();
    };
}]);

//点位播放列表
app.controller('wifiProbeList', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', 'adService', '$timeout', function ($scope, staticData, $resource, commonService, $http, $stateParams, adService, $timeout) {

    $scope.pointId = $stateParams.id;
    $scope.name = $stateParams.name;
    $scope.pageSize = 20;
    //console.log($scope.pointId)
    $scope.datas = {};
    //屏幕绑定
    //$scope.mainScreen = false
    //$scope.otherScreen1 = false
    //$scope.otherScreen2 = false
    //$scope.otherScreen3 = false

    //时间插件
    $scope.logSearchCond = staticData.logSearchCond;
    $scope.fromDate = undefined;

    $scope.option1 = {
        locale: 'zh-cn',
        format: 'YYYY-MM-DD',
        showClear: true,
        minDate: '2017-11-01'

    };

    $scope.yesterday = new Date();
    $scope.fromDate = new Date();
    $scope.yesterday.setTime($scope.yesterday.getTime() - 24 * 60 * 60 * 1000);
    //$scope.fromDate = new Date()
    //$scope.yesterday.setTime($scope.yesterday.getTime());

    $scope.yesterday = adService.formatDate($scope.yesterday);
    //console.log($scope.yesterday)

    //下载
    //$scope.download = function(type){
    //    var downloadAddress = '/api/cinema-point/point/'+$scope.pointId+'/exportExcel?type='+type;
    //    window.location=downloadAddress;
    //}
    //查询
    $scope.query = function (pointId, date, pageNo, pageSize) {
        var $com = $resource($scope.app.host + '/api/cinema-point/point/:pointId/visitorFlowOfAll?date=:date&pageNo=:pageNo&pageSize=:pageSize', {
            pointId: '@pointId', date: '@date', pageNo: '@pageNo', pageSize: '@pageSize'
        });
        $com.get({ pointId: pointId, date: date, pageNo: pageNo, pageSize: pageSize }, function (res) {
            if (res.success) {
                $scope.datas = res.message.dataList;
                $scope.totalItems = res.message.total;
                $scope.numPages = res.message.pages;
                $scope.currentPage = res.message.pageNo;
            }
        });
    };
    $scope.query($scope.pointId, $scope.yesterday, 1, 20);
    //条件搜索e
    $scope.search = function (fromDate) {
        if (fromDate) {
            var fromDate = $scope.fromDate._d;
            //console.log($scope.fromDate._d)
            var fromDateTrans = adService.formatDate(fromDate);
            //console.log(fromDateTrans)
            //获取在线终端数
            var $getActiveNum = $resource("/api/cinema-point/point/:pointId/visitorFlowByDay?date=:date", { pointId: '@pointId', date: '@date' });
            $getActiveNum.get({
                pointId: $scope.pointId,
                date: fromDateTrans
            }, function (data) {
                if (data.success) {
                    $scope.onlineAllTime = data.message.time;
                    $scope.onlineAllCount = data.message.count;
                    $timeout(function () {
                        initEchart();
                        console.log('123213');
                    }, 30);
                } else {
                    console.log('参数获取失败');
                }
            });
        }
    };

    //下载
    $scope.downLoad = function (pointId, type) {
        var $getActiveNum = $resource("/api/cinema-point/point/:pointId/exportExcel?type=:type", { pointId: '@pointId', type: '@type' });
        $getActiveNum.get({
            pointId: $scope.pointId,
            type: type
        }, function (data) {
            if (data.success) {
                console.log('开始下载');
            } else {
                console.log('参数获取失败');
            }
        });
    };
    function initEchart() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('warnAll'));
        $(window).resize(function () {
            myChart.resize();
        });
        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: [{ left: 50, right: 30 }],
            xAxis: [{
                data: $scope.onlineAllTime,
                //data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],

                boundaryGap: false,
                axisLine: {
                    show: true,
                    onZero: true,
                    lineStyle: {
                        color: '#9ea0ae',
                        width: 1,
                        type: 'solid'
                    }
                }
            }],
            yAxis: [{
                axisLine: {
                    show: true,
                    onZero: true,
                    lineStyle: {
                        color: '#9ea0ae',
                        width: 1,
                        type: 'solid'
                    }
                }
            }],
            series: [{
                name: '人',
                type: 'line',
                //data: [100,300,600,1400,200,89,799,20,300,600,1400,200,89,799,20,300,600,1400,200,89,799,20,2300,5000],
                data: $scope.onlineAllCount,

                itemStyle: {
                    normal: {
                        color: '#eab73d',
                        lineStyle: {
                            color: '#eab73d',
                            width: 3
                        }
                    }
                }
            }]
        };

        myChart.setOption(option);
    }

    // 指定图表的配置项和数据
    //$timeout(function () {
    //    initEchart();
    //    //console.log('123213')
    //}, 30);

    $scope.return = function () {
        history.back();
    };
}]);

app.controller('pointDateCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', '$timeout', function ($scope, staticData, $resource, commonService, $http, $stateParams, $timeout) {
    $scope.pointName = $stateParams.pointName;

    $scope.titleText = '201801';

    // $scope.getData = function (date) {

    // }
    //$scope.getData('201801');

    // $scope.startCalendar = function () {
    $('#calendar').fullCalendar({
        header: {
            left: '',
            center: 'prev,title,next',
            right: ''
        },
        firstDay: 1,
        editable: false,
        timeFormat: 'H:mm',
        axisFormat: 'H:mm',
        titleFormat: 'yyyyMMMM',
        selectable: true,
        selectHelper: true,

        next: function next() {
            alert('next');
        },
        dayClick: function dayClick(date, allDay, jsEvent, view) {
            console.log(date);
            console.log(allDay);
            console.log(jsEvent);
            console.log(view);
        },

        events: function events(start, end, callback) {
            var view = $('#calendar').fullCalendar('getView');
            console.log(view.title);
            var events = [];
            var $com = $resource($scope.app.host + '/api/mps-adschedule/playlist/pointPlayDetail/:pointId/:date/:pointType', {
                pointId: '@pointId', date: '@date', pointType: '@pointType'
            });
            $com.get({ pointId: $stateParams.id, date: view.title, pointType: $stateParams.pointType }, function (res) {
                if (res.success) {
                    $scope.calendarData = res;
                    //$scope.startCalendar();
                    events = $scope.calendarData.message;
                    callback(events);
                }
            });
        },

        eventClick: function eventClick(event, jsEvent, view) {

            var year = event.start.getFullYear(); //获取完整的年份(4位,1970)  
            var month = event.start.getMonth() + 1; //获取月份(0-11,0代表1月,用的时候记得加上1)  
            if (month <= 9) {
                month = "0" + month;
            }
            var date = event.start.getDate(); //获取日(1-31)  
            if (date <= 9) {
                date = "0" + date;
            }
            var dateformat = year + "-" + month + "-" + date;

            console.log(dateformat);

            commonService.showPlayList($stateParams.id, dateformat, event.deviceType, event.resourceIds);

            console.log(event);
            console.log(jsEvent);
            console.log(view);
        }

    });
    // }
    $scope.returnBack = function () {
        history.back();
    };

    // $scope.$watch('titleText',function(newValue,oldValue, scope){
    //     console.log('change');
    //     $scope.getData(newValue);
    // });

    //     var watch = $scope.$watch('name',function(newValue,oldValue, scope){

    //         console.log(newValue);

    //         console.log(oldValue);

    // });
}]);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('advertisementDescCtrl', ['$scope', '$state', '$rootScope', '$http', '$resource', 'commonService', 'checkBtnService', 'showCheckBox', '$stateParams', '$location', function ($scope, $state, $rootScope, $http, $resource, commonService, checkBtnService, showCheckBox, $stateParams, $location) {

    //edit_mode为true，即为正常跳转模式，false为审核模式
    var billId = $stateParams.id;
    $scope.bool = $stateParams.bool;
    $scope.xiaKangBool = $stateParams.bool;
    $scope.adType = true;
    //console.log($stateParams.bool)
    //console.log(edit_mode)
    //查询
    $scope.projectId = $stateParams.projectId;
    $scope.queryTimeList = function () {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/getTimerangeList", {});
        $com.get({}, function (res) {
            $scope.timeObj = res.result;
            //console.log($scope.timeObj)
        });
    };
    $scope.queryTimeList();

    $scope.goDesc = function () {
        // ui-sref="app.order.adPointList({billId:id,bool:true,projectId:projectId,xiaKangBool:xiaKangBool})"
        $state.go('app.order.adPointList', { projectId: $stateParams.projectId, billId: $stateParams.id, bool: true, xiaKangBool: $scope.bool }); //详情带下刊
    };

    //查询列表
    $scope.query = function (billId) {

        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {
            billId: '@billId'
        });

        $com.get({ billId: billId }, function (res) {
            $scope.data = res;
            //$scope.queryPro($scope.data.step1.projectId)
            if ($scope.data.step2.screenType == 1 && $scope.data.step1.pointType != 5) {
                $scope.showType = true;
                var sData = $scope.data.step2.fileInfo;
                for (var i = 0; i < sData.length; i++) {
                    //console.log(sData)
                    switch (sData[i].deviceType) {
                        case 1:
                            $scope.queryPic(1, sData[i].fileId);break;
                        case 2:
                            $scope.queryPic(2, sData[i].fileId);break;
                        case 3:
                            $scope.queryPic(3, sData[i].fileId);break;
                        case 4:
                            $scope.queryPic(4, sData[i].fileId);break;
                        default:
                            break;
                    }
                }
                //$scope.queryPic(1,$scope.data.step2.fileId)
                //$scope.queryPic(2,$scope.data.step2.picture1Id)
                //$scope.queryPic(3,$scope.data.step2.picture2Id)
                //$scope.queryPic(4,$scope.data.step2.picture3Id)
            } else {
                $scope.showType = false;
                //$scope.queryPic(1,$scope.data.step2.fileId)
                //$scope.queryPic(5,$scope.data.step2.pictureId)
                var sData = $scope.data.step2.fileInfo;
                if (sData.length == 3) {
                    $scope.adType = false;
                }
                for (var i = 0; i < sData.length; i++) {
                    switch (sData[i].deviceType) {
                        case 1:
                            $scope.queryPic(1, sData[i].fileId);break;
                        case 2:
                            $scope.queryPic(5, sData[i].fileId);break;
                        case 3:
                            $scope.queryPic(6, sData[i].fileId);break;
                        default:
                            break;
                    }
                }
            }
            if ($scope.data.step3.timerangeIds) {
                $scope.timeList = [];
                for (var i = 0; i < $scope.data.step3.timerangeIds.length; i++) {
                    for (var n = 0; n < $scope.timeObj.length; n++) {
                        if ($scope.timeObj[n].timerangeid == $scope.data.step3.timerangeIds[i]) {
                            $scope.timeList.push($scope.timeObj[n].timerange);
                        }
                    }
                }
                //console.log($scope.timeList)
            }
            if ($scope.data.step3.addedInfo) {
                $scope.videoTimeList = [];
                for (var i = 0; i < $scope.data.step3.addedInfo.length; i++) {
                    for (var n = 0; n < $scope.timeObj.length; n++) {
                        if ($scope.timeObj[n].timerangeid == $scope.data.step3.addedInfo[i].timerangeId) {
                            $scope.videoTimeList.push($scope.timeObj[n].timerange);
                        }
                    }
                }
            }
        });
    };

    $scope.returnBack = function () {
        $state.go('app.order.adOrderList', { deviceId: $stateParams.projectId });
    };

    var playerPre = {};

    $scope.openOtherPlay = function (imgPath, videoPath) {
        $('.video-jsPre0').attr('id', 'a' + parseInt(Math.random() * 100));
        var videoId = $('.video-jsPre0').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        playerPre.src($rootScope.address + videoPath);
        playerPre.poster($scope.posterImg);
        //playBool = true;
    };

    var playerPre1 = {};

    $scope.openOtherPlay1 = function (imgPath, videoPath) {
        $('.video-jsPre1').attr('id', 'b' + parseInt(Math.random() * 100));
        var videoId = $('.video-jsPre1').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre1 = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        playerPre1.src($rootScope.address + videoPath);
        playerPre1.poster($scope.posterImg);
        //playBool = true;
    };

    //$scope.openOtherPlay()

    $scope.queryPic = function (screenNum, fileUid) {
        //console.log(fileUid)
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            fileUid: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {

            if (screenNum == 1) {
                if ($scope.data.step1.billType == 1) {
                    //$('#order-video').fadeIn(200);
                    $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);
                } else {
                    $scope.gameType = true;
                    $scope.gameName = data.message[0].name;
                }
            } else if (screenNum == 3) {
                $scope.screen3Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 2) {
                $scope.screen2Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 4) {
                $scope.screen4Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 5) {
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 6) {
                $scope.openOtherPlay1(data.message[0].picPath, data.message[0].videoPath);
            }
        });
    };
    $scope.query(billId);
    $scope.id = billId;

    //下刊
    $scope.examine = function (billId) {

        checkBtnService.check("/api/cinema-adLaunch/adBill/:billId", 'delete').then(function () {

            commonService.ctrlModal('downOrder').result.then(function () {
                var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", { billId: '@billId' });
                $com.delete({ billId: billId }, {}, function (data) {
                    if (data.success) {
                        commonService.ctrlSuccess('下刊');
                        history.back();
                    }
                });
            });
        });
    };

    //滚动条
    $scope.scrollHeight = function () {
        //console.log($(window).height())
        $('#scroll').css('height', $(window).height() - 230);
    };

    $scope.scrollHeight();
    $(window).resize(function () {
        $('#scroll').css('height', $(window).height() - 230);
    });
}]);
app.controller('examineDescCtrl', ['$scope', '$rootScope', '$http', '$resource', 'commonService', 'checkBtnService', 'showCheckBox', '$stateParams', '$location', '$state', function ($scope, $rootScope, $http, $resource, commonService, checkBtnService, showCheckBox, $stateParams, $location, $state) {

    //edit_mode为true，即为正常跳转模式，false为审核模式
    var billId = $stateParams.id;
    $scope.id = billId;
    //console.log(edit_mode)
    $scope.adType = true;

    $scope.rightMedia = true; //单屏时显示

    //查询
    $scope.queryTimeList = function () {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/getTimerangeList", {});
        $com.get({}, function (res) {
            $scope.timeObj = res.result;
            //console.log($scope.timeObj)
        });
    };
    $scope.queryTimeList();
    //查询项目
    $scope.queryPro = function (projectId) {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adProject/:projectId", {
            projectId: '@projectId'
        });

        $com.get({ projectId: projectId }, function (res) {
            $scope.proData = res;
            if ($scope.proData.projectCosts.length == 2) {
                $scope.cost1 = true;
                $scope.cost2 = true;
            } else if ($scope.proData.projectCosts[0] == 1) {
                $scope.cost1 = true;
                $scope.cost2 = false;
            } else {
                $scope.cost2 = true;
                $scope.cost1 = false;
            }
        });
    };
    $scope.returnBack = function () {
        history.back();
    };

    //查询列表
    $scope.query = function (billId) {

        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {
            billId: '@billId'
        });

        $com.get({ billId: billId }, function (res) {
            if (res.step3.fileDuration != null) {
                res.step3.fileDuration = parseInt(res.step3.fileDuration);
            }
            $scope.data = res;
            //alert(123)
            $scope.queryPro($scope.data.step1.projectId);

            if ($scope.data.step1.pointType == 4) {
                //单屏隐藏右侧图片
                $scope.rightMedia = false;
            }

            if ($scope.data.step2.screenType == 1 && $scope.data.step1.pointType != 5) {
                $scope.showType = true;
                var sData = $scope.data.step2.fileInfo;
                for (var i = 0; i < sData.length; i++) {
                    //console.log(sData)
                    switch (sData[i].deviceType) {
                        case 1:
                            $scope.queryPic(1, sData[i].fileId);break;
                        case 2:
                            $scope.queryPic(2, sData[i].fileId);break;
                        case 3:
                            $scope.queryPic(3, sData[i].fileId);break;
                        case 4:
                            $scope.queryPic(4, sData[i].fileId);break;
                        default:
                            break;
                    }
                }
                //$scope.queryPic(1,$scope.data.step2.fileId)
                //$scope.queryPic(2,$scope.data.step2.picture1Id)
                //$scope.queryPic(3,$scope.data.step2.picture2Id)
                //$scope.queryPic(4,$scope.data.step2.picture3Id)
            } else {
                $scope.showType = false;
                //$scope.queryPic(1,$scope.data.step2.fileId)
                //$scope.queryPic(5,$scope.data.step2.pictureId)
                var sData = $scope.data.step2.fileInfo;
                if (sData.length == 3) {
                    $scope.adType = false;
                }
                for (var i = 0; i < sData.length; i++) {
                    switch (sData[i].deviceType) {
                        case 1:
                            $scope.queryPic(1, sData[i].fileId);break;
                        case 2:
                            $scope.queryPic(5, sData[i].fileId);break;
                        case 3:
                            $scope.queryPic(6, sData[i].fileId);break;
                        default:
                            break;
                    }
                }
            }
            if ($scope.data.step3.timerangeIds) {
                $scope.timeList = [];
                for (var i = 0; i < $scope.data.step3.timerangeIds.length; i++) {
                    for (var n = 0; n < $scope.timeObj.length; n++) {
                        if ($scope.timeObj[n].timerangeid == $scope.data.step3.timerangeIds[i]) {
                            $scope.timeList.push($scope.timeObj[n].timerange);
                        }
                    }
                }
                //console.log($scope.timeList)
            }
            if ($scope.data.step3.addedInfo) {
                $scope.videoTimeList = [];
                for (var i = 0; i < $scope.data.step3.addedInfo.length; i++) {
                    for (var n = 0; n < $scope.timeObj.length; n++) {
                        if ($scope.timeObj[n].timerangeid == $scope.data.step3.addedInfo[i].timerangeId) {
                            $scope.videoTimeList.push($scope.timeObj[n].timerange);
                        }
                    }
                }
            }
        });
    };

    var playerPre = {};

    $scope.openOtherPlay = function (imgPath, videoPath) {
        $('.video-jsPre0').attr('id', 'a' + parseInt(Math.random() * 100));
        var videoId = $('.video-jsPre0').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        playerPre.src($rootScope.address + videoPath);
        playerPre.poster($scope.posterImg);
        //playBool = true;
    };

    var playerPre1 = {};

    $scope.openOtherPlay1 = function (imgPath, videoPath) {
        $('.video-jsPre1').attr('id', 'b' + parseInt(Math.random() * 100));
        var videoId = $('.video-jsPre1').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre1 = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        playerPre1.src($rootScope.address + videoPath);
        playerPre1.poster($scope.posterImg);
        //playBool = true;
    };

    //$scope.openOtherPlay()

    $scope.queryPic = function (screenNum, fileUid) {
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {

            if (screenNum == 1) {
                //$scope.screen1 = true;
                if ($scope.data.step1.billType == 1) {
                    //$('#order-video').fadeIn(200);
                    $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);
                } else {
                    $scope.gameType = true;
                    $scope.gameName = data.message[0].name;
                }
                //$scope.data.fileId = fileUid;
            } else if (screenNum == 3) {
                $scope.screen3Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 2) {
                $scope.screen2Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 4) {
                $scope.screen4Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 5) {
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;
            } else if (screenNum == 6) {
                $scope.openOtherPlay1(data.message[0].picPath, data.message[0].videoPath);
            }
        });
    };
    $scope.query(billId);

    //审核
    $scope.examine = function (num) {
        var orderData = {
            billId: billId,
            billStatus: num // 2代表审核不通过，3代表审核通过
        };
        var $comUpdate = $resource($scope.app.host + "/api/cinema-adLaunch/checkAdBillPermmison/check", {}, {
            'update': { method: 'PUT' }
        });

        $comUpdate.update({}, orderData, function (res) {
            if (res.success) {
                commonService.ctrlSuccess('审核');
                $state.go('app.order.checkSheetList');
            } else {
                //$('.btnSubmit').attr('disabled',false)
                //$scope.errorMsg = res.message
                if (res.orderId) {
                    commonService.conflictModal(res);
                } else {
                    commonService.ctrlError('操作', res.message);
                }
            }
        });
    };
    //滚动条
    //$scope.scrollHeight = function () {
    //    //console.log($(window).height())
    //    $('#scroll').css('height', $(window).height() - 230)
    //}
    //
    //$scope.scrollHeight();
    //$(window).resize(function () {
    //    $('#scroll').css('height', $(window).height() - 230)
    //});

    $scope.returnBack = function () {
        history.back();
    };

    //点位冲突的弹窗
    //var aData = {
    //    "suceess":false,  // false 排期冲突
    //    "error" : "xxx", //  该处给出排期错误的原因
    //    "taskId" : "8b7181ff69c044f5b56eac2616836ec3", // 任务UUID
    //    "orderId" : "c1c38fc126314a8e99d6ece3829f79e3", //广告单UUID
    //    "collidePoints" : [
    //        {
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        },{
    //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
    //            "pointName" : "测试分组1" ,//点位名称
    //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
    //            "actualCount" : 5 //实际可播总次数
    //        }
    //    ]
    //}

    //$scope.conflict = function(){
    //    commonService.conflictModal(aData)
    //
    //}
}]);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Administrator on 2018\1\15 0015.
 */
//默认播放列表
app.controller('defaultPlayListCtrl', ['$scope', '$state', 'staticData', '$resource', 'commonService', 'checkBtnService', '$rootScope', function ($scope, $state, staticData, $resource, commonService, checkBtnService, $rootScope) {
    ////分页每页条目数
    //$scope.pageSize = staticData.pageSize;
    ////分页索引显示数
    //
    //$scope.maxSize = staticData.pageMaxSize;

    //点位分类
    $scope.pointType = 1;

    //查询播放列表
    $scope.queryList = function (pointType) {
        $scope.pointType = pointType;
        var $com = $resource($scope.app.host + '/api/mps-adschedule/defaultRes/list?pointType=:pointType', { pointType: '@pointType' });
        $com.get({ pointType: pointType }, function (res) {
            if (res.success) {
                $scope.datas = res.data;
            }
        });
    };
    $scope.queryList($scope.pointType);

    //上移
    $scope.up = function (defaultId, pointType) {
        var $com = $resource($scope.app.host + '/api/mps-adschedule/defaultRes/up');
        $com.save({}, { defaultId: defaultId, pointType: pointType }, function (res) {
            if (res.success) {
                commonService.ctrlSuccess('上移');
                $scope.queryList($scope.pointType);
            } else {
                commonService.ctrlError('上移', res.message);
            }
        });
    };
    //下移
    $scope.down = function (defaultId, pointType) {
        //console.log(defaultId)
        var $com = $resource($scope.app.host + '/api/mps-adschedule/defaultRes/down');
        $com.save({}, { defaultId: defaultId, pointType: pointType }, function (res) {
            if (res.success) {
                commonService.ctrlSuccess('下移');
                $scope.queryList($scope.pointType);
            } else {
                commonService.ctrlError('下移', res.message);
            }
        });
    };
    //删除和更改
    $scope.opt = function (defaultId, optType) {
        if (optType == 0) {
            commonService.ctrlModal("deleteAd").result.then(function () {

                var $com = $resource($scope.app.host + "/api/mps-adschedule/defaultRes/opt");
                $com.save({}, { defaultId: defaultId, optType: optType }, function (res) {
                    if (res.success) {
                        commonService.ctrlSuccess('删除');
                        $scope.queryList($scope.pointType);
                    } else {
                        commonService.ctrlError('删除', res.message);
                    }
                });
            });
        } else {
            var $com = $resource($scope.app.host + "/api/mps-adschedule/defaultRes/opt");
            $com.save({}, { defaultId: defaultId, optType: optType }, function (res) {
                if (res.success) {
                    commonService.ctrlSuccess('设置');
                    $scope.queryList($scope.pointType);
                } else {
                    commonService.ctrlError('设置', res.message);
                }
            });
        }
    };
    //新建素材列表
    $scope.creat = function (pointType, defaultId) {
        if ($scope.pointType != 5) {
            commonService.defaultPlayList(pointType, defaultId).result.then(function () {
                $scope.queryList($scope.pointType);
            });
        } else {
            commonService.defaultPlayListNew(pointType, defaultId).result.then(function () {
                $scope.queryList($scope.pointType);
            });
        }
    };

    $rootScope.$on('defaultPlayList', function (event, args) {
        if (args.bool) {
            $scope.queryList($scope.pointType);
        }
    });

    ////查询待审核数目
    //    $scope.queryTipNum = function () {
    //        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=&pageSize=&billName=&billType=&pointType=&billStatus=1&projectId=');
    //        $com.get(function (res) {
    //            if (res.success == false) {
    //                $scope.tipNum = 0;
    //            } else {
    //                $scope.tipNum = res.total;
    //            }
    //        });
    //    };
    //    $scope.queryTipNum();


    ////获取广告播放统计
    //$scope.getCount = function (projectName, projectNum, projectId) {
    //    $state.go('app.order.adProjectCount', {
    //        projectName: projectName,
    //        projectNum: projectNum,
    //        id: projectId,
    //        isAdInto: false
    //    });
    //};
    //
    ////新建项目
    //$scope.addProject = function () {
    //    checkBtnService.check("/api/cinema-adLaunch/adProject", 'post').then(function () {
    //
    //        commonService.add_project().result.then(function () {
    //            $scope.query();
    //        });
    //    });
    //};
    //
    ////编辑项目
    //$scope.editProject = function (projectId) {
    //
    //    checkBtnService.check("/api/cinema-adLaunch/adProject", 'put').then(function () {
    //        commonService.add_project(projectId).result.then(function () {
    //            $scope.query();
    //        });
    //    });
    //};
    //
    ////查列表
    //$scope.query = function (projectSource, customerCategory, keyword, pageNo, pageSize) {
    //    var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adProject?pageNo=:pageNo&pageSize=:pageSize&keyword=:keyword&projectSource=:projectSource&customerCategory=:customerCategory', { projectSource: '@projectSource', customerCategory: '@customerCategory', keyword: '@keyword', pageNo: '@pageNo', pageSize: '@pageSize' });
    //    $com.get({ projectSource: projectSource, customerCategory: customerCategory, keyword: keyword, pageNo: pageNo, pageSize: pageSize }, function (res) {
    //        $scope.datas = res.dataList;
    //
    //        $scope.totalItems = res.total;
    //        $scope.numPages = res.pages;
    //        $scope.currentPage = res.pageNo;
    //    });
    //};
    //$scope.query('', '', '', 1, $scope.pageSize);
    //
    //$scope.search = function (projectSource, customerCategory, keyword, pageNo, pageSize, e) {
    //    if (keyword) {
    //        keyword = keyword.replace(/&/g, '%26');
    //    }
    //    if (e) {
    //        var keycode = window.event ? e.keyCode : e.which;
    //        if (keycode == 13) {
    //            $scope.query(projectSource, customerCategory, keyword, pageNo, pageSize);
    //        }
    //    } else {
    //        $scope.query(projectSource, customerCategory, keyword, pageNo, pageSize);
    //    }
    //};
    //
    //$scope.show_project_detail = function (projectId) {
    //    commonService.show_project_detail(projectId);
    //};

    //$scope.showAdList = function (deviceId, projectName, projectNum) {
    //    checkBtnService.check("/api/cinema-adLaunch/adBill?", 'get').then(function () {
    //        $state.go('app.order.adOrderList', { deviceId: deviceId, projectName: projectName, projectNum: projectNum });
    //    });
    //};
}]);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/7/19.
 */

//设备模块控制器
app.controller('deviceListCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', '$interval', 'selectService', 'commonService', 'deviceService', 'checkBtnService', 'staticData', function ($scope, $rootScope, $http, $resource, $state, $timeout, $interval, selectService, commonService, deviceService, checkBtnService, staticData) {

    //初始化多选组价
    var SelectedArr = [];
    $scope.deviceSelectedArr = SelectedArr;

    //设备状态选项绑定
    $scope.stateGroup = staticData.deviceState;

    //城市json数据获取
    $http.get('admin/js/cityList.json').success(function (data) {
        $scope.cityGroup = data;
    });

    $scope.query = function (name, province, state, pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/mps-device/mpsDevice?province=:province&deviceName=:name&state=:state&pageNo=:pageNo&pageSize=:pageSize", {
            name: '@name',
            province: '@province',
            state: '@state',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ name: name, province: province, state: state, pageNo: pageNo, pageSize: pageSize }, function (data) {
            $scope.datas = data.results;
            $scope.deviceList = data.results;
        });
    };

    $scope.query();

    //监听按键
    $scope.search = function (name, e, pageNo, pageSize) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(name, pageNo, pageSize);
            }
        } else {
            $scope.query(name, pageNo, pageSize);
        }
    };

    //点击新建按钮触发弹框
    $scope.addProgram = function () {
        checkBtnService.check("/api/mps-materialList/materialList", 'POST').then(function () {
            commonService.addPro();
        });
    };

    //删除操作
    $scope.delete = function (data) {
        //检查删除权限
        //checkBtnService.check("/api/mps-device/mpsDevice",'put').then(function(){
        //获取删除项对象集合
        var sendObj = deviceService.getSelectedDevice(data, $scope.datas);
        if (sendObj.deviceIdList.length == 0) {
            commonService.ctrlError('操作', '请先选择设备');
        } else {
            commonService.ctrlModal("deleteDeviceType").result.then(function () {

                var promise = $http({
                    method: 'put',
                    url: $scope.app.host + '/api/mps-device/mpsDevice',
                    data: sendObj
                });

                promise.then(function (res) {
                    res.data.success ? commonService.ctrlSuccess('删除') : commonService.ctrlError('删除', res.msg);
                    $scope.query();
                    $scope.keyword = '';
                });
            });
        }

        //})
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;

    //设备定时模态框
    $scope.setTime = function (id) {

        //查询接口查看该设备是否已有定时任务
        $scope.querySetTime = function (deviceId) {
            var $com = $resource($scope.app.host + "/api/mps-device/device/timeswitch/:deviceId", {
                deviceId: '@deviceId'
            });

            $com.get({ deviceId: deviceId }, function (data) {
                data.success ? commonService.setTime(id, data.data) : commonService.tipModal('serverErrorType');
            });
        };
        $scope.querySetTime(id);
    };

    //临时接口（开机）
    $scope.deviceOn = function (deviceId) {

        var sendObj = {};
        sendObj.deviceId = deviceId;

        //正常对象
        var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/open/:deviceId", { deviceId: '@deviceId' }, {
            'update': { method: 'PUT' }
        });

        $comUpdate.update({ deviceId: deviceId }, sendObj, function (res) {
            res.success ? commonService.ctrlSuccess('操作', res.message) : commonService.ctrlError('操作');
            $scope.query();
        });
    };

    //临时接口（关机）
    $scope.deviceOff = function (deviceId) {

        var sendObj = {};
        sendObj.deviceId = deviceId;

        //正常对象
        var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/close/:deviceId", { deviceId: '@deviceId' }, {
            'update': { method: 'PUT' }
        });

        $comUpdate.update({ deviceId: deviceId }, sendObj, function (res) {
            res.success ? commonService.ctrlSuccess('操作', res.message) : commonService.ctrlError('操作');
            $scope.query();
        });
    };

    //每隔0.5s进行请求刷新
    $scope.refresh = function (taskId, deviceId, data) {

        var $com = $resource($scope.app.host + '/api/mps-device/device/taskstate/:taskId', { taskId: '@taskId' });

        $com.get({ taskId: taskId }, function (res) {
            if (res.success) {
                if (res.code == 'opened' || res.code == 'closed') {

                    $scope.onLoading = false;
                    res.code == 'opened' ? commonService.ctrlSuccess('开机') : commonService.ctrlSuccess('关机');

                    $scope.query();
                } else if (res.code == 'upload_success') {
                    $scope.onLoading = false;
                    //截图成功，打开截图模态框
                    commonService.showSS(deviceId, res.data.md5, data);
                } else {
                    $timeout(function () {
                        $scope.refresh(taskId, deviceId, data);
                    }, 500);
                }
            } else {
                $scope.onLoading = false;
                commonService.ctrlError('操作', res.message);
                $scope.query();
            }
        });
    };

    // switch模式下的开关机
    //$scope.onOff = function(deviceId , state){
    //
    //    $scope.onLoading = true
    //
    //    var sendObj = {}
    //    sendObj.deviceId = deviceId
    //
    //    if(state == '已关机'){
    //
    //        //正常对象
    //        //var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/open/:deviceId",{deviceId:'@deviceId'},{
    //        //    'update': { method:'PUT' }
    //        //});
    //
    //        //测试对象
    //        var $com = $resource($scope.app.host + "/api/mps-device/device/open/:deviceId",{deviceId:'@deviceId'})
    //        //测试过程
    //
    //        //定时请求定时器
    //        //var timer = $interval(function(){
    //            refresh($com , sendObj)
    //        //},500)
    //
    //    }else if (state == '在线'){
    //
    //        //正常对象
    //        //var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/cloes/:deviceId",{deviceId:'@deviceId'},{
    //        //    'update': { method:'PUT' }
    //        //});
    //
    //        //测试对象
    //        var $com = $resource($scope.app.host + "/api/mps-device/device/close/:deviceId",{deviceId:'@deviceId'})
    //        //测试过程
    //
    //        //定时请求定时器
    //        //var timer = $interval(function(){
    //            refresh($com , sendObj)
    //        //},500)
    //
    //    }
    //}


    //打开查看截图模态框
    $scope.showSS = function (deviceId, data) {
        $scope.onLoading = true;

        //先请求截图接口，终端开始截图
        var sendObj = {};
        sendObj.deviceId = deviceId;

        var $com = $resource($scope.app.host + "/api/mps-device/device/screenshot/:deviceId", { deviceId: '@deviceId' });
        $com.save({}, sendObj, function (res) {
            res.success ? $scope.refresh(res.data.taskId, deviceId, data) : commonService.ctrlError('操作', res.message);
            $scope.query();
        });
    };
}]);

//添加设备控制器
app.controller('addDeviceCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'deviceService', 'checkBtnService', 'staticData', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, deviceService, checkBtnService, staticData) {

    //初始化多选组价
    var SelectedArr = [];
    $scope.deviceSelectedArr = SelectedArr;

    //设备状态选项绑定
    $scope.stateGroup = staticData.deviceState;

    //城市json数据获取
    $http.get('admin/js/cityList.json').success(function (data) {
        $scope.cityGroup = data;
    });

    $scope.query = function (name, city, pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/mps-device/usefulDevice?province=:city&deviceName=:name&pageNo=&pageSize=", {
            name: '@name',
            city: '@city',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ name: name, city: city, pageNo: pageNo, pageSize: pageSize }, function (data) {
            $scope.datas = data.results;
            $scope.deviceList = data.results;
        });
    };

    $scope.query();

    //监听按键
    $scope.search = function (name, e, pageNo, pageSize) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(name, pageNo, pageSize);
            }
        }
    };

    //添加操作
    $scope.addDevice = function (data) {
        //检查删除权限
        //checkBtnService.check("/api/mps-device/mpsDevice",'put').then(function(){
        //获取删除项对象集合
        var sendObj = deviceService.getAddDevice(data, $scope.datas);

        console.log(sendObj);
        if (sendObj.deviceList.length == 0) {
            commonService.ctrlError('操作', '请先选择设备');
        } else {
            commonService.ctrlModal("addDeviceType").result.then(function () {

                var promise = $http({
                    method: 'post',
                    url: $scope.app.host + '/api/mps-device/device',
                    data: sendObj
                });

                promise.then(function (res) {
                    res.data.success ? commonService.ctrlSuccess('添加') : commonService.ctrlError('添加', res.msg);
                    $scope.query();
                });
            });
        }

        //})
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;
}]);

//设备定时模态框控制器
app.controller('setTimeCtrl', ['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'staticData', 'info', 'checkTimeService', 'formatDateService', function ($scope, $modalInstance, $resource, $state, commonService, staticData, info, checkTimeService, formatDateService) {

    var hostUrl = staticData.hostUrl;
    var sendObj = {};
    //已设置时间数据
    var timeSetData = info.data;
    sendObj.deviceId = info.id;

    $scope.deviceId = info.id;
    $scope.data = {};
    $scope.data.startDate = undefined;
    $scope.data.endDate = undefined;
    $scope.options = {
        locale: 'zh-cn',
        format: 'YYYY/MM/DD',
        showClear: true,
        minDate: new Date()

        //编辑模式检查各属性赋值情况
    };if (Boolean(timeSetData)) {
        //检查可选项赋值
        timeSetData.daily ? $scope.data["daily"] = '1' : $scope.data["daily"] = '';
        //日历插件赋值
        $scope.data = timeSetData;
        //时间输入赋值
        $scope.data.openTime = checkTimeService.getModelTime(timeSetData.openTime);
        $scope.data.closeTime = checkTimeService.getModelTime(timeSetData.closeTime);
    } else {
        //必选
        $scope.data["daily"] = '1';
    }

    //提交校验逻辑
    $scope.doSubmit = function (deviceId) {

        //时间输入合法标识符
        var timeComplete = false;
        //时间格式合法标识符
        var timeCheck = false;
        //日期格式合法标识符
        var dateCheck = false;

        if ($scope.data.openTime && $scope.data.closeTime) {
            if ($scope.data.openTime.length == 4 && $scope.data.closeTime.length == 4) {
                timeComplete = true;
                if (!checkTimeService.checkTime($scope.data.openTime) && !checkTimeService.checkTime($scope.data.closeTime)) {
                    timeCheck = true;
                    sendObj.openTime = checkTimeService.getSendTime($scope.data.openTime);
                    sendObj.closeTime = checkTimeService.getSendTime($scope.data.closeTime);
                }
            }
        }

        sendObj.daily = Boolean($scope.data.daily);

        if ($scope.data.startDate && $scope.data.endDate) {

            if (formatDateService.getDate($scope.data.startDate._d) <= formatDateService.getDate($scope.data.endDate._d)) {
                dateCheck = true;
                sendObj.startDate = formatDateService.getDate($scope.data.startDate._d);
                sendObj.endDate = formatDateService.getDate($scope.data.endDate._d);
            }
        }

        //正常流程
        var $comUpdate = $resource(hostUrl + "/api/mps-device/device/timeswitch/:deviceId", { deviceId: '@deviceId' }, {
            'update': { method: 'PUT' }
        });

        //校验输入完整性和合法性并提示
        if (timeComplete) {
            if (timeCheck) {
                if (sendObj.daily) {
                    $comUpdate.update({ deviceId: deviceId }, sendObj, function (res) {
                        res.success ? commonService.ctrlSuccess('保存') : commonService.ctrlError('保存', res.msg);
                        $modalInstance.close();
                    });
                } else {
                    if (dateCheck) {
                        $comUpdate.update({ deviceId: deviceId }, sendObj, function (res) {
                            res.success ? commonService.ctrlSuccess('保存') : commonService.ctrlError('保存', res.msg);
                            $modalInstance.close();
                        });
                    } else {
                        commonService.ctrlError('操作', '请选择正确的日期');
                    }
                }
            } else {
                commonService.ctrlError('操作', '时间格式有误');
            }
        } else {
            commonService.ctrlError('操作', '时间字段未完整填写');
        }

        ////测试流程
        //var $com = $resource(hostUrl + "/api/mps-device/device/timeswitch/:deviceId",{deviceId:'@deviceId'})
        //
        ////校验输入完整性和合法性并提示
        //if(timeComplete){
        //    if(timeCheck){
        //        if( sendObj.daily ){
        //            $com.save({},sendObj,function(res){
        //                res.success ?
        //                    commonService.ctrlSuccess('保存') :
        //                    commonService.ctrlError('保存', res.msg)
        //            })
        //        }else {
        //            if(dateCheck){
        //                $com.save({},sendObj,function(res){
        //                    res.success ?
        //                        commonService.ctrlSuccess('保存') :
        //                        commonService.ctrlError('保存', res.msg)
        //                })
        //            }else {
        //                commonService.ctrlError('操作','请选择正确的日期')
        //            }
        //        }
        //    }else {
        //        commonService.ctrlError('操作','时间格式有误')
        //    }
        //}else {
        //    commonService.ctrlError('操作','时间字段未完整填写')
        //}

        console.log(sendObj);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//查看终端截图控制器
//app.controller('ShowSSCtrl',['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'info','formatDateService','staticData',
//    function($scope, $modalInstance, $resource, $state, commonService , info , formatDateService , staticData){
//
//        var host = staticData.hostUrl
//        var deviceData = info.data
//
//        $scope.deviceName = deviceData.deviceName
//        $scope.deviceId = deviceData.deviceId
//        $scope.time = formatDateService.getNowFormatDate()
//
//        //获取原图地址
//        var $com = $resource(host + '/api/mps-upload/file/' + info.md5)
//        $com.get(function(res){
//            res.success?
//                $scope.imgSrc = host + 'upload' + res.data.path:
//                commonService.ctrlError('操作',res.message)
//        })
//
//        $scope.cancel = function () {
//            $modalInstance.dismiss('cancel');
//        };
//}])
//
//

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/7/4.
 */
/**
 * Created by chenqi1 on 2016/12/26.
 */

//登录验证模块

app.controller('LoginController', ['$scope', '$http', '$state', '$timeout', 'commonService', 'dataAccess', '$modal', '$cookieStore', 'cookieService', function ($scope, $http, $state, $timeout, commonService, dataAccess, $modal, $cookieStore, cookieService) {

    //['$scope','$http','$state' ,'$timeout' , 'commonService' ,'dataAccess','$modal','cookieService',
    //    function($scope,$http,$state ,$timeout , commonService ,dataAccess,$modal,cookieService){
    //初始化记住密码状态
    $scope.rememberPassword = false;

    $scope.login = function () {
        $http.post($scope.app.host + '/api/login', $scope.data).success(function (data) {
            if (data.success) {
                dataAccess.sessionSave('adminName', data.message.userName);
                dataAccess.sessionSave('adminId', data.message.userId);
                $state.go('app.PT.PTlist');
            } else {
                $scope.noRepeat = false;
                $scope.data.password = '';
                $scope.errorMsg = data.message;
                $scope.errorShake = true;
                $timeout(function () {
                    $scope.errorMsg = null;
                    $scope.errorShake = false;
                }, 3000);
            }
        }).error(function (data) {
            $scope.noRepeat = false;
            commonService.ctrlModal('reqErrorType');
        });
    };

    //检查是否为记住密码登录
    $scope.checkLogin = function () {
        var remPwd = $scope.rememberPassword;
        if (remPwd) {
            //如果是记住密码，调用writeCookie方法更新cookie
            cookieService.writeCookie($scope.data);
        } else {
            $cookieStore.remove('name');
            $cookieStore.remove('password');
        }
        //点击登录后禁用登录按钮
        $scope.noRepeat = true;
        $scope.login();
    };

    //找回密码弹窗
    $scope.findPassword = function () {
        commonService.ctrlModal('findPwdType');
    };
}]);

//忘记密码控制器
//app.controller('findPasswordCtrl' ,
//    ['$scope' , '$modalInstance', '$resource','$stateParams','$modal','$state','commonService','app',
//        function($scope , $modalInstance, $resource,$stateParams,$modal,$state,commonService,app){
//
//            $scope.app = app
//            //取消操作关闭模态框
//            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
//            };
//            //查询信息列表
//            $scope.query = function(userId){
//                var $com = $resource($scope.app.host + "/api/iot-user/user");
//                $com.get({userId:userId},function(data){
//                    $scope.datas = data;
//                    console.log(data)
//                })
//            }
//        }])

//登出操作控制器
app.controller('adminCtrl', ['$rootScope', '$scope', '$http', '$state', 'commonService', 'dataAccess', function ($rootScope, $scope, $http, $state, commonService, dataAccess) {

    //用户信息
    $rootScope.adminName = dataAccess.sessionGet('adminName');
    $scope.adminId = dataAccess.sessionGet('adminId');

    $scope.logout = function () {
        commonService.ctrlModal("logOutType").result.then(function () {
            $http.get($scope.app.host + '/api/exit').success(function (data) {
                if (data.success) {
                    dataAccess.sessionClear();
                    $state.go('auth.login');
                } else {
                    commonService.ctrlModal('reqErrorType');
                }
            });
        });
    };
}]);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/6/13.
 */
app.controller('mediaCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'backPathService', 'mediaService', 'commonService', 'FileUploader', 'checkBtnService', 'checkUpdateStateService', 'staticData', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, backPathService, mediaService, commonService, FileUploader, checkBtnService, checkUpdateStateService, staticData) {
    var mediaSelectedArr = [];
    $scope.dirPath = '';
    $scope.mediaSelectedArr = mediaSelectedArr;
    $scope.datas = [];
    $scope.errorNumber = 0;

    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;

    $scope.showSelectBox = false; //初始化不能上传文件


    var fileId = 1;
    //列表页数
    var pageNo = 1;
    //存储路径
    var pathList = {};
    $rootScope.filePath = '';

    $scope.listimg = function (item) {
        var item = item;
        //alert(item)
        if (item == undefined) return;
        var list = item.split('/');
        if (list[0] == 'image') {
            return './admin/img/img.png';
        } else if (list[0] == 'video') {
            return './admin/img/video.png';
        } else {
            return './admin/img/other.png';
        }
    };
    //上传文件关联文件夹
    $scope.fileUploadDir = function (data) {
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?op=create");
        $com.save({}, data, function (res) {
            res.success ? commonService.ctrlSuccess('上传') : commonService.ctrlError('上传', res.message);
            $scope.query($scope.dirPath);
        });
    };

    //初始化上传插件
    var uploader = $scope.uploader = new FileUploader({});

    //支持多文件上传
    uploader.filters.push({
        name: 'uploadBtn',
        fn: function fn(item, options) {
            return this.queue;
        }
    });

    //文件添加结束时
    uploader.onAfterAddingFile = function (fileItem) {
        console.log(fileItem);
        fileItem.url = '/api/mps-upload/upload/' + fileId + '/file';

        fileItem.isReady = true;
        pathList[fileId] = $rootScope.filePath;
        //console.log(pathList);
        fileId++;
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        $('#uploadListBtn').click();
        uploader.uploadAll();
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        $scope.errorNumber++;
        fileItem.progress = 0;
    };
    //文件上传成功回调
    uploader.onSuccessItem = function (item, response, status, headers) {
        if (response.success) {
            var name = response.materialInfo.name;
            var cdata = {
                dir: false,
                //path : pathList[response.id],
                path: $scope.dirPath,
                name: name,
                md5: response.materialInfo.md5,
                size: response.materialInfo.size,
                type: response.type,
                savePath: response.storagePath,
                duration: response.materialInfo.videoLength
            };
            $scope.fileUploadDir(cdata);
        } else {
            $scope.errorNumber++;
            item.progress = 0;
            item.isReady = false;
            item.isUploading = false;
            item.isUploaded = false;
            item.isSuccess = false;
            item.isCancel = false;
            item.isError = true;
        }
    };
    //文件上传完毕事件
    uploader.onCompleteAll = function () {
        //console.log(123)
        if ($scope.errorNumber > 0) {
            $('#panelError').slideDown(1000);
            setTimeout(function () {
                $('#panelError').slideUp(1000);
                $scope.errorNumber = 0;
            }, 3000);
        }
        $scope.query($scope.dirPath);
    };
    //开始全部上传
    // uploader.uploadAll()
    //全部取消
    //uploader.clearQueue()

    //跳转点击
    $scope.clickUp = function () {
        if ($scope.showSelectBox) {
            $("#uploadBtn").click();
        } else {
            commonService.ctrlModal('noPerType');
        }
    };

    //检查是否具有上传权限
    $scope.checkUpdateState = function () {
        checkUpdateStateService.check("/api/mps-upload/upload/:id/file", 'post').then(function () {
            $rootScope.filePath = $scope.dirPath;
            $scope.showSelectBox = true;
            return;
        });
    };

    $scope.checkUpdateState();

    //给右侧的上传列表预留的事件
    $(document).on("click", "#uploadListBtn", function () {
        //$scope.scrollHeight();
        $('#upload').addClass('active');
    });

    //默认查找根目录
    $scope.query = function (path, keyword, pageNo, pageSize) {
        //测试接口
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword&neededCheckFile=", {
            path: '@path',
            keyword: '@keyword',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ path: path, keyword: keyword, pageNo: pageNo, pageSize: pageSize }, function (data) {
            if (data.success == false) {
                commonService.ctrlError('查询', data.message);
            } else {
                $scope.datas = data.dataList;
                $scope.mediaList = data.dataList;
                $scope.dirPath = path.replace(/%26/g, '&');
                $scope.currentPath = backPathService.getCurrentSpace(path.replace(/%26/g, '&'));
                $scope.addDirBool = false;
                $scope.mediaSelectedArr = [];

                $scope.totalItems = data.total;
                $scope.numPages = data.pages;
                $scope.currentPage = data.pageNo;
            }
        });
    };
    //根据关键字查询数据

    $scope.query($scope.dirPath, '', 1, $scope.pageSize);

    $scope.search = function (name, dirBool, keyword, path, pageNo, pageSize, e) {

        //var path2 = path //转义问题
        if (keyword) {
            keyword = keyword.replace(/&/g, '%26');
        }
        if (path) {
            //console.log(path)
            path = path.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(path, keyword, pageNo, pageSize);
            }
        } else {
            if (dirBool) {
                $scope.dirPath = path;
                $scope.query($scope.dirPath, '', pageNo, pageSize);
                //$scope.dirPath = path2
            }
        }
    };

    //查询上一级
    $scope.backSearch = function (data) {
        $scope.dirPath = backPathService.getBackSpace(data);
        $scope.query($scope.dirPath);
        $scope.keyword = '';
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;

    //删除资源
    $scope.delete = function (data, keyword) {

        //检测删除权限
        checkBtnService.check("/api/mps-filemanager/file?op=delete", 'post').then(function () {
            //获取删除项对象集合
            var sendObj = mediaService.getSelectedMedia(data, $scope.datas, $scope.dirPath);
            if (sendObj.fileList.length == 0) {
                commonService.ctrlError('操作', '请先选择文件/文件夹');
            } else {
                commonService.ctrlModal("deleteMediaType").result.then(function () {

                    var $com = $resource($scope.app.host + "/api/mps-filemanager/file?op=delete");

                    $com.save({}, sendObj, function (res) {
                        res.success ? commonService.ctrlSuccess('删除') : commonService.ctrlError('删除', res.message);
                        $scope.mediaSelectedArr = [];
                        $scope.query($scope.dirPath, keyword);
                    });
                });
            }
        });
    };

    //发送新建文件夹请求
    $scope.submitDir = function () {
        var sendObj = {};
        //var newDirPath = $scope.dirPath + '/' + $scope.dirName
        sendObj.path = $scope.dirPath;
        sendObj.name = $scope.dirName;

        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?op=create");
        $com.save({}, sendObj, function (res) {
            res.success ? commonService.ctrlSuccess('新建文件夹') : commonService.ctrlError('新建文件夹', res.message);
            $scope.query($scope.dirPath.replace(/&/g, '%26'));
            $scope.dirName = '新建文件夹';
        });
    };

    //监听按键
    $scope.doAddDir = function (e) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;

            switch (keycode) {
                case 13:
                    $scope.submitDir();
                    break;
                case 27:
                    $scope.addDirBool = false;
                    break;
            }
        } else {
            $scope.submitDir();
        }
    };

    //发送重命名文件夹请求
    $scope.editDir = function (newName, path, dir, keyword) {
        var sendObj = {};
        var editEleScope = angular.element('.editTr').scope();
        sendObj.path = path;
        sendObj.newName = newName;
        sendObj.dir = dir;

        var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-filemanager/file', data: sendObj });

        promise.then(function (res) {
            res.data.success ? commonService.ctrlSuccess('重命名') : commonService.ctrlError('重命名', res.data.message);
            $scope.query($scope.dirPath, keyword);
            editEleScope.editDirBool = false;
        });
    };

    $scope.doRenameDir = function (newName, path, dir, keyword, e) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;

            switch (keycode) {
                case 13:
                    $scope.editDir(newName, path, dir, keyword);
                    break;
                case 27:
                    var editEleScope = angular.element('.editTr').scope();
                    editEleScope.editDirBool = false;
                    break;
            }
        } else {
            $scope.editDir(newName, path, dir, keyword);
        }
    };

    /**
     * 移动文件操作的函数
     */
    $scope.removeFiles = function (data) {
        console.log(data);
        var sendObj = mediaService.getSelectedMedia(data, $scope.datas, $scope.dirPath);
        if (!sendObj.fileList.length) {
            commonService.ctrlError('操作', '未选择文件或文件夹');
            return;
        }
        checkBtnService.check("/api/mps-filemanager/file?op=move", 'post').then(function () {
            //"/api/mps-filemanager/file?op=move"
            commonService.fileManagerModal('移动', sendObj);
        });
    };

    /**
     * 复制文件操作的函数
     */
    $scope.copyFiles = function (data) {
        console.log(data);
        var sendObj = mediaService.getSelectedMedia(data, $scope.datas, $scope.dirPath);
        if (!sendObj.fileList.length) {
            commonService.ctrlError('操作', '未选择文件或文件夹');
            return;
        }
        //"/api/mps-filemanager/file?op=copy"
        checkBtnService.check("/api/mps-filemanager/file?op=copy", 'post').then(function () {
            commonService.fileManagerModal('复制', sendObj);
        });
    };
    //监听复制移动后刷新位置
    $scope.$on('queryMedia', function (event, args) {

        //console.log(args)
        if (args.queryMedia) {
            $scope.query($scope.dirPath.replace(/&/g, '%26'), '', '', '');
        }
        //console.log(args.newSelectList);
        //console.log($scope.datas);
    });

    //播放器
    var player = {};
    //播放标志位
    var playBool = false;
    $scope.imgOnly = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if (videoPath != '') {
            $scope.imgOnly = false;
            $scope.posterImg = $rootScope.address + imgPath;
            player = videojs("my-video", {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg
                //"src":"http://vjs.zencdn.net/v/oceans.mp4",
                //controlBar: {
                //    captionsButton: false,
                //    chaptersButton : false,
                //    liveDisplay:false,
                //    playbackRateMenuButton: false,
                //    subtitlesButton:false
                //}

            });
            player.src($rootScope.address + videoPath);
            player.poster($scope.posterImg);
            playBool = true;
        } else {
            //tupian
            $scope.imgOnly = true;
            $scope.picPath = $rootScope.address + imgPath;
        }
        if (playBool) {
            player.paused();
        }
    };

    //预览
    $scope.openPlay = function (fileUid) {
        //checkBtnService.check("/api/mps-materialList/task/:taskId/preview",'get').then(function(){
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            //if(!data.success){
            //    commonService.ctrlError('预览', data.message)
            //}else if(data.message.length == 0){
            //    commonService.ctrlError('预览', '此节目单下没有可预览的素材')
            //} else{
            $scope.dataImg = data.message;
            //console.log($scope.dataImg)
            $('#videoMask').fadeIn(200);
            $('#video').fadeIn(200);
            $scope.openOtherPlay($scope.dataImg[0].picPath, $scope.dataImg[0].videoPath);
            //setTimeout(function(){
            //    var num =parseInt($('.videoListInfo').width() / 270)
            //    //console.log(num)
            //    jQuery("#videoList").slide({pnLoop:false,scroll:num,delayTime:400,mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:false,vis:num,prevCell:".prev",nextCell:".next" });
            //
            //},10)
            //}
        });

        //})
    };

    //关闭播放器
    $scope.closePlay = function () {
        //player.dispose();
        if (playBool) {
            player.paused();
        }
        $('#videoMask').fadeOut(200);
        $('#video').fadeOut(200);
    };

    //获取素材待审核数量
    $scope.toCheckNum = function () {
        //测试接口
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=&pageSize=&path=&keyword=&neededCheckFile=3");

        $com.get(function (data) {
            if (data.success == false) {
                commonService.ctrlError('查询', data.message);
            } else {
                $scope.toCheckNumber = data.total;
            }
        });
    };
    $scope.toCheckNum();

    //素材下载
    $scope.download = function (id) {
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@id'
        });
        $com.get({ fileUid: id }, function (data) {
            $scope.dataImg = data.message;
            console.log($scope.dataImg[0].picPath);
            console.log($scope.dataImg[0].videoPath);
            if ($scope.dataImg[0].format == 'video') {
                var downloadAddress = $rootScope.address + $scope.dataImg[0].videoPath;
                window.location = downloadAddress;
            } else if ($scope.dataImg[0].format == 'picture') {
                var downloadAddress = $rootScope.address + $scope.dataImg[0].picPath;
                window.location = downloadAddress;
            } else {
                var downloadAddress = $rootScope.address + $scope.dataImg[0].otherPath;
                window.location = downloadAddress;
            }
        });
    };

    //右侧滚动条
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('uploadList'));
    }, 100);
}]);

//素材审核模块
app.controller('checkMediaCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$rootScope', function ($scope, staticData, $resource, commonService, $http, $rootScope) {
    //设备状态选项绑定
    $scope.stateGroup = staticData.checkState;
    $scope.state = $scope.stateGroup[0].id;

    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;

    //默认查找根目录
    $scope.query = function (keyword, neededCheckFile, pageNo, pageSize) {
        //测试接口
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=&keyword=:keyword&neededCheckFile=:neededCheckFile", {
            keyword: '@keyword',
            neededCheckFile: '@neededCheckFile',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ keyword: keyword, neededCheckFile: neededCheckFile, pageNo: pageNo, pageSize: pageSize }, function (data) {
            if (data.success == false) {
                commonService.ctrlError('查询', data.message);
            } else {

                $scope.datas = data.dataList;
                $scope.totalItems = data.total;
                $scope.numPages = data.pages;
                $scope.currentPage = data.pageNo;
            }
        });
    };
    //根据关键字查询数据

    $scope.query("", 0, 1, $scope.pageSize);

    $scope.search = function (keyword, neededCheckFile, e, pageNo, pageSize) {
        if (keyword) {
            keyword = keyword.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(keyword, neededCheckFile, pageNo, pageSize);
            }
        } else {
            $scope.query(keyword, neededCheckFile, pageNo, pageSize);
        }
    };

    //查询审核权限
    $scope.checkExamine = function () {

        var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-filemanager/checkFilePermmison' });
        promise.then(function (res) {
            if (res.data.code == 'noPop' && res.data.access == "notpermission") {
                //没审核权限，只显示状态
                $scope.onlyShowState = true;
            } else if (res.data.access == "havepermmison") {
                //有审核权限，显示操作项
                $scope.onlyShowState = false;
            }
        });
    };

    $scope.checkExamine();

    //素材审核
    $scope.examine = function (uid, checkStatus) {

        var sendObj = {
            uid: uid,
            checkStatus: checkStatus
        };

        commonService.ctrlModal("examineType", { checkStatus: checkStatus }).result.then(function () {
            var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-filemanager/checkFilePermmison/checkFile', data: sendObj });
            promise.then(function (res) {
                res.data.success ? commonService.ctrlSuccess("操作") : commonService.ctrlError("操作", res.data.message);
                $scope.query($scope.keyword, $scope.state);
                $scope.toCheckNum();
            });
        });
    };

    //获取素材待审核数量
    $scope.toCheckNum = function () {
        //测试接口
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=&pageSize=&path=&keyword=&neededCheckFile=3");

        $com.get(function (data) {
            if (data.success == false) {
                commonService.ctrlError('查询', data.message);
            } else {
                $scope.toCheckNumber = data.total;
            }
        });
    };
    $scope.toCheckNum();

    //播放器
    var player = {};
    //播放标志位
    var playBool = false;
    $scope.imgOnly = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if (videoPath != '') {
            //alert(1)
            $scope.imgOnly = false;
            $scope.posterImg = $rootScope.address + imgPath;
            player = videojs("my-video1", {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg
                //"src":"http://vjs.zencdn.net/v/oceans.mp4",
                //controlBar: {
                //    captionsButton: false,
                //    chaptersButton : false,
                //    liveDisplay:false,
                //    playbackRateMenuButton: false,
                //    subtitlesButton:false
                //}

            });
            player.src($rootScope.address + videoPath);
            player.poster($scope.posterImg);
            playBool = true;
        } else {
            //tupian
            //alert(0)
            $scope.imgOnly = true;
            $scope.picPath = $rootScope.address + imgPath;
        }
        if (playBool) {
            player.paused();
        }
    };

    //预览
    $scope.openPlay1 = function (fileUid) {
        //checkBtnService.check("/api/mps-materialList/task/:taskId/preview",'get').then(function(){
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            //if(!data.success){
            //    commonService.ctrlError('预览', data.message)
            //}else if(data.message.length == 0){
            //    commonService.ctrlError('预览', '此节目单下没有可预览的素材')
            //} else{
            $scope.dataImg = data.message;
            //console.log($scope.dataImg)
            $('#videoMask').fadeIn(200);
            $('#video').fadeIn(200);
            $scope.openOtherPlay($scope.dataImg[0].picPath, $scope.dataImg[0].videoPath);
            //setTimeout(function(){
            //    var num =parseInt($('.videoListInfo').width() / 270)
            //    //console.log(num)
            //    jQuery("#videoList").slide({pnLoop:false,scroll:num,delayTime:400,mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:false,vis:num,prevCell:".prev",nextCell:".next" });
            //
            //},10)
            //}
        });

        //})
    };

    //关闭播放器
    $scope.closePlay1 = function () {
        //player.dispose();
        if (playBool) {
            player.paused();
        }
        $('#videoMask').fadeOut(200);
        $('#video').fadeOut(200);
    };

    //素材下载
    $scope.download = function (id) {
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@id'
        });
        $com.get({ fileUid: id }, function (data) {
            $scope.dataImg = data.message;
            console.log($scope.dataImg[0].picPath);
            console.log($scope.dataImg[0].videoPath);
            if ($scope.dataImg[0].format == 'video') {
                var downloadAddress = $rootScope.address + $scope.dataImg[0].videoPath;
                window.location = downloadAddress;
            } else if ($scope.dataImg[0].format == 'picture') {
                var downloadAddress = $rootScope.address + $scope.dataImg[0].picPath;
                window.location = downloadAddress;
            } else {
                var downloadAddress = $rootScope.address + $scope.dataImg[0].otherPath;
                window.location = downloadAddress;
            }
        });
    };
}]);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('memberManagerCtrl', ['$scope', '$rootScope', '$http', '$resource', 'commonService', 'checkBtnService', 'showCheckBox', function ($scope, $rootScope, $http, $resource, commonService, checkBtnService, showCheckBox) {

    $scope.selected = []; //初始化复选框
    $rootScope.reflash = false;

    //鼠标移入时操作
    $scope.mousemoveEvent = function (id) {
        showCheckBox.checkboxShow(id, 'hover');
    };

    //鼠标移出时操作
    $scope.mouseoutEvent = function (id) {
        console.log('id' + id);
        showCheckBox.checkboxShow(id, 'out');
    };

    /**
     * 列出成员列表接口
     */
    $scope.query = function (queryValue) {
        //测试接口
        if (queryValue) {
            var userName = queryValue;
        } else {
            var userName = '';
        }

        //console.log('搜索关键字为：' + queryValue);
        var $com = $resource($scope.app.host + "/api/mps-user/user?userName=:userName", {
            userName: '@userName'
        });

        $com.get({ userName: userName }, function (data) {
            $scope.memberList = data.results;
        });
    };

    //删除成员操作
    $scope.deleteMember = function (userId) {
        console.log('删除成员' + userId);
        var id = $scope.selected.join(',');
        if (userId) {
            id = userId;
        }
        if (!id) {
            commonService.ctrlError('删除', '未选择成员');
            return;
        }
        console.log('删除' + id);
        //权限判断
        checkBtnService.check("/api/mps-user/user/" + id, 'delete').then(function () {
            commonService.ctrlModal('memberName').result.then(function () {
                var $com = $resource($scope.app.host + "/api/mps-user/user/:id", { id: '@id' });
                $com.delete({}, { id: id }, function (data) {
                    console.log(data);
                    if (data.success) {
                        commonService.ctrlSuccess('删除');
                        $scope.selected = [];
                        $scope.query();
                        $scope.keyword = '';
                    }
                });
            });
        });
    };

    //判断是否为选中状态
    $scope.isChecked = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    //删除选中的成员
    $scope.deleteSelected = function () {
        console.log('delete' + $scope.selected);
    };

    //搜索成员列表
    $scope.searchMember = function (keyword, e) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                console.log('search ' + keyword); //开始进行查询操作
                keyword = keyword.replace(/&/g, '%26');
                $scope.query(keyword);
            }
        }
    };

    //用户复选框操作，给出checkbox结果
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var checked = checkbox.checked;
        if (checked) {
            $scope.selected.push(id);
        } else {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
        }
        console.log($scope.selected);
    };

    //编辑成员
    $scope.editMember = function (id) {
        console.log('编辑成员' + id);
        checkBtnService.check("/api/mps-user/user/" + id, 'put').then(function () {
            commonService.addMemberModal('edit', id);
        });
    };

    //添加成员
    $scope.addMember = function () {
        //console.log('添加成员');
        checkBtnService.check("/api/mps-user/user", 'post').then(function () {
            commonService.addMemberModal('add');
        });
    };

    //查看成员
    $scope.showDetailMember = function (id) {
        commonService.detailMemberModal(id);
    };

    $scope.query();

    //滚动条
    $scope.scrollHeight = function () {
        //console.log($(window).height())
        $('#scroll').css('height', $(window).height() - 230);
    };

    $scope.scrollHeight();
    $(window).resize(function () {
        $('#scroll').css('height', $(window).height() - 230);
    });

    //滚动条设置
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('scroll'));
        //滚动底部的时候触发
        $('#scroll').on('scrollreachbottom', function (ev) {});
    }, 100);

    //监听reflash刷新当前页面成员数据
    var watch = $scope.$watch('reflash', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.query();
            $rootScope.reflash = false;
        }
    });
}]);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/6/19.
 */

//普通删除模态框

app.controller('delModalCtrl', ['$scope', '$modalInstance', '$state', 'info', function ($scope, $modalInstance, $state, info) {

    $scope.modalType = info.typeInfo;

    $scope.obj = info.obj;

    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.goSheetList = function () {
        $state.go('app.order.orderList');
        $modalInstance.dismiss('cancel');
    };
}]);

//提示类型模态框控制器，延时2秒后消失
app.controller('tipCtrl', ['$scope', '$modalInstance', '$timeout', 'info', function ($scope, $modalInstance, $timeout, info) {
    $scope.modalType = info.typeInfo;

    $timeout(function () {
        $modalInstance.close();
    }, 2000);
}]);

//文件操作模态框
app.controller('fileManagerCtrl', ['$scope', '$rootScope', '$modalInstance', '$resource', '$state', 'commonService', 'getDatas', '$q', 'addDiyDom', function ($scope, $rootScope, $modalInstance, $resource, $state, commonService, getDatas, $q, addDiyDom) {

    $scope.mediaLists = getDatas.mediaLists; //获取勾选的媒体列表
    $scope.format = getDatas.format; //获取文件格式
    $rootScope.titleName = ''; //初始化上传到标题
    $scope.showLists = false; //初始化是否显示文件列表
    $scope.fileManagerName = $rootScope.fileManagerName; //标识媒体操作名称
    //console.log($scope.fileManagerName);
    if ($scope.fileManagerName == '上传' || $scope.fileManagerName == "选择") {
        //console.log($scope.fileManagerName);
        $scope.showImage = false;
    } else {
        //console.log($scope.fileManagerName);
        $scope.showImage = true;
    }
    var setting = {
        // 是否为异步加载文件
        // async: {
        //     enable: true,
        //     url:"/api/mps-filemanager/fileList",
        //     autoParam:["id", "name=n", "level=lv"],
        //     otherParam:{"otherParam":"zTreeAsyncTest"},
        //     dataFilter: filter
        // },
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: false,
            dblClickExpand: true,
            addDiyDom: addDiyDoms
        },
        callback: {
            onMouseUp: zTreeOnMouseUp,
            onDblClick: zTreeOnDblClick
        }
    };

    //自定义Dom样式
    function addDiyDoms(treeId, treeNode) {
        addDiyDom.diyDom(treeId, treeNode);
    }

    //异步加载数据树
    if ($scope.fileManagerName == "选择") {
        //异步加载数据树
        setTimeout(function () {
            $scope.query('', '', true, $scope.format);
        }, 0);
    } else {
        setTimeout(function () {
            $scope.query('', true, true, $scope.format);
        }, 0);
    }

    //鼠标抬起时的回调函数 
    function zTreeOnMouseUp(event, treeId, treeNode) {
        if (treeNode) {
            $scope.titleName = treeNode.name;
        }
        // console.log(treeNode);
        // $(".ztree li a").css("background","none");
        // $("#"+ treeNode.tId+ "_a").css("background-color","#f9cc9d");
    };

    function zTreeOnDblClick(event, treeId, treeNode) {
        console.log(treeNode);
        if (!treeNode.isParent) {
            $scope.ok();
        }
    }

    //点击确定移动/复制时的操作
    $scope.ok = function () {

        var obj = $.fn.zTree.getZTreeObj("jqueryTree"); //定义ztree对象
        var sNodes = obj.getSelectedNodes(); //获取选择的对象
        var path = ''; //初始化全路径
        var mediaSendArr = []; //初始化发送信息数组
        if (sNodes.length > 0) {
            var node = sNodes[0].getPath();
        } else {
            commonService.ctrlError($scope.fileManagerName, '未选择文件(夹)');
            return;
        }

        if ($scope.fileManagerName == "选择") {
            //console.log(sNodes[0]);
            if (sNodes[0].format) {
                $rootScope.$emit('selectFileObj', { selectFileObj: sNodes[0] });
                $modalInstance.dismiss('cancel');
            } else {
                commonService.ctrlError($scope.fileManagerName, '请选择媒体文件');
            }
            return;
        }

        //定义用户操作
        var operate = '';

        if ($scope.fileManagerName == '复制') {
            operate = 'copy';
        } else {
            operate = 'move';
        }
        if ($scope.fileManagerName == '上传') {
            $rootScope.filePath = $scope.mediaLists;
            // console.log($rootScope.uploadCtrl)
            $modalInstance.dismiss('cancel');
            $("#uploadBtn").click();
            return;
        }

        //获取当前节点的全路径
        for (var i = 0; i <= node.length - 1; i++) {
            path = path + "/" + node[i].name;
        }

        //拼接所需要移动/复制的数据对象        
        for (var i = 0; i <= getDatas.mediaLists.fileList.length - 1; i++) {
            var mediaSendObj = {};
            mediaSendObj.dest = sNodes[0].fullName;
            mediaSendObj.newName = getDatas.mediaLists.fileList[i].name;
            mediaSendObj.dir = getDatas.mediaLists.fileList[i].dir;
            mediaSendObj.path = getDatas.mediaLists.fileList[i].path;
            mediaSendObj.ondup = 'newcopy';
            mediaSendArr.push(mediaSendObj);
        }
        //console.log(mediaSendArr);
        var sendObj = {};
        sendObj.fileList = mediaSendArr;

        //发送数据请求
        var $com = $resource("/api/mps-filemanager/file?op=" + operate);
        //console.log(operate);
        $com.save(sendObj, function (res) {
            //成功回调函数
            if (res.success) {
                commonService.ctrlSuccess($scope.fileManagerName);
                //$state.go('app.media.mediaList');
                $rootScope.$broadcast('queryMedia', { queryMedia: true });
                $modalInstance.dismiss('cancel');
            } else {
                commonService.ctrlError($scope.fileManagerName, res.message);
                $modalInstance.dismiss('cancel');
            }
        });
    };

    $scope.upLoadFile = function () {
        $rootScope.filePath = $scope.mediaLists;
        // console.log($rootScope.uploadCtrl)
        $modalInstance.dismiss('cancel');
        //console.log(123123);
        $("#uploadBtn").click();
        return;
    };

    if ($scope.fileManagerName == '上传') {
        //console.log($scope.fileManagerName);
        $scope.showImage = false;
        //console.log(123123);
        $scope.upLoadFile();
    } else if ($scope.fileManagerName == "选择") {
        $scope.showImage = false;
    } else {
        //console.log($scope.fileManagerName);
        $scope.showImage = true;
    }

    //取消时的操作
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //默认查找根目录文件
    $scope.query = function (path, dir, all, format) {
        //测试接口,对接口进行测试
        var $com = $resource("/api/mps-filemanager/file/tree?path=:path&dir=:dir&all=:all&format=:format", {
            path: '@path',
            dir: '@dir',
            all: '@all'
        });

        $com.get({ path: path, dir: dir, all: all, format: format }, function (data) {
            //console.log(data);
            $.fn.zTree.init($("#jqueryTree"), setting, data.message);
        });
    };
}]);

app.controller('addMemberCtrl', ['$scope', '$rootScope', '$modalInstance', '$resource', 'commonService', '$state', 'operate', 'id', function ($scope, $rootScope, $modalInstance, $resource, commonService, $state, operate, id) {

    //console.log(operate + id);
    $scope.editModel = false;

    $scope.showPass = true;

    $scope.showPassword = function () {
        $scope.showPass = !$scope.showPass;
        if ($scope.showPass) {
            $scope.repeatPassword = '';
            $scope.data.password = '';
        } else {
            $scope.data.password = $scope.cachePassword;
            $scope.repeatPassword = $scope.cachePassword;
        }
    };

    $scope.query = function () {
        //console.log(1111);
        var userId = id;
        var $com = $resource("/api/mps-user/user?userId=:userId", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {
            userId: '@userId'
        });

        $com.get({ userId: userId }, function (data) {
            //console.log(data);
            $scope.data = data.results[0];
            $scope.cachePassword = $scope.data.password;
            $scope.repeatPassword = $scope.cachePassword;
        });
    };

    //定义操作规则
    $scope.operate = operate;
    if (operate === 'edit') {
        $scope.editModel = true;
        $scope.id = id;
        $scope.showPass = false;

        $scope.query(); //修改成员进行信息查询
    }

    //w5c表单验证配置
    var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
    };

    vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
    };
    //每个表单的配置，如果不设置，默认和全局配置相同
    vm.validateOptions = {
        blurTrig: true
    };

    vm.customizer = function () {
        return vm.entity.customizer > vm.entity.number;
    };

    vm.changeShowType = function () {
        if (vm.showErrorType == 2) {
            vm.validateOptions.showError = false;
            vm.validateOptions.removeError = false;
        } else {
            vm.validateOptions.showError = true;
            vm.validateOptions.removeError = true;
        }
    };

    vm.types = [{
        value: 1,
        text: "选择框"
    }, {
        value: 2,
        text: "输入框"
    }];

    $scope.ok = function () {
        $modalInstance.close();
    };

    //查询权限
    $scope.queryRole = function () {
        var $com = $resource('/api/mps-user/role?hasCount=false');
        $com.get(function (data) {
            $scope.roles = data.results;
        });
    };
    $scope.queryRole();

    //查询部门
    $scope.queryDepartment = function () {
        var $com = $resource('/api/common/department');
        $com.get(function (data) {
            $scope.departments = data.results;
        });
    };
    $scope.queryDepartment();

    //提交成员数据
    $scope.submit = function () {
        //console.log('提交用户');
        //提交后禁用提交按钮防止重复提交
        $('.addMember').attr('disabled', true);

        if ($scope.editModel) {
            //console.log(id);
            var $comUpdate = $resource("/api/mps-user/user/:id", { id: '@id' }, {
                'update': { method: 'PUT' }
            });
            $comUpdate.update({ id: $scope.id }, $scope.data, function (res) {
                if (res.success) {
                    commonService.ctrlSuccess('编辑');
                    $state.go('app.member.memberList');
                    $modalInstance.close();
                    //$scope.query();

                    $rootScope.reflash = true;
                } else {
                    $scope.errorMsg = res.message;
                    commonService.ctrlError('编辑', res.message);
                    $('.addMember').attr('disabled', false);
                }
            });
        }

        //人员新增
        else {
                var $com = $resource("/api/mps-user/user");

                $com.save($scope.data, function (res) {
                    //console.log(res);
                    if (res.success) {
                        commonService.ctrlSuccess('添加');
                        //console.log('添加成功-----');
                        $state.go('app.member.memberList');
                        $modalInstance.close();
                        $rootScope.reflash = true;
                        //$scope.quer();
                    } else {
                        $scope.errorMsg = res.message;
                        commonService.ctrlError('添加', res.message);
                        $('.addMember').attr('disabled', false);
                    }
                });
            }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//查看成员信息模态框
app.controller('detailMemberCtrl', ['$scope', '$modalInstance', 'userId', '$resource', function ($scope, $modalInstance, userId, $resource) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.query = function () {
        var $com = $resource("/api/mps-user/user?userId=:userId", {
            userId: '@userId'
        });

        $com.get({ userId: userId }, function (data) {
            console.log(data);
            $scope.data = data.results[0];
        });
    };

    $scope.query();
}]);

//角色添加成员
app.controller('addRoleMemberModal', ['$scope', '$rootScope', '$resource', 'commonService', '$state', 'info', '$modalInstance', 'staticData', 'selectService', function ($scope, $rootScope, $resource, commonService, $state, info, $modalInstance, staticData, selectService) {

    $scope.selected = []; //初始化复选框
    $scope.selectedRoleMember = []; //右侧div东西
    $scope.arrAll = []; //全部数组用来添加人的(右侧)

    //console.log(info)
    $scope.roleId = info.roleId;
    $scope.name = info.name;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //加载所有成员
    $scope.queryMember = function (queryValue) {
        //测试接口
        if (queryValue) {
            var userName = queryValue;
        } else {
            var userName = '';
        }

        //console.log('搜索关键字为：' + queryValue);
        var $com = $resource(staticData.hostUrl + "/api/mps-user/user?userName=:userName", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

            userName: '@userName'
        });

        $com.get({ userName: userName }, function (data) {
            $scope.datas = data.results;
        });
    };
    $scope.queryMember();
    /**
     * 列出已选成员列表接口
     */
    $scope.queryRoleMember = function (roleId) {
        //测试接口
        if (roleId) {
            var userName = roleId;
        } else {
            var userName = '';
        }

        //console.log('搜索关键字为：' + queryValue);
        var $com = $resource(staticData.hostUrl + "/api/mps-user/role/:roleId/member", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

            roleId: '@roleId'
        });

        $com.get({ roleId: roleId }, function (data) {

            var dataList = [];
            var dataList2 = [];
            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].check_flag == 'Y') {
                    dataList.push(data.results[i]);
                    dataList2.push(data.results[i].user_id);
                }
            }
            $scope.arrAll = data.results;
            //console.log(data)
            $scope.selected = dataList2;
            $scope.selectedRoleMember = dataList;
        });
    };

    $scope.queryRoleMember($scope.roleId);
    $scope.ok = function () {
        var userSelectedArr = $scope.selected;

        var $com = $resource(staticData.hostUrl + "/api/mps-user/role/:id/member", { id: '@$scope.roleId' });
        $com.save({ id: $scope.roleId }, userSelectedArr, function (data) {
            if (data.success) {
                $modalInstance.close();
                //$scope.query();

                $rootScope.roleMemberFlash = true;
            }
        });
    };

    //搜索成员列表
    $scope.searchMember = function (e, keyword) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {

                $scope.queryMember(keyword);
            }
        } else {
            $scope.queryMember(keyword);
        }
    };

    //select相关操作的方法绑定
    $scope.updateSelection = function (selected, e, userId, boole) {
        //console.log($scope.selected.indexOf(userId))
        if (boole) {
            if ($scope.selected.indexOf(userId) >= 0) {
                for (var i = 0; i < $scope.selectedRoleMember.length; i++) {
                    if ($scope.selectedRoleMember[i].user_id == userId) {
                        $scope.selectedRoleMember.splice(i, 1);
                    }
                }
            } else if ($scope.selected.indexOf(userId) == -1) {
                for (var i = 0; i < $scope.arrAll.length; i++) {
                    //console.log($scope.arrAll)
                    if ($scope.arrAll[i].user_id == userId) {
                        $scope.selectedRoleMember.push($scope.arrAll[i]);
                    }
                }
            }
            selectService.updateSelection(selected, e, userId);
        } else {
            for (var i = 0; i < $scope.selectedRoleMember.length; i++) {
                if ($scope.selectedRoleMember[i].user_id == userId) {
                    $scope.selectedRoleMember.splice(i, 1);
                }
            }
            selectService.updateSelectionRole(selected, e, userId);
        }
    };
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;
    //滚动条
    //$scope.scrollHeight = function () {
    //    //console.log($(window).height())
    //    $('#scroll').css('height', $(window).height() - 230)
    //}
    //$scope.scrollHeight();
    //$(window).resize(function () {
    //    $('#scroll').css('height', $(window).height() - 230)
    //});
    //滚动条设置
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('rightMember'));
        var scroll2 = new Optiscroll(document.getElementById('leftMember'));
        //滚动底部的时候触发
        //$('#scroll').on('scrollreachbottom', function (ev) {
        //
        //});
    }, 500);
}]);

//订单模块
//新建项目控制器
app.controller('addProjectCtrl', ['$scope', '$modalInstance', '$resource', 'staticData', 'selectService', 'formatDateService', 'commonService', '$state', 'info', '$http', 'checkTimeService', function ($scope, $modalInstance, $resource, staticData, selectService, formatDateService, commonService, $state, info, $http, checkTimeService) {
    //初始化
    $scope.data = {};
    //给出费用默认值
    $scope.waySelectedArr = [1];
    $scope.data['projectSource'] = '1';
    $scope.data['customerCategory'] = '1';
    $scope.data.fromDate = undefined;
    $scope.data.endDate = undefined;
    $scope.editMode = false;
    $scope.noRepeat = false;

    $scope.options = {
        locale: 'zh-cn',
        format: 'YYYY/MM/DD',
        showClear: true
        //minDate: new Date()

        //w5c表单验证配置
    };var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
    };

    vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
    };
    //每个表单的配置，如果不设置，默认和全局配置相同
    vm.validateOptions = {
        blurTrig: true
    };

    //费用类别绑定
    $scope.wayList = staticData.feeType;

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;

    //判断是否为编辑模式
    if (info.projectId) {
        $scope.editMode = true;
        //查询项目详情
        $scope.query = function (projectId) {
            var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject/:projectId', { projectId: '@projectId' });
            $com.get({ projectId: projectId }, function (res) {
                $scope.data = res;
                $scope.waySelectedArr = res.projectCosts;
                $scope.data.fromDate = res.projectBegintime;
                $scope.data.endDate = res.projectEndtime;
            });
        };
        $scope.query(info.projectId);
    }

    $scope.submit = function () {
        var startDate, endDate;
        $scope.noRepeat = true;

        //整合发送数据
        var sendObj = $scope.data;
        var fromDate = $scope.data.fromDate._d;
        var fromDateTrans = formatDateService.getDate(fromDate);
        var endDate = $scope.data.endDate._d;
        var endDateTrans = formatDateService.getDate(endDate);
        sendObj.projectBegintime = fromDateTrans;
        sendObj.projectEndtime = endDateTrans;

        sendObj.projectCosts = $scope.waySelectedArr;
        sendObj.customerCategory = parseInt(sendObj.customerCategory);
        sendObj.projectSource = parseInt(sendObj.projectSource);

        startDate = checkTimeService.dateFormat(fromDateTrans);
        endDate = checkTimeService.dateFormat(endDateTrans);

        if (startDate - endDate <= 0) {
            //校验是否选择费用类型
            if ($scope.waySelectedArr.length == 0) {
                commonService.ctrlError('操作', '费用类型不能为空');
                $scope.noRepeat = false;
            } else {
                //编辑模式提交
                if ($scope.editMode) {

                    var promise = $http({
                        method: 'put',
                        url: '/api/cinema-adLaunch/adProject',
                        data: sendObj
                    });
                    promise.then(function (res) {
                        if (res.data.success) {
                            commonService.ctrlSuccess('编辑');
                            $modalInstance.close();
                        } else {
                            commonService.ctrlError('编辑', res.data.message);
                            $scope.noRepeat = false;
                        }
                    });
                } else {
                    var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject');
                    $com.save({}, sendObj, function (res) {
                        if (res.success) {
                            commonService.ctrlSuccess('添加');
                            $modalInstance.close();
                        } else {
                            commonService.ctrlError('添加', res.message);
                            $scope.noRepeat = false;
                        }
                    });
                }
            }
        } else {
            commonService.ctrlError('操作', '起始日期不可大于结束日期');
            $scope.noRepeat = false;
        }
    };

    //取消时的操作
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//查看项目详情
app.controller('showProjectDetailCtrl', ['$scope', '$modalInstance', '$resource', 'staticData', 'commonService', 'info', function ($scope, $modalInstance, $resource, staticData, commonService, info) {
    //初始化
    $scope.data = {};

    $scope.query = function (projectId) {
        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject/:projectId', { projectId: '@projectId' });
        $com.get({ projectId: projectId }, function (res) {
            if (res.success == false) {
                commonService.ctrlError('查询', res.message);
            } else {
                $scope.data = res;
            }
        });
    };
    $scope.query(info.projectId);

    //取消时的操作u
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//选择投放点位
app.controller('setPointModal', ['$scope', '$rootScope', '$resource', 'commonService', '$state', 'info', '$modalInstance', 'staticData', 'selectService', '$http', 'dataAccess', function ($scope, $rootScope, $resource, commonService, $state, info, $modalInstance, staticData, selectService, $http, dataAccess) {

    $scope.selected = info.select; //初始化复选框

    $scope.selectedRightMember = []; //右侧div东西
    $scope.arrAll = []; //全部数组用来添加人的(右侧)

    console.log(info);

    $scope.pointType = info.pointType;
    // if($scope.selected.length > 0){
    //     $scope.selectedRightMember = $scope.selected

    //     console.log($scope.selectedRightMember)
    // }
    //$scope.selectedRightMember = info.select;
    //$scope.data111 = [
    //    {
    //        "pointId": "efc9ffcbf4e9410792dfdf7a61982033",
    //        "pointForeId": "123243432",  //前端展示id
    //        "pointType": 1,
    //        "pointName":"123",
    //        "pointProvince":"湖北省",
    //        "pointCity":"武汉",
    //        "pointDistrict":"武昌区",
    //        "detailAddress":"武昌火车站",
    //        "showBeginTime": "14:29",
    //        "showEndTime": "14:30",
    //        "addTime":"2017-05-17 14:29:29",
    //        "state": "在线",
    //        "estimateFlow": 200
    //    },
    //    {
    //        "pointId": "efc9ffcbf4e9410792dfdf7a61982034",
    //        "pointForeId": "123243432",  //前端展示id
    //        "pointType": 1,
    //        "pointName":"234",
    //        "position":"2332",
    //        "showBeginTime": "14:29",
    //        "showEndTime": "14:30",
    //        "addTime":"2017-05-17 14:29:29",
    //        "state": "离线",
    //        "estimateFlow": 200
    //    },
    //    {
    //        "pointId": "efcbf4e9410792dfdf7a61982034",
    //        "pointForeId": "123243432",  //前端展示id
    //        "pointType": 1,
    //        "pointName":"bbbbb",
    //        "position":"2332",
    //        "showBeginTime": "14:29",
    //        "showEndTime": "14:30",
    //        "addTime":"2017-05-17 14:29:29",
    //        "state": "离线",
    //        "estimateFlow": 200
    //    },
    //    {
    //        "pointId": "efc9ffcbf4e9410792a61982034",
    //        "pointForeId": "123243432",  //前端展示id
    //        "pointType": 1,
    //        "pointName":"aaaaa",
    //        "position":"2332",
    //        "showBeginTime": "14:29",
    //        "showEndTime": "14:30",
    //        "addTime":"2017-05-17 14:29:29",
    //        "state": "离线",
    //        "estimateFlow": 200
    //    }
    //]
    //console.log($scope.pointType)
    //console.log($scope.selected)

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //循环加载右侧
    $scope.queryMember = function (province, city, district, queryValue, pointType) {
        //测试接口
        if (queryValue) {
            var pointName = queryValue;
        } else {
            var pointName = '';
        }

        //console.log('搜索关键字为：' + queryValue);
        var $com = $resource(staticData.hostUrl + "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=&pageNo=1&pageSize=10000", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

            province: '@province', city: '@city', district: '@district', pointName: '@pointName', pointType: '@pointType'
        });

        $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType }, function (data) {
            //console.log(data)
            $scope.datas = data.pointList.dataList;
        });
    };

    //加载所有点位
    $scope.queryMemberAll = function (province, city, district, queryValue, pointType) {
        //测试接口
        if (queryValue) {
            var pointName = queryValue;
        } else {
            var pointName = '';
        }

        //console.log('搜索关键字为：' + queryValue);
        var $com = $resource(staticData.hostUrl + "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=&pageNo=1&pageSize=10000", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

            province: '@province', city: '@city', district: '@district', pointName: '@pointName', pointType: '@pointType'
        });

        $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType }, function (data) {
            //console.log(data)
            $scope.datas = data.pointList.dataList;
            for (var i = 0; i < $scope.selected.length; i++) {
                for (var k = 0; k < $scope.datas.length; k++) {
                    if ($scope.selected[i] == $scope.datas[k].pointId) {
                        $scope.selectedRightMember.push($scope.datas[k]);
                    }
                }
            }
            //$scope.arrAll = data.pointList.results;
        });
    };
    $scope.queryMemberAll('', '', '', '', $scope.pointType);
    /**
     * 列出已选成员列表接口
     */
    //if(dataAccess.sessionGet('allObj')){

    //}

    //function a(){
    //    $scope.datas = $scope.data111
    //    for(var i = 0; i< $scope.selected.length; i++){
    //        for(var k = 0; k < $scope.datas.length; k++){
    //            if($scope.selected[i] == $scope.datas[k].pointId){
    //                $scope.selectedRightMember.push($scope.datas[k])
    //            }
    //        }
    //    }
    //}
    //a()

    $scope.ok = function () {
        var selectPoint = $scope.selected;
        $rootScope.$emit('selectPoint', { selectPoint: selectPoint });
        $modalInstance.dismiss('cancel');
    };

    //搜索成员列表
    $scope.searchMember = function (e, selected, selected2, selected3, keyword) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {

                $scope.queryMember(selected, selected2, selected3, keyword, $scope.pointType);
            }
        } else {
            $scope.queryMember(selected, selected2, selected3, keyword, $scope.pointType);
        }
    };

    //select相关操作的方法绑定
    $scope.updateSelection = function (selected, e, pointId, boole) {
        //console.log($scope.selected.indexOf(userId))
        if (boole) {
            if ($scope.selected.indexOf(pointId) >= 0) {
                for (var i = 0; i < $scope.selectedRightMember.length; i++) {
                    if ($scope.selectedRightMember[i].pointId == pointId) {
                        $scope.selectedRightMember.splice(i, 1);
                    }
                }
            } else if ($scope.selected.indexOf(pointId) == -1) {
                for (var i = 0; i < $scope.datas.length; i++) {
                    //console.log($scope.arrAll)
                    if ($scope.datas[i].pointId == pointId) {
                        $scope.selectedRightMember.push($scope.datas[i]);
                    }
                }
            }
            selectService.updateSelection(selected, e, pointId);
        } else {
            for (var i = 0; i < $scope.selectedRightMember.length; i++) {
                if ($scope.selectedRightMember[i].pointId == pointId) {
                    $scope.selectedRightMember.splice(i, 1);
                }
            }
            selectService.updateSelectionRole(selected, e, pointId);
        }
    };
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAllRole;

    //省市联动
    function getCity(pointType) {
        $scope.list = [];
        var $com = $resource(staticData.hostUrl + "/api/cinema-point/point/pointLocation?pointType=:pointType", { pointType: '@pointType' });

        $com.get({ pointType: pointType }, function (res) {
            $scope.list = res.message;
        });
        $scope.c = function (selected, selected2, selected3, keyword) {
            $scope.selected2 = "";
            $scope.selected3 = "";
            $scope.queryMember(selected, $scope.selected2, $scope.selected3, keyword, $scope.pointType);
        };

        $scope.c2 = function (selected, selected2, selected3, keyword) {
            $scope.selected3 = "";
            $scope.queryMember(selected, selected2, $scope.selected3, keyword, $scope.pointType);
        };

        $scope.c3 = function (selected, selected2, selected3, keyword) {
            $scope.queryMember(selected, selected2, selected3, keyword, $scope.pointType);
        };
    }
    getCity($scope.pointType);

    //滚动条设置
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('rightMember'));
        var scroll2 = new Optiscroll(document.getElementById('leftMember'));
        //滚动底部的时候触发
        //$('#scroll').on('scrollreachbottom', function (ev) {
        //
        //});
    }, 500);
    //一键清空
    $scope.deleteArr = function () {
        //alert(0)
        $scope.selectedRightMember = [];
        $scope.selected = [];
    };
    setTimeout(function () {
        $('#allCheck').on('click', function () {
            if ($(this).is(':checked')) {
                var checkList = $('.siteCheck');
                ////checkList.eq(0).trigger("click");
                for (var i = 0; i < checkList.length; i++) {
                    if (!checkList.eq(i).is(':checked')) {
                        //alert(0)
                        checkList.eq(i).click();
                    }
                }
            } else {
                var checkList = $('.siteCheck');
                for (var i = 0; i < checkList.length; i++) {
                    if (checkList.eq(i).is(':checked')) {
                        checkList.eq(i).click();
                    }
                }
            }
        });
    }, 500);
}]);
//选择城市站点弹框
app.controller('selectCitySiteCtrl', ['$scope', '$rootScope', '$modalInstance', '$resource', 'staticData', 'selectService', 'dataAccess', 'selectCityService', 'commonService', 'info', function ($scope, $rootScope, $modalInstance, $resource, staticData, selectService, dataAccess, selectCityService, commonService, info) {
    //初始化
    $scope.data = {};

    var perSelectedArr = [[], []];
    var userSelectedArr = [];
    var name = ''; //权限的名字用鱼取消该名字的时候使用

    $scope.selectSitesArr = [];
    $scope.allSiteNum = 0;

    $scope.pointType = info.pointType;
    $scope.cityList = info.cityList;
    $scope.citySite = info.citySite;

    if ($scope.citySite.length >= 0) {
        $scope.allSiteNum = $scope.citySite.length;
    }

    //console.log($scope.cityList);
    //模拟数据
    //$scope.cityList = ['北京市','北京市1','北京市3','北京市2','海淀区','九江市']

    $('.groupNameFocus').focus(function () {
        $scope.errorMsg = false;
    });

    $scope.getCityList = function () {
        ///api/cinema-point/point/pointLocation?pointType=xxx
        var $com = $resource(staticData.hostUrl + "api/cinema-point/point/pointLocation?pointType=:pointType", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

            pointType: '@pointType'
        });

        $com.get({ pointType: $scope.pointType }, function (data) {
            if (data.success) {
                $scope.results = data.message;
                console.log($scope.results);
                //模拟数据
                // $scope.results = [{"province":"北京","cityList":[
                // {"city":"北京市",'pointIdList':['1','2','3']},
                // {"city":"北京市2",'pointIdList':['11','22','33']},
                // {"city":"北京市3",'pointIdList':['111','222','333']},
                // {"city":"海淀区",'pointIdList':['1111','2222','3333']}]},
                // {"province":"江西省","cityList":[
                // {"city":"南昌市",'pointIdList':['12','22','32']},
                // {"city":"九江市",'pointIdList':['122','222','322']},
                // {"city":"井冈山",'pointIdList':['133','233','333']},
                // {"city":"上饶市",'pointIdList':['144','244','344']}]}
                // ,{"province":"甘肃省","cityList":
                // [{"city":"兰州市",'pointIdList':['1s','2s','3s']},
                // {"city":"榆中市",'pointIdList':['1c','2c','3c']},
                // {"city":"吉林",'pointIdList':['1a','2a','3a']}]}];

                if ($scope.cityList) {
                    for (var i = 0; i <= $scope.cityList.length - 1; i++) {
                        for (var j = 0; j <= $scope.results.length - 1; j++) {
                            for (var k = 0; k <= $scope.results[j].cityList.length - 1; k++) {
                                if ($scope.cityList[i] == $scope.results[j].cityList[k].city) {
                                    console.log($scope.results[j].cityList[k]);
                                    $scope.results[j].cityList[k].checked = true;
                                }
                            }
                        }
                    }
                } else {
                    console.log('没有回显过程');
                }

                $scope.permissionDatas = $scope.results;
                console.log($scope.permissionDatas);

                angular.forEach($scope.permissionDatas, function (data, index) {
                    //console.log(index);
                    perSelectedArr[index + 1] = [];
                    angular.forEach(data.cityList, function (mData) {
                        if (mData.checked === true) {
                            perSelectedArr[0].push(mData.city);
                            perSelectedArr[index + 1].push(mData.city);

                            $scope.selectSitesArr.push({
                                name: mData.city, pointIdList: mData.pointIdList
                            });
                        }
                    });
                });
            } else {
                commonService.ctrlError('城市列表获取', res.msg);
            }
            //$scope.datas = data.results;
        });
    };

    $scope.getCityList();

    //console.log(perSelectedArr)
    $scope.perSelectedArr = perSelectedArr;
    //select相关操作的方法绑定
    $scope.updateSelection = selectCityService.updateSelection;
    $scope.selectAll = selectCityService.selectAll;
    $scope.isSelected = selectCityService.isSelected;
    $scope.isSelectedAll = selectCityService.isSelectedAll;
    $scope.selectChildAll = selectCityService.selectChildAll;
    $scope.isChildSelectedAll = selectCityService.isChildSelectedAll;

    $scope.isSelectedAllRole = selectCityService.isSelectedAllRole;

    //取消时的操作
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.siteNum = [];

    //实时更新站点总数
    $scope.allSiteNumFun = function () {
        $scope.allSiteNum = 0;
        for (var i = 0; i <= $scope.selectSitesArr.length - 1; i++) {
            $scope.allSiteNum = $scope.allSiteNum + $scope.selectSitesArr[i].pointIdList.length;
        }
    };
    //$scope.allSiteNumFun();

    $scope.updateParentArr = function (selectedArr, childArr, e, originData) {
        var checkbox = e.target;

        if (checkbox.checked) {
            //添加元素
            for (var i = 0; i <= originData.cityList.length - 1; i++) {
                var selectedFlag = true;
                for (var j = 0; j <= $scope.selectSitesArr.length - 1; j++) {
                    if (originData.cityList[i].city == $scope.selectSitesArr[j].name) {
                        console.log("一样的不用加");
                        selectedFlag = false;
                        break;
                    }
                }
                console.log(selectedFlag);
                if (selectedFlag) {
                    $scope.selectSitesArr.push({
                        name: originData.cityList[i].city,
                        pointIdList: originData.cityList[i].pointIdList
                    });
                }
            }
        } else {
            //剔除元素
            for (var i = 0; i <= originData.cityList.length - 1; i++) {
                //var selectedFlag = true;
                for (var j = 0; j <= $scope.selectSitesArr.length - 1; j++) {
                    if (originData.cityList[i].city == $scope.selectSitesArr[j].name) {
                        console.log("存在就剔除");
                        $scope.selectSitesArr.splice(j, 1);
                        selectedFlag = false;
                        break;
                    }
                }
            }
        }
        console.log($scope.selectSitesArr);
        $scope.allSiteNumFun();
    };

    //确定选择的城市
    $scope.submit = function () {
        //发送已选择信息的城市站点
        console.log('开始发送城市点位信息');
        console.log($scope.selectSitesArr);
        if ($scope.selectSitesArr.length <= 0) {
            commonService.ctrlError('操作', '请选择城市');
            return;
        }
        $rootScope.$emit('selectCityList', { selectCityList: $scope.selectSitesArr });
        //dataAccess.sessionSave('selectSitesArr',$scope.selectSitesArr);
        $modalInstance.close();
        //$scope.$on('newSelectList', function (event, args) {})
    };

    $scope.updateArr = function (arr, name, siteNum, pointIdList, e) {
        var checkbox = e.target;
        var checked = checkbox.checked;
        console.log(checked);
        if (checked) {
            $scope.selectSitesArr.push({
                name: name, pointIdList: pointIdList
            });
        } else {
            for (var i = 0; i <= $scope.selectSitesArr.length - 1; i++) {
                if ($scope.selectSitesArr[i].name == name) {
                    $scope.selectSitesArr.splice(i, 1);
                }
            }
        }
        console.log($scope.selectSitesArr);
        $scope.allSiteNumFun();
    };

    //尝试jq解决全选问题
    $('#allCheck').on('click', function () {
        if ($(this).is(':checked')) {
            var checkList = $('.parent2Check');
            for (var i = 0; i < checkList.length; i++) {
                if (!checkList.eq(i).is(':checked')) {
                    checkList.eq(i).click();
                }
            }
        } else {
            var checkList = $('.parent2Check');
            for (var i = 0; i < checkList.length; i++) {
                if (checkList.eq(i).is(':checked')) {
                    checkList.eq(i).click();
                }
            }
        }
    });
}]);

//编辑点位弹框
app.controller('editPTCtrl', ['$scope', '$modalInstance', '$resource', '$state', '$http', 'commonService', 'staticData', 'info', 'checkTimeService', 'formatDateService', '$timeout', '$q', 'ptService', function ($scope, $modalInstance, $resource, $state, $http, commonService, staticData, info, checkTimeService, formatDateService, $timeout, $q, ptService) {
    //初始化
    var pointId = info.id;
    var bool = info.bool;
    var hostUrl = staticData.hostUrl;

    $scope.cityList = [];

    $scope.editMode = false;
    if (bool) {
        $scope.editMode = true;
    }

    $scope.createMap = function () {
        var map = new BMap.Map("map"); // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        $scope.local = new BMap.LocalSearch(map, {
            renderOptions: { map: map }, pageCapacity: 1
        });

        console.log($scope.data);
        var address = $scope.data.pointProvince + $scope.data.pointCity + $scope.data.pointDistrict + $scope.data.detailAddress;
        $scope.local.search(address);
        //console.log(address)
    };

    $scope.c = function (selected, selected2, selected3, keyword, type) {
        //console.log(selected);
        $scope.selected2 = "";
        $scope.selected3 = "";
    };

    $scope.c2 = function (selected, selected2, selected3, keyword, type) {
        $scope.selected3 = "";
    };

    $scope.c3 = function (selected, selected2, selected3, keyword, type) {};

    //查询点位详情
    $scope.queryPTdetail = function (pointId) {
        var $com = $resource(staticData.hostUrl + '/api/cinema-point/point/:pointId/detail', { pointId: '@pointId' });
        var defer = $q.defer();

        $com.get({ pointId: pointId }, function (res) {
            $scope.data = res;

            $scope.beginTime = res.showBeginTime;
            $scope.endTime = res.showEndTime;

            $scope.data.showBeginTime = checkTimeService.getModelTime(res.showBeginTime);
            $scope.data.showEndTime = checkTimeService.getModelTime(res.showEndTime);

            $scope.detailAddress = res.detailAddress;
            defer.resolve(res);
        });
        return defer.promise;
    };

    $scope.queryPTdetail(pointId).then(function () {
        $scope.createMap();

        //城市json数据获取
        $http.get('admin/js/cityList.json').success(function (data) {
            //console.log(data);
            $scope.cityList = data;

            $scope.selected = ptService.getStationLocations(data, $scope.data).selected;
            $scope.selected2 = ptService.getStationLocations(data, $scope.data).selected2;
            $scope.selected3 = ptService.getStationLocations(data, $scope.data).selected3;
        });
    });

    //---测试数据---

    //$scope.data = {
    //    "pointId": "efc9ffcbf4e9410792dfdf7a61982033",
    //    "pointName": "1223",
    //    "addTime": "2017-04-17 14:29:29",
    //    "pointType": 1,
    //    "pointProvince":"湖北省",
    //    "pointCity":"武汉",
    //    "pointDistrict":"武昌区",
    //    "detailAddress":"武昌火车站",
    //    "showBeginTime": "14:29",
    //    "showEndTime": "21:56",
    //    "state": "在线",
    //    "estimateFlow": 200,
    //    "pointForeId": "123243432",  //前端展示id
    //}
    //$scope.data.showBeginTime = checkTimeService.getModelTime($scope.data.showBeginTime)
    //$scope.data.showEndTime = checkTimeService.getModelTime($scope.data.showEndTime)


    //---测试结束---

    //提交校验逻辑
    $scope.doSubmit = function (pointId) {

        //时间输入合法标识符
        var timeComplete = false;
        //时间格式合法标识符
        var timeCheck = false;
        //始末时间校验
        var cycleCheck = false;

        $scope.data.estimateFlow = parseInt($scope.data.estimateFlow);

        if ($scope.data.showBeginTime && $scope.data.showEndTime) {
            if ($scope.data.showBeginTime.length == 4 && $scope.data.showEndTime.length == 4) {
                timeComplete = true;
                if (!checkTimeService.checkTime($scope.data.showBeginTime) && !checkTimeService.checkTime($scope.data.showEndTime)) {
                    timeCheck = true;
                    if ($scope.data.showBeginTime < $scope.data.showEndTime) {
                        cycleCheck = true;

                        $scope.data.showBeginTime = checkTimeService.getSendTime($scope.data.showBeginTime);
                        $scope.data.showEndTime = checkTimeService.getSendTime($scope.data.showEndTime);
                    }
                }
            }
        }
        //正常流程
        var $comUpdate = $resource(hostUrl + "/api/cinema-point/point/:pointId", { pointId: '@pointId' }, {
            'update': { method: 'PUT' }
        });

        $scope.data.pointProvince = $scope.selected.name;
        $scope.data.pointCity = $scope.selected2.name;
        $scope.data.pointDistrict = $scope.selected3.value;
        //校验输入完整性和合法性并提示
        if (timeComplete) {
            if (timeCheck) {
                if (cycleCheck) {
                    $comUpdate.update({ pointId: pointId }, $scope.data, function (res) {

                        if (res.success) {
                            commonService.ctrlSuccess('保存');
                            $modalInstance.close();
                        } else {
                            commonService.ctrlError('保存', res.msg);
                        }
                    });
                } else {
                    commonService.ctrlError('操作', '起始时间必须小于结束时间');
                }
            } else {
                commonService.ctrlError('操作', '时间格式有误');
            }
        } else {
            commonService.ctrlError('操作', '时间字段未完整填写');
        }

        ////测试流程
        //var $com = $resource(hostUrl + "/api/mps-device/device/timeswitch/:deviceId",{deviceId:'@deviceId'})
        //
        ////校验输入完整性和合法性并提示
        //if(timeComplete){
        //    if(timeCheck){
        //        if( sendObj.daily ){
        //            $com.save({},sendObj,function(res){
        //                res.success ?
        //                    commonService.ctrlSuccess('保存') :
        //                    commonService.ctrlError('保存', res.msg)
        //            })
        //        }else {
        //            if(dateCheck){
        //                $com.save({},sendObj,function(res){
        //                    res.success ?
        //                        commonService.ctrlSuccess('保存') :
        //                        commonService.ctrlError('保存', res.msg)
        //                })
        //            }else {
        //                commonService.ctrlError('操作','请选择正确的日期')
        //            }
        //        }
        //    }else {
        //        commonService.ctrlError('操作','时间格式有误')
        //    }
        //}else {
        //    commonService.ctrlError('操作','时间字段未完整填写')
        //}

        //console.log(sendObj)
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//默认素材列表弹窗
app.controller('defulatPlayListModalCtrl', ['$scope', 'staticData', '$resource', 'info', 'commonService', '$rootScope', '$modalInstance', function ($scope, staticData, $resource, info, commonService, $rootScope, $modalInstance) {

    $scope.deviceType = info.pointType;
    switch ($scope.deviceType) {
        case 1:
            $scope.pointName = '3*3';
            break;
        case 2:
            $scope.pointName = '3*4';
            break;
        case 3:
            $scope.pointName = '1+1';
            break;
        case 4:
            $scope.pointName = '单屏';
            break;
        case 5:
            $scope.pointName = '1+1+1';
            break;
    }
    //判断新建
    if (info.defaultId) {
        $scope.defaultId = info.defaultId;
        $scope.edit_bool = true;
    } else {
        $scope.edit_bool = false;
    }

    var hostUrl = staticData.hostUrl;

    $scope.data = {
        "resouceName": "",
        "pointType": $scope.deviceType,
        "resourceItems": [],
        "screenType": 2
    };

    var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
    };

    vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
    };
    //每个表单的配置，如果不设置，默认和全局配置相同
    vm.validateOptions = {
        blurTrig: true
    };

    $scope.allDel = function () {

        commonService.ctrlModal('deleteAd').result.then(function () {
            console.log('清除素材');
            $scope.data.resourceItems = [];
            $scope.screen1 = false;
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            $scope.screen5 = false;
            $scope.gameType = false;
            if ($scope.playBool) {
                playerPre.paused();
            }
        });
    };

    $scope.selectMedia = function (number, format) {
        $scope.screenNum = number;
        var format = format;
        commonService.fileManagerModal('选择', '', format);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');
    };

    $rootScope.$on('selectFileObj', function (event, args) {
        //console.log(args.selectFileObj.uid)
        //console.log(args)
        //$scope.gameName = args.selectFileObj.name;
        console.log(args.selectFileObj.uid);
        $scope.query($scope.screenNum, args.selectFileObj.uid);
    });

    //播放器
    var playerPre = {};
    $scope.playBool = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if (!videoPath) {
            return;
        }
        $('.video-jsPre1').attr('id', 'a' + parseInt(Math.random() * 25));
        var videoId = $('.video-jsPre1').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        $scope.playBool = true;
        playerPre.src($rootScope.address + videoPath);
        playerPre.poster($scope.posterImg);
        playerPre.paused();
    };
    //预览
    $scope.query = function (screenNum, fileUid) {
        //console.log(fileUid);
        var $com = $resource(hostUrl + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            if (screenNum == 1) {
                $scope.screen1 = true;
                $('#order-video').fadeIn(200);
                $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);

                //去除相同位置的素材
                if ($scope.data.resourceItems.length > 0) {
                    for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                        if ($scope.data.resourceItems[i].screenSeq == 1) {
                            $scope.data.resourceItems.splice(i, 1);
                        }
                    }
                }
                //console.log(data)
                $scope.data.resourceItems.push({
                    "resourceId": fileUid,
                    "resourceType": "video",
                    "resourceDuration": data.code * 1000,
                    "screenSeq": "1"
                });
            } else if (screenNum == 3) {
                $scope.screen3 = true;
                $scope.screen3Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[2].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 3) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }
                $scope.data.resourceItems.push({
                    "screenSeq": 3,
                    "resourceId": fileUid,
                    "resourceDuration": 10000,
                    "resourceType": "picture"
                });
            } else if (screenNum == 2) {
                $scope.screen2 = true;
                $scope.screen2Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[1].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 2) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }

                $scope.data.resourceItems.push({
                    "screenSeq": 2,
                    "resourceId": fileUid,
                    "resourceDuration": 10000,
                    "resourceType": "picture"
                });
            } else if (screenNum == 4) {
                $scope.screen4 = true;
                $scope.screen4Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[3].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 4) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }

                $scope.data.resourceItems.push({
                    "screenSeq": 4,
                    "resourceId": fileUid,
                    "resourceDuration": 10000,
                    "resourceType": "picture"
                });
            } else if (screenNum == 5) {
                $scope.screen5 = true;
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 2) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }
                //$scope.data.fileInfo[1].fileId = fileUid;
                $scope.data.resourceItems.push({
                    "screenSeq": 2,
                    "resourceId": fileUid,
                    "resourceDuration": 10000,
                    "resourceType": "picture"
                });
            }
        });
    };

    //换type
    $scope.changeType = function (num) {
        if (num == 2) {
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                if ($scope.data.resourceItems[i].screenSeq > 1) {
                    $scope.data.resourceItems.splice(i, 1);
                    //$scope.data.fileInfo[i].
                    //console.log($scope.data.fileInfo);
                }
            }
        } else {
            $scope.screen5 = false;
            for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                if ($scope.data.resourceItems[i].screenSeq > 1) {
                    $scope.data.resourceItems.splice(i, 1);
                    //console.log($scope.data.fileInfo);
                }
            }
        }
    };

    //编辑时候的数据回显
    if ($scope.edit_bool) {
        var $com = $resource(hostUrl + '/api/mps-adschedule/defaultRes/itemDetail?defaultId=:defaultId', { defaultId: '@defaultId' });
        $com.get({ defaultId: $scope.defaultId }, function (res) {
            if (res.success) {
                if (res.data.resourceItems.length == 2) {
                    res.data.screenType = 2;
                } else {
                    res.data.screenType = 1;
                }
                $scope.data = res.data;
                console.log($scope.data);
                for (var i = 0; i < res.data.resourceItems.length; i++) {
                    $scope.query(res.data.resourceItems[i].screenSeq, res.data.resourceItems[i].resourceId);
                }
            }
        });
    }

    //提交
    $scope.submit = function () {
        var sendObj = $scope.data;
        console.log(sendObj);
        switch ($scope.deviceType) {
            case 1:
                if (sendObj.resourceItems.length != 1) {
                    commonService.ctrlError('创建', '请选择素材');
                    return;
                }
                break;
            case 2:
                if (sendObj.screenType == 2) {
                    if (sendObj.resourceItems.length != 2) {
                        commonService.ctrlError('创建', '请选择素材');
                        return;
                    }
                } else {
                    if (sendObj.resourceItems.length != 4) {
                        commonService.ctrlError('创建', '请选择素材');
                        return;
                    }
                }
                break;
            case 3:
                if (sendObj.resourceItems.length != 2) {
                    commonService.ctrlError('创建', '请选择素材');
                    return;
                }
                break;
            case 4:
                if (sendObj.resourceItems.length != 1) {
                    commonService.ctrlError('创建', '请选择素材');
                    return;
                }
                break;
        }
        //发送数据请求
        if ($scope.edit_bool) {
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/update");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('编辑');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList', { bool: true });
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('编辑', res.message);
                    $modalInstance.dismiss('cancel');
                }
            });
        } else {
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/submit");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('创建');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList', { bool: true });
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('创建', res.message);
                    $modalInstance.dismiss('cancel');
                }
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//1+1+1
app.controller('defulatPlayListModalNewCtrl', ['$scope', 'staticData', '$resource', 'info', 'commonService', '$rootScope', '$modalInstance', function ($scope, staticData, $resource, info, commonService, $rootScope, $modalInstance) {

    //判断新建
    if (info.defaultId) {
        $scope.defaultId = info.defaultId;
        $scope.edit_bool = true;
    } else {
        $scope.edit_bool = false;
    }

    var hostUrl = staticData.hostUrl;
    //视频时长字段
    var videoCode1 = 0;
    var videoCode2 = 0;

    $scope.data = {
        "resouceName": "",
        "pointType": 5,
        "resourceItems": [],
        "screenType": 1
    };

    var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
    };

    vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
    };
    //每个表单的配置，如果不设置，默认和全局配置相同
    vm.validateOptions = {
        blurTrig: true
    };

    $scope.allDel = function () {

        commonService.ctrlModal('deleteAd').result.then(function () {
            $scope.data.resourceItems = [];
            $scope.screen1 = false;
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            $scope.screen5 = false;
            $scope.gameType = false;
            if ($scope.playBool) {
                playerPre.paused();
                $('#order-video1').fadeOut(20);
            }
            if ($scope.playBool2) {
                playerPre2.paused();
                $('#order-video2').fadeOut(20);
            }
        });
    };

    $scope.selectMedia = function (number, format) {
        $scope.screenNum = number;
        var format = format;
        commonService.fileManagerModal('选择', '', format);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');
    };

    $rootScope.$on('selectFileObj', function (event, args) {
        //console.log(args.selectFileObj.uid);
        $scope.query($scope.screenNum, args.selectFileObj.uid);
    });

    //播放器
    var playerPre = {};
    $scope.playBool = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if (!videoPath) {
            return;
        }
        $('.video-jsPre1').attr('id', 'e' + parseInt(Math.random() * 25));
        var videoId = $('.video-jsPre1').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        $scope.playBool = true;
        playerPre.src($rootScope.address + videoPath);
        playerPre.poster($scope.posterImg);
        playerPre.paused();
    };
    //播放器2
    var playerPre2 = {};
    $scope.playBool2 = false;
    $scope.openOtherPlay2 = function (imgPath, videoPath) {
        if (!videoPath) {
            return;
        }
        $('.video-jsPre2').attr('id', 'f' + parseInt(Math.random() * 25));
        var videoId = $('.video-jsPre2').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre2 = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        $scope.playBool2 = true;
        playerPre2.src($rootScope.address + videoPath);
        playerPre2.poster($scope.posterImg);
        playerPre2.paused();
    };
    //预览
    $scope.query = function (screenNum, fileUid) {
        //console.log(fileUid);
        var $com = $resource(hostUrl + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            if (screenNum == 1) {
                $scope.screen1 = true;
                $('#order-video1').fadeIn(200);
                $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);

                //去除相同位置的素材
                if ($scope.data.resourceItems.length > 0) {
                    for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                        if ($scope.data.resourceItems[i].screenSeq == 1) {
                            $scope.data.resourceItems.splice(i, 1);
                            videoCode1 = data.code;
                        }
                    }
                }
                //console.log(data)
                $scope.data.resourceItems.push({
                    "resourceId": fileUid,
                    "resourceType": "video",
                    "resourceDuration": data.code * 1000,
                    "screenSeq": "1"
                });
            } else if (screenNum == 3) {
                $scope.screen3 = true;
                $('#order-video2').fadeIn(200);
                $scope.openOtherPlay2(data.message[0].picPath, data.message[0].videoPath);

                //去除相同位置的素材
                if ($scope.data.resourceItems.length > 0) {
                    for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                        if ($scope.data.resourceItems[i].screenSeq == 3) {
                            $scope.data.resourceItems.splice(i, 1);
                        }
                    }
                }
                videoCode2 = data.code;
                $scope.data.resourceItems.push({
                    "resourceId": fileUid,
                    "resourceType": "video",
                    "resourceDuration": data.code * 1000,
                    "screenSeq": "3"
                });
            } else if (screenNum == 2) {
                $scope.screen5 = true;
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 2) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }
                //$scope.data.fileInfo[1].fileId = fileUid;
                $scope.data.resourceItems.push({
                    "screenSeq": "2",
                    "resourceId": fileUid,
                    "resourceDuration": 10000,
                    "resourceType": "picture"
                });
            }
        });
    };

    //编辑时候的数据回显
    if ($scope.edit_bool) {
        var $com = $resource(hostUrl + '/api/mps-adschedule/defaultRes/itemDetail?defaultId=:defaultId', { defaultId: '@defaultId' });
        $com.get({ defaultId: $scope.defaultId }, function (res) {
            if (res.success) {
                //判断id是否相同从而判断是否和左屏幕同步
                var n, m;
                for (var i = 0; i < res.data.resourceItems.length; i++) {
                    if (res.data.resourceItems[i].screenSeq == 1) {
                        n = i;
                    }
                    if (res.data.resourceItems[i].screenSeq == 3) {
                        m = i;
                    }
                }
                if (res.data.resourceItems[n].resourceId == res.data.resourceItems[m].resourceId) {
                    res.data.screenType = 2;
                } else {
                    res.data.screenType = 1;
                }
                $scope.data = res.data;
                //console.log($scope.data)
                for (var i = 0; i < res.data.resourceItems.length; i++) {
                    $scope.query(res.data.resourceItems[i].screenSeq, res.data.resourceItems[i].resourceId);
                }
            }
        });
    }

    //提交
    $scope.submit = function () {
        var sendObj = $scope.data;
        console.log(sendObj);
        if (sendObj.screenType == 2) {
            if (!$scope.playBool || !$scope.screen5) {
                commonService.ctrlError('创建', '请选择素材');
                return;
            }

            //把左屏幕复制给右屏幕
            var n;
            for (var i = 0; i < sendObj.resourceItems.length; i++) {
                if (sendObj.resourceItems[i].screenSeq == 1) {}
                if (sendObj.resourceItems[i].screenSeq == 3) {
                    sendObj.resourceItems.splice(i, 1);
                }
            }
            for (var i = 0; i < sendObj.resourceItems.length; i++) {
                if (sendObj.resourceItems[i].screenSeq == 1) {
                    n = i;
                }
            }
            sendObj.resourceItems.push({
                "resourceId": sendObj.resourceItems[n].resourceId,
                "resourceType": "video",
                "resourceDuration": sendObj.resourceItems[n].resourceDuration,
                "screenSeq": "3"
            });
        } else {
            if (!$scope.playBool2 || !$scope.playBool || !$scope.screen5) {
                commonService.ctrlError('创建', '请选择素材');
                return;
            }
            if (Math.abs(videoCode1 - videoCode2) > 1) {
                var obj = {
                    videoCode1: videoCode1,
                    videoCode2: videoCode2
                };
                commonService.ctrlModal('videoCode', obj);
                return;
            }
        }

        //发送数据请求
        if ($scope.edit_bool) {
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/update");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('编辑');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList', { bool: true });
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('编辑', res.message);
                    $modalInstance.dismiss('cancel');
                }
            });
        } else {
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/submit");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('创建');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList', { bool: true });
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('创建', res.message);
                    $modalInstance.dismiss('cancel');
                }
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//点位冲突模态框
app.controller('conflictModalCtrl', ['$scope', '$modalInstance', '$state', 'info', 'staticData', 'commonService', '$resource', function ($scope, $modalInstance, $state, info, staticData, commonService, $resource) {

    //$scope.modalType = info.typeInfo;

    $scope.obj = info.obj;
    var hostUrl = staticData.hostUrl;

    $scope.ok = function () {

        var data = { "billId": $scope.obj.orderId, "billStatus": 3 };
        var $comUpdate = $resource(hostUrl + "/api/cinema-adLaunch/checkAdBillPermmison/throwIn", {}, {
            'update': { method: 'PUT' }
        });

        $comUpdate.update({}, data, function (res) {
            if (res.success) {
                commonService.ctrlSuccess('审核');
                $state.go('app.order.checkSheetList');
                $modalInstance.dismiss('cancel');
            } else {
                //$('.btnSubmit').attr('disabled',false)
                //$scope.errorMsg = res.message
                commonService.ctrlError('操作', res.message);
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //$scope.goSheetList = function () {
    //    $state.go('app.order.orderList');
    //    $modalInstance.dismiss('cancel');
    //};
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('scroll1'));
        //滚动底部的时候触发
        $('#scroll').on('scrollreachbottom', function (ev) {});
    }, 100);
}]);

//addPointCtrl
app.controller('addPointCtrl', ['$scope', '$modalInstance', '$resource', 'staticData', 'commonService', '$state', 'randomStringServive', '$compile', function ($scope, $modalInstance, $resource, staticData, commonService, $state, randomStringServive, $compile) {

    var hostUrl = staticData.hostUrl;

    $scope.data = {};
    $scope.badId = [];
    $scope.data.pointType = '';
    //添加副屏
    $scope.addScreen = function () {
        console.log($("#addScreen").children().length);
        if ($("#addScreen").children().length >= 3) {
            commonService.ctrlError('操作', '最多只能有三条副屏幕');
            return;
        }

        var number = $("#addScreen").children().length + 1;

        var str = randomStringServive.randomString();
        var addScreenHtml = "<div class='input-class' id=" + str + ">" + "<label>副屏" + number + "&nbsp;&nbsp;ID ： </label>" + "<input class='inputText' type='text' ng-blur=\"checkId('" + str + '\')"  name=\'pointName\' ng-pattern=\'/^[\u4E00-\u9FA5A-Za-z0-9_]+$/\' required maxlength=\'30\'/>' + "<input class='disableId' type='hidden'/>" + "<i class='iconfont icon-shanchu " + str + "' ng-click=\"deleteScreen('" + str + "')\"></i>" + "<br>&nbsp;&nbsp;<span class=" + str + " style='color:red;padding-left:60px;display:inline-block;'></span>" + "</div>";
        $("#addScreen").append($compile(addScreenHtml)($scope));
    };
    //提交
    $scope.submit = function () {

        if ($scope.data.pointType == '') {
            commonService.ctrlError('添加', '请选择点位类型');
            return;
        }

        //for(var i = 0;i <= $("#addScreen").children().length - 1; i++) {
        $scope.data.mainScreenId = $("#mainScreenId").find('.inputText').val();
        $scope.data.firViceScreenId = $("#addScreen").children().eq(0).find('.inputText').val();
        $scope.data.secViceScreenId = $("#addScreen").children().eq(1).find('.inputText').val();
        $scope.data.thiViceScreenId = $("#addScreen").children().eq(2).find('.inputText').val();
        //}


        if ($.inArray($scope.data.mainScreenId, $scope.badId) >= 0) {
            commonService.ctrlError('添加', '请输入正确的ID');
            return;
        }

        if ($.inArray($scope.data.firViceScreenId, $scope.badId) >= 0) {
            commonService.ctrlError('添加', '请输入正确的ID');
            return;
        }

        if ($.inArray($scope.data.secViceScreenId, $scope.badId) >= 0) {
            commonService.ctrlError('添加', '请输入正确的ID');
            return;
        }

        if ($.inArray($scope.data.thiViceScreenId, $scope.badId) >= 0) {
            commonService.ctrlError('添加', '请输入正确的ID');
            return;
        }

        $scope.data.mainScreenId = $("#mainScreenId").find('.disableId').val();
        $scope.data.firViceScreenId = $("#addScreen").children().eq(0).find('.disableId').val();
        $scope.data.secViceScreenId = $("#addScreen").children().eq(1).find('.disableId').val();
        $scope.data.thiViceScreenId = $("#addScreen").children().eq(2).find('.disableId').val();

        // $scope.data.firViceScreenId = $scope.data.firViceScreenId == undefined ? '' : $scope.data.firViceScreenId;
        // $scope.data.secViceScreenId = $scope.data.secViceScreenId == undefined ? '' : $scope.data.secViceScreenId;
        // $scope.data.thiViceScreenId = $scope.data.thiViceScreenId == undefined ? '' : $scope.data.thiViceScreenId;

        if (!$scope.data.firViceScreenId) {
            delete $scope.data.firViceScreenId;
        }

        if (!$scope.data.secViceScreenId) {
            delete $scope.data.secViceScreenId;
        }

        if (!$scope.data.thiViceScreenId) {
            delete $scope.data.thiViceScreenId;
        }

        var $com = $resource(hostUrl + "/api/cinema-point/point/add/point");
        console.log($scope.data);
        $com.save($scope.data, function (res) {
            console.log(res);
            if (res.success) {
                commonService.ctrlSuccess('添加');
                $modalInstance.close();
                $state.go('app.PT.PTlist');
            } else {
                commonService.ctrlError('添加', res.message);
            }
        });
    };

    $scope.checkId = function (str) {
        console.log(str);
        // /api/cinema-point/point/checkDevice/:deviceNewId
        console.log($("#" + str));
        var deviceNewId = $("#" + str).find('.inputText').val();
        if (deviceNewId == '') {
            return;
        }
        console.log(deviceNewId);
        var $com = $resource(staticData.hostUrl + '/api/cinema-point/point/checkDevice/:deviceNewId', { deviceNewId: '@deviceNewId' });

        $com.get({ deviceNewId: deviceNewId }, function (res) {
            console.log(res);
            if (res.success) {
                //$scope.resInput = ''
                $("#" + str).find('span').text('该ID可用');
                //$("#"+str).find('.disableId').attr("value",str);
                $("#" + str).find('.disableId').val(res.message);
            } else {
                $scope.badId.push(deviceNewId);
                $("#" + str).find('span').text(res.message + "请重新输入");
            }
        });
    };

    //删除副屏幕
    $scope.deleteScreen = function (str) {
        $("#" + str).remove();
        for (var j = 0; j <= $("#addScreen").children().length - 1; j++) {
            var m = parseInt(j + 1);
            $("#addScreen").children().eq(j).find('label').html("副屏 " + m + " ID:");
        }
    };

    //取消时的操作
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//点位列表详情
app.controller('showPlayListCtrl', ['$scope', '$modalInstance', '$resource', 'staticData', 'commonService', '$state', 'info', function ($scope, $modalInstance, $resource, staticData, commonService, $state, info) {
    console.log(info);

    var hostUrl = staticData.hostUrl;

    // $scope.query = function (date,pointId,deviceType) {
    //     ///api/cinema-adLaunch/{pointId}/{date}/{deviceType}/queryPointPlayDetail
    //     var $com = $resource("/api/cinema-adLaunch/:pointId/:date/:deviceType/queryPointPlayDetail", {
    //         date: '@date',
    //         pointId: '@pointId',
    //         deviceType: '@deviceId',
    //         //resourceIds: '@resourceIds'
    //     });

    //     $com.get({ date: date, pointId: pointId, deviceType: deviceType },
    //         function (data) {
    //             console.log(data);
    //         })
    // }
    $scope.query = function (date, pointId, deviceType, resourceIds) {
        var obj = { resourceIds: resourceIds };
        var $com = $resource(hostUrl + "/api/cinema-adLaunch/" + pointId + "/" + date + "/" + deviceType + "/queryPointPlayDetail", {
            date: '@date',
            pointId: '@pointId',
            deviceType: '@deviceType'
            //resourceIds: '@resourceIds'
        });

        //console.log($scope.data);
        $com.save(obj, function (res) {
            console.log(res);
            $scope.datas = res.message;
            $scope.allTime = 0;
            for (var i = 0; i <= $scope.datas.length - 1; i++) {
                $scope.allTime = parseInt($scope.datas[i].fileDuration) + parseInt($scope.allTime);
            }
        });
    };
    $scope.query(info.date, info.pointId, info.deviceType, info.resourceIds);
    //取消时的操作
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.goToDetail = function (id) {
        //localStorage.userId = data;
        //$state.go('app.order.desc',{'id':id});
        var url = $state.href('app.order.desc', { 'id': id });
        window.open(url, '_blank'); //跳转到新开的一个页面
    };
}]);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/10/9.
 */
/**
 * Created by chenqi1 on 2017/10/9.
 */
//项目列表控制器
app.controller('orderlistCtrl', ['$scope', '$state', 'staticData', '$resource', 'commonService', 'checkBtnService', function ($scope, $state, staticData, $resource, commonService, checkBtnService) {
    //点位状态选项绑定
    $scope.orderSource = staticData.orderSource;
    //点位类型绑定
    $scope.customerType = staticData.customerType;

    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;

    //查询待审核数目
    $scope.queryTipNum = function () {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=&pageSize=&billName=&billType=&pointType=&billStatus=1&projectId=');
        $com.get(function (res) {
            if (res.success == false) {
                $scope.tipNum = 0;
            } else {
                $scope.tipNum = res.total;
            }
        });
    };
    $scope.queryTipNum();

    //获取广告播放统计
    $scope.getCount = function (projectName, projectNum, projectId) {
        $state.go('app.order.adProjectCount', {
            projectName: projectName,
            projectNum: projectNum,
            id: projectId,
            isAdInto: false
        });
    };

    //新建项目
    $scope.addProject = function () {
        checkBtnService.check("/api/cinema-adLaunch/adProject", 'post').then(function () {

            commonService.add_project().result.then(function () {
                $scope.query();
            });
        });
    };

    //编辑项目
    $scope.editProject = function (projectId) {

        checkBtnService.check("/api/cinema-adLaunch/adProject", 'put').then(function () {
            commonService.add_project(projectId).result.then(function () {
                $scope.query();
            });
        });
    };

    //查列表
    $scope.query = function (projectSource, customerCategory, keyword, pageNo, pageSize) {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adProject?pageNo=:pageNo&pageSize=:pageSize&keyword=:keyword&projectSource=:projectSource&customerCategory=:customerCategory', { projectSource: '@projectSource', customerCategory: '@customerCategory', keyword: '@keyword', pageNo: '@pageNo', pageSize: '@pageSize' });
        $com.get({ projectSource: projectSource, customerCategory: customerCategory, keyword: keyword, pageNo: pageNo, pageSize: pageSize }, function (res) {
            $scope.datas = res.dataList;

            $scope.totalItems = res.total;
            $scope.numPages = res.pages;
            $scope.currentPage = res.pageNo;
        });
    };
    $scope.query('', '', '', 1, $scope.pageSize);

    $scope.search = function (projectSource, customerCategory, keyword, pageNo, pageSize, e) {
        if (keyword) {
            keyword = keyword.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(projectSource, customerCategory, keyword, pageNo, pageSize);
            }
        } else {
            $scope.query(projectSource, customerCategory, keyword, pageNo, pageSize);
        }
    };

    $scope.show_project_detail = function (projectId) {
        commonService.show_project_detail(projectId);
    };

    //删除项目
    $scope.delete = function (projectId) {

        //检测删除权限
        checkBtnService.check("/api/cinema-adLaunch/adProject/:projectId", 'delete').then(function () {
            //获取删除项对象集合

            commonService.ctrlModal("projectType").result.then(function () {

                var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adProject/:projectId", { projectId: '@projectId' });
                $com.delete({ projectId: projectId }, function (res) {
                    res.success ? commonService.ctrlSuccess('删除') : commonService.ctrlError('删除', res.message);
                    $scope.query($scope.source, $scope.type, $scope.keyword);
                });
            });
        });
    };

    $scope.showAdList = function (deviceId, projectName, projectNum) {
        checkBtnService.check("/api/cinema-adLaunch/adBill?", 'get').then(function () {
            $state.go('app.order.adOrderList', { deviceId: deviceId, projectName: projectName, projectNum: projectNum });
        });
    };
}]);
//广告单列表
app.controller('adOrderlistCtrl', ['$scope', '$rootScope', '$state', 'staticData', '$resource', 'commonService', '$stateParams', 'checkBtnService', function ($scope, $rootScope, $state, staticData, $resource, commonService, $stateParams, checkBtnService) {

    $scope.adType = staticData.adType;
    $scope.statusType = staticData.statusType;
    $scope.tempType = staticData.PTtype;

    $scope.projectName = $stateParams.projectName;
    $scope.projectId = $stateParams.deviceId;
    $scope.projectNum = $stateParams.projectNum;

    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;

    $scope.returnBack = function () {
        $state.go('app.order.orderList');
    };

    $scope.query = function (billType, billStatus, pointType, billName, pageNo, pageSize) {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=:pageNo&pageSize=:pageSize&billName=:billName&billType=:billType&pointType=:pointType&billStatus=:billStatus&projectId=:projectId', { billType: '@billType', pointType: '@pointType', billName: '@billName', billStatus: '@billStatus', pageNo: '@pageNo', pageSize: '@pageSize', projectId: '@projectId' });
        $com.get({ billType: billType, pointType: pointType, billName: billName, billStatus: billStatus, pageNo: pageNo, pageSize: pageSize, projectId: $stateParams.deviceId }, function (res) {
            $scope.datas = res.dataList;
            $scope.totalItems = res.total;
            $scope.numPages = res.pages;
            $scope.currentPage = res.pageNo;
        });
    };
    $scope.query('', '', '', '', 1, $scope.pageSize);

    //下刊广告单
    $scope.releaseAd = function (billId) {
        //checkBtnService.check("/api/cinema-adLaunch/adBill/:billId",'delete').then(function() {
        commonService.ctrlModal('releaseAd').result.then(function () {
            var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {
                billId: '@billId'
            });

            $com.delete({ billId: billId }, function (res) {
                res.success ? commonService.ctrlSuccess('下刊') : commonService.ctrlError('下刊', res.message);
                $scope.query($scope.billType, $scope.billStatus, $scope.pointType, $scope.billName);
            });
        });
        //})
    };
    //复制
    $scope.copy = function (billId) {
        commonService.ctrlModal('copyAd').result.then(function () {
            var $com = $resource($scope.app.host + "/api/cinema-adLaunch/copyBill/:billId", {
                billId: '@billId'
            });

            $com.save({ billId: billId }, function (res) {
                res.success ? commonService.ctrlSuccess('复制') : commonService.ctrlError('复制', res.message);
                $scope.query($scope.billType, $scope.billStatus, $scope.pointType, $scope.billName);
            });
        });
    };
    //编辑订单
    $scope.editAd = function (billId, billStatus) {
        checkBtnService.check("/api/cinema-adLaunch/adBill", 'put').then(function () {
            $rootScope.addFlag = billStatus;
            $state.go('app.order.addAdOrder1', { projectId: $stateParams.deviceId, billId: billId, addFlag: billStatus });
        });
    };

    $scope.deleteAd = function (billId) {
        commonService.ctrlModal('deleteAd').result.then(function () {
            var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {
                billId: '@billId'
            });

            $com.delete({ billId: billId }, function (res) {
                res.success ? commonService.ctrlSuccess('删除') : commonService.ctrlError('删除', res.message);
                $scope.query($scope.billType, $scope.billStatus, $scope.pointType, $scope.billName);
            });
        });
    };

    $scope.search = function (billType, billStatus, pointType, billName, pageNo, pageSize, e) {
        // if(keyword){
        //     keyword = keyword.replace(/&/g, '%26')
        // }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(billType, billStatus, pointType, billName, pageNo, pageSize);
            }
        } else {
            $scope.query(billType, billStatus, pointType, billName, pageNo, pageSize);
        }
    };

    //showAdList(data.deviceId)
    //广告单详情
    $scope.adOrderDetail = function (billId, bool) {
        //console.log(billId);
        if (bool) {
            $state.go('app.order.desc', { projectId: $stateParams.deviceId, id: billId, bool: true });
        } else {
            $state.go('app.order.desc', { projectId: $stateParams.deviceId, id: billId });
        }
        //$state.go('app.order.adPointList',{billId:billId})
    };

    //新建广告单
    $scope.addAdOrder = function () {
        checkBtnService.check("/api/cinema-adLaunch/adBill", 'post').then(function () {
            $rootScope.addFlag = 'newAdd';
            $state.go('app.order.addAdOrder1', { projectId: $stateParams.deviceId, addFlag: 'newAdd' });
        });
    };

    //获取广告播放统计
    $scope.getCount = function (billId) {
        $state.go('app.order.adProjectCount', {
            projectName: $scope.projectName,
            projectNum: $scope.projectNum,
            id: $scope.projectId,
            billId: billId,
            isAdInto: true
        });
    };
}]);

//广告单播放统计
app.controller('adProjectCountCtrl', ['$scope', '$rootScope', '$state', 'staticData', '$resource', 'commonService', '$stateParams', 'checkBtnService', function ($scope, $rootScope, $state, staticData, $resource, commonService, $stateParams, checkBtnService) {

    $scope.projectId = $stateParams.id;
    $scope.projectNum = $stateParams.projectNum;
    $scope.projectName = $stateParams.projectName;

    $scope.isAdInto = $stateParams.isAdInto == 'false' ? false : true;
    //$scope.adList = staticData.adType


    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;

    $scope.returnBack = function () {
        history.back();
    };

    $scope.queryDetail = function () {
        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject/:projectId', { projectId: '@projectId' });
        $com.get({ projectId: $scope.projectId }, function (res) {
            if (res.success == false) {
                commonService.ctrlError('查询', res.message);
            } else {
                $scope.projectName = res.projectName;
                $scope.projectNum = res.cinemaAdbillSize;
            }
        });
    };
    $scope.queryDetail();

    $scope.adProjectCountDetail = function (id) {
        if ($scope.adSelectBillId) {
            $state.go("app.order.adProjectCountDetail", { id: id, isAdInto: isAdInto, billId: $scope.adSelectBillId });
        } else {
            $state.go("app.order.adProjectCountDetail", { id: id, isAdInto: isAdInto });
        }
    };

    $scope.query = function (pageNo, pageSize, billId, date) {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/getPlayCount?pageNo=:pageNo&pageSize=:pageSize&projectId=:projectId&date=:date&billId=:billId', { pageNo: '@pageNo', pageSize: '@pageSize', projectId: '@projectId', date: '@date', billId: '@billId' });
        $com.get({ pageNo: pageNo, pageSize: pageSize, projectId: $scope.projectId, date: date, billId: billId }, function (res) {
            console.log(res);
            $scope.datas = res.dataList;

            $scope.totalItems = res.total;
            $scope.numPages = res.pages;
            $scope.currentPage = res.pageNo;
        });
    };
    //初始化billID
    if ($stateParams.billId) {
        $scope.adSelectBillId = $stateParams.billId;
        $scope.query(1, $scope.pageSize, $scope.adSelectBillId);
    } else {
        $scope.adSelectBillId = '';
        $scope.query(1, $scope.pageSize);
    }

    //查询广告单下拉列表
    $scope.queryAd = function () {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/:projectId/getAllBill", {
            taskId: '@projectId'
        });
        $com.get({ projectId: $scope.projectId }, function (res) {
            console.log(res);
            $scope.adList = res.message;
        });
    };

    $scope.queryAd();

    //导出数据
    $scope.exportData = function (projectId, date, billId, projectName, pointName, pointId) {
        var url = $scope.app.host + '/api/cinema-adLaunch/getPlayCount/export?projectId=' + projectId + '&date=' + date + '&billId=' + billId + '&projectName=' + projectName + '&pointName=' + pointName + '&pointId=' + pointId;
        console.log(url);
        document.location.href = url;

        // var $com = $resource($scope.app.host +
        // //api/cinema-adLaunch/getPlayCount/export?projectId=xxx&billId=xxx&date=xxx&pointId=xxx&projectName=xxx&pointName=xxx
        //     '/api/cinema-adLaunch/getPlayCount/export?projectId=:projectId&date=:date&billId=:billId&projectName=:projectName&pointName=:pointName&pointId=:pointId' ,
        //     {projectId:'@projectId', date:'@date',billId:'@billId',projectName:'projectName',pointName:'pointName'})
        // $com.get({projectId:$scope.projectId , date:date, billId:billId , projectName:projectName , pointName:pointName,pointId:pointId },function(res){
        //     console.log(res);

        // })
    };
}]);

//广告单播放统计详情
app.controller('adProjectCountDetailCtrl', ['$scope', '$rootScope', '$state', 'staticData', '$resource', 'commonService', '$stateParams', 'checkBtnService', function ($scope, $rootScope, $state, staticData, $resource, commonService, $stateParams, checkBtnService) {

    $scope.projectId = $stateParams.id;
    $scope.projectNum = $stateParams.projectNum;
    $scope.projectName = $stateParams.projectName;
    $scope.date = $stateParams.date;

    $scope.isAdInto = $stateParams.isAdInto === 'false' ? false : true;

    $scope.adSelectBillId = $stateParams.billId;

    //$scope.adList = staticData.adType


    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数

    $scope.maxSize = staticData.pageMaxSize;

    $scope.returnBack = function () {
        history.back();
    };

    // $scope.adProjectCountDetail = function (id) {
    //     $state.go("app.order.adProjectCountDetail",{id:id});
    // }

    $scope.query = function (pageNo, pageSize, billId, date) {
        console.log(date);
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/getPlayCount?pageNo=:pageNo&pageSize=:pageSize&projectId=:projectId&date=:date&billId=:billId', { pageNo: '@pageNo', pageSize: '@pageSize', projectId: '@projectId', date: '@date', billId: '@billId' });
        $com.get({ pageNo: pageNo, pageSize: pageSize, projectId: $scope.projectId, date: date, billId: billId }, function (res) {
            console.log(res);
            $scope.datas = res.dataList;

            $scope.totalItems = res.total;
            $scope.numPages = res.pages;
            $scope.currentPage = res.pageNo;
        });
    };

    //$scope.query(1 , $scope.pageSize,'',$scope.date)

    //初始化billID
    if ($stateParams.billId) {
        $scope.adSelectBillId = $stateParams.billId;
        $scope.query(1, $scope.pageSize, $scope.adSelectBillId, $scope.date);
    } else {
        $scope.adSelectBillId = '';
        $scope.query(1, $scope.pageSize, '', $scope.date);
    }

    //查询广告单下拉列表
    $scope.queryAd = function () {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/:projectId/getAllBill", {
            taskId: '@projectId'
        });
        $com.get({ projectId: $scope.projectId }, function (res) {
            console.log(res);
            $scope.adList = res.message;
        });
    };

    $scope.queryAd();

    //导出数据
    $scope.exportData = function (projectId, date, billId, projectName, pointName, pointId) {
        var url = $scope.app.host + '/api/cinema-adLaunch/getPlayCount/export?projectId=' + projectId + '&date=' + date + '&billId=' + billId + '&projectName=' + projectName + '&pointName=' + pointName + '&pointId=' + pointId;
        console.log(url);
        document.location.href = url;

        // var $com = $resource($scope.app.host +
        // //api/cinema-adLaunch/getPlayCount/export?projectId=xxx&billId=xxx&date=xxx&pointId=xxx&projectName=xxx&pointName=xxx
        //     '/api/cinema-adLaunch/getPlayCount/export?projectId=:projectId&date=:date&billId=:billId&projectName=:projectName&pointName=:pointName&pointId=:pointId' ,
        //     {projectId:'@projectId', date:'@date',billId:'@billId',projectName:'projectName',pointName:'pointName'})
        // $com.get({projectId:$scope.projectId , date:date, billId:billId , projectName:projectName , pointName:pointName,pointId:pointId },function(res){
        //     console.log(res);

        // })
    };
}]);

//广告单审核控制器
app.controller('checkSheetCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', function ($scope, staticData, $resource, commonService, $http) {

    //终端类型
    $scope.PTtypes = staticData.PTtype;
    //广告类型
    $scope.sheetTypes = staticData.sheetType;
    //分页每页条目数
    $scope.pageSize = staticData.pageSize;
    //分页索引显示数
    $scope.maxSize = staticData.pageMaxSize;

    //查询待审核数目
    $scope.queryTipNum = function () {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=&pageSize=&billName=&billType=&pointType=&billStatus=1&projectId=');
        $com.get(function (res) {
            if (res.success == false) {
                $scope.tipNum = 0;
            } else {
                $scope.tipNum = res.total;
            }
        });
    };

    //查询待审核广告单列表
    $scope.queryList = function (billName, billType, pointType, pageNo, pageSize) {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=:pageNo&pageSize=:pageSize&billName=:billName&billType=:billType&pointType=:pointType&billStatus=&projectId=', { billName: '@billName', billType: '@billType', pointType: '@pointType', pageNo: '@pageNo', pageSize: '@pageSize' });
        $com.get({ billName: billName, billType: billType, pointType: pointType, pageNo: pageNo, pageSize: pageSize }, function (res) {
            if (res.success == false) {
                commonService.ctrlError('查询', res.message);
                $scope.datas = data;
            } else {
                $scope.datas = res.dataList;

                $scope.totalItems = res.total;
                $scope.numPages = res.pages;
                $scope.currentPage = res.pageNo;
            }
        });
    };

    $scope.search = function (billName, billType, pointType, pageNo, pageSize, e) {
        if (billName) {
            billName = billName.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.queryList(billName, billType, pointType, pageNo, pageSize);
            }
        } else {
            $scope.queryList(billName, billType, pointType, pageNo, pageSize);
        }
    };

    //查询审核权限
    $scope.checkExamine = function () {

        var promise = $http({ method: 'put', url: $scope.app.host + '/api/cinema-adLaunch/checkAdBillPermmison' });
        promise.then(function (res) {
            if (res.data.code == 'noPop' && res.data.access == "notpermission") {
                //没审核权限，只显示状态
                $scope.onlyShowState = true;
            } else if (res.data.access == "havepermmison") {
                //有审核权限，显示操作项
                $scope.onlyShowState = false;
            }
        });
    };

    //初始化查询
    $scope.queryTipNum();
    $scope.queryList('', '', '', 1, $scope.pageSize);
    $scope.checkExamine();
}]);

app.controller('adPointListCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$stateParams', '$state', function ($scope, staticData, $resource, commonService, $stateParams, $state) {
    //点位状态选项绑定
    $scope.stateGroup = staticData.deviceState;
    //点位类型绑定
    $scope.PTtype = staticData.PTtype;

    $scope.cityList = [];

    $scope.xiaKangBool = $stateParams.xiaKangBool;

    console.log($stateParams);

    //查询点位城市数据
    $scope.queryCity = function () {
        var $com = $resource($scope.app.host + '/api/cinema-point/point/pointLocation?pointType=');
        $com.get(function (res) {
            $scope.cityList = res.message;
        });
    };

    // //查询待添加点位角标数值
    // $scope.queryTipNum = function(){
    //     var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&groupName=&groupType=&pageNo=&pageSize=')
    //     $com.get(function(res){
    //         $scope.tipNum = res.total
    //     })
    // }
    //跳转
    $scope.goDesc = function () {
        console.log($stateParams.bool);
        if ($stateParams.bool == 'true') {
            if ($stateParams.xiaKangBool == 'true') {
                $state.go('app.order.desc', { projectId: $stateParams.projectId, id: $stateParams.billId, bool: true }); //详情带下刊
            } else {
                $state.go('app.order.desc', { projectId: $stateParams.projectId, id: $stateParams.billId }); //详情
            }
        } else {
            $state.go('app.order.examineDesc', { id: $stateParams.billId });
        }
    };
    //返回上一页
    $scope.returnBack = function () {
        $state.go('app.order.adOrderList', { deviceId: $stateParams.projectId });
    };

    //查询列表
    $scope.query = function (province, city, district, pointName, pointType, pageNo, pageSize) {
        ///api/cinema-adLaunch/adBill/getPoint?
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/getPoint?billId=:billId&pointProvince=:pointProvince&pointCity=:pointCity&pointDistrict=:pointDistrict&pointName=:pointName&pointType=:pointType&pageNo=:pageNo&pageSize=:pageSize", {
            billId: '@billId',
            pointProvince: '@province',
            pointCity: '@city',
            pointDistrict: '@district',
            pointName: '@pointName',
            pointType: '@pointType',
            //state: '@state',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ billId: $stateParams.billId, pointProvince: province, pointCity: city, pointDistrict: district, pointName: pointName, pointType: pointType, pageNo: pageNo, pageSize: pageSize }, function (res) {
            // $scope.countMap = res.countMap
            // $scope.datas = res.pointList.results
            // $scope.deviceList = res.pointList.results
            console.log(res);
            $scope.adPointList = res.dataList;
        });
    };

    $scope.search = function (selected, selected2, selected3, keyword, type, e, pageNo, pageSize) {
        if (keyword) {
            keyword = keyword.replace(/&/g, '%26');
        }
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                //$scope.query(selected,selected2,selected3,keyword,type)
                $scope.query(selected.province, selected2.city, selected3, keyword, type);
            }
        } else {
            //$scope.query(selected,selected2,selected3,keyword,type)
            $scope.query(selected.province, selected2.city, selected3, keyword, type);
        }
    };

    //---初始查询----
    $scope.queryCity();

    $scope.query();

    //$scope.queryTipNum()


    // $scope.adPointList = [
    // {

    //     "sendStatus": 1, //发送状态 1代表已完成 2代表正在发送 
    //     "pointName": "测试点位",  //点位名称
    //     "adress": "北京北京昌平来广营诚盈中心" //点位位置

    // },        {

    //     "sendStatus": 2, //发送状态 1代表已完成 2代表正在发送 
    //     "pointName": "测试点位2",  //点位名称
    //     "adress": "北京北京昌平来广营诚盈中心22" //点位位置

    // }

    // ];

    // $scope.cityList = [
    //     {
    //         "province": "湖北省",
    //         "cityList":[
    //             {
    //                 "city":"武汉市",
    //                 "districtList":[
    //                     "武昌区","汉口区"
    //                 ],
    //                 "pointIdList":[
    //                     "111","222"
    //                 ]
    //             },
    //             {
    //                 "city":"孝感市",
    //                 "districtList":[
    //                     "孝南区"
    //                 ],
    //                 "pointIdList":[
    //                     "333","444"
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "province": "河南省",
    //         "cityList":[
    //             {
    //                 "city":"郑州市",
    //                 "districtList":[
    //                     "金水区"
    //                 ],
    //                 "pointIdList":[
    //                     "123","456"
    //                 ]
    //             },
    //             {
    //                 "city":"许昌市",
    //                 "districtList":[
    //                     "xx区"
    //                 ],
    //                 "pointIdList":[
    //                     "345","424"
    //                 ]
    //             }
    //         ]
    //     }
    // ]
    //---测试结束---

    $scope.c = function (selected, selected2, selected3, keyword, type, state) {
        $scope.selected2 = "";
        $scope.selected3 = "";
        //console.log(selected);
        if (selected) {
            $scope.query(selected.province, selected2, selected3, keyword, type, state);
        } else {
            $scope.query(selected, selected2, selected3, keyword, type, state);
        }
    };

    $scope.c2 = function (selected, selected2, selected3, keyword, type, state) {
        $scope.selected3 = "";

        $scope.query(selected.province, selected2.city, selected3, keyword, type, state);
    };

    $scope.c3 = function (selected, selected2, selected3, keyword, type, state) {
        $scope.query(selected.province, selected2.city, selected3, keyword, type, state);
    };

    //点位编辑&查看详情
    $scope.editPT = function (id) {
        commonService.editPT(id);
    };
}]);

//添加广告单第一步添加站点

app.controller('addAdOrder1Ctrl', ['$rootScope', '$scope', '$state', 'staticData', '$resource', 'commonService', '$stateParams', 'dataAccess', function ($rootScope, $scope, $state, staticData, $resource, commonService, $stateParams, dataAccess) {

    $scope.projectName = $stateParams.projectName;
    $scope.projectId = $stateParams.projectId;
    $scope.projectNum = $stateParams.projectNum;

    console.log($stateParams);
    $scope.citySite = [];
    $scope.selectPoint = [];
    $scope.data = {};
    $scope.data['type'] = '2';
    $scope.data['video'] = '1';
    $scope.data['site'] = '0';
    $scope.allPointIdList = {};

    var allObj = dataAccess.sessionGet('allObj');
    if (allObj) {
        //console.log(allObj);
        //console.log(22222);
        //             "billName" : $scope.data.adName, //广告单名称
        // "billType" : $scope.data.video,          //广告类型 1代表视频 2代表互动游戏
        // "pointIds" :pointIds,//点位id数组
        // "projectId":$stateParams.projectId,  //广告项目id
        // "pointType" : $scope.data.type,   //点位类型 1:3*3,2:3*4,3:1*2,4:单屏
        // "sendPoint" : $scope.data.site
        $scope.data.adName = allObj.step1.billName;
        $scope.data.video = allObj.step1.billType;
        $scope.data.type = allObj.step1.pointType;
        $scope.data.site = allObj.step1.sendPoint;
        $scope.data.projectId = allObj.step1.projectId;
        $scope.data.billId = $stateParams.billId;
        $scope.selectPoint = allObj.step1.pointIds;
        //if($scope.data.site == 1){
        //    $scope.cityNum = allObj.step1.cityList.length
        //}
        //


        $scope.citySite = allObj.step1.pointIds;
    } else {
        var allObj = {};
    }

    //编辑时搜索广告单详情
    $scope.query = function () {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", { billId: $stateParams.billId });

        $com.get({ billId: $stateParams.billId }, function (res) {
            //console.log(res);
            $scope.data.adName = res.step1.billName;
            $scope.data.video = res.step1.billType;
            $scope.data.type = res.step1.pointType;
            $scope.data.site = res.step1.sendPoint;

            //$scope.data.billId = res.step1.billId
            $scope.data.projectId = res.step1.projectId;

            allObj.step1 = res.step1;
            allObj.step2 = res.step2;
            allObj.step3 = res.step3;

            $scope.cityList = res.step1.cityList;

            $scope.selectPoint = allObj.step1.pointIds;
            // allObj.step1.projectId = res.step1.projectId
            if ($scope.data.site == 1) {
                $scope.cityNum = res.step1.cityList.length;
                $scope.citySite = res.step1.pointIds;
                $scope.selectPoint = [];
            } else if ($scope.data.site == 2) {
                $scope.cityNum = 0;
                $scope.citySite = [];
            } else if ($scope.data.site == 0) {
                $scope.getAllPoint('', '', '', '', $scope.data.type, '', '', '');
                $scope.cityNum = 0;
                $scope.citySite = [];
                $scope.selectPoint = [];
            }
        });
    };

    //if($stateParams.billId && !allObj.step1) {
    if ($stateParams.billId) {
        console.log('编辑');
        $scope.data.billId = $stateParams.billId;
        //console.log($scope.data.billId);
        $scope.query();
    } else if ($stateParams.projectId) {
        console.log("新增");
        $scope.data.billId = '';

        $scope.data.projectId = $stateParams.projectId;
    }

    $scope.returnBack = function () {
        $state.go('app.order.adOrderList', { deviceId: $stateParams.projectId });
    };

    $scope.setPoint = function () {
        // if($scope.data.type)
        //console.log($scope.selectPoint);
        commonService.setPointModal($scope.data.type, $scope.selectPoint);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');

    };

    $scope.getAllPoint = function (province, city, district, pointName, pointType, state, pageNo, pageSize) {
        ///api/cinema-point/point?province=xxx&city=xxx&district=xxx&pointName=xxx&pointType=xxx&state=xxx&pageNo=xxx&pageSize=xxx
        var $com = $resource($scope.app.host + "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=:state&pageNo=:pageNo&pageSize=:pageSize", {
            province: '@province',
            city: '@city',
            district: '@district',
            pointName: '@pointName',
            pointType: '@pointType',
            state: '@state',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType, state: state, pageNo: pageNo, pageSize: pageSize }, function (res) {
            //console.log(res);
            $scope.allPointIdList = res.pointList.dataList;
            //console.log($scope.allPointIdList);
            $scope.allPoints = [];
            for (var i = 0; i <= $scope.allPointIdList.length - 1; i++) {
                $scope.allPoints.push($scope.allPointIdList[i].pointId);
            }
            //console.log($scope.allPoints);
        });
    };

    $scope.getAllPoint('', '', '', '', 2, '', '', '');

    $scope.changeType = function (num) {
        $scope.data.site = 0;
        $scope.cityNum = 0;
        $scope.selectPoint = [];
        //当类型改变时所有选择得点位都为空
        $scope.citySite = [];
        $scope.allPoints = [];
        $scope.selectPoint = [];
        $scope.cityList = [];
        if (num == 5) {
            $scope.data['video'] = '1';
            $scope.pointTypeBool = true;
        } else {
            $scope.pointTypeBool = false;
        }
        $scope.getAllPoint('', '', '', '', num, '', '', '');
    };

    $scope.showCityList = function () {
        commonService.selectCitySite($scope.data.type, $scope.cityList, $scope.citySite);
    };
    //改变billType时候清除list
    $scope.changeBillType = function () {
        if (allObj) {
            allObj.step2.fileInfo = [];
        }
    };
    $rootScope.$on('selectCityList', function (event, args) {
        //console.log(args);
        $scope.cityNum = args.selectCityList.length;
        //$scope.cityList = args.selectCityList


        $scope.citySite = [];
        $scope.cityList = [];
        for (var i = 0; i <= args.selectCityList.length - 1; i++) {

            // for(var x = 0;x <= args.selectCityList[i].length - 1; x++) {
            $scope.cityList.push(args.selectCityList[i].name);
            // }

            for (var j = 0; j <= args.selectCityList[i].pointIdList.length - 1; j++) {
                $scope.citySite.push(args.selectCityList[i].pointIdList[j]);
            }
        }
        //console.log($scope.citySite);
    });

    $rootScope.$on('selectPoint', function (event, selectPoint) {
        //console.log(12323);
        //console.log(selectPoint);
        $scope.selectPoint = selectPoint.selectPoint;
    });

    $scope.nextStep = function () {
        //var getCitySite = dataAccess.sessionGet('selectSitesArr');
        //console.log(getCitySite);
        if (!$scope.data.adName) {
            commonService.ctrlError('操作', '请输入广告单名称');
            return;
        }

        if ($scope.data.adName.length > 30) {
            commonService.ctrlError('操作', '广告单名称不能大于30');
            return;
        }

        var pointIds = [];
        //console.log($scope.data.site);
        switch (parseInt($scope.data.site)) {
            case 0:
                pointIds = $scope.allPoints;break;
            case 1:
                pointIds = $scope.citySite;break;
            case 2:
                pointIds = $scope.selectPoint;break;
        }

        if (allObj.step1) {
            allObj.step1 = {
                "billId": $scope.data.billId,
                "billName": $scope.data.adName, //广告单名称
                "billType": $scope.data.video, //广告类型 1代表视频 2代表互动游戏
                "pointIds": pointIds, //点位id数组
                "projectId": $scope.data.projectId, //广告项目id
                "pointType": $scope.data.type, //点位类型 1:3*3,2:3*4,3:1*2,4:单屏
                "sendPoint": $scope.data.site
            };
        } else {
            allObj = {
                'step1': {
                    "billId": $scope.data.billId,
                    "billName": $scope.data.adName, //广告单名称
                    "billType": $scope.data.video, //广告类型 1代表视频 2代表互动游戏
                    "pointIds": pointIds, //点位id数组
                    "projectId": $scope.data.projectId, //广告项目id
                    "pointType": $scope.data.type, //点位类型 1:3*3,2:3*4,3:1*2,4:单屏
                    "sendPoint": $scope.data.site
                    //这是第一步的数据
                },
                'step2': {},
                'step3': {}
            };
        }
        if ($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
            console.log('新增或者草稿状态需要请求服务器');
            if (allObj.step1.billId) {
                console.log('存在billId就为编辑草稿状态');
                $scope.addInfo(allObj, 'draft', allObj.step1.billId);
            } else {
                $scope.addInfo(allObj, 'draft');
            }
        } else {
            $state.go('app.order.addAdOrder2', { projectId: $stateParams.projectId, addFlag: $stateParams.addFlag });
            dataAccess.sessionSave('allObj', allObj);
        }
    };

    $scope.addMedia = function () {
        commonService.fileManagerModal('选择');
    };

    $scope.addInfo = function (allObj, operate, draftId) {
        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId', {
            operate: '@operate',
            draftId: '@draftId'
        });
        $com.save({ operate: operate, draftId: draftId }, allObj, function (res) {
            //console.log(res);
            if (res.success) {
                allObj.step1.billId = res.code;
                //commonService.ctrlSuccess('添加');
                $state.go('app.order.addAdOrder2', { projectId: $stateParams.projectId, addFlag: $stateParams.addFlag });
                dataAccess.sessionSave('allObj', allObj);

                //$modalInstance.close()
            } else {
                commonService.ctrlError('添加', res.message);
                //$scope.noRepeat = false
            }
        });
    };
}]);

//添加广告单第二步选择素材

app.controller('addAdOrder2Ctrl', ['$scope', 'staticData', '$resource', 'commonService', 'dataAccess', '$rootScope', '$state', '$stateParams', function ($scope, staticData, $resource, commonService, dataAccess, $rootScope, $state, $stateParams) {

    $scope.projectName = $stateParams.projectName;
    $scope.projectId = $stateParams.projectId;
    $scope.projectNum = $stateParams.projectNum;

    $scope.data = {

        "fileInfo": [{
            "deviceType": 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
            "fileId": "", //素材的uid
            "format": "video" //素材格式
        }, {
            "deviceType": 2,
            "fileId": "",
            "format": "picture"
        }, {
            "deviceType": 3,
            "fileId": "",
            "format": "picture"
        }, {
            "deviceType": 4,
            "fileId": "",
            "format": "picture"
        }],
        "screenType": 2 //副屏类型 1代表分屏 2代表全屏
        //这是第二步的数据


        //$scope.data['type'] = '1'
    };$scope.screenNum = 0; //用于判断是哪个屏幕
    //$scope.screen5 = true
    function isEmptyObject(e) {
        var t;
        for (t in e) {
            return !1;
        }return !0;
    }

    var allObj = dataAccess.sessionGet('allObj');
    console.log(allObj);
    //判断是视频还是游戏
    var orderType = allObj.step1.billType == 1 ? true : false;

    $scope.deviceType = allObj.step1.pointType;

    $scope.gameOrVideo = orderType;

    $scope.allDel = function () {

        commonService.ctrlModal('deleteAd').result.then(function () {
            console.log('清除素材');
            // $scope.data.fileInfo[0].fileId = ''
            // $scope.data.fileInfo[1].fileId = ''
            // $scope.data.fileInfo[2].fileId = ''
            // $scope.data.fileInfo[3].fileId = ''
            // $scope.data.fileInfo[1].fileId = ''
            $scope.data.fileInfo = [];
            $scope.screen1 = false;
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            $scope.screen5 = false;
            $scope.gameType = false;
            $('#order-video').fadeOut(20);
            if ($scope.playBool) {
                playerPre.paused();
            }
        });
    };

    $scope.returnBack = function () {
        //history.back();
        $state.go('app.order.addAdOrder1', { projectId: $stateParams.projectId, billId: allObj.step1.billId, addFlag: $stateParams.addFlag });
    };
    $scope.selectMedia = function (number, format) {
        $scope.screenNum = number;
        var format = format;
        // if(!orderType){
        //     format = 'other'
        // }
        //alert(0)
        commonService.fileManagerModal('选择', '', format);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');

    };

    $rootScope.$on('selectFileObj', function (event, args) {
        //console.log(args.selectFileObj.uid)
        //console.log(args)
        //$scope.gameName = args.selectFileObj.name;
        console.log(args.selectFileObj.uid);
        $scope.query($scope.screenNum, args.selectFileObj.uid);
    });

    $scope.addInfo = function (allObj, operate, draftId) {
        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId', {
            operate: '@operate',
            draftId: '@draftId'
        });
        $com.save({ operate: operate, draftId: draftId }, allObj, function (res) {
            console.log(res);
            if (res.success) {
                //commonService.ctrlSuccess('添加');
                $state.go('app.order.addAdOrder3', { projectId: $stateParams.projectId, addFlag: $stateParams.addFlag });
                dataAccess.sessionSave('allObj', allObj);

                //$modalInstance.close()
            } else {
                commonService.ctrlError('添加', res.message);
                //$scope.noRepeat = false
            }
        });
    };

    //下一步
    $scope.nextStep = function () {

        // if($scope.data.screenType == 2){
        //         if($scope.data.fileInfo[1].fileId) {
        //             $scope.data.fileInfo[2].delete
        //             $scope.data.fileInfo[3].delete
        //         } else {
        //             // commonService.ctrlError('操作','请先选择素材')
        //             // return;
        //         }
        //     }
        console.log($scope.data);

        if ($scope.data.fileInfo.length) {
            for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                if ($scope.data.fileInfo[i].fileId == "") {
                    $scope.data.fileInfo.splice(i, 1);
                }
            }
        }

        console.log($scope.data);

        if ($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
            console.log('新增或者草稿状态需要请求服务器');
            if (allObj.step1.billId) {
                console.log('存在billId就为编辑草稿状态');
                allObj.step2 = $scope.data;
                $scope.addInfo(allObj, 'draft', allObj.step1.billId);
            } else {
                allObj.step2 = $scope.data;
                $scope.addInfo(allObj, 'draft');
            }
        } else {
            allObj.step2 = $scope.data;
            $state.go('app.order.addAdOrder3', { projectId: $stateParams.projectId, addFlag: $stateParams.addFlag });
            dataAccess.sessionSave('allObj', allObj);
        }

        // if($scope.data.fileInfo[0].fileId){
        //     if($scope.data.screenType == 1 ) {

        //         // if($scope.data.fileInfo[1].fileId&&$scope.data.fileInfo[2].fileId&&$scope.data.fileInfo[3].fileId) {
        //         // }else {
        //         //     commonService.ctrlError('操作','请先选择素材')
        //         //     return;
        //         // }

        //     }
        //     if($scope.data.screenType == 2){
        //         if($scope.data.fileInfo[1].fileId) {
        //             $scope.data.fileInfo[2].delete
        //             $scope.data.fileInfo[3].delete
        //         } else {
        //             // commonService.ctrlError('操作','请先选择素材')
        //             // return;
        //         }
        //     }

        // if($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
        //     console.log('新增或者草稿状态需要请求服务器');
        //     if(allObj.step1.billId) {
        //         console.log('存在billId就为编辑草稿状态');
        //         allObj.step2 = $scope.data
        //         $scope.addInfo(allObj,'draft',allObj.step1.billId);
        //     } else {
        //         allObj.step2 = $scope.data
        //         $scope.addInfo(allObj,'draft');
        //     }
        // } else {
        //     allObj.step2 = $scope.data
        //     $state.go('app.order.addAdOrder3',{addFlag:$stateParams.addFlag});
        //     dataAccess.sessionSave('allObj',allObj)
        // }
        //         // allObj.step2 = $scope.data
        //         // console.log(allObj);

        //         // dataAccess.sessionSave('allObj',allObj)
        //         // $state.go("app.order.addAdOrder3")


        // }else{
        //    // commonService.ctrlError('操作','请先选择素材')
        // }

        //dataAccess.sessionSave('allObj',allObj)

        //return
        //$scope.data.fileId =
    };

    //播放器
    var playerPre = {};
    $scope.playBool = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        $('.video-jsPre1').attr('id', 'a' + parseInt(Math.random() * 3000));
        var videoId = $('.video-jsPre1').attr('id');
        //$scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false
            //"poster": $scope.posterImg,

        });
        $scope.playBool = true;
        playerPre.src($rootScope.address + videoPath);
        //playerPre.poster($scope.posterImg);
        playerPre.paused();
    };
    //预览
    $scope.openPlay = function (src) {
        $('#videoMask').fadeIn(200);
        $('#preview').fadeIn(200);

        $scope.openPlayImg = src;
    };
    //关闭预览
    $scope.closePlay = function () {
        $('#videoMask').fadeOut(200);
        $('#preview').fadeOut(200);
    };

    //查询素材
    //预览
    $scope.query = function (screenNum, fileUid) {
        console.log(fileUid);
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            //         $scope.data.fileInfo = [
            //     {
            //         "deviceType" : 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
            //         "fileId" : "", //素材的uid
            //         "format":"video" //素材格式
            //     },
            //     {
            //         "deviceType" : 2,
            //         "fileId" : "",
            //         "format":"picture"
            //     },
            //     {
            //         "deviceType" : 3,
            //         "fileId" : "",
            //         "format":"picture"
            //     },
            //     {
            //         "deviceType" : 4,
            //         "fileId" : "",
            //         "format":"picture"
            //     }
            // ];
            //console.log(data);
            if (screenNum == 1) {
                $scope.screen1 = true;
                if (orderType) {
                    $('#order-video').fadeIn(200);
                    $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);
                } else {
                    $scope.gameType = true;
                    $scope.gameName = data.message[0].name;
                }
                //去除相同位置的素材
                if ($scope.data.fileInfo.length > 0) {
                    for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                        if ($scope.data.fileInfo[i].deviceType == 1) {
                            $scope.data.fileInfo.splice(i, 1);
                        }
                    }
                }
                //显示大屏的游戏界面
                $scope.screen1Pic = $rootScope.address + data.message[0].picPath;
                if (!$scope.gameOrVideo) {
                    $scope.data.fileInfo.push({

                        "deviceType": 1,
                        "fileId": fileUid,
                        "format": "game"
                    });
                } else {
                    $scope.data.fileInfo.push({
                        "deviceType": 1,
                        "fileId": fileUid,
                        "format": "video"
                    });
                }

                //console.log($scope.data.fileInfo);
                //$scope.data.fileInfo[0].fileId = fileUid;
            } else if (screenNum == 3) {
                $scope.screen3 = true;
                $scope.screen3Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[2].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 3) {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }

                $scope.data.fileInfo.push({
                    "deviceType": 3,
                    "fileId": fileUid,
                    "format": "picture"
                });
            } else if (screenNum == 2) {
                $scope.screen2 = true;
                $scope.screen2Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[1].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }

                $scope.data.fileInfo.push({
                    "deviceType": 2,
                    "fileId": fileUid,
                    "format": "picture"
                });
            } else if (screenNum == 4) {
                $scope.screen4 = true;
                $scope.screen4Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[3].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 4) {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }

                $scope.data.fileInfo.push({
                    "deviceType": 4,
                    "fileId": fileUid,
                    "format": "picture"
                });
            } else if (screenNum == 5) {
                $scope.screen5 = true;
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;

                //去除相同位置的素材
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }
                //$scope.data.fileInfo[1].fileId = fileUid;
                $scope.data.fileInfo.push({
                    "deviceType": 2,
                    "fileId": fileUid,
                    "format": "picture"
                });
            }
        });
    };
    //数据回显
    console.log(allObj);
    if (!isEmptyObject(allObj.step2) && allObj.step1.pointType != 5) {
        $scope.data = allObj.step2;
        //console.log($scope.data)

        if (allObj.step2.fileInfo.length > 0) {
            if (allObj.step2.screenType == 2) {
                // $scope.query(1,$scope.data.fileInfo[0])
                // $scope.query(5,$scope.data.fileInfo[1].fileId)

                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 1) {
                        $scope.query(1, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        $scope.query(5, $scope.data.fileInfo[i].fileId);
                    }
                }
            } else {
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 1) {
                        $scope.query(1, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        console.log($scope.data.fileInfo[i].fileId);
                        $scope.query(2, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 3) {
                        $scope.query(3, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 4) {
                        $scope.query(4, $scope.data.fileInfo[i].fileId);
                    }
                }
                // $scope.query(1,$scope.data.fileInfo[0])
                // $scope.query(2,$scope.data.fileInfo[1].fileId)
                // $scope.query(3,$scope.data.fileInfo[2].fileId)
                // $scope.query(4,$scope.data.fileInfo[3].fileId)
            }
        } else {
            $scope.data = {

                "fileInfo": [{
                    "deviceType": 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                    "fileId": "", //素材的uid
                    "format": "video" //素材格式
                }, {
                    "deviceType": 2,
                    "fileId": "",
                    "format": "picture"
                }, {
                    "deviceType": 3,
                    "fileId": "",
                    "format": "picture"
                }, {
                    "deviceType": 4,
                    "fileId": "",
                    "format": "picture"
                }],
                "screenType": 2 //副屏类型 1代表分屏 2代表全屏
            };
            return;
        }
    }

    //换type
    $scope.changeType = function (num) {
        if (num == 2) {
            // $scope.data.fileInfo[1].fileId = ''
            // $scope.data.fileInfo[2].fileId = ''
            // $scope.data.fileInfo[3].fileId = ''
            //$scope.screen1 = false
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                if ($scope.data.fileInfo[i].deviceType > 1) {
                    $scope.data.fileInfo.splice(i, 1);
                    //$scope.data.fileInfo[i].
                    console.log($scope.data.fileInfo);
                }
            }
        } else {
            // $scope.data.fileInfo[1].fileId = ''

            $scope.screen5 = false;
            for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                if ($scope.data.fileInfo[i].deviceType > 1) {
                    $scope.data.fileInfo.splice(i, 1);
                    console.log($scope.data.fileInfo);
                }
            }
        }
    };

    //$scope.nextStep();
    //获取子控制器的图片
    $scope.$on('to-parentImg', function (event, msg) {
        $scope.openPlayImg = msg;
    });
}]);

//第二步添加素材扩展1+1+1
app.controller('newScreenCtrl', ['$scope', 'staticData', '$resource', 'commonService', 'dataAccess', '$rootScope', '$state', '$stateParams', function ($scope, staticData, $resource, commonService, dataAccess, $rootScope, $state, $stateParams) {
    $scope.data = {

        "fileInfo": [{
            "deviceType": 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
            "fileId": "", //素材的uid
            "format": "video" //素材格式
        }, {
            "deviceType": 2,
            "fileId": "",
            "format": "picture"
        }, {
            "deviceType": 3,
            "fileId": "",
            "format": "picture"
        }, {
            "deviceType": 4,
            "fileId": "",
            "format": "picture"
        }],
        "screenType": 2 //副屏类型
        //这是第二步的数据
    };

    $scope.screenNum = 0; //用于判断是哪个屏幕
    function isEmptyObject(e) {
        var t;
        for (t in e) {
            return !1;
        }return !0;
    }
    //视频时长字段
    var videoCode1 = 0;
    var videoCode2 = 0;
    var allObj = dataAccess.sessionGet('allObj');
    //console.log(allObj)
    //判断是视频还是游戏
    var orderType = allObj.step1.billType == 1 ? true : false;

    $scope.deviceType = allObj.step1.pointType;

    $scope.gameOrVideo = orderType;

    $scope.allDel = function () {
        //console.log('清除素材');
        $scope.data.fileInfo = [];
        $scope.screen1 = false;
        $scope.screen5 = false;
        $scope.screen7 = false;
        $scope.gameType = false;
        $scope.playBool1 = false;
        $('.order-video1').fadeOut(20);
        if ($scope.playBool) {
            playerPre.pause();
        }
        $('.order-video2').fadeOut(20);
        if ($scope.playBool1) {
            playerPre1.pause();
        }
    };

    $scope.returnBack = function () {
        //history.back();
        $state.go('app.order.addAdOrder1', { projectId: $stateParams.projectId, billId: allObj.step1.billId, addFlag: $stateParams.addFlag });
    };
    $scope.selectMedia = function (number, format) {
        $scope.screenNum = number;
        console.log(number);
        var format = format;
        // if(!orderType){
        //     format = 'other'
        // }
        //alert(0)
        commonService.fileManagerModal('选择', '', format);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');

    };

    $rootScope.$on('selectFileObj', function (event, args) {

        //console.log(args.selectFileObj.uid);
        $scope.query($scope.screenNum, args.selectFileObj.uid);
    });

    $scope.addInfo = function (allObj, operate, draftId) {
        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId', {
            operate: '@operate',
            draftId: '@draftId'
        });
        $com.save({ operate: operate, draftId: draftId }, allObj, function (res) {
            console.log(res);
            if (res.success) {
                //commonService.ctrlSuccess('添加');
                $state.go('app.order.addAdOrder3', { projectId: $stateParams.projectId, addFlag: $stateParams.addFlag });
                dataAccess.sessionSave('allObj', allObj);

                //$modalInstance.close()
            } else {
                commonService.ctrlError('添加', res.message);
                //$scope.noRepeat = false
            }
        });
    };

    //下一步
    $scope.nextStep = function () {

        // if($scope.data.screenType == 2){
        //         if($scope.data.fileInfo[1].fileId) {
        //             $scope.data.fileInfo[2].delete
        //             $scope.data.fileInfo[3].delete
        //         } else {
        //              commonService.ctrlError('操作','请先选择素材')
        //             // return;
        //         }
        //     }
        //console.log($scope.data);
        //判断视频时长
        if (allObj.step1.billType == 1 && $scope.data.screenType == 2) {
            if (Math.abs(videoCode1 - videoCode2) > 1) {
                videoCode1 = parseInt(videoCode1);
                videoCode2 = parseInt(videoCode2);
                var obj = {
                    videoCode1: videoCode1,
                    videoCode2: videoCode2
                };
                commonService.ctrlModal('videoCode', obj);
                return;
            }
        }
        if ($scope.data.fileInfo.length) {
            for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                if ($scope.data.fileInfo[i].fileId == "") {
                    $scope.data.fileInfo.splice(i, 1);
                }
            }
        }
        if ($scope.data.screenType == 1 && $scope.data.fileInfo.length > 0) {
            //alert(0)
            if (allObj.step1.billType == 1) {
                var h = 0;
                var k = 0;
                for (var i = 0; i < $scope.data.fileInfo.length; i++) {
                    if ($scope.data.fileInfo[i].deviceType == 1) {
                        h = i;
                    }
                    if ($scope.data.fileInfo[i].deviceType == 3) {
                        k = i;
                    }
                }
                if ($scope.data.fileInfo.length == 2) {
                    $scope.data.fileInfo.push({
                        "deviceType": 3,
                        "fileId": $scope.data.fileInfo[h].fileId,
                        "format": "video"
                    });
                } else {
                    $scope.data.fileInfo[k].fileId = $scope.data.fileInfo[h].fileId;
                    //console.log('复制成功')
                    //console.log($scope.data.fileInfo[k].fileId)
                    //console.log($scope.data.fileInfo[h].fileId)
                }
            } else {
                for (var i = 0; i < $scope.data.fileInfo.length; i++) {
                    if ($scope.data.fileInfo[i].deviceType == 3) {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }
            }
        }

        if ($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
            //console.log('新增或者草稿状态需要请求服务器');
            if (allObj.step1.billId) {
                //console.log('存在billId就为编辑草稿状态');
                allObj.step2 = $scope.data;
                $scope.addInfo(allObj, 'draft', allObj.step1.billId);
            } else {
                allObj.step2 = $scope.data;
                $scope.addInfo(allObj, 'draft');
            }
        } else {
            allObj.step2 = $scope.data;
            $state.go('app.order.addAdOrder3', { projectId: $stateParams.projectId, addFlag: $stateParams.addFlag });
            dataAccess.sessionSave('allObj', allObj);
        }
    };

    //播放器
    var playerPre = {};
    $scope.playBool = false;

    $scope.openOtherPlay = function (imgPath, videoPath) {
        $('.video-jsPre2').attr('id', 'b' + parseInt(Math.random() * 2000));
        //console.log($('.video-jsPre2'))
        var videoId1 = $('.video-jsPre2').attr('id');
        //$scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId1, {
            //"techOrder": ["flash","html"],
            "autoplay": false
            //"poster": $scope.posterImg,

        });
        $scope.playBool = true;
        playerPre.src($rootScope.address + videoPath);
        //playerPre.poster($scope.posterImg);
        playerPre.pause();
    };

    //播放器2
    var playerPre1 = {};
    $scope.playBool1 = false;

    $scope.openOtherPlay1 = function (imgPath, videoPath) {
        $('.video-jsPre3').attr('id', 'c' + parseInt(Math.random() * 200));
        var videoId2 = $('.video-jsPre3').attr('id');
        //$scope.posterImg1 = $rootScope.address + imgPath;
        playerPre1 = videojs(videoId2, {
            //"techOrder": ["flash","html"],
            "autoplay": false
            //"poster": $scope.posterImg1,

        });
        $scope.playBool1 = true;
        playerPre1.src($rootScope.address + videoPath);
        //playerPre1.poster($scope.posterImg1);
        playerPre1.pause();
    };
    //预览
    $scope.openPlay = function (src) {
        $('#videoMask').fadeIn(200);
        $('#preview').fadeIn(200);
        $scope.newOpenPlayImg = src;
        $scope.$emit('to-parentImg', $scope.newOpenPlayImg);
        //console.log(123213)
    };
    //关闭预览
    $scope.closePlay = function () {
        $('#videoMask').fadeOut(200);
        $('#preview').fadeOut(200);
    };
    //换type
    $scope.changeScreenType = function (num) {
        $scope.screenType = num;
        if ($scope.playBool1) {
            playerPre1.pause();
        }
    };

    //查询素材
    //预览
    $scope.query = function (screenNum, fileUid) {
        console.log(fileUid);
        var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            if (screenNum == 1) {
                $scope.screen1 = true;
                if (orderType) {
                    $('.order-video1').fadeIn(200);
                    $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);
                } else {
                    $scope.gameType = true;
                    $scope.gameName = data.message[0].name;
                }
                //去除相同位置的素材
                if ($scope.data.fileInfo.length > 0) {
                    for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                        if ($scope.data.fileInfo[i].deviceType == 1) {
                            $scope.data.fileInfo.splice(i, 1);
                        }
                    }
                }
                //显示大屏的游戏界面
                $scope.screen1Pic = $rootScope.address + data.message[0].picPath;
                if (!$scope.gameOrVideo) {
                    $scope.data.fileInfo.push({

                        "deviceType": 1,
                        "fileId": fileUid,
                        "format": "game"
                    });
                } else {
                    $scope.data.fileInfo.push({
                        "deviceType": 1,
                        "fileId": fileUid,
                        "format": "video"
                    });
                }

                //console.log($scope.data.fileInfo);
                videoCode1 = data.code;
                console.log(videoCode1);
            } else if (screenNum == 3) {
                $scope.screen7 = true;
                $('.order-video2').fadeIn(200);
                $scope.openOtherPlay1(data.message[0].picPath, data.message[0].videoPath);
                //去除相同位置的素材
                if ($scope.data.fileInfo.length > 0) {
                    for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                        if ($scope.data.fileInfo[i].deviceType == 3) {
                            $scope.data.fileInfo.splice(i, 1);
                        }
                    }
                }
                //if(!$scope.gameOrVideo) {
                //    $scope.data.fileInfo.push({
                //
                //        "deviceType" : 3,
                //        "fileId" : fileUid,
                //        "format":"game"
                //    });
                //} else {
                $scope.data.fileInfo.push({
                    "deviceType": 3,
                    "fileId": fileUid,
                    "format": "video"
                });
                //}

                videoCode2 = data.code;
                console.log(videoCode2);
                //console.log($scope.data.fileInfo);
            } else if (screenNum == 5) {
                $scope.screen5 = true;
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;

                //去除相同位置的素材
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }
                //$scope.data.fileInfo[1].fileId = fileUid;
                $scope.data.fileInfo.push({
                    "deviceType": 2,
                    "fileId": fileUid,
                    "format": "picture"
                });
            }
        });
    };
    //数据回显
    //console.log(allObj);
    if (!isEmptyObject(allObj.step2) && allObj.step1.pointType == 5) {
        $scope.data = allObj.step2;
        console.log($scope.data);

        if (allObj.step2.fileInfo.length > 0) {
            if (allObj.step2.screenType == 2) {
                // $scope.query(1,$scope.data.fileInfo[0])
                // $scope.query(5,$scope.data.fileInfo[1].fileId)

                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 1) {
                        $scope.query(1, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        $scope.query(5, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 3) {
                        $scope.query(3, $scope.data.fileInfo[i].fileId);
                    }
                }
                $scope.screenType = 2;
            } else {
                for (var i = $scope.data.fileInfo.length - 1; i >= 0; i--) {
                    if ($scope.data.fileInfo[i].deviceType == 1) {
                        $scope.query(1, $scope.data.fileInfo[i].fileId);
                    }
                    if ($scope.data.fileInfo[i].deviceType == 2) {
                        //console.log($scope.data.fileInfo[i].fileId);
                        $scope.query(5, $scope.data.fileInfo[i].fileId);
                    }
                    $scope.screenType = 1;
                    //if($scope.data.fileInfo[i].deviceType == 3) {
                    //    $scope.query(3,$scope.data.fileInfo[i].fileId)
                    //}
                    //if($scope.data.fileInfo[i].deviceType == 4) {
                    //    $scope.query(4,$scope.data.fileInfo[i].fileId)
                    //}
                }
                // $scope.query(1,$scope.data.fileInfo[0])
                // $scope.query(2,$scope.data.fileInfo[1].fileId)
                // $scope.query(3,$scope.data.fileInfo[2].fileId)
                // $scope.query(4,$scope.data.fileInfo[3].fileId)
            }
        } else {
            $scope.data = {

                "fileInfo": [{
                    "deviceType": 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                    "fileId": "", //素材的uid
                    "format": "video" //素材格式
                }, {
                    "deviceType": 2,
                    "fileId": "",
                    "format": "picture"
                }, {
                    "deviceType": 3,
                    "fileId": "",
                    "format": "picture"
                }, {
                    "deviceType": 4,
                    "fileId": "",
                    "format": "picture"
                }],
                "screenType": 2 //副屏类型 1代表分屏 2代表全屏
            };
            return;
        }
    }
}]);
//添加广告单第三步设置播放
app.controller('addAdOrder3Ctrl', ['$rootScope', '$scope', '$q', 'staticData', '$resource', 'commonService', 'formatDateService', '$http', 'dataAccess', '$state', 'checkTimeService', '$stateParams', function ($rootScope, $scope, $q, staticData, $resource, commonService, formatDateService, $http, dataAccess, $state, checkTimeService, $stateParams) {
    //初始化

    $scope.projectName = $stateParams.projectName;
    $scope.projectId = $stateParams.projectId;
    $scope.projectNum = $stateParams.projectNum;

    var i = 0;
    $rootScope.condArray = [], $rootScope.extra_condition = {};

    $scope.hover = false;

    $scope.data = {};
    $scope.data.showCountday = "";
    $scope.data.beginTime = "";
    $scope.data.endTime = "";
    $scope.data.showCountround = 1;
    $scope.data.showCountday = 1;
    $scope.data.addedInfo = [];
    $scope.data.addPlay = 1;
    // step3 = {
    //     "addedInfo" : [
    //     {
    //         "countRound" : 1, //每轮加播次数
    //         "timerangeId" : 2 //加播时段Id 
    //     }
    // ],  //加播信息，不加播此字段不传，或者传递null
    // "beginTime" : "2017-12-10", //投放开始时间
    // "endTime" : "2017-12-31",  //投放结束时间
    // "showCountday" : "",      //每日播放次数,不限传""
    // "showCountround" : "2",   //每轮播放次数,不限传""
    // "timerangeIds" : [ 1 ]   //播放时段 1为不限
    // //这是第三步的数据
    // }

    $scope.editMode = false;
    $scope.noRepeat = false;
    //$scope.timeAllFlag = false //默认为非全选

    $scope.options = {
        locale: 'zh-cn',
        format: 'YYYY/MM/DD',
        showClear: true
        //minDate: new Date()
    };

    $scope.timeArr = [];
    //$scope.selectAllFlag = false;
    $scope.selectAllTime = function () {
        console.log($("#selectAll").is(':checked'));
        if ($("#selectAll").is(':checked')) {
            $scope.timeArr = [];
            for (var i = 0; i <= $scope.times.length - 1; i++) {
                $scope.timeArr.push($scope.times[i].timerangeid);
            }
            $scope.removeAddClass();
        } else {
            $scope.timeArr = [];
            $(".timeShow").removeClass('active');
        }
    };

    $scope.removeAddClass = function () {
        //重新渲染样式图
        $(".timeShow").removeClass('active');
        for (var j = 0; j <= $scope.timeArr.length - 1; j++) {
            $("#" + $scope.timeArr[j]).addClass("active");
        }
    };

    $scope.queryTime = function () {
        var $com = $resource($scope.app.host + "/api/cinema-adLaunch/getTimerangeList");
        //var defer = $q.defer();
        $com.get(function (res) {
            console.log(res);
            $scope.times = res.result;
            //  defer.resolve(res)
        });
        //  return defer.promise
    };

    //搜索时间段
    $scope.queryTime();

    //时间段选择控件
    $scope.operateTimeArr = function (timeId) {
        var timeFlag = true;
        for (var i = 0; i <= $scope.timeArr.length - 1; i++) {
            //console.log($scope.timeArr[i]);
            if ($scope.timeArr[i] == timeId) {
                // console.log('存在不推送');
                $scope.timeArr.splice(i, 1);
                timeFlag = false;
            }
        }
        if (timeFlag) {
            // console.log('开始推送');
            $scope.timeArr.push(timeId);
        }
        //全选按钮的勾选
        // if($scope.timeArr.length == $scope.times.length) {
        //     $scope.timeAllFlag = true;
        // }else {
        //     $scope.timeAllFlag = false;
        // }
        // $scope.selectedAll();
        //console.log($scope.timeArr);
        //重新渲染样式图
        $scope.removeAddClass();
        console.log($scope.timeArr);
    };

    $scope.selectedChecked = function (timeId) {
        return $scope.timeArr.indexOf(timeId) >= 0 ? true : false;
    };

    $scope.timeOption = {
        locale: 'zh-cn',
        format: 'HH:mm',
        showClear: true
    };

    $scope.data['timeLine'] = '1';
    $scope.data['playTimes'] = '1';

    $scope.returnBack = function () {
        history.back();
    };

    $scope.backStep = function () {
        history.back();
    };

    $scope.noRepeat = false;

    //每次进入页面从缓存取数据
    var allObj = dataAccess.sessionGet('allObj');

    $scope.gameOrVideo = allObj.step1.billType; //1 ：视频 2：游戏

    if ($scope.gameOrVideo == 2) {
        if (!allObj.step3.timerangeIds) {
            $scope.timeArr = [];
            $(".timeShow").removeClass('active');
        } else {
            $scope.timeArr = allObj.step3.timerangeIds;
        }
        $scope.addedInfo = [];
    }

    //获取素材时长
    $scope.queryMediaLength = function (fileId) {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill/getFileDuration/:fileId', { fileId: '@fileId' });
        $com.save({ fileId: fileId }, function (res) {
            $scope.data.fileDuration = res.fileDuration;
        });
    };
    // if(allObj.step2.fileInfo[0].fileId) {
    //     $scope.queryMediaLength(allObj.step2.fileInfo[0].fileId)
    // }
    if (allObj.step2.fileInfo.length > 0) {
        for (var i = 0; i <= allObj.step2.fileInfo.length - 1; i++) {
            if (allObj.step2.fileInfo[i].deviceType == "1") {
                if (allObj.step2.fileInfo[i].fileId) {
                    $scope.queryMediaLength(allObj.step2.fileInfo[i].fileId);
                }
            }
        }
    }

    if ($stateParams.addFlag == 'newAdd' || $stateParams.addFlag == '0') {
        $scope.showButton = true;
    } else {
        $scope.showButton = false;
    }

    if ($stateParams.addFlag == 'newAdd') {
        $scope.timeArr = [];
    } else if ($stateParams.addFlag == 0) {
        //如果step3数据对象存在，则为编辑模式
        if (allObj.step3.beginTime) {
            //编辑模式数据预处理
            $scope.editMode = true;
            $scope.data = allObj.step3;
            $scope.data.fromDate = allObj.step3.beginTime;
            $scope.data.endDate = allObj.step3.endTime;
            $scope.timeArr = [];

            //单选状态处理赋值
            allObj.step3.showCountday == "" ? $scope.data.playTimes = "1" : $scope.data.playTimes = "2";
            $scope.data.timeLine = 1;
            //allObj.step3.showTimes[0] == ""?$scope.data.timeLine = "1":$scope.data.timeLine = "2"

            //时间段控件赋值
            //var arr = allObj.step3.showTimes

            //$scope.data.fromTime = allObj.step3.showTimes[0].split("-")[0]
            //$scope.data.finishTime = allObj.step3.showTimes[0].split("-")[1]
        }

        if (allObj.step3.addedInfo) {
            $scope.data.addPlay = 2;
            $scope.data.addPlayTime = allObj.step3.addedInfo[0].countRound;
            for (var j = 0; j <= allObj.step3.addedInfo.length - 1; j++) {
                $scope.timeArr.push(allObj.step3.addedInfo[j].timerangeId);
            }
            $scope.removeAddClass();
        } else {
            $scope.data.addPlay = 1;
            allObj.step3.addedInfo = [];
        }

        if (!!allObj.step3.timerangeIds) {
            $scope.timeArr = allObj.step3.timerangeIds;
        } else {
            allObj.step3.timerangeIds = [];
            //$scope.timeArr = []
            if ($scope.gameOrVideo == 2) {
                $scope.timeArr = [];
            }
        }
    } else {
        $scope.editMode = true;
        $scope.data = allObj.step3;
        $scope.data.fromDate = allObj.step3.beginTime;
        $scope.data.endDate = allObj.step3.endTime;

        $scope.timeArr = [];
        if ($scope.gameOrVideo == 1 && $scope.data.addPlay == 2) {
            for (var j = 0; j <= allObj.step3.addedInfo.length - 1; j++) {
                $scope.timeArr.push(allObj.step3.addedInfo[j].timerangeId);
                // console.log($scope.timeArr);
            }
        } else if ($scope.gameOrVideo == 2 && allObj.step3.timerangeIds) {
            $scope.timeArr = allObj.step3.timerangeIds;
        }

        $scope.removeAddClass();
        //单选状态处理赋值
        allObj.step3.showCountday == "" ? $scope.data.playTimes = "1" : $scope.data.playTimes = "2";
        $scope.data.timeLine = 1;
        if (allObj.step3.addedInfo) {
            $scope.data.addPlay = 2;
            $scope.data.addPlayTime = allObj.step3.addedInfo[0].countRound;
            //$scope.data.addPlayTime =  allObj.step3.addedInfo[0].countRound
            for (var j = 0; j <= allObj.step3.addedInfo.length - 1; j++) {
                $scope.timeArr.push(allObj.step3.addedInfo[j].timerangeId);
            }
            $scope.removeAddClass();
        } else {
            $scope.data.addPlay = 1;
        }
        //allObj.step3.showTimes[0] == ""?$scope.data.timeLine = "1":$scope.data.timeLine = "2"
    }

    $scope.selectedAll = function () {
        return parseInt($scope.timeArr.length) === parseInt($scope.times.length);
    };

    $scope.addInfo = function (allObj, operate, draftId) {
        //console.log($scope.data.beginTime._d + $scope.data.beginTime._d);
        if ($scope.data.fromDate !== undefined && $scope.data.endDate !== undefined) {
            var startDate, endDate;
            $scope.noRepeat = true;
            $scope.data.beginTime = formatDateService.getDate($scope.data.fromDate._d);
            $scope.data.endTime = formatDateService.getDate($scope.data.endDate._d);

            startDate = checkTimeService.dateFormat($scope.data.beginTime);
            endDate = checkTimeService.dateFormat($scope.data.endTime);

            if (startDate - endDate <= 0) {
                //if($scope.data.timeLine == "2"){
                //    //获取基础项
                //    var firstCond = formatDateService.formatTime($scope.data.fromTime._d)+'-'+formatDateService.formatTime($scope.data.finishTime._d)
                //    //提交数组
                //    var extraTimeLineArr = []
                //    extraTimeLineArr.push(firstCond)
                //    angular.forEach($rootScope.extra_condition, function (value, index) {
                //        extraTimeLineArr.push(value)
                //    })
                //    $scope.data.showTimes = extraTimeLineArr
                //}

                //组装sendObj
                //判断是否为不限


            } else {
                commonService.ctrlError('操作', '起始日期不可大于结束日期');
                $scope.noRepeat = false;
                return;
            }
        } else {
            $scope.data.beginTime = '';
            $scope.data.endDate = '';
        }

        if ($scope.data.timeLine == "1") {
            //$scope.data.showTimes = []
        }
        if ($scope.data.playTimes == "1") {
            $scope.data.showCountday = "";
        }

        if ($scope.data.addPlay == "1") {
            $scope.data.addedInfo = [];
            if ($scope.gameOrVideo == 2) {
                $scope.data.timerangeIds = $scope.timeArr;
            }
        } else {
            $scope.data.addedInfo = [];
            for (var i = 0; i <= $scope.timeArr.length - 1; i++) {
                $scope.data.addedInfo.push({
                    "countRound": $scope.data.addPlayTime,
                    "timerangeId": $scope.timeArr[i]
                });
            }
            // $scope.data.addedInfo = [
            //     {
            //         "countRound" : $scope.data.addPlayTime, //每轮加播次数
            //         //"timerangeId" : 4 //加播时段Id
            //         "timerangeId" : $scope.timeArr //加播时段Id
            //     }
            // ]
        }

        allObj.step3 = $scope.data;

        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId', {
            operate: '@operate',
            draftId: '@draftId'
        });
        $com.save({ operate: operate, draftId: draftId }, allObj, function (res) {
            if (res.success) {
                if (operate == "draft") {
                    commonService.ctrlSuccess('保存草稿');
                    dataAccess.sessionRemove('allObj');
                    $state.go('app.order.adOrderList', { deviceId: $stateParams.projectId });
                } else {
                    commonService.ctrlModal('waitCheckType').result.then(function () {
                        $state.go('app.order.checkSheetList');
                        dataAccess.sessionRemove('allObj');
                    });
                }

                //commonService.ctrlSuccess('添加');
                //$state.go('app.order.addAdOrder2',{addFlag:$stateParams.addFlag});
                //dataAccess.sessionSave('allObj',allObj)
                //dataAccess.sessionRemove('allObj')
                //commonService.ctrlSuccess('保存草稿');
                //commonService.ctrlModal('waitCheckType').result.then(function(){
                //$state.go('app.order.checkSheetList')
                // })
                //$modalInstance.close()
            } else {
                commonService.ctrlError('保存草稿', res.message);
                //$scope.noRepeat = false
            }
        });
    };

    //添加新时段
    $scope.addCondtion = function () {
        //此处计数器i为了保证删除后i一致
        if ($rootScope.i >= 0) {
            i = $rootScope.i;
            console.log(i);
        }
        //设置最多添加多少条数据
        if (i < 4) {
            var condObj = { id: i };
            $rootScope.condArray.push(condObj);

            $scope.condArray = $rootScope.condArray;

            i++;
            $rootScope.i = i;
        } else {
            alert('最多只能设置5条数据');
        }
    };

    $scope.commitInfo = function () {
        $scope.addInfo(allObj, 'draft', allObj.step1.billId);
    };

    //每日播放次数改变每轮播放次数
    $scope.changeShowCountround = function (type, num) {

        if (!isNaN(num)) {
            var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/:count/getCountRoundOrDay?type=:type', { count: '@count', type: '@type' });
            $com.get({ count: num, type: type }, function (res) {
                if (res.success) {
                    if (type == 'countRound') {
                        $scope.data.showCountday = res.message;
                    } else {
                        $scope.data.showCountround = res.message;
                    }
                } else {
                    commonService.ctrlError('操作', res.message);
                }
            });
        }
    };

    $scope.submit = function (saveWay) {
        //是存为草稿还是存为广告单
        if (!$scope.data.fromDate || !$scope.data.endDate) {
            commonService.ctrlError('操作', '请填写日期');
            $scope.noRepeat = false;
        }
        var startDate, endDate;
        $scope.noRepeat = true;
        $scope.data.beginTime = formatDateService.getDate($scope.data.fromDate._d);
        $scope.data.endTime = formatDateService.getDate($scope.data.endDate._d);

        startDate = checkTimeService.dateFormat($scope.data.beginTime);
        endDate = checkTimeService.dateFormat($scope.data.endTime);

        console.log($scope.data);
        console.log(startDate);

        var now = new Date();
        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日
        var currentData = year + '-' + month + '-' + day;

        var currentDataChange = checkTimeService.dateFormat(currentData);

        if (startDate - currentDataChange < 0) {
            commonService.ctrlError('操作', '起始日期需要大于等于今天日期');
            return;
        }

        if (startDate - endDate <= 0) {
            //if($scope.data.timeLine == "2"){
            //    //获取基础项
            //    var firstCond = formatDateService.formatTime($scope.data.fromTime._d)+'-'+formatDateService.formatTime($scope.data.finishTime._d)
            //    //提交数组
            //    var extraTimeLineArr = []
            //    extraTimeLineArr.push(firstCond)
            //    angular.forEach($rootScope.extra_condition, function (value, index) {
            //        extraTimeLineArr.push(value)
            //    })
            //    $scope.data.showTimes = extraTimeLineArr
            //}

            //组装sendObj
            //判断是否为不限
            if ($scope.data.timeLine == "1") {
                //$scope.data.showTimes = []
            }
            if ($scope.data.playTimes == "1") {
                $scope.data.showCountday = "";
            }

            if ($scope.data.addPlay == "1") {
                $scope.data.addedInfo = [];
                if ($scope.gameOrVideo == 2) {
                    $scope.data.timerangeIds = $scope.timeArr;
                }
            } else {
                // $scope.data.addedInfo = [
                //     {
                //         "countRound" : $scope.data.addPlayTime, //每轮加播次数
                //         "timerangeId" : 4 //加播时段Id
                //     }
                // ]
                $scope.data.addedInfo = [];
                for (var i = 0; i <= $scope.timeArr.length - 1; i++) {
                    $scope.data.addedInfo.push({
                        "countRound": $scope.data.addPlayTime,
                        "timerangeId": $scope.timeArr[i]
                    });
                }
            }

            if ($scope.gameOrVideo == 2) {
                $scope.data.timerangeIds = $scope.timeArr;
                if ($scope.timeArr.length <= 0) {
                    commonService.ctrlError('操作', '请至少选择一个时间段');
                    return;
                }
            }

            if ($scope.data.addPlay == 2 && $scope.gameOrVideo == 1) {
                if ($scope.timeArr.length <= 0) {
                    commonService.ctrlError('操作', '请至少选择一个时间段');
                    return;
                }
            }

            if (allObj.step2.screenType == 2 && (allObj.step1.pointType == 2 || allObj.step1.pointType == 3)) {
                if (allObj.step2.fileInfo.length < 2) {
                    commonService.ctrlError('操作', '请返回上一步先选择素材');
                    return;
                }
            }

            if (allObj.step2.screenType == 1 && (allObj.step1.pointType == 2 || allObj.step1.pointType == 3)) {
                if (allObj.step2.fileInfo.length < 4) {
                    commonService.ctrlError('操作', '请返回上一步先选择素材');
                    return;
                }
            }

            if (allObj.step1.pointType == 1 || allObj.step1.pointType == 4) {
                if (allObj.step2.fileInfo.length < 1) {
                    commonService.ctrlError('操作', '请返回上一步先选择素材');
                    return;
                }
            }
            allObj.step3 = $scope.data;

            //存为草稿
            // if(saveWay == 'draft') {
            //     $scope.addInfo(allObj,'draft',allObj.step1.billId);
            //     return;
            // }

            //提交广告单
            //编辑模式
            //if($scope.editMode){

            // if($stateParams.addFlag == "0" || $stateParams.addFlag == "newAdd") {
            if ($stateParams.addFlag == "newAdd") {
                $scope.addInfo(allObj, 'add', allObj.step1.billId);
            } else {
                if (parseInt($stateParams.addFlag) == 0) {
                    allObj.isDraft = true;
                } else {
                    allObj.isDraft = false;
                }
                var promise = $http({
                    method: 'put',
                    url: $scope.app.host + '/api/cinema-adLaunch/adBill',
                    data: allObj
                });

                promise.then(function (res) {

                    if (res.data.success) {
                        //commonService.ctrlSuccess('编辑')
                        dataAccess.sessionRemove('allObj');
                        commonService.ctrlModal('waitCheckType').result.then(function () {
                            $state.go('app.order.checkSheetList');
                        });
                    } else {
                        commonService.ctrlError('编辑', res.data.message);
                        $scope.noRepeat = false;
                    }
                });
            }

            //}else {
            // var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill')

            // $com.save({} , allObj , function(res){

            //     if(res.success){
            //         //commonService.ctrlSuccess('新建')
            //         dataAccess.sessionRemove('allObj')
            //         commonService.ctrlModal('waitCheckType').result.then(function(){
            //             $state.go('app.order.checkSheetList')
            //         })
            //     }else {
            //         commonService.ctrlError('新建', res.msg)
            //         $scope.noRepeat = false
            //     }
            // })
            //$scope.addInfo(allObj,'add',allObj.step1.billId);
            //}
        } else {
            commonService.ctrlError('操作', '起始日期不可大于结束日期');
            $scope.noRepeat = false;
        }
    };
}]);

//排期表
app.controller('adPlayListCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', 'adService', function ($scope, staticData, $resource, commonService, $http, $stateParams, adService) {

    $scope.statId = $stateParams.id;
    $scope.name = $stateParams.name;
    //console.log($scope.statId)
    //$scope.datas1 = {
    //    "error" : "",
    //    "pageNo" : 1,
    //    "pageSize" : 15,
    //    "pages" : 1,
    //    "result" : [
    //        {
    //            "data" : [
    //                [ 1, 2 ],
    //                [ 2, 2 ],
    //                [ 2 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                 [ 8, 20 ],
    //                 [ 8, 20 ],
    //                 [ 8, 20 ],
    //                [ 8, 20 ],
    //                 [ 8, 20 ],
    //                 [ 8, 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ],
    //                 [ 20 ]
    //            ],
    //            "pointId" : "12312312",
    //            "pointName" : "qweqwewqe",
    //            "pointType" : "2"
    //        },
    //        {
    //            "data" : [
    //                [ 1, 2 ],
    //                [ 2, 2 ],
    //                [ 2 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ]
    //            ],
    //            "pointId" : "12312312",
    //            "pointName" : "aaaaaaaaaa",
    //            "pointType" : "3"
    //        },
    //        {
    //            "data" : [
    //                [ 1, 2 ],
    //                [ 2, 2 ],
    //                [ 2 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 8, 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ],
    //                [ 20 ]
    //            ],
    //            "pointId" : "12312312",
    //            "pointName" : "bbbbbbbb",
    //            "pointType" : "1"
    //        }
    //    ],
    //    "success" : true,
    //    "total" : 1
    //}
    //$scope.datas = $scope.datas1.result
    //console.log($scope.datas)

    //时间插件
    $scope.logSearchCond = staticData.logSearchCond;
    $scope.fromDate = undefined;
    $scope.fromHour = undefined;
    $scope.fromMin = undefined;

    $scope.option1 = {
        locale: 'zh-cn',
        format: 'YYYY-MM'
        //showClear: true,
        //minDate: '2017-11-01'

    };
    $scope.fromDate = new Date();

    //查询
    $scope.query = function (billId, date, pageNo, pageSize) {
        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill/getSchedule/:billId/:date?pageNo=:pageNo&pageSize=:pageSize', {
            billId: '@billId', date: '@date', pageNo: '@pageNo', pageSize: '@pageSize'
        });
        $com.get({ billId: billId, date: date, pageNo: pageNo, pageSize: pageSize }, function (res) {
            if (res) {
                $scope.datas = res.dataList;
                console.log($scope.datas);
                $scope.totalItems = res.dataList.total;
                $scope.numPages = res.dataList.pages;
                $scope.currentPage = res.dataList.pageNo;
            }
        });
    };
    //$scope.query($scope.statId , ' ' , ' ' , 1 , 20)
    //$scope.datas =[]
    //条件搜索e
    $scope.search = function (fromDate, pageNo, pageSize) {
        if (fromDate) {
            var fromDate = $scope.fromDate._d;
            //console.log($scope.fromDate._d)
            var fromDateTrans = adService.getMoth(fromDate);
            //console.log(fromDateTrans)
            $scope.query($scope.statId, fromDateTrans, pageNo, pageSize);
        }
    };
    //$scope.search($scope.fromDate , 1 , 20)

    $scope.return = function () {
        history.back();
    };
}]);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by chenqi1 on 2017/6/30.
 */
//节目列表

app.controller('programListCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'programService', 'checkBtnService', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, programService, checkBtnService) {

    var programSelectedArr = [];
    $scope.programSelectedArr = programSelectedArr;

    $scope.query = function (name, pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/mps-materialList/materialList?name=:name&pageNo=:pageNo&pageSize=:pageSize", {
            name: '@name',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ name: name, pageNo: pageNo, pageSize: pageSize }, function (data) {
            $scope.datas = data.results;
            $scope.programList = data.results;
        });
    };

    $scope.query();

    //监听按键
    $scope.search = function (name, e, pageNo, pageSize) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(name, pageNo, pageSize);
            }
        }
    };

    //点击新建按钮触发弹框
    $scope.addProgram = function () {
        checkBtnService.check("/api/mps-materialList/materialList", 'POST').then(function () {
            commonService.addPro();
        });
    };

    //删除操作
    $scope.delete = function (data) {
        //检查删除权限
        checkBtnService.check("/api/mps-materialList/materialList", 'put').then(function () {
            //获取删除项对象集合
            var sendObj = programService.getSelectedProgram(data, $scope.datas);

            if (sendObj.ids.length == 0) {
                commonService.ctrlError('操作', '请先选择节目');
            } else {
                commonService.ctrlModal("deleteProgramType").result.then(function () {

                    var promise = $http({
                        method: 'put',
                        url: $scope.app.host + '/api/mps-materialList/materialList',
                        data: sendObj
                    });

                    promise.then(function (res) {
                        res.data.success ? commonService.ctrlSuccess('删除') : commonService.ctrlError('删除', res.msg);
                        $scope.query();
                    });
                });
            }
        });
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;
}]);

//新建节目模态框
app.controller('addProCtrl', ['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'staticData', 'programService', function ($scope, $modalInstance, $resource, $state, commonService, staticData, programService) {

    var host = staticData.hostUrl;
    var id = "";
    $scope.addProModel = true;

    $scope.submit = function () {

        var $com = $resource(host + "/api/mps-materialList/materialList");
        $com.save({}, $scope.data, function (res) {
            res.success ? commonService.ctrlSuccess('新建节目') : commonService.ctrlError('新建节目', res.message);

            id = res.message;
            if (res.success == true) {
                $state.go('app.program.addProgram', { id: id, name: $scope.data.name, bool: false });
            }
        });

        $modalInstance.close();
        $scope.addProModel = false;
    };

    $scope.doSubmit = function (e) {
        //验证输入项是否符合要求
        var bool = programService.limitNameLength($scope.data.name);
        $scope.bool = bool;
        //验证按键事件
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;

            switch (keycode) {
                case 13:
                    if (bool) {
                        $scope.submit();
                        break;
                    }
            }
        } else {
            if (bool) {
                $scope.submit();
            }
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $scope.addProModel = false;
    };
}]);

//添加修改素材列表

app.controller('addProgramCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'programService', '$stateParams', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, programService, $stateParams) {
    var programSelectedArr = [];
    $scope.programSelectedArr = programSelectedArr;
    var name = $stateParams.name;
    var edit = !!$stateParams.bool;
    $scope.programName = name; //获取的名字
    $scope.editProName = false;
    $scope.materialListId = $stateParams.id; //获取的id
    $scope.datas = [];
    //查询列表
    $scope.query = function (materialListId, pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/mps-materialList/materialList/:materialListId/material?pageNo=:pageNo&pageSize=:pageSize", {
            materialListId: '@materialListId',
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ materialListId: materialListId, pageNo: pageNo, pageSize: pageSize }, function (data) {
            $scope.datas = data.results;
        });
    };
    //
    if (edit) {
        $scope.query($scope.materialListId, 1, 10000);
    }
    //
    //改名字
    $scope.changeName = function (name, materialListId) {
        if (name == '') {
            commonService.ctrlError('操作', '请输入名字');
        } else {
            var sendObj = { 'name': name };
            var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-materialList/materialList/' + materialListId + '/name', data: sendObj });
            promise.then(function (res) {
                res.data.success ? commonService.ctrlSuccess('保存') : commonService.ctrlError('保存', res.data.message);
                if (res.data.success) {
                    $scope.editProName = !$scope.editProName;
                }
            });
        }
    };

    $scope.submit = function (id, arr) {
        if (arr == '') {
            commonService.ctrlError('操作', '请先选择素材');
        } else if (edit) {
            //for(var i = 0; i < arr.length; i++){
            //    if(arr[i].orderNumber == ""){
            //        arr[i].orderNumber = 0
            //    }
            //}
            var sendObj = { 'fileList': arr };
            var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-materialList/materialList/' + id + '/file', data: sendObj });

            promise.then(function (res) {
                res.data.success ? commonService.ctrlSuccess('保存') : commonService.ctrlError('保存', res.data.message);
                if (res.data.success) {
                    $scope.query(id, 1, 1000);
                }
            });
        } else if (!edit) {
            //for(var i = 0; i < arr.length; i++){
            //    if(arr[i].orderNumber == ""){
            //        arr[i].orderNumber = 0
            //    }
            //}
            var sendObj = { 'fileList': arr };
            var promise = $http({ method: 'post', url: $scope.app.host + '/api/mps-materialList/materialList/' + id + '/file', data: sendObj });

            promise.then(function (res) {
                res.data.success ? commonService.ctrlSuccess('保存') : commonService.ctrlError('保存', res.data.message);
                if (res.data.success) {
                    $scope.query(id, 1, 1000);
                }
            });
        }
    };

    //删除操作
    $scope.delete = function (index, bool) {
        if (bool) {
            commonService.ctrlModal("delRole").result.then(function () {
                $scope.datas.splice(index, 1);
            });
        } else {
            if (index == '') {
                commonService.ctrlError('操作', '请先选择素材');
            } else {
                commonService.ctrlModal("delRole").result.then(function () {
                    for (var i = 0; i < index.length; i++) {
                        for (var k = 0; k < $scope.datas.length; k++) {
                            if ($scope.datas[k].uid == index[i]) {
                                $scope.datas.splice(k, 1);
                                break;
                            }
                        }
                    }
                    $scope.programSelectedArr = [];
                });
            }
        }
    };
    //取消改名字操作
    $scope.clearName = function () {
        $scope.programName = name;
        $scope.editProName = !$scope.editProName;
    };
    $scope.editName = function () {
        //$scope.programName = name2;
        $scope.editProName = !$scope.editProName;
        //angular.element('.proName').focus().select()
        var focusEle = angular.element('.proName');
        $timeout(function () {
            focusEle.focus().select();
        });
    };
    $scope.addProName = function (name, materialListId) {
        $scope.changeName(name, materialListId);
        //console.log(materialListId)
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;

    //监听导入的素材列表
    $scope.$on('newSelectList', function (event, args) {

        //$scope.datas = args.newSelectList;
        var itemBool = false;
        for (var i = 0; i < args.newSelectList.length; i++) {
            for (var k = 0; k < $scope.datas.length; k++) {
                if (args.newSelectList[i].uid == $scope.datas[k].uid) {
                    itemBool = true;
                    break;
                }
            }
            if (itemBool == false) {
                args.newSelectList[i]["orderNumber"] = '';
                $scope.datas.push(args.newSelectList[i]);
            }
            itemBool = false;
        }
        //console.log(args.newSelectList);
        //console.log($scope.datas);
    });
}]);

//文件操作模态框
app.controller('treeNodeCtrl', ['$scope', '$rootScope', '$resource', '$state', 'commonService', '$q', 'addDiyDom', function ($scope, $rootScope, $resource, $state, commonService, $q, addDiyDom) {
    var _setting;

    var zTreeObj; //初始化树形结构对象

    var setting = (_setting = {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: false,
            dblClickExpand: true,
            addDiyDom: addDiyDoms
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    }, _defineProperty(_setting, 'data', {
        key: {
            name: "name",
            title: "name"
        }
    }), _defineProperty(_setting, 'callback', {
        onCheck: zTreeOnCheck
    }), _setting);

    //自定义Dom样式
    function addDiyDoms(treeId, treeNode) {
        addDiyDom.diyDom(treeId, treeNode, 'check');
    }

    //是否选中状态的DOM操作
    function zTreeOnCheck(event, treeId, treeNode) {
        //console.log(treeId);

        var zTree = $.fn.zTree.getZTreeObj("treeNodes");
        var nodes = zTree.getCheckedNodes(true);

        for (var i = 0; i <= nodes.length - 1; i++) {
            $("#" + nodes[i].tId).css("background-color", "#fff3e4");
        }

        var noChecked = zTree.getCheckedNodes(false);

        for (var j = 0; j <= noChecked.length - 1; j++) {
            $("#" + noChecked[j].tId).css("background-color", "#fff");
        }

        // if (!treeNode.checked) {
        //     $("#" + treeNode.tId).css("background-color", "#fff");
        //     console.log("未勾选" + treeNode.name);
        // } else {
        //     $("#" + treeNode.tId).css("background-color", "#fff3e4");
        //     console.log("勾选" + treeNode.name);
        // }
    }

    //异步加载数据树
    setTimeout(function () {
        $scope.query('', true);
    }, 0);

    //取消全部选中
    $scope.cancelSelect = function () {
        var treeObj = $.fn.zTree.init($("#treeNodes"), setting, $scope.ztreeNodeMessage);
        treeObj.cancelSelectedNode();
    };

    //导入素材
    $scope.importMedia = function () {
        var zTree = $.fn.zTree.getZTreeObj("treeNodes");
        var nodes = zTree.getCheckedNodes(true);
        if (nodes.length <= 0) {
            commonService.ctrlError('导入', '请先选择素材');
            return;
        }
        var newSelectObj = [];
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var house = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        var milsecond = date.getMilliseconds();
        var timeNow = year + "-" + month + "-" + day + " " + house + ":" + minutes + ":" + second;

        for (var i = 0; i <= nodes.length - 1; i++) {
            if (!nodes[i].isParent) {
                nodes[i].selectTime = timeNow;
                newSelectObj.push(nodes[i]);
            }
        }
        $scope.$emit('newSelectList', { newSelectList: newSelectObj });
    };

    //滚动条设置
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('scrolls'));
        //滚动底部的时候触发
        $('#scrollleft').on('scrollreachbottom', function (ev) {});
    }, 100);

    ////滚动条
    //$scope.scrollHeight = function () {
    //    //console.log($(window).height())
    //    $('#scrolls').css('height', $(window).height() - 310)
    //}
    //
    //$scope.scrollHeight();
    //$(window).resize(function () {
    //    $('#scrolls').css('height', $(window).height() - 310)
    //});

    //默认查找根目录文件
    $scope.query = function (path, all) {
        //测试接口,对接口进行测试
        var $com = $resource("/api/mps-filemanager/file/tree?path=:path&all=:all", {
            path: '@path',
            all: '@all'
        });

        $com.get({ path: path, all: all }, function (data) {

            $scope.ztreeNodeMessage = data.message;
            console.log(data.message);
            zTreeObj = $.fn.zTree.init($("#treeNodes"), setting, data.message);
            var type = { "Y": "s", "N": "s" };
            zTreeObj.setting.check.chkboxType = type;
        });
    };

    //搜索框功能
    $scope.searchKeyword = function () {
        var keyword = $("#keyword").val();
        zTreeObj = $.fn.zTree.init($("#treeNodes"), setting, $scope.ztreeNodeMessage);
        var treeObj = $.fn.zTree.getZTreeObj("treeNodes");
        var nodes = treeObj.getNodesByParamFuzzy("name", keyword, null);
        zTreeObj = $.fn.zTree.init($("#treeNodes"), setting, nodes);
        //filter();
    };

    //过滤ztree显示数据,暂时未用到该功能
    function filter() {
        //获取不符合条件的叶子结点
        var hiddenNodes = zTreeObj.getNodesByFilter(filterFunc);
        //显示上次搜索后背隐藏的结点
        zTreeObj.showNodes(hiddenNodes);

        //查找不符合条件的叶子节点
        function filterFunc(node) {
            var _keywords = $("#keyword").val();

            if (node.isParent || node.name.indexOf(_keywords) != -1) return false;
            return true;
        };
        //hiddenNodes=zTreeObj.getNodesByFilter(filterFunc);
        //隐藏不符合条件的叶子结点
        zTreeObj.hideNodes(hiddenNodes);
    };
}]);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Administrator on 2017\7\3 0003.
 */
app.controller('roleCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'backPathService', 'mediaService', 'commonService', 'dataAccess', 'checkBtnService', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, backPathService, mediaService, commonService, dataAccess, checkBtnService) {
    var mediaSelectedArr = [];
    $scope.mediaSelectedArr = mediaSelectedArr;
    $scope.datas = [];

    //角色搜索
    $scope.query = function (hasCount, roleName) {

        var $com = $resource($scope.app.host + "/api/mps-user/role?hasCount=:hasCount&roleName=:roleName", {
            hasCount: '@hasCount',
            roleName: '@roleName'
        });

        $com.get({ hasCount: hasCount, roleName: roleName }, function (data) {
            dataAccess.set("permissionDateRes", data);
            $scope.datas = data.results;
        });
    };
    $scope.query();
    $scope.queryRoleName = function (e, bol, name) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.query(bol, name);
            }
        } else {
            $scope.query(bol, name);
        }
    };
    //删除
    $scope.delete = function (data) {
        //检测删除权限
        checkBtnService.check("/api/mps-user/role/:roleId", 'delete').then(function () {
            //获取删除项对象集合
            if (typeof data == 'string') {
                var sendObj = data;
            } else {
                var sendObj = data.join(',');
            }
            if (sendObj.length == 0) {
                commonService.ctrlError('操作', '请先选择角色');
            } else {
                commonService.ctrlModal("delRole").result.then(function () {

                    var $com = $resource($scope.app.host + "/api/mps-user/role/:roleId", {
                        roleId: '@sendObj'
                    });

                    $com.delete({ roleId: sendObj }, function (res) {
                        if (res.success) {
                            $scope.query();
                            $scope.keyword = '';
                            commonService.ctrlSuccess('删除');
                            $scope.mediaSelectedArr = [];
                        } else {
                            commonService.ctrlError('删除', res.message);
                        }
                    });
                });
            }
        });
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;

    //滚动条
    $scope.scrollHeight = function () {
        //console.log($(window).height())
        $('#scroll').css('height', $(window).height() - 230);
    };
    $scope.scrollHeight();
    $(window).resize(function () {
        $('#scroll').css('height', $(window).height() - 230);
    });
    //滚动条设置
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('scroll'));
        //滚动底部的时候触发
        $('#scroll').on('scrollreachbottom', function (ev) {});
    }, 100);
}]);

//添加和编辑权限操作
app.controller('permissionCtrl', ['$scope', '$resource', '$stateParams', '$state', '$modal', 'commonService', 'dataAccess', '$timeout', function ($scope, $resource, $stateParams, $state, $modal, commonService, dataAccess, $timeout) {

    var perSelectedArr = [[], []];
    var userSelectedArr = [];
    var name = ''; //权限的名字用鱼取消该名字的时候使用


    $scope.roleId = '';
    $('.groupNameFocus').focus(function () {
        $scope.errorMsg = false;
    });
    //查询权限类
    var queryPermission = function queryPermission(id) {
        var $com = $resource($scope.app.host + "/api/mps-user/role/:id/permission", { id: '@id' });
        $com.get({ id: id }, function (data) {

            $scope.permissionDatas = data.results;
            // console.log(data.results)

            angular.forEach($scope.permissionDatas, function (data, index) {
                //console.log(index);
                perSelectedArr[index + 1] = [];
                angular.forEach(data.methods, function (mData) {
                    if (mData.checked === true) {
                        perSelectedArr[0].push(mData.id);
                        perSelectedArr[index + 1].push(mData.id);
                    }
                });
            });
            //console.log(perSelectedArr)
            $scope.perSelectedArr = perSelectedArr;
        });
    };

    //查询组成员
    var queryUser = function queryUser(id) {
        var $com = $resource($scope.app.host + "/api/mps-user/role/:id/member", { id: '@id' });
        $com.get({ id: id }, function (data) {

            $scope.groupUsers = data.results;

            angular.forEach($scope.groupUsers, function (data) {
                if (data.check_flag === 'Y') {
                    userSelectedArr.push(data.user_id);
                }
            });
            $scope.userSelectedArr = userSelectedArr;
        });
    };

    //edit_mode为true，即为编辑模式
    var edit_mode = !!$stateParams.id;
    $scope.editProName = edit_mode;

    //取消改名字操作
    $scope.clearName = function () {
        $scope.roleName = name;
        $scope.editProName = !$scope.editProName;
    };
    $scope.editName = function () {
        $scope.editProName = !$scope.editProName;
        var focusEle = angular.element('.proName');
        $timeout(function () {
            focusEle.focus().select();
        });
    };

    //编辑权限信息需要先拉取对应信息并显示
    if (edit_mode) {
        var permissionDateRes = dataAccess.get("permissionDateRes");

        angular.forEach(permissionDateRes.results, function (data) {
            if (data.roleId == $stateParams.id) {
                $scope.data = data;
                $scope.roleId = data.roleId;
                name = data.roleName;
            }
        });
        queryPermission($scope.roleId);
        //queryUser($scope.roleId)
    } else {
        $scope.data = {};
        queryPermission('null');
    }

    //提交按钮的编辑和新增状态控制
    //添加组名
    $scope.addGroupName = function () {
        $('.btnSubmit').attr('disabled', true);
        if (edit_mode) {
            var $comUpdate = $resource($scope.app.host + "/api/mps-user/role/:id", { id: '@id' }, {
                'update': { method: 'PUT' }
            });

            $comUpdate.update({ id: $scope.roleId }, this.data, function (res) {
                if (res.success) {
                    commonService.ctrlSuccess('添加');
                    $('.btnSubmit').attr('disabled', false);
                    name = $scope.data.roleName;
                    $scope.editProName = !$scope.editProName;
                } else {
                    $('.btnSubmit').attr('disabled', false);
                    //$scope.errorMsg = res.message
                    commonService.ctrlError('操作', res.message);
                }
            });
        } else {
            var $com = $resource($scope.app.host + "/api/mps-user/role");

            $com.save(this.data, function (res) {
                if (res.success) {
                    $scope.roleId = res.message;
                    //queryPermission($scope.roleId)
                    //queryUser($scope.roleId)
                    $('.btnSubmit').attr('disabled', false);
                    edit_mode = true;
                    commonService.ctrlSuccess('操作');
                    name = $scope.data.roleName;
                    $scope.editProName = !$scope.editProName;
                } else {
                    $('.btnSubmit').attr('disabled', false);
                    $scope.errorMsg = res.message;
                }
            });
        }
    };
    $scope.getIcon = function (index) {
        switch (index) {
            case 0:
                return 'iconfont icon-wenjianjia';
            case 1:
                return 'iconfont icon-fasong';
            case 2:
                return 'iconfont icon-shebei';
            case 3:
                return 'iconfont icon-earth';
            case 4:
                return 'iconfont icon-wenjianjia';

        }
    };
    //添加权限类
    app.controller('permissionClass', ['$scope', '$resource', '$modal', 'perService', 'commonService', 'selectService', function ($scope, $resource, $modal, perService, commonService, selectService) {

        $scope.perSelectedArr = perSelectedArr;
        //console.log(perSelectedArr)
        $scope.addPermissionList = function (id) {
            if ($scope.roleId == '') {
                commonService.ctrlError('操作', '请填写并保存权限名');
                return;
            }
            //提交信息到保存权限api
            var $com = $resource($scope.app.host + "/api/mps-user/role/:id/permission", { id: '@id' });
            $com.save({ id: id }, perSelectedArr[0], function (data) {
                if (data.success) {
                    commonService.ctrlSuccess('添加');
                    $state.go('app.role.roleList');

                    //$state.go('app.members.membersList')
                } else {
                    commonService.ctrlError('操作', res.message);
                }
            });
        };

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection;
        $scope.selectAll = selectService.selectAll;
        $scope.isSelected = selectService.isSelected;
        $scope.isSelectedAll = selectService.isSelectedAll;
        $scope.selectChildAll = selectService.selectChildAll;
        $scope.isChildSelectedAll = selectService.isChildSelectedAll;

        $scope.isSelectedAllRole = selectService.isSelectedAllRole;
    }]);

    //尝试jq解决全选问题
    $('#allCheck').on('click', function () {
        if ($(this).is(':checked')) {
            var checkList = $('.parent2Check');
            for (var i = 0; i < checkList.length; i++) {
                if (!checkList.eq(i).is(':checked')) {
                    checkList.eq(i).click();
                    //$scope.$apply();
                }
            }
        } else {
            var checkList = $('.parent2Check');
            for (var i = 0; i < checkList.length; i++) {
                if (checkList.eq(i).is(':checked')) {
                    checkList.eq(i).click();
                }
            }
        }
    });
}]);

//权限添加成员列表
app.controller('addMemberManagerCtrl', ['$scope', '$rootScope', '$http', '$resource', 'commonService', '$stateParams', function ($scope, $rootScope, $http, $resource, commonService, $stateParams) {

    $scope.selected = []; //初始化复选框
    $rootScope.roleMemberFlash = false;

    //edit_mode为true，即为编辑模式
    var edit_mode = !!$stateParams.id;
    //console.log($stateParams)


    /**
     * 列出成员列表接口
     */
    $scope.query = function (roleId, userName) {
        //console.log('搜索关键字为：' + queryValue);
        var $com = $resource($scope.app.host + "/api/mps-user/role/:roleId/member?userName=:userName", {
            //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

            roleId: '@roleId', userName: '@userName'
        });

        $com.get({ roleId: roleId, userName: userName }, function (data) {
            //console.log(data)
            var dataList = [];
            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].check_flag == 'Y') {
                    dataList.push(data.results[i]);
                }
            }
            $scope.memberList = dataList;
            $scope.selected = [];
        });
    };

    $scope.query($stateParams.id, '');

    //删除成员操作
    $scope.deleteMember = function (data) {
        var roleId = $stateParams.id;
        if (typeof data == 'string') {
            var sendObj = data;
        } else {
            var sendObj = data.join(',');
        }
        if (sendObj.length == 0) {
            commonService.ctrlError('删除', '未选择成员');
            return;
        }
        commonService.ctrlModal('memberName').result.then(function () {
            var $com = $resource($scope.app.host + "/api/mps-user/role/:roleId/member?memberIds=:memberIds", { roleId: '@roleId', memberIds: '@sendObj' });
            $com.delete({ roleId: roleId, memberIds: sendObj }, {}, function (data) {
                if (data.success) {
                    commonService.ctrlSuccess('删除');
                    $scope.selected = [];
                    $scope.query($stateParams.id);
                    //$state.go('app.member.membersList');
                }
            });
        });
    };

    //判断是否为选中状态
    $scope.isChecked = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };

    //删除选中的成员
    $scope.deleteSelected = function () {}
    //console.log('delete' + $scope.selected);


    //搜索成员列表
    ;$scope.searchMember = function (keyword, e) {
        //console.log(e)
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                //console.log('search ' + keyword);//开始进行查询操作
                $scope.query($stateParams.id, keyword);
            }
        } else {
            $scope.query($stateParams.id, keyword);
        }
    };

    //用户复选框操作，给出checkbox结果
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var checked = checkbox.checked;
        if (checked) {
            $scope.selected.push(id);
        } else {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
        }
        // console.log($scope.selected);
    };

    //添加成员
    $scope.addMember = function () {
        //console.log('添加成员');
        commonService.addRoleMemberModal($stateParams.id, $stateParams.name);
    };

    //滚动条
    $scope.scrollHeight = function () {
        //console.log($(window).height())
        $('#scroll').css('height', $(window).height() - 230);
    };
    $scope.scrollHeight();
    $(window).resize(function () {
        $('#scroll').css('height', $(window).height() - 230);
    });
    //滚动条设置
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('scroll'));
        //滚动底部的时候触发
        $('#scroll').on('scrollreachbottom', function (ev) {});
    }, 100);

    var watch = $scope.$watch('roleMemberFlash', function (newValue, oldValue, scope) {
        if (newValue) {
            $scope.query($stateParams.id);
            $rootScope.roleMemberFlash = false;
        }
    });
}]);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/6/13.
 */
app.controller('sendCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'backPathService', 'mediaService', 'commonService', 'FileUploader', 'checkBtnService', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, backPathService, mediaService, commonService, FileUploader, checkBtnService) {

    //选中数组
    var sendSelectedArr = [];
    $scope.sendSelectedArr = sendSelectedArr;

    ////预览的地址
    //var address = 'http://mpsd.kdxcloud.com:88'

    //select调用
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;

    //发送列表
    $scope.query = function (pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/mps-materialList/task?pageNo=:pageNo&pageSize=:pageSize", {
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ pageNo: pageNo, pageSize: pageSize }, function (data) {
            $scope.sendList = data.results;
            //$scope.programList = data.results
        });
    };
    $scope.query(1, 10000);

    //删除
    $scope.delete = function (data) {
        //检测删除权限
        checkBtnService.check("/api/mps-materialList/task/deleteTask", 'PUT').then(function () {
            //获取删除项对象集合
            var sendObj = [];
            if (typeof data == 'string') {
                sendObj.push(data);
            } else {
                sendObj = data;
            }
            if (sendObj.length == 0) {
                commonService.ctrlError('操作', '请先选择任务');
            } else {
                commonService.ctrlModal("delRole").result.then(function () {

                    var $com = $resource($scope.app.host + "/api/mps-materialList/task/deleteTask", {}, { 'update': { method: 'PUT' } });

                    $com.update({ taskIds: sendObj }, function (res) {
                        res.success ? commonService.ctrlSuccess('删除') : commonService.ctrlError('删除', res.message);
                        $scope.sendSelectedArr = [];
                        $scope.query(1, 10000);
                    });
                });
            }
        });
    };

    //审核通过
    $scope.rejectPass = function (taskId) {
        checkBtnService.check("/api/mps-materialList/task/:taskId/check", 'put').then(function () {
            var promise = $http({
                method: 'put',
                url: $scope.app.host + '/api/mps-materialList/task/' + taskId + '/check?result=Y',
                data: {
                    rejectReason: '',
                    remark: ''
                }
            });
            promise.then(function (res) {
                if (res.data.success) {
                    commonService.ctrlSuccess('审核通过');
                    $scope.query(1, 10000);
                } else {
                    commonService.ctrlError('审核', res.msg);
                }
                //$scope.query()
            });
        });
    };
    //驳回
    $scope.rejectRequest = function (taskId) {
        checkBtnService.check("/api/mps-materialList/task/:taskId/check", 'put').then(function () {
            commonService.rejectRequest(taskId);
        });
    };

    //播放器
    var player = {};
    //播放标志位
    var playBool = false;
    $scope.imgOnly = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if (videoPath != '') {
            $scope.imgOnly = false;
            $scope.posterImg = $rootScope.address + imgPath;
            player = videojs("my-video", {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg
                //"src":"http://vjs.zencdn.net/v/oceans.mp4",
                //controlBar: {
                //    captionsButton: false,
                //    chaptersButton : false,
                //    liveDisplay:false,
                //    playbackRateMenuButton: false,
                //    subtitlesButton:false
                //}

            });
            player.src($rootScope.address + videoPath);
            player.poster($scope.posterImg);
            playBool = true;
        } else {
            //tupian
            $scope.imgOnly = true;
            $scope.picPath = $rootScope.address + imgPath;
        }
        if (playBool) {
            player.paused();
        }
    };

    //预览
    $scope.openPlay = function (taskId) {
        checkBtnService.check("/api/mps-materialList/task/:taskId/preview", 'get').then(function () {
            var $com = $resource($scope.app.host + "/api/mps-materialList/task/:taskId/preview", {
                taskId: '@taskId'
            });
            $com.get({ taskId: taskId }, function (data) {
                if (!data.success) {
                    commonService.ctrlError('预览', data.message);
                } else if (data.message.length == 0) {
                    commonService.ctrlError('预览', '此节目单下没有可预览的素材');
                } else {
                    $scope.dataImg = data.message;
                    //console.log($scope.dataImg)
                    $('#videoMask').fadeIn(200);
                    $('#video').fadeIn(200);
                    $scope.openOtherPlay($scope.dataImg[0].picPath, $scope.dataImg[0].videoPath);
                    setTimeout(function () {
                        var num = parseInt($('.videoListInfo').width() / 270);
                        //console.log(num)
                        jQuery("#videoList").slide({ pnLoop: false, scroll: num, delayTime: 400, mainCell: ".bd ul", autoPage: true, effect: "left", autoPlay: false, vis: num, prevCell: ".prev", nextCell: ".next" });
                    }, 10);
                }
            });
        });
    };

    //关闭播放器
    $scope.closePlay = function () {
        //player.dispose();
        if (playBool) {
            player.paused();
        }
        $('#videoMask').fadeOut(200);
        $('#video').fadeOut(200);
    };
}]);

//驳回模态框
app.controller('rejectRequestCtrl', ['$scope', '$rootScope', '$resource', 'commonService', '$state', 'info', '$modalInstance', 'staticData', 'selectService', '$http', function ($scope, $rootScope, $resource, commonService, $state, info, $modalInstance, staticData, selectService, $http) {

    //console.log(info.taskId)
    var taskId = info.taskId;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //发送列表
    $scope.query = function (pageNo, pageSize) {

        var $com = $resource($scope.app.host + "/api/mps-materialList/task?pageNo=:pageNo&pageSize=:pageSize", {
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ pageNo: pageNo, pageSize: pageSize }, function (data) {
            $scope.sendList = data.results;
            //$scope.programList = data.results
        });
    };

    $scope.doSubmit = function () {
        var promise = $http({
            method: 'put',
            url: '/api/mps-materialList/task/' + taskId + '/check?result=Y',
            data: {
                rejectReason: $scope.reason,
                remark: $scope.reasonInfo
            }
        });
        promise.then(function (res) {
            if (res.data.success) {
                commonService.ctrlSuccess('驳回');
                $scope.query(1, 10000);
                $modalInstance.dismiss('cancel');
            } else {
                commonService.ctrlError('驳回', res.msg);
            }
            //$scope.query()
        });
    };
}]);
app.controller('addSendTAskCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'programService', 'checkBtnService', 'staticData', '$stateParams', 'formatDateService', 'checkTimeService', function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, programService, checkBtnService, staticData, $stateParams, formatDateService, checkTimeService) {
    //设备列表
    var equipmentSelectedArr = [];
    $scope.equipmentSelectedArr = equipmentSelectedArr;
    //节目列表
    $scope.materialList = '';

    //默认立即发送
    $scope.jobModeCode = 'immediately';

    //edit_mode为true，即为编辑模式
    var edit_mode = !!$stateParams.id;
    //console.log($stateParams.id)

    //时间插件
    $scope.logSearchCond = staticData.logSearchCond;
    $scope.fromDate = undefined;
    $scope.fromHour = undefined;
    $scope.fromMin = undefined;

    $scope.options = {
        locale: 'zh-cn',
        format: 'YYYY-MM-DD',
        showClear: true,
        minDate: new Date()
        //debug: true
    };

    $scope.optionsHour = {
        locale: 'zh-cn',
        format: 'HH',
        showClear: true
        //debug: true
    };
    $scope.optionsMin = {
        locale: 'zh-cn',
        format: 'mm',
        showClear: true,
        stepping: 10
        //debug: true
        //debug: true


        //城市json数据获取
    };$http.get('admin/js/cityList.json').success(function (data) {
        $scope.cityGroup = data;
    });

    $scope.query = function (sheetName, province, deviceName, state) {

        var $com = $resource($scope.app.host + "/api/mps-materialList/task/newTask?sheetName=:sheetName&province=:province&deviceName=:deviceName&state=:state", {
            sheetName: '@sheetName',
            province: '@province',
            deviceName: '@deviceName',
            state: '@state'
        });

        $com.get({ sheetName: sheetName, province: province, deviceName: deviceName, state: state }, function (data) {
            $scope.datas = data.sheetList;
            $scope.devices = data.deviceList;

            //$scope.programList = data.results
        });
    };
    if (!edit_mode) {
        $scope.query();
    }

    //编辑下的数据回显
    $scope.editQuery = function (taskId) {

        var $com = $resource($scope.app.host + "/api/mps-materialList/task/:taskId?sheetName=&deviceName=&province=&state=", {
            taskId: '@taskId'
        });

        $com.get({ taskId: taskId }, function (data) {
            console.log(data);
            $scope.materialList = data.sheetList[0].materialListId;
            for (var i = 0; i < data.deviceList.length; i++) {
                if (data.deviceList[i].flag == 'Y') {
                    $scope.equipmentSelectedArr.push(data.deviceList[i].deviceId);
                }
            }
            //var time = data.sendStartTime.split(' ');
            //$scope.fromDate = time[0]
            //$scope.fromHour = time[1].split(':')[0]
            //$scope.fromMin = time[1].split(':')[1]
            //$scope.programList = data.results
            $scope.datas = data.sheetList;
            $scope.devices = data.deviceList;
            $scope.fromDate = data.sendStartTime;
            $scope.fromHour = data.sendStartTime;

            $scope.fromMin = data.sendStartTime;
        });
    };
    if (edit_mode) {
        $scope.editQuery($stateParams.id);
    }
    //查找节目单名称
    $scope.sheetNameQuery = function (sheetName) {
        var $com = $resource($scope.app.host + "/api/mps-materialList/task/newTask?sheetName=:sheetName&province=&deviceName=&state=", {
            sheetName: '@sheetName'
        });

        $com.get({ sheetName: sheetName }, function (data) {
            $scope.datas = data.sheetList;
            //$scope.programList = data.results
        });
    };

    //查找设备
    $scope.deviceQuery = function (province, deviceName, state) {
        var $com = $resource($scope.app.host + "/api/mps-materialList/task/newTask?sheetName=&province=:province&deviceName=:deviceName&state=:state", {
            province: '@province',
            deviceName: '@deviceName',
            state: '@state'
        });

        $com.get({ province: province, deviceName: deviceName, state: state }, function (data) {
            $scope.devices = data.deviceList;

            //$scope.programList = data.results
        });
    };
    //监听按键
    $scope.searchMater = function (name, e) {
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;

            if (keycode == 13) {
                $scope.sheetNameQuery(name);
            }
        } else {
            $scope.sheetNameQuery(name);
        }
    };

    $scope.searchDevice = function (province, deviceName, state, e) {
        console.log(e);
        if (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.deviceQuery(province, deviceName, state);
            }
        } else {
            $scope.deviceQuery(province, deviceName, state);
        }
    };

    //select相关操作的方法绑定
    $scope.updateSelection = selectService.updateSelection;
    $scope.selectAll = selectService.selectAll;
    $scope.isSelected = selectService.isSelected;
    $scope.isSelectedAll = selectService.isSelectedAll;
    //节目单操作
    $scope.isMaterialSelect = function (id) {
        return $scope.materialList == id;
    };
    $scope.updateMaterialList = function (id) {
        $scope.materialList = id;
    };

    //提交表单
    $scope.saveTask = function () {
        //防止多次提交
        $('.btnSubmit').attr('disabled', true);
        if ($scope.materialList == '') {
            $('.btnSubmit').attr('disabled', false);
            commonService.ctrlError('创建', '清选择节目单');
            return;
        }
        if ($scope.equipmentSelectedArr.length == 0) {
            $('.btnSubmit').attr('disabled', false);
            commonService.ctrlError('创建', '清选择设备');
            return;
        }
        if ($scope.jobModeCode == 'timing') {
            console.log($scope.fromDate);
            if ($scope.fromDate == null || $scope.fromHour == null || $scope.fromMin == null) {
                commonService.ctrlError('创建', '清选择时间');
                return;
            }
            var fromDate = $scope.fromDate._d;
            var fromDateTrans = formatDateService.getDate(fromDate);

            var fromHour = $scope.fromHour._d;
            var fromHourTrans = formatDateService.formatHour(fromHour);

            var fromMin = $scope.fromMin._d;
            var fromMinTrans = formatDateService.formatMinute(fromMin);

            //var todayDate = new Date();
            var todayDateTrans = new Date().getTime();
            //
            var starTime = fromDateTrans + ' ' + fromHourTrans + ':' + fromMinTrans;
            var starTime2 = starTime.replace(new RegExp("-", "gm"), "/");
            starTime2 = new Date(starTime2).getTime();
            //console.log(fromDateTrans)
            //console.log(fromHourTrans)
            //console.log(starTime < (todayDateTrans + 60*1000))
            //return
            if (starTime2 < todayDateTrans + 60 * 1000) {
                $('.btnSubmit').attr('disabled', false);
                commonService.ctrlError('创建', '时间不能早于当前时间10分钟');
                return;
            }
            if (!edit_mode) {
                var $com = $resource($scope.app.host + "/api/mps-materialList/task");
                $com.save({}, { materialListId: $scope.materialList, deviceIdList: $scope.equipmentSelectedArr, sendStartTime: starTime }, function (res) {
                    if (res.success) {
                        commonService.ctrlSuccess('创建');
                        $state.go('app.send.sendList');
                    } else {
                        $('.btnSubmit').attr('disabled', false);
                        commonService.ctrlError('创建', res.message);
                    }
                });
            } else {

                var $com = $resource($scope.app.host + "/api/mps-materialList/task/:task", {
                    task: '@$stateParams.id'
                }, { 'update': { method: 'PUT' } });
                $com.update({ task: $stateParams.id }, { materialListId: $scope.materialList, deviceIdList: $scope.equipmentSelectedArr, sendStartTime: starTime }, function (res) {
                    if (res.success) {
                        commonService.ctrlSuccess('编辑');
                        $state.go('app.send.sendList');
                    } else {
                        $('.btnSubmit').attr('disabled', false);
                        commonService.ctrlError('编辑', res.message);
                    }
                });
            }
        } else {
            if (!edit_mode) {
                var $com = $resource($scope.app.host + "/api/mps-materialList/task");
                $com.save({}, { materialListId: $scope.materialList, deviceIdList: $scope.equipmentSelectedArr, sendStartTime: starTime }, function (res) {
                    if (res.success) {
                        commonService.ctrlSuccess('创建');
                        $state.go('app.send.sendList');
                    } else {
                        $('.btnSubmit').attr('disabled', false);
                        commonService.ctrlError('创建', res.message);
                    }
                });
            } else {

                var $com = $resource($scope.app.host + "/api/mps-materialList/task/:task", {
                    task: '@$stateParams.id'
                }, { 'update': { method: 'PUT' } });
                $com.update({ task: $stateParams.id }, { materialListId: $scope.materialList, deviceIdList: $scope.equipmentSelectedArr, sendStartTime: starTime }, function (res) {
                    if (res.success) {
                        commonService.ctrlSuccess('编辑');
                        $state.go('app.send.sendList');
                    } else {
                        $('.btnSubmit').attr('disabled', false);
                        commonService.ctrlError('编辑', res.message);
                    }
                });
            }
        }

        //将提交的参数清理下

    };
}]);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/6/19.
 */
angular.module('app')
//loading框的指令
.directive('ctrlLoading', [function () {
    return {
        restrict: 'E',
        templateUrl: 'admin/blocks/loading.html',
        replace: true

    };
}])

//成功框的指令
.directive('ctrlSuccess', [function () {
    return {
        restrict: 'E',
        templateUrl: 'admin/blocks/success.html',
        replace: true

    };
}])

//失败框的指令
.directive('ctrlError', [function () {
    return {
        restrict: 'E',
        templateUrl: 'admin/blocks/error.html',
        replace: true

    };
}])

//新建文件夹默认选中输入框文本
.directive('createFocus', ['$resource', '$timeout', 'checkBtnService', 'mediaService', function ($resource, $timeout, checkBtnService, mediaService) {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {

            ele.on('click', function () {

                if (mediaService.checkRename('.listTr')) {
                    checkBtnService.check('/api/mps-filemanager/file?op=create', 'post').then(function () {
                        scope.addDirBool = true;
                    });
                }
            });

            //使用$watch监听模型变化，根据变化绑定dom
            scope.$watch('addDirBool', function (newVal, oldVal) {
                if (newVal) {
                    var focusAll = angular.element('.createInput');
                    $timeout(function () {
                        focusAll.focus().select();
                    });
                }
            });
        }
    };
}])

//重命名文件默认选中输入框文本
.directive('renameFocus', ['$resource', '$timeout', 'checkBtnService', 'mediaService', function ($resource, $timeout, checkBtnService, mediaService) {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {

            ele.on('click', function () {

                //重命名时不可新建，新建时不可重命名

                if (mediaService.checkRename('.listTr') && !scope.addDirBool) {
                    checkBtnService.check('/api/mps-filemanager/file', 'put').then(function () {
                        scope.editDirBool = true;
                        scope.data.newName = scope.data.name;
                    });
                }
            });

            scope.$watch('editDirBool', function (newVal, oldVal) {
                if (newVal) {
                    var focusEle = ele.closest('.operateBtn').siblings('.dirName').find('.dirInput');
                    $timeout(function () {
                        focusEle.focus().select();
                    });
                }
            });
        }
    };
}])

//新建节目默认选中输入框文本
.directive('proFocus', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {

            scope.$watch('addProModel', function (newVal, oldVal) {
                if (newVal) {
                    var focusEle = angular.element('.createPro');
                    $timeout(function () {
                        focusEle.focus().select();
                    });
                }
            });
        }
    };
}]).directive('onFinish', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            if (scope.$last == true) [$timeout(function () {
                scope.$emit('ngRepeatFinished');
            })];
        }
    };
}]);

//仅能输入数字
app.directive('fdcFilter', [function () {
    return {
        require: "ngModel",
        link: function link(scope, element, attrs, ngModel) {

            //var attr = attrs.fdcFilter;
            //console.log(attr);
            //console.log(attrs);
            //
            //if(attr){
            //
            //    var dataType = {
            //        //只能输入数字！
            //        "num":/\D/g
            //    }
            //
            //    var regex = dataType[attr];
            //}
            element.bind('keyup', function (value) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }
    };
}])
//各个页面的高度指令
.directive('bodyHeight', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {

            var attrs = attr.bodyHeight;
            var id = attrs.split(' ')[0];
            var height = parseInt(attrs.split(' ')[1]);
            $('#' + id).css('height', $(window).height() - height);
            $(window).resize(function () {
                $('#' + id).css('height', $(window).height() - height);
            });
        }
    };
}])
//新建发送页的宽度设置
.directive('bodyWidth', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            setTimeout(function () {
                $('.list2').css('width', $('#addSendTAsk').width() - 640);
                $(window).resize(function () {
                    $('.list2').css('width', $('#addSendTAsk').width() - 640);
                });
            }, 0);
        }
    };
}])
//的宽度设置
.directive('bodyWidthpre', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            setTimeout(function () {

                //setTimeout(function(){
                $('.infoLeft').css('width', $('#examineDesc').width() - 403);
                //},10000)
                $(window).resize(function () {
                    $('.infoLeft').css('width', $('#examineDesc').width() - 420);
                });
            }, 0);
        }
    };
}])
//滚动条高度
.directive('scrollHeight', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {

            var attrs = attr.scrollHeight;
            var id = attrs.split(' ')[0];
            var height = parseInt(attrs.split(' ')[1]);
            $('#' + id).css('height', $(window).height() - height);
            $(window).resize(function () {
                $('#' + id).css('height', $(window).height() - height);
            });
            setTimeout(function () {
                var scroll = new Optiscroll(document.getElementById(id));
                ////滚动底部的时候触发
                //$('#scroll').on('scrollreachbottom', function (ev) {
                //
                //});
            }, 100);
        }
    };
}])
//登录页获取当前屏幕高度指令
.directive('bgHeight', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            var screenHeight = $(window).height();
            $('.loginBg').css('height', screenHeight);
            $(window).resize(function () {
                var screenHeight = $(window).height();
                $('.loginBg').css('height', screenHeight);
            });
        }
    };
}])

//记住密码操作相关指令
.directive('remberPwd', ['$timeout', 'cookieService', function ($timeout, cookieService) {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            var name = cookieService.getCookie('name');
            var password = cookieService.getCookie('password');
            $timeout(function () {
                $('#password').focus();
                $('#password').blur();
            });
            if (name && password) {
                scope.data = { 'email': name, 'password': password };
                scope.rememberPassword = true;
                // $scope.login2();
            }
        }
    };
}])

//.表格宽度随屏幕改变自适应指令
.directive('adaptiveTable', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {

            function copyWidth() {
                $('#td1').width($('.td1').width());
                $('#td2').width($('.td2').width());
                $('#td3').width($('.td3').width());
                $('#td4').width($('.td4').width());
                $('#td5').width($('.td5').width());
                $('#td6').width($('.td6').width());
                $('#td7').width($('.td7').width());
                $('#td8').width($('.td8').width());
                $('#td9').width($('.td9').width());
                $('#td10').width($('.td10').width());
                $('#td11').width($('.td11').width());
                $('#td12').width($('.td12').width());
                $('#td13').width($('.td13').width());
                $('#td14').width($('.td14').width());
            }
            $(window).resize(function () {
                copyWidth();
            });

            //$(window).onload(function(){
            //    copyWidth()
            //
            //})

            //$timeout(function(){
            //    copyWidth()
            //})
        }
    };
}])

//滚动条指令
.directive('listScroll', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            $('#scroll').css('height', $(window).height() - 330);
            $(window).resize(function () {

                $('#scroll').css('height', $(window).height() - 330);
            });
            setTimeout(function () {
                var scroll = new Optiscroll(document.getElementById('scroll'));
                //滚动底部的时候触发
                $('#scroll').on('scrollreachbottom', function (ev) {});
            }, 100);
        }
    };
}])

//fileManager鼠标移入移出指令
.directive('showCheckbox', [function () {
    return {
        restrct: 'A',
        link: function link(scope, ele, attr) {
            ele.on('mouseenter', function () {
                $("." + scope.item.userId).show();
                $("#" + scope.item.userId).find('label i').css('visibility', 'visible');
            });
            ele.on('mouseleave', function () {
                var checked = $("#" + scope.item.userId).find('label input').attr('checked');
                if (checked) {
                    return;
                } else {
                    $("." + scope.item.userId).hide();
                    $("#" + scope.item.userId).find('label i').css('visibility', 'hidden');
                }
            });
        }
    };
}])

//时间插件样式修改指令
.directive('datepickerStyle', [function () {
    return {
        restrict: 'A',
        link: function link(scope, ele, attr) {
            ele.on('click', function () {
                ele.siblings('.bootstrap-datetimepicker-widget').css({ left: "-111px" });
                ele.siblings('.bootstrap-datetimepicker-widget').addClass('change');
            });
        }
    };
}])
//院线选择设备动态添加样式指令
.directive('addpointStyle', [function () {
    return {
        restrict: 'C',
        link: function link(scope, ele, attr) {
            //ele.on('click' , function(){
            //    ele.siblings('.bootstrap-datetimepicker-widget').css({left:"-111px"})
            //    ele.siblings('.bootstrap-datetimepicker-widget').addClass('change')
            //})
            console.log(scope);
            console.log(ele);
            console.log(attr);
            if (scope.data.deviceScreenType > 0) {
                ele.addClass('disabled');
            }
        }
    };
}]);

angular.module('app')
//文件列表的指令
.directive('treeView', [function () {
    return {
        restrict: 'E',
        templateUrl: 'treeView.html',
        scope: {
            treeData: '='
        },
        controller: function controller($scope, $rootScope) {
            $scope.isLeaf = function (item) {
                return !item.children || !item.children.length;
            };
            $scope.toggleExpandStatus = function (item) {
                console.log(item);
                item.isExpand = !item.isExpand;
                $rootScope.titleName = item.name;
            };
        }
    };
}]);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/7/18.
 */
angular.module('app')
//自定义输入时间指令
.directive('inputTime', ['checkTimeService', 'commonService', 'dataAccess', '$timeout', function (checkTimeService, commonService, dataAccess, $timeout) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            myModel: '=ngModel'
        },
        templateUrl: './admin/blocks/timeInput.html',
        link: function link(scope, ele, attr, ngModel) {

            var active;
            var timeModel;

            var watch = scope.$watch('myModel', function (newVal, oldVal) {
                //获取该指令的model值
                if (newVal && newVal != undefined) {
                    timeModel = newVal;

                    scope.hourTen = timeModel.charAt(0);
                    scope.hourOne = timeModel.charAt(1);
                    scope.minTen = timeModel.charAt(2);
                    scope.minOne = timeModel.charAt(3);
                    active = 1;
                } else {
                    active = 0;
                }
            });

            $timeout(function () {
                watch();
            }, 500);

            ////如果有model值，赋值
            //if(timeModel != undefined){
            //    console.log(timeModel)
            //    scope.hourTen = timeModel.charAt(0)
            //    scope.hourOne = timeModel.charAt(1)
            //    scope.minTen = timeModel.charAt(2)
            //    scope.minOne = timeModel.charAt(3)
            //    active = 1
            //}else {
            //    active = 0
            //}


            //获取控件所在元素选择器，区分获取
            var className = '.' + attr.info;
            //active为当前光标所在输入框的计数器
            var time = '',

            //获取输入框组
            inputBtn = angular.element(className + ' .timeInput');

            ////遍历输入框组，给每项添加点击事件
            angular.forEach(inputBtn, function (data, index, array) {
                $(data).on('click', function () {
                    //active != 0 时，为编辑该项
                    if (active != 0) {
                        $(this).focus().select();
                        active = index;
                    }
                    //否则必须从第一项开始输入
                    else {
                            array[0].focus();
                        }
                });

                //添加focus事件，监听按键,执行回调
                $(data).on('focus', function () {
                    this.addEventListener('keyup', listenKeyUp, false);
                });

                //失去焦点时，移除监听，检测输入值是否符合时间规范
                $(data).on('blur', function () {
                    this.removeEventListener('keyup', listenKeyUp, false);
                    //错误输入标识
                    scope.hError = checkTimeService.checkHour(time);
                    scope.mError = checkTimeService.checkMinute(time);
                    if (scope.hError || scope.mError) {
                        commonService.ctrlError('操作', '时间格式有误');
                    }
                });
            });

            ngModel.$render = function () {
                scope.time = ngModel.$viewValue;
            };

            ////按键监听回调函数
            function listenKeyUp() {
                //将当前时间清空
                time = '';
                //将当前输入框中的非法字符过滤，只能输入数字
                this.value = this.value.replace(/\D/g, '');
                if (!isNaN(this.value) && this.value.length != 0) {
                    //计数器小于输入框个数，计数器+1，光标后移
                    if (active < 3) {
                        active += 1;
                    }
                    $(inputBtn[active]).focus().select();
                } else if (this.value.length == 0) {
                    if (active > 0) {
                        active -= 1;
                    }
                    $(inputBtn[active]).focus().select();
                }

                //每次按键时计算当前time
                time = scope.hourTen + scope.hourOne + scope.minTen + scope.minOne;

                //绑定time至model
                scope.$apply(read(time));
            }

            function read(newVal) {
                ngModel.$setViewValue(newVal);
            }
            read();

            ////获取控件所在元素选择器，区分获取
            //var className = '.' + attr.info
            ////active为当前光标所在输入框的计数器
            //var active = 0,
            //    time = '',
            //    //获取输入框组
            //    inputBtn = angular.element( className + ' .timeInput');
            //
            ////遍历输入框组，给每项添加点击事件
            //angular.forEach(inputBtn , function(data , index , array){
            //    $(data).on('click' , function(){
            //        //active != 0 时，为编辑该项
            //        if( active != 0){
            //            $(this).focus()
            //            active = index
            //        }
            //        //否则必须从第一项开始输入
            //        else {
            //            array[0].focus()
            //        }
            //    })
            //
            //    //添加focus事件，监听按键,执行回调
            //    $(data).on('focus' , function(){
            //       this.addEventListener('keyup' , listenKeyUp , false)
            //    })
            //
            //    //失去焦点时，移除监听，检测输入值是否符合时间规范
            //    $(data).on('blur' , function(){
            //       this.removeEventListener('keyup' , listenKeyUp , false)
            //        //错误输入标识
            //        scope.hError = checkTimeService.checkHour(time)
            //        scope.mError = checkTimeService.checkMinute(time)
            //        if(scope.hError || scope.mError){
            //            commonService.ctrlError('操作','时间格式有误')
            //        }
            //    })
            //
            //})
            //
            //
            //ngModel.$render = function(){
            //    scope.time = ngModel.$viewValue
            //}
            //
            ////按键监听回调函数
            //function listenKeyUp() {
            //    //将当前时间清空
            //    time = ''
            //    //将当前输入框中的非法字符过滤，只能输入数字
            //    this.value=this.value.replace(/\D/g,'');
            //    if (!isNaN(this.value) && this.value.length != 0) {
            //        //计数器小于输入框个数，计数器+1，光标后移
            //        if (active < 3) {
            //            active += 1;
            //        }
            //        inputBtn[active].focus()
            //    }
            //    else if (this.value.length == 0) {
            //        if (active > 0) {
            //            active -= 1;
            //        }
            //        inputBtn[active].focus()
            //    }
            //
            //    //每次按键时计算当前time
            //    angular.forEach(inputBtn , function(item){
            //        time += item.value
            //    })
            //    //绑定time至model
            //    scope.$apply(read(time))
            //}
            //
            //function read(newVal){
            //    ngModel.$setViewValue(newVal)
            //}
            //read()
        }

    };
}])

//额外时段指令
.directive('extraTimeline', ['$rootScope', 'staticData', 'formatDateService', function ($rootScope, staticData, formatDateService) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            myModel: '=ngModel',
            cond: '='
        },
        replace: true,
        templateUrl: './admin/blocks/extraTimeLine.html',
        link: function link(scope, ele, attr, ngModel) {

            //删除当前条件
            scope.remove = function () {

                delete $rootScope.extra_condition[scope.cond];

                ele.remove();

                $rootScope.i--;

                console.log('delete=' + $rootScope.i);
            };

            scope.myChange = function () {
                if (scope.finishTime) {
                    scope.myModel = formatDateService.formatTime(scope.fromTime["_d"]) + '-' + formatDateService.formatTime(scope.finishTime["_d"]);
                    //scope.$apply(read(scope.myModel))
                    console.log(scope.myModel);
                }
            };

            var selectGroup = angular.element('.timeLine');

            angular.forEach(selectGroup, function (item) {
                //$(item).on('click' , function(){
                //    this.addEventListener('change' , listenChange , false)
                //})

                $(item).on('click', function () {
                    this.addEventListener('keyup', listenChange, false);
                });

                $(item).on('blur', function () {
                    this.removeEventListener('change', listenChange, false);
                    this.removeEventListener('keyup', listenChange, false);
                });
            });

            function listenChange() {
                scope.myModel = scope.fromTime + '-' + scope.finishTime;
                scope.$apply(read(scope.myModel));
            }
            ngModel.$render = function () {
                scope.myModel = ngModel.$viewValue;
            };

            function read(newVal) {
                ngModel.$setViewValue(newVal);
            }
            read();
        }
    };
}]);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by chenqi1 on 2017/6/15.
 */


/* Filters */
// need load the moment.js to use this filter.

angular.module('app').filter('fromNow', function () {
    return function (date) {
        return moment(date).fromNow();
    };
})

//是否在线样式
.filter('onlineStyle', function () {
    return function (statusId) {
        var statusStyle;
        switch (statusId) {
            case 'Y':
                statusStyle = 'onlineIcon';
                break;

            case 'N':
                statusStyle = 'offlineIcon';
                break;
        }
        return statusStyle;
    };
})

//终端激活时间显示
.filter('terminalTime', function () {
    var roleNum;
    return function (arr) {
        if (arr === null) {
            roleNum = '-';
        } else {
            roleNum = arr;
        }
        return roleNum;
    };
})

//包名显示
.filter('packageNameTrans', function () {
    var roleNum;
    return function (arr) {
        if (arr === null) {
            roleNum = '无';
        } else {
            roleNum = arr;
        }
        return roleNum;
    };
})

//终端状态显示
.filter('terminalState', function () {
    return function (state) {
        var status;
        switch (state) {
            case 'Y':
                status = '在线';
                break;
            case 'N':
                status = '离线';
                break;
        }
        return status;
    };
})

//是否激活样式
.filter('terminalActiveStyle', function () {
    return function (state) {
        var status;
        switch (state) {
            case 'Y':
                status = '已激活';
                break;
            case 'N':
                status = '未激活';
                break;
        }
        return status;
    };
})

//是否显示待办事项
.filter('showNoData', function () {
    var bool;
    return function (dataList) {
        if (!!dataList && dataList.length === 0 || dataList == null) {
            bool = true;
        } else {
            bool = false;
        }
        return bool;
    };
})

//popover的过滤器
.filter('popoverText', function () {
    var text;
    return function (array) {
        if (!!array && array.length === 0 && array == null) {
            text = '';
        } else {
            text = array.join(',');
        }
        return text;
    };
})

//素材大小格式转换
.filter('sizeFormat', function () {
    var formatSize;
    return function (size) {
        if (size) {
            var size = parseInt(size);
            formatSize = size / 1024 / 1024;
            return formatSize.toFixed(2);
        } else {
            return formatSize = '-';
        }
    };
})

//产品授权码字母大小写转换
.filter('upperCase', function () {
    var upperCase;
    return function (data) {
        if (data) {
            upperCase = data.toUpperCase();
        }
        return upperCase;
    };
})

//根据更新包路径截取包名字段
.filter('getPackName', function () {
    var path;
    return function (data) {
        if (data) {
            path = data.split("/");
            path = path[path.length - 1];
            return path;
        }
    };
})

//限制描述长度
.filter('limitLength', function () {
    var str;
    var limitLength;
    return function (data, length) {
        limitLength = length ? length : 20;
        if (data != '') {
            if (data.split('').length > limitLength) {
                str = data.substring(0, limitLength).concat('...');
            } else {
                str = data;
            }
        } else {
            str = '';
        }
        return str;
    };
})
//发送模块的状态标志
.filter('sendExecuteState', function () {
    var str;
    var limitLength;
    return function (data) {
        switch (data) {
            case 1:
                str = "待审核";break;
            case 2:
                str = "正在发送";break;
            case 3:
                str = '已完成';break;
            case 4:
                str = '已失效';break;
            case 5:
                str = '已驳回';break;
            case 6:
                str = '待发送';break;
        }
        return str;
    };
})
//秒换成时分格式
.filter('timeChange', function () {
    var str;
    return function (data) {
        var h = Math.floor(data / 3600);
        var m = Math.floor(data / 60 % 60);
        var s = Math.floor(data % 60);
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return str = h + ":" + m + ":" + s;
    };
})
//截取产品ID后8位
.filter('cutProdIdLength', function () {
    var str;
    return function (data) {
        if (data) {
            str = data.slice(-9);
        }
        return str;
    };
})

//截取终端ID后8位
.filter('cutDeviceIdLength', function () {
    var str;
    return function (data) {
        if (data) {
            str = data.slice(-8).toUpperCase();
        }
        return str;
    };
})

//搜索结果面包屑路径显示
.filter('getCurrentPath', function () {
    var path;
    return function (data) {
        if (data === '') {
            path = '搜索结果';
        } else {
            path = data;
        }
        return path;
    };
})

//根据文件类型不同区分显示图标
.filter('formatIcon', function () {
    var className;
    return function (data) {
        if (data) {
            if (data == 'picture') {
                className = 'picType';
            } else if (data == 'video') {
                className = 'videoType';
            } else {
                className = 'otherType';
            }
        } else {
            className = 'dirType';
        }
        return className;
    };
})

//获取头文字D
.filter('firstName', function () {
    return function (data) {
        return data.charAt(0);
    };
})

//获取设备开关机状态
.filter('getOnOff', function () {
    return function (data) {
        var bool;
        if (data) {
            switch (data) {
                case '在线':
                    bool = true;
                    break;
                case '已关机':
                    bool = false;
                    break;
            }
        }
        return bool;
    };
})

//获取审核状态
.filter('getExamine', function () {
    return function (data) {
        var str;
        if (data) {
            switch (data) {
                case 1:
                    str = "审核通过";
                    break;
                case 2:
                    str = "审核不通过";
                    break;
                case 3:
                    str = "待审核";
                    break;
                case 4:
                    str = "审核通过";
                    break;
            }
        }

        return str;
    };
})
// 1代表出售 2代表赠送 3代表自营 4代表置换

//项目来源
.filter('getProjectSource', function () {
    return function (data) {
        var str;
        if (data) {
            switch (data) {
                case 1:
                    str = '出售';
                    break;
                case 2:
                    str = '赠送';
                    break;
                case 3:
                    str = '自营';
                    break;
                case 4:
                    str = '置换';
                    break;
            }
        }
        return str;
    };
})
//项目费用类别
.filter('getProjectCost', function () {
    return function (data) {
        var str;
        if (data) {
            if (data.length == 2) {
                str = "内容制作费   媒体投放费";
            } else if (data[0] == 1) {
                str = '内容制作费';
            } else if (data[0] == 2) {
                str = '媒体投放费';
            }
        }
        return str;
    };
})
//客户类别
.filter('getCustomerCategory', function () {
    return function (data) {
        var str;
        if (data) {
            switch (data) {
                case 1:
                    str = '直客';
                    break;
                case 2:
                    str = '代理';
                    break;
            }
        }
        return str;
    };
})

//点位模块过滤器
//获取点位类型
.filter('getPTtype', function () {
    return function (data) {
        var str;
        if (parseInt(data)) {
            switch (parseInt(data)) {
                case 1:
                    str = "3*3";
                    break;
                case 2:
                    str = "3*4";
                    break;
                case 3:
                    str = "1*2";
                    break;
                case 4:
                    str = "单屏";
                    break;
                case 5:
                    str = "1+1+1";
                    break;
            }
        }
        return str;
    };
})

//billType
.filter('billType', function () {

    return function (data) {
        var str;
        if (data) {
            switch (data) {

                case 1:
                    str = "视频";
                    break;
                case 2:
                    str = "游戏";
            }
        }
        return str;
    };
})

//parseInt
.filter('parseInt', function () {

    return function (data) {
        var str;
        if (data) {
            str = parseInt(data);
        }
        return str;
    };
})

//获取是否设置主/副屏
.filter('getScreenType', function () {

    return function (data) {
        var str;
        switch (data) {

            case true:
                str = "是";
                break;
            case false:
                str = "否";
                break;
        }
        return str;
    };
}).filter('statusType', function () {
    return function (data) {
        var str;
        if (data) {
            switch (data) {
                case 1:
                    str = "待审核";
                    break;
                case 2:
                    str = "已审核不通过";
                    break;
                case 3:
                    str = "投放中";
                    break;
                case 4:
                    str = "已结束";
                    break;
                case 5:
                    str = "已过期";
                    break;
            }
        }

        if (data === 0) {
            str = "草稿";
        }
        return str;
    };
})

//是否是定制播放时段判断
.filter('showTimeFlag', function () {
    return function (data) {
        var str;
        if (data) {
            str = "是";
        } else {
            str = "否";
        }
        return str;
    };
})

//播放次数或时段
.filter('getPlayTimes', function () {
    return function (data) {
        var str;
        if (data.length = 0) {
            str = "不限";
        } else {
            str = "有限";
        }
        return str;
    };
})
//点位状态回显
.filter('pointStatus', function () {
    return function (data) {
        var str;
        if (data) {
            switch (data) {

                case 1:
                    str = "已完成";
                    break;
                case 2:
                    str = "下刊完成";
                    break;
                case 3:
                    str = "正在发送";
                    break;
                case 4:
                    str = "正在下刊";
                    break;
                case 5:
                    str = "发送失败";
                    break;
                case 6:
                    str = "下刊失败";
                    break;
            }
        }
        return str;
    };
})

//获取广告单审核状态
.filter('getSheetCheck', function () {
    return function (data) {
        var str;
        if (data) {
            switch (data) {
                case 1:
                    str = '待审核';
                    break;
                case 2:
                    str = '审核不通过';
                    break;
                case 3:
                    str = '审核通过';
                    break;
                case 4:
                    str = '审核通过';
                    break;
                case 5:
                    str = '过期';
                    break;
            }
        }
        return str;
    };
})

//获取头文字D
.filter('getParseInt', function () {
    return function (data) {
        if (data) {
            return parseInt(data) + "秒";
        } else {
            return "暂无";
        }
    };
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by chenqi1 on 2017/6/14.
 */
/**
 * Created by chenqi1 on 2017/2/21.
 */

//静态资源的数据service
app.service('staticData', function () {
    return {
        hostUrl: '',
        //分页相关
        //分页配置每页条数
        pageSize: 10,
        //分页配置索引数目
        pageMaxSize: 5,
        //设备状态
        deviceState: [{ id: 1, name: '在线' }, { id: 2, name: '离线' }],
        checkState: [{ id: 0, name: '全部' }, { id: 1, name: '审核通过' }, { id: 2, name: '审核不通过' }, { id: 3, name: '待审核' }],
        //点位类型
        PTtype: [{ id: 1, name: '3*3' }, { id: 2, name: '3*4' }, { id: 3, name: '1*2' }, { id: 4, name: '单屏' }, { id: 5, name: '1+1+1' }],
        //项目来源
        orderSource: [{ id: 1, name: '出售' }, { id: 2, name: '赠送' }, { id: 3, name: '自营' }, { id: 4, name: '置换' }],
        //广告单类型 
        adType: [{ id: 1, name: '视频' }, { id: 2, name: '互动游戏' }],
        //状态 
        statusType: [{ id: 0, name: '草稿' }, { id: 1, name: '待审核' }, { id: 2, name: '审核不通过' }, { id: 3, name: '投放中' }, { id: 4, name: '已结束' }, { id: 5, name: '已过期' }],
        //客户类别
        customerType: [{ id: 1, name: '直客' }, { id: 2, name: '代理' }],
        //费用类别
        feeType: [{ id: 1, name: '内容制作费' }, { id: 2, name: '媒体投放费' }],
        //广告类型
        sheetType: [{ id: 1, name: '视频' }, { id: 2, name: '互动游戏' }],
        //picHost : 'http://mpsd.kdxcloud.download'
        //线上
        picHost: 'http://mpsd.kdxcloud.com:88'
    };
});

//各种模态框操作的service封装
app.service('commonService', ['$rootScope', '$modal', '$timeout', 'staticData', function ($rootScope, $modal, $timeout, staticData) {
    //操作成功时的tip
    this.ctrlSuccess = function (data, reason) {
        $rootScope.ctrlSuccess = true;
        $rootScope.opAction = data;
        $rootScope.successReason = reason;
        $timeout(function () {
            $rootScope.ctrlSuccess = false;
        }, 2000);
    };

    //文件操作模态框
    this.fileManagerModal = function (data, mediaLists, format) {
        $rootScope.fileManagerName = data;
        var fileData = {
            mediaLists: mediaLists,
            format: format
        };
        var fileManager = $modal.open({
            templateUrl: 'admin/modals/fileManagerModal.html',
            controller: 'fileManagerCtrl',
            resolve: {
                //给fileManagerCtrl传参数
                getDatas: function getDatas() {
                    return fileData;
                }
            },
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        return fileManager;
    };

    //添加编辑成员模态框
    this.addMemberModal = function (operates, _id) {
        var addMember = $modal.open({
            templateUrl: 'admin/modals/addMemberModal.html',
            controller: 'addMemberCtrl',
            resolve: {
                operate: function operate() {
                    return operates;
                },
                id: function id() {
                    return _id;
                }
            },
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        return addMember;
    };

    //添加权限成员模态框
    this.addRoleMemberModal = function (roleId, name) {
        var addRoleMember = $modal.open({
            templateUrl: 'admin/modals/addRoleMemberModal.html',
            controller: 'addRoleMemberModal',
            resolve: {
                info: function info() {
                    return { roleId: roleId, name: name };
                }
            },
            backdrop: 'static',
            size: 'lg',
            keyboard: false
        });
        return addRoleMember;
    };
    //添加站点模态框
    this.setPointModal = function (pointType, select) {
        var setPoint = $modal.open({
            templateUrl: 'admin/modals/setPointModal.html',
            controller: 'setPointModal',
            resolve: {
                info: function info() {
                    return { pointType: pointType, select: select };
                }
            },
            backdrop: 'static',
            size: 'diyLg',
            keyboard: false
        });
        return setPoint;
    };

    //查看成员模态框
    this.detailMemberModal = function (id) {
        var detailMember = $modal.open({
            templateUrl: 'admin/modals/detailMemberModal.html',
            controller: 'detailMemberCtrl',
            resolve: {
                userId: function userId() {
                    return id;
                }
            },
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        return detailMember;
    };
    //驳回发送请求模态框
    this.rejectRequest = function (taskId) {
        var rejectRequest = $modal.open({
            templateUrl: 'admin/modals/rejectRequest.html',
            controller: 'rejectRequestCtrl',
            resolve: {
                info: function info() {
                    return { taskId: taskId };
                }
            },
            backdrop: 'static',
            size: 'sm',
            keyboard: false
        });
        return rejectRequest;
    };

    ////预览模态框
    //this.previewModal = function(taskId){
    //    var previewModal = $modal.open({
    //        templateUrl: 'admin/modals/previewModal.html',
    //        controller: 'previewCtrl',
    //        resolve: {
    //            info: function () {
    //                return {taskId:taskId};
    //            }
    //        },
    //        backdrop: 'static',
    //        //size:'sm',
    //        keyboard: false
    //    });
    //    return previewModal;
    //}
    ////操作失败tip
    this.ctrlError = function (data, reason) {
        $rootScope.ctrlError = true;
        $rootScope.opAction = data;
        $rootScope.errorReason = reason;
        $timeout(function () {
            $rootScope.ctrlError = false;
        }, 2000).then(function () {
            $rootScope.load = false;
        });
    };

    //tipModal
    this.tipModal = function (data) {
        var modalConfirm = $modal.open({
            templateUrl: 'admin/modals/tipModal.html',
            controller: 'tipCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { typeInfo: data };
                }
            }
        });
        return modalConfirm;
    };

    //确认操作模态框
    this.ctrlModal = function (data, obj) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/ctrlModal.html',
            controller: 'delModalCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { typeInfo: data, obj: obj };
                }
            }
        });
        return modalInstance;
    };
    //点位冲突模态框
    this.conflictModal = function (obj) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/conflictModal.html',
            controller: 'conflictModalCtrl',
            size: 'diyLg2',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { obj: obj };
                }
            }
        });
        return modalInstance;
    };

    //新建节目模态框
    this.addPro = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/addProModal.html',
            controller: 'addProCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false
            //resolve: {
            //    info: function () {
            //        return {model: data}
            //    }
            //}
        });
        return modalInstance;
    };

    //设备定时模态框
    this.editPT = function (id, bool) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/setTimeModal.html',
            controller: 'editPTCtrl',
            size: 'diySm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { id: id, bool: bool };
                }
            }
        });
        return modalInstance;
    };

    //查看终端截图模态框
    this.showSS = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/screenShot.html',
            controller: 'ShowSSCtrl',
            size: 'SS',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { data: data };
                }
            }

        });
        return modalInstance;
    };

    //添加项目模态框
    this.add_project = function (projectId) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/add_project_modal.html',
            controller: 'addProjectCtrl',
            size: 'diySm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { projectId: projectId };
                }
            }

        });
        return modalInstance;
    };

    //添加默认素材
    this.defaultPlayList = function (pointType, defaultId) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/defulatPlayListModal.html',
            controller: 'defulatPlayListModalCtrl',
            size: 'SS',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { pointType: pointType, defaultId: defaultId };
                }
            }

        });
        return modalInstance;
    };

    //添加默认素材1+1+1
    this.defaultPlayListNew = function (pointType, defaultId) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/defulatPlayListModal_1.html',
            controller: 'defulatPlayListModalNewCtrl',
            size: 'lg3',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { pointType: pointType, defaultId: defaultId };
                }
            }

        });
        return modalInstance;
    };

    //查看项目详情
    this.show_project_detail = function (projectId) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/project_detail_modal.html',
            controller: 'showProjectDetailCtrl',
            size: 'diySm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { projectId: projectId };
                }
            }

        });
        return modalInstance;
    };

    //添加广告单时选择城市站点
    this.selectCitySite = function (pointType, cityList, citySite) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/selectCitySite.html',
            controller: 'selectCitySiteCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { pointType: pointType, cityList: cityList, citySite: citySite };
                }
            }

        });
        return modalInstance;
    };

    //添加点位弹框
    this.addPoint = function () {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/addPointModal.html',
            controller: 'addPointCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    //return {pointType: pointType ,cityList: cityList , citySite : citySite}
                }
            }

        });
    };

    //点位播放列表
    this.showPlayList = function (pointId, date, deviceType, resourceIds) {
        var modalInstance = $modal.open({
            templateUrl: 'admin/modals/showPlayListModal.html',
            controller: 'showPlayListCtrl',
            size: 'diyLg2',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                info: function info() {
                    return { deviceType: deviceType, date: date, pointId: pointId, resourceIds: resourceIds };
                }
            }

        });
    };
}]);

//存取值的service封装,避免使用$rootScope
app.service('dataAccess', ['$window', function ($window) {
    var list = {};
    return {
        get: function get(key) {
            return list[key];
        },
        set: function set(key, value) {
            list[key] = value;
        },
        sessionSave: function sessionSave(key, value) {
            $window.sessionStorage.setItem(key, JSON.stringify(value));
        },
        sessionGet: function sessionGet(key) {
            return JSON.parse($window.sessionStorage.getItem(key));
        },
        sessionRemove: function sessionRemove(key) {
            $window.sessionStorage.removeItem(key);
        },
        sessionClear: function sessionClear() {
            $window.sessionStorage.clear();
        }

    };
}]);

//检测按钮的跳转权限
app.service('checkBtnService', ['$resource', '$state', 'staticData', 'commonService', '$q', function ($resource, $state, staticData, commonService, $q) {
    var host = staticData.hostUrl;

    return {
        check: function check(url, method, route, param) {
            var $com = $resource(host + "/api/common/preAccess?url=:url&method=:method", { url: "@url", method: "@method" });
            var defer = $q.defer();

            $com.get({ url: url, method: method }, function (data) {
                if (data.success) {
                    if (!!route) {
                        $state.go(route, param);
                    }
                    defer.resolve(data);
                } else {
                    commonService.ctrlModal('noPerType');
                    defer.reject(data);
                }
            });
            return defer.promise;
        }
    };
}]);

//针对上传特殊新增一个检查口
app.service('checkUpdateStateService', ['$resource', '$state', 'staticData', 'commonService', '$q', function ($resource, $state, staticData, commonService, $q) {
    var host = staticData.hostUrl;

    return {
        check: function check(url, method, route, param) {
            var $com = $resource(host + "/api/common/preAccess?url=:url&method=:method", { url: "@url", method: "@method" });
            var defer = $q.defer();

            $com.get({ url: url, method: method }, function (data) {
                if (data.success) {
                    if (!!route) {
                        $state.go(route, param);
                    }
                    defer.resolve(data);
                } else {
                    defer.reject(data);
                }
            });
            return defer.promise;
        }
    };
}]);

//全选反选的操作相关封装
app.service('selectService', ['perService', function (perService) {
    var _ref;

    return _ref = {
        updateSelectionRole: function updateSelectionRole(selectedArr, e, id, childArr) {
            var action = checkbox.checked ? 'add' : 'remove';
            perService.updateSelected(selectedArr, action, id);
            if (childArr != null) {
                perService.updateSelected(childArr, action, id);
            }
        },
        updateSelection: function updateSelection(selectedArr, e, id, childArr) {
            var checkbox = e.target;
            var action = checkbox.checked ? 'add' : 'remove';
            perService.updateSelected(selectedArr, action, id);
            if (childArr != null) {
                perService.updateSelected(childArr, action, id);
            }
        }
    }, _defineProperty(_ref, 'updateSelectionRole', function updateSelectionRole(selectedArr, e, id) {
        var action = 'remove';
        perService.updateSelected(selectedArr, action, id);
    }), _defineProperty(_ref, 'selectAll', function selectAll(selectedArr, e, originData, idKey, permissionBool) {
        var checkbox = e.target;
        var action = checkbox.checked ? 'add' : 'remove';
        if (permissionBool) {

            angular.forEach(originData, function (data) {
                angular.forEach(data.methods, function (mData) {
                    var entity = mData;

                    perService.updateSelected(selectedArr, action, entity[idKey]);
                });
            });
        } else {
            angular.forEach(originData, function (data) {
                var entity = data;
                perService.updateSelected(selectedArr, action, entity[idKey]);
            });
        }
    }), _defineProperty(_ref, 'selectChildAll', function selectChildAll(selectedArr, childArr, e, originData, idKey, permissionBool) {
        var checkbox = e.target;
        var action = checkbox.checked ? 'add' : 'remove';
        if (permissionBool) {

            angular.forEach(originData.methods, function (data) {
                var entity = data;
                perService.updateSelected(selectedArr, action, entity[idKey]);
                perService.updateSelected(childArr, action, entity[idKey]);
            });
        } else {
            angular.forEach(originData, function (data) {
                var entity = data;
                perService.updateSelected(selectedArr, action, entity[idKey]);
            });
        }
    }), _defineProperty(_ref, 'isSelected', function isSelected(arr, id) {
        if (arr.length) {
            return arr.indexOf(id) >= 0;
        }
    }), _defineProperty(_ref, 'isChildSelected', function isChildSelected(arr, id) {
        if (arr.length) {
            return arr.indexOf(id) >= 0;
        }
    }), _defineProperty(_ref, 'isSelectedAllRole', function isSelectedAllRole(arr, datas, permissionBool) {
        if (arr.length) {
            if (permissionBool) {
                var num = 0;

                angular.forEach(datas, function (data) {
                    //console.log(data)
                    num += data.methods.length;
                });
                //console.log(arr.length)
                //console.log(num)
                return arr.length === num;
            } else {
                if (!datas) {
                    return;
                }
                return arr.length === datas.length;
            }
        }
    }), _defineProperty(_ref, 'isSelectedAll', function isSelectedAll(arr, datas, permissionBool) {

        if (arr.length) {
            if (permissionBool) {
                return arr.length === perService.getAllMethods(datas).length;
            } else {
                return arr.length === datas.length;
            }
        }
    }), _defineProperty(_ref, 'isChildSelectedAll', function isChildSelectedAll(arr, datas, permissionBool) {
        if (arr.length) {
            if (permissionBool) {
                //console.log(perService.getAllMethods(datas, datas).length)
                return arr.length === perService.getAllMethods(datas, datas).length;
            } else {
                return arr.length === datas.length;
            }
        }
    }), _ref;
}]);

//城市选择全选反选的操作相关封装
app.service('selectCityService', ['perService', function (perService) {
    var _ref2;

    return _ref2 = {
        updateSelectionRole: function updateSelectionRole(selectedArr, e, id, childArr) {
            var action = checkbox.checked ? 'add' : 'remove';
            perService.updateSelected(selectedArr, action, id);
            if (childArr != null) {
                perService.updateSelected(childArr, action, id);
            }
        },
        updateSelection: function updateSelection(selectedArr, e, id, childArr) {
            var checkbox = e.target;
            var action = checkbox.checked ? 'add' : 'remove';
            perService.updateSelected(selectedArr, action, id);
            if (childArr != null) {
                perService.updateSelected(childArr, action, id);
            }
        }
    }, _defineProperty(_ref2, 'updateSelectionRole', function updateSelectionRole(selectedArr, e, id) {
        var action = 'remove';
        perService.updateSelected(selectedArr, action, id);
    }), _defineProperty(_ref2, 'selectAll', function selectAll(selectedArr, e, originData, idKey, permissionBool) {
        var checkbox = e.target;
        var action = checkbox.checked ? 'add' : 'remove';
        if (permissionBool) {

            angular.forEach(originData, function (data) {
                angular.forEach(data.cityList, function (mData) {
                    var entity = mData;

                    perService.updateSelected(selectedArr, action, entity[idKey]);
                });
            });
        } else {
            angular.forEach(originData, function (data) {
                var entity = data;
                perService.updateSelected(selectedArr, action, entity[idKey]);
            });
        }
    }), _defineProperty(_ref2, 'selectChildAll', function selectChildAll(selectedArr, childArr, e, originData, idKey, permissionBool) {
        var checkbox = e.target;
        var action = checkbox.checked ? 'add' : 'remove';
        if (permissionBool) {

            angular.forEach(originData.cityList, function (data) {
                var entity = data;
                perService.updateSelected(selectedArr, action, entity[idKey]);
                perService.updateSelected(childArr, action, entity[idKey]);
            });
        } else {
            angular.forEach(originData, function (data) {
                var entity = data;
                perService.updateSelected(selectedArr, action, entity[idKey]);
            });
        }
    }), _defineProperty(_ref2, 'isSelected', function isSelected(arr, id) {
        if (arr.length) {
            return arr.indexOf(id) >= 0;
        }
    }), _defineProperty(_ref2, 'isChildSelected', function isChildSelected(arr, id) {
        if (arr.length) {
            return arr.indexOf(id) >= 0;
        }
    }), _defineProperty(_ref2, 'isSelectedAllRole', function isSelectedAllRole(arr, datas, permissionBool) {
        if (arr.length) {
            if (permissionBool) {
                var num = 0;

                angular.forEach(datas, function (data) {
                    //console.log(data)
                    num += data.cityList.length;
                });
                //console.log(arr.length)
                //console.log(num)
                return arr.length === num;
            } else {
                if (!datas) {
                    return;
                }
                return arr.length === datas.length;
            }
        }
    }), _defineProperty(_ref2, 'isSelectedAll', function isSelectedAll(arr, datas, permissionBool) {

        if (arr.length) {
            if (permissionBool) {
                return arr.length === perService.getAllCityMethods(datas).length;
            } else {
                return arr.length === datas.length;
            }
        }
    }), _defineProperty(_ref2, 'isChildSelectedAll', function isChildSelectedAll(arr, datas, permissionBool) {
        if (arr.length) {
            if (permissionBool) {
                return arr.length === perService.getAllCityMethods(datas, datas).length;
            } else {
                return arr.length === datas.length;
            }
        }
    }), _ref2;
}]);

//select方法内部调用的service
app.service('perService', [function () {
    return {
        //封装方法获取已选项并添加到数组或者从数组中删除未选项
        updateSelected: function updateSelected(selectArr, action, id) {

            if (action === 'add' && selectArr.indexOf(id) === -1) {
                selectArr.push(id);
            }
            if (action === 'remove' && selectArr.indexOf(id) !== -1) {
                var idx = selectArr.indexOf(id);
                selectArr.splice(idx, 1);
            }
            return selectArr;
        },

        //封装方法获取所有的操作类型
        getAllMethods: function getAllMethods(perDatas, chlidDatas) {
            var allMethods = [];
            if (chlidDatas == null || chlidDatas == undefined) {
                angular.forEach(perDatas, function (data) {
                    angular.forEach(data.methods, function (mData) {
                        allMethods.push(mData);
                    });
                });
            } else {
                angular.forEach(chlidDatas.methods, function (data) {

                    allMethods.push(data);
                });
            }

            return allMethods;
        },

        getAllCityMethods: function getAllCityMethods(perDatas, chlidDatas) {
            var allMethods = [];
            if (chlidDatas == null || chlidDatas == undefined) {
                angular.forEach(perDatas, function (data) {
                    angular.forEach(data.cityList, function (mData) {
                        allMethods.push(mData);
                    });
                });
            } else {
                angular.forEach(chlidDatas.cityList, function (data) {

                    allMethods.push(data);
                });
            }

            return allMethods;
        }
    };
}]);

//cookie操作service
app.service('cookieService', [function () {
    return {
        getCookie: function getCookie(name) {
            var arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
        },
        writeCookie: function writeCookie(data) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);
            //写cookie
            var data = data;
            document.cookie = 'name' + "=" + data.email + ";expires=" + expireDate.toGMTString();
            document.cookie = 'password' + "=" + data.password + ";expires=" + expireDate.toGMTString();
        }
    };
}]);

//拦截器判断用户是否登录超时或无权限
app.factory('UserInterceptor', ['$q', '$rootScope', 'dataAccess', function ($q, $rootScope, dataAccess) {
    return {
        request: function request(config) {
            //加载框的loading层
            $rootScope.load = true;
            config.requestTimestamp = new Date().getTime();
            return config;
        },

        response: function response(_response) {
            $rootScope.load = false;
            var data = _response.data;
            //判断错误信息，如果是未登录
            if (data['access'] == 'notlogin' || data['access'] == 'outlogin') {
                $rootScope.$emit("userIntercepted", "notlogin", _response);
            }
            //如果是无权限（需要弹框）

            if (data['code'] != 'noPop' && data['access'] == 'notpermission') {
                dataAccess.set('notPerBool', 1);
                $rootScope.$emit("userNotPermission", "notpermission", _response);
            } else {
                dataAccess.set('notPerBool', 0);
            }
            //如果是被禁用
            if (data['access'] == 'forbidden') {
                $rootScope.$emit("forbidden", "forbidden", _response);
            }

            return _response;
        },
        responseError: function responseError(response) {
            // 对失败的响应进行处理
            var data = response;
            if (data.status != 200) {
                $rootScope.$emit("serverError", "reqError", response);
            }
            return response;
        }
    };
}]);

app.service('showCheckBox', [function () {
    return {
        checkboxShow: function checkboxShow(id, outOrHover) {
            if (outOrHover == 'out') {
                var checked = $("#" + id).find('label input').attr('checked');
                if (checked) {
                    return;
                } else {
                    $("." + id).hide();
                    $("#" + id).find('label i').css('visibility', 'hidden');
                }
            } else {
                $("." + id).show();
                $("#" + id).find('label i').css('visibility', 'visible');
            }
        }
    };
}]);

app.service('addDiyDom', [function () {
    return {
        diyDom: function diyDom(treeId, treeNode, check) {
            var spaceWidth = 25;
            var switchObj = $("#" + treeNode.tId + "_switch"),
                checkObj = $("#" + treeNode.tId + "_check"),
                icoObj = $("#" + treeNode.tId + "_ico");
            var spanObj = $("#" + treeNode.tId + "_span");
            switchObj.remove();
            checkObj.remove();
            if (check) {
                spanObj.before(checkObj);
            }
            icoObj.before(switchObj);

            //替换图标的icon
            switch (treeNode.format) {
                case 'picture':
                    spanObj.removeClass().addClass('node_name1');
                    break;
                case 'video':
                    spanObj.removeClass().addClass('node_name2');
                    break;
                case 'other':
                    spanObj.removeClass().addClass('node_name3');
                default:
            }

            var spaceStr = "<span style='display: inline-block;width:" + spaceWidth * treeNode.level + "px'></span>";
            switchObj.before(spaceStr);
        }
    };
}]);

//设备模块

//判断时间输入控件时间有效性
app.service('checkTimeService', [function () {
    return {
        checkHour: function checkHour(data) {
            var bool = false;
            var hour = parseInt(data.substring(0, 2));
            hour > 23 ? bool = true : bool = false;
            return bool;
        },
        checkMinute: function checkMinute(data) {
            var bool = false;
            var minute = parseInt(data.substring(data.length - 2));
            minute > 59 ? bool = true : bool = false;
            return bool;
        },

        checkTime: function checkTime(data) {
            var bool = false;
            var hour = parseInt(data.substring(0, 2));
            var minute = parseInt(data.substring(data.length - 2));
            hour > 23 || minute > 59 ? bool = true : bool = false;
            return bool;
        },

        getSendTime: function getSendTime(data) {
            if (data) {
                var time = data.substring(0, 2) + ':' + data.substring(2);
                return time;
            }
        },

        getModelTime: function getModelTime(data) {
            if (data) {
                var time = data.substring(0, 2) + data.substring(3);
                return time;
            }
        },
        //日期转换时间戳
        dateFormat: function dateFormat(date) {
            var date = date;
            date = date.substring(0, 19);
            date = date.replace(/-/g, '/');
            var timestamp = new Date(date).getTime();
            return timestamp;
        }
    };
}]);

//日期控件获取所需日期格式
app.service('formatDateService', [function () {
    return {
        getDate: function getDate(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? '0' + d : d;
            return y + '-' + m + '-' + d;
        },
        //获取当前时间
        getNowFormatDate: function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var strMin = date.getMinutes();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (strMin >= 0 && strMin <= 9) {
                strMin = "0" + strMin;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + strMin;
            return currentdate;
        },
        formatHour: function formatHour(date) {
            var h = date.getHours();
            h = h < 10 ? '0' + h : h;
            return h;
        },
        formatMinute: function formatMinute(date) {
            var minute = date.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            return minute;
        },
        //获取时分
        formatTime: function formatTime(date) {
            var str;
            var h = date.getHours();
            h = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            str = h + ':' + minute;
            return str;
        }
    };
}]);

//生成随机数
app.service('randomStringServive', [function () {
    return {
        randomString: function randomString() {
            var len = 10;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
    };
}]);

app.service('adService', ['staticData', function (staticData) {
    //格式化日期控件所选时间
    //播放列表专用
    this.formatDateTime = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? '0' + d : d;
        var h = date.getHours();
        y = y.toString();
        m = m.toString();
        d = d.toString();
        if (h < 10) {
            h = '0' + h;
        }
        //h = h.toString();
        //var minute = date.getMinutes();
        //minute = minute < 10 ? ('0' + minute) : minute;
        //return y + '-' + m + '-' + d + ' ' + h+':'+minute;
        return y + m + d + ' ' + h;
    };

    this.formatDate = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? '0' + d : d;
        y = y.toString();
        m = m.toString();
        d = d.toString();
        return y + m + d;
        //return y + '-' + m + '-' + d;
    };

    this.getMoth = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        y = y.toString();
        m = m.toString();
        return y + '-' + m;
        //return y + '-' + m + '-' + d;
    };

    this.formatHourTime = function (date) {
        var h = date.getHours();
        h = h < 10 ? '0' + h : h;
        //var minute = date.getMinutes();
        //minute = minute < 10 ? ('0' + minute) : minute;
        return h;
        //return y + '-' + m + '-' + d;
    };
}]);

//设备服务
app.service('deviceService', [function () {

    //站点详情解析位置数据
    this.getStationLocation = function (list, data) {

        var scopeObj = {};
        //$scope.pointProvince + $scope.pointCity + $scope.pointDistrict + $scope.detailAddress
        angular.forEach(list, function (province) {
            if (province.name == data.pointProvince) {
                scopeObj.selected = province;
                angular.forEach(province.child, function (city) {
                    if (city.name == data.pointCity) {
                        scopeObj.selected2 = city;
                        angular.forEach(city.child, function (deviceDistrict) {
                            if (deviceDistrict.value == data.pointDistrict) {
                                scopeObj.selected3 = deviceDistrict;
                            }
                        });
                    }
                });
            }
        });

        return scopeObj;
    };
}]);
//给自定义directive使用的$apply
//app.factory('safeApply', function ($rootScope) {
//    return function (scope, fn) {
//        var phase = scope.$root.$$phase;
//        if (phase == '$apply' || phase == '$digest') {
//            if (fn && ( typeof (fn) === 'function')) {
//                fn();
//            }
//        } else {
//            scope.$apply(fn);
//        }
//    }
//});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/6/16.
 */

//返回上一级操作
app.service('backPathService', [function () {
    this.getBackSpace = function (data) {
        var arr;
        arr = data.split("/");
        arr.pop();
        arr = arr.join('/');
        return arr;
    };

    this.getCurrentSpace = function (data) {
        var arr;
        arr = data.split("/");
        arr = arr[arr.length - 1];
        return arr;
    };
}]);

app.service('mediaService', [function () {
    //删除项获取path和dir并拼装
    this.getSelectedMedia = function (data, orginData, path) {
        var gettype = Object.prototype.toString;
        var sendObj = {};
        var selectedMediaArr = [];
        if (gettype.call(data) == '[object String]') {

            angular.forEach(orginData, function (item) {
                if (item.fullName == data) {
                    var selectedMediaObj = {};
                    selectedMediaObj.path = item.fullName;
                    selectedMediaObj.dir = item.dir;
                    selectedMediaObj.name = item.name;
                    selectedMediaArr.push(selectedMediaObj);
                }
            });
        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.fullName == name) {
                        var selectedMediaObj = {};
                        selectedMediaObj.path = item.fullName;
                        selectedMediaObj.dir = item.dir;
                        selectedMediaObj.name = item.name;
                        selectedMediaArr.push(selectedMediaObj);
                    }
                });
            });
        }
        sendObj.fileList = selectedMediaArr;
        return sendObj;
    };

    //该service用于检测当前是否有正在重命名项，防止同时多项重命名
    this.checkRename = function (selector) {
        var trArr = $(selector),
            bool = true;

        angular.forEach(trArr, function (item) {
            if ($(item).hasClass('editTr') == true) {
                bool = false;
            }
        });

        return bool;
    };
}]);

//获取节目删除项
app.service('programService', [function () {

    this.getSelectedProgram = function (data, orginData) {
        var gettype = Object.prototype.toString;
        var sendObj = {};
        var selectedProgramArr = [];
        if (gettype.call(data) == '[object String]') {
            angular.forEach(orginData, function (item) {
                if (item.materialListId == data) {
                    selectedProgramArr.push(data);
                }
            });
        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.materialListId == name) {
                        selectedProgramArr.push(name);
                    }
                });
            });
        }
        sendObj.ids = selectedProgramArr;
        return sendObj;
    };

    this.limitNameLength = function (data) {
        if (!!data) {
            var name = data,
                bool;
            name = name.split('');

            name.length <= 20 ? bool = true : bool = false;

            return bool;
        }
    };
}]);

//设备相关服务
app.service('deviceService', [function () {

    //获取设备删除项
    this.getSelectedDevice = function (data, orginData) {
        var gettype = Object.prototype.toString;
        var sendObj = {};
        var selectedProgramArr = [];
        if (gettype.call(data) == '[object String]') {
            angular.forEach(orginData, function (item) {
                if (item.deviceId == data) {
                    selectedProgramArr.push(data);
                }
            });
        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.deviceId == name) {
                        selectedProgramArr.push(name);
                    }
                });
            });
        }
        sendObj.deviceIdList = selectedProgramArr;
        return sendObj;
    };

    //获取添加设备项
    this.getAddDevice = function (data, orginData) {
        var gettype = Object.prototype.toString;
        var sendObj = {};
        var selectedProgramArr = [];
        if (gettype.call(data) == '[object String]') {
            angular.forEach(orginData, function (item) {
                if (item.deviceId == data) {
                    selectedProgramArr.push(item);
                }
            });
        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.deviceId == name) {
                        selectedProgramArr.push(item);
                    }
                });
            });
        }
        sendObj.deviceList = selectedProgramArr;
        return sendObj;
    };
}]);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2017/10/17.
 */
//设备服务
app.service('ptService', [function () {
    //解析终端位置数据
    this.getDeviceLocation = function (list, data) {

        var scopeObj = {};

        angular.forEach(list, function (province) {
            if (province.name == data.deviceProvince) {
                scopeObj.selected = province;
                angular.forEach(province.child, function (city) {
                    if (city.name == data.deviceCity) {
                        scopeObj.selected2 = city;
                        angular.forEach(city.child, function (deviceDistrict) {
                            if (deviceDistrict.value == data.deviceDistrict) {
                                scopeObj.selected3 = deviceDistrict;
                            }
                        });
                    }
                });
            }
        });

        return scopeObj;
    };

    //站点详情解析位置数据
    this.getStationLocation = function (list, data) {

        var scopeObj = {};

        angular.forEach(list, function (province) {
            if (province.name == data.stationProvince) {
                scopeObj.selected = province;
                angular.forEach(province.child, function (city) {
                    if (city.name == data.stationCity) {
                        scopeObj.selected2 = city;
                        angular.forEach(city.child, function (deviceDistrict) {
                            if (deviceDistrict.value == data.stationDistrict) {
                                scopeObj.selected3 = deviceDistrict;
                            }
                        });
                    }
                });
            }
        });

        return scopeObj;
    };

    //站点详情解析位置数据
    this.getStationLocations = function (list, data) {

        var scopeObj = {};

        //$scope.pointProvince + $scope.pointCity + $scope.pointDistrict + $scope.detailAddress
        angular.forEach(list, function (province) {
            //console.log(data)
            //console.log(123)
            if (province.name == data.pointProvince) {
                scopeObj.selected = province;
                angular.forEach(province.child, function (city) {
                    if (city.name == data.pointCity) {
                        scopeObj.selected2 = city;
                        angular.forEach(city.child, function (deviceDistrict) {
                            if (deviceDistrict.value == data.pointDistrict) {
                                scopeObj.selected3 = deviceDistrict;
                            }
                        });
                    }
                });
            }
        });

        return scopeObj;
    };

    //检查添加终端时mac输入合理性
    this.checkMac = function (data) {
        var bool,
            patternBool,
            reg = /^[A-Fa-f0-9:]+$/;

        //符合验证为true
        data.length == 17 ? bool = true : bool = false;

        //符合验证则为true
        reg.test(data) ? patternBool = true : patternBool = false;

        return { bool: bool, patternBool: patternBool };
    };
}]);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Controllers */

angular.module('app').controller('AppCtrl', ['$scope', '$rootScope', '$translate', '$localStorage', '$window', '$state', '$location', 'dataAccess', 'commonService', 'checkBtnService', 'staticData', function ($scope, $rootScope, $translate, $localStorage, $window, $state, $location, dataAccess, commonService, checkBtnService, staticData) {
  // add 'ie' classes to html
  var isIE = !!navigator.userAgent.match(/MSIE/i);
  isIE && angular.element($window.document.body).addClass('ie');
  isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

  // config
  $scope.app = {
    name: 'Angulr',
    //host: "http://172.17.9.92:8000",
    host: staticData.hostUrl,
    version: '1.3.3',
    // for chart colors
    color: {
      primary: '#7266ba',
      info: '#23b7e5',
      success: '#27c24c',
      warning: '#fad733',
      danger: '#f05050',
      light: '#e8eff0',
      dark: '#3a3f51',
      black: '#1c2b36'
    },
    settings: {
      themeID: 1,
      navbarHeaderColor: 'bg-white',
      navbarCollapseColor: 'bg-white',
      asideColor: 'bg-white',
      headerFixed: true,
      asideFixed: false,
      asideFolded: true,
      asideDock: false,
      container: false
    }

    // save settings to local storage
  };if (angular.isDefined($localStorage.settings)) {
    $scope.app.settings = $localStorage.settings;
  } else {
    $localStorage.settings = $scope.app.settings;
  }
  $scope.$watch('app.settings', function () {
    if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
      // aside dock and fixed must set the header fixed.
      $scope.app.settings.headerFixed = true;
    }
    // save to local storage
    $localStorage.settings = $scope.app.settings;
  }, true);

  // angular translate
  $scope.lang = { isopen: false };
  $scope.langs = { en: 'English', de_DE: 'German', it_IT: 'Italian' };
  $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
  $scope.setLang = function (langKey, $event) {
    // set the current lang
    $scope.selectLang = $scope.langs[langKey];
    // You can change the language during runtime
    $translate.use(langKey);
    $scope.lang.isopen = !$scope.lang.isopen;
  };

  function isSmartDevice($window) {
    // Adapted from http://www.detectmobilebrowsers.com
    var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
    // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
    return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(ua)
    );
  }

  //路由拦截,检查权限
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.name == 'auth.login') return; // 如果是进入登录界面则允许
    // 如果用户不存在
    if (!dataAccess.sessionGet('adminName')) {
      event.preventDefault(); // 取消默认跳转行为
      $state.go("auth.login"); //跳转到登录界面
    }
  });

  //拦截器:如果用户登录状态丢失，返回登录页
  $rootScope.$on('userIntercepted', function (data) {
    //跳转到登录界面
    commonService.tipModal('conflictType').result.then(function () {
      $state.go("auth.login");
    });
  });

  ////拦截器:如果用户无权限查看该页面，给出提示
  $rootScope.$on('userNotPermission', function (data) {
    commonService.ctrlModal('noPerType').result.then(function () {
      return;
    });
  });

  ////拦截器，如果后台出错，给出提示
  $rootScope.$on('serverError', function (data) {
    commonService.tipModal('serverErrorType').result.then(function () {
      return;
    });
  });

  //w5c表单验证配置
  var vm = $scope.vm = {
    htmlSource: "",
    showErrorType: "1",
    showDynamicElement: true,
    dynamicName: "dynamicName",
    entity: {}
  };

  vm.saveEntity = function ($event) {
    //do somethings for bz
    alert("Save Successfully!!!");
  };
  //每个表单的配置，如果不设置，默认和全局配置相同
  vm.validateOptions = {
    blurTrig: true
  };

  vm.customizer = function () {
    return vm.entity.customizer > vm.entity.number;
  };

  vm.changeShowType = function () {
    if (vm.showErrorType == 2) {
      vm.validateOptions.showError = false;
      vm.validateOptions.removeError = false;
    } else {
      vm.validateOptions.showError = true;
      vm.validateOptions.removeError = true;
    }
  };

  vm.types = [{
    value: 1,
    text: "选择框"
  }, {
    value: 2,
    text: "输入框"
  }];

  //权限检测
  $scope.checkBtn = function (url, method, route, params) {
    checkBtnService.check(url, method, route, params);
  };

  // 全局变量图片以及视频开头的域
  // $rootScope.address = 'http://mpsd.kdxcloud.dev/'

  //$rootScope.address = 'http://mpsd.kdxcloud.download'
  //线上
  $rootScope.address = 'http://mpsd.kdxcloud.com:88';
}]);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by chenqi1 on 2016/12/26.
 */
app.run(['$rootScope', '$location', '$state', '$stateParams', 'dataAccess', function ($rootScope, $location, $state, $stateParams, dataAccess) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
        $rootScope.previousState = from;
        $rootScope.previousStateParams = fromParams;

        var str = $location.path();
        var index = $location.path().lastIndexOf('\/');
        var newStr = str.substr(0, index);

        if (str == '/app/order/addAdOrder1' || str == '/app/order/addAdOrder2' || str == '/app/order/addAdOrder3') {
            return;
        } else {
            dataAccess.sessionRemove('allObj');
        }

        $rootScope.navRoute = newStr;
    });
}]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
    //.otherwise('/auth/login')
    //.otherwise('/app/media/mediaList')
    //.otherwise('/app/program/programList')
    .otherwise('/app/device/deviceList');

    $stateProvider.state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'admin/app.html'
    }).state('app.dashboard', {
        //url: '/dashboard',
        //templateUrl: 'admin/dashboard.html',
        //ncyBreadcrumb: {
        //    label: '<i class="fa fa-home"></i> 首页'
        //}
    })

    //登录页面路由
    .state('auth', {
        abstract: true,
        url: '/auth',
        template: '<div ui-view class="fade-in"></div>'
    }).state('auth.login', {
        url: '/login',
        templateUrl: 'admin/auth/login.html'
    })

    //素材管理路由
    .state('app.media', {
        abstract: true,
        url: '/media',
        template: '<div ui-view class="fade-in"></div>'

    }).state('app.media.mediaList', {
        url: '/mediaList?reload',
        templateUrl: 'admin/media/mediaList.html',
        cache: false
    })
    //素材审核
    .state('app.media.checkMedia', {
        url: '/checkMedia?reload',
        templateUrl: 'admin/media/checkMedia.html',
        cache: false
    })

    //节目管理路由
    .state('app.program', {
        abstract: true,
        url: '/program',
        template: '<div ui-view class="fade-in"></div>'

    })
    //节目列表
    .state('app.program.programList', {
        url: '/programList?reload',
        //templateUrl : 'admin/program/addProgram.html',
        templateUrl: 'admin/program/programList.html',
        cache: false
    })
    //创建节目
    .state('app.program.addProgram', {
        url: '/addProgram',
        params: { "id": null, "name": null, "bool": null },
        templateUrl: 'admin/program/addProgram.html',
        cache: false
    })

    //成员管理路由
    .state('app.member', {
        abstract: true,
        url: '/member',
        template: '<div ui-view class="fade-in"></div>'
        //resolve: {
        //    deps: ['$ocLazyLoad',
        //        function( $ocLazyLoad ){
        //            return $ocLazyLoad.load('admin/js/controller/mediaCtrl.js');
        //        }]
        //}
    }).state('app.member.memberList', {
        url: '/memberList',
        templateUrl: 'admin/member/memberList.html',
        cache: false
    })

    //系统权限管理路由
    .state('app.role', {
        abstract: true,
        url: '/role',
        template: '<div ui-view class="fade-in"></div>'
    }).state('app.role.roleList', {
        url: '/roleList?reload',
        templateUrl: 'admin/role/roleList.html',
        cache: false
    })
    //添加权限组路由
    .state('app.role.addRole', {
        url: '/role/addRole',
        templateUrl: 'admin/role/addRole.html'
        //ncyBreadcrumb: {
        //    parent:'app.permission.permissionList',
        //    label: '添加权限组'
        //}
    })
    //编辑权限路由
    .state('app.role.editRole', {
        url: '/editRole',
        params: { "id": null },
        templateUrl: 'admin/role/addRole.html'
        //ncyBreadcrumb: {
        //    parent:'app.permission.permissionList',
        //    label: '编辑权限组',
        //}
    })
    //添加成员
    .state('app.role.addRoleMember', {
        url: '/addRoleMember',
        params: { "id": null, "name": null },
        templateUrl: 'admin/role/roleAddMember.html'
        //ncyBreadcrumb: {
        //    parent:'app.permission.permissionList',
        //    label: '添加权限组'
        //}
    })
    //设备路由
    .state('app.device', {
        abstract: true,
        url: '/device',
        template: '<div ui-view class="fade-in"></div>'
    })
    //设备列表
    .state('app.device.deviceList', {
        url: '/deviceList',
        //params:{"id":null,"name":null},
        templateUrl: 'admin/device/deviceList.html'
    })
    //添加设备
    .state('app.device.addDevice', {
        url: '/addDevice',
        //params:{"id":null,"name":null},
        templateUrl: 'admin/device/addDevice.html'
    })

    //发送管理路由
    .state('app.send', {
        abstract: true,
        url: '/send',
        template: '<div ui-view class="fade-in"></div>'
        //resolve: {
        //    deps: ['$ocLazyLoad',
        //        function( $ocLazyLoad ){
        //            return $ocLazyLoad.load('admin/js/controller/mediaCtrl.js');
        //        }]
        //}
    }).state('app.send.sendList', {
        url: '/sendList',
        templateUrl: 'admin/send/sendList.html',
        cache: false
    })
    //添加发送任务
    .state('app.send.addSendTask', {
        url: '/addSendTask',
        templateUrl: 'admin/send/addSendTask.html',
        cache: false
    })
    //编辑发送任务
    .state('app.send.editSendTask', {
        url: '/editSendTask',
        params: { "id": null },
        templateUrl: 'admin/send/addSendTask.html'
        //ncyBreadcrumb: {
        //    parent:'app.permission.permissionList',
        //    label: '添加权限组'
        //}
    })

    //点位管理
    .state('app.PT', {
        abstract: true,
        url: '/PT',
        template: '<div ui-view class="fade-in"></div>'
    })
    //点位列表
    .state('app.PT.PTlist', {
        url: '/PTlist?reload',
        templateUrl: 'admin/point/PTlist.html',
        cache: false
    })
    //添加点位
    .state('app.PT.addPTlist', {
        url: '/addPTlist',
        templateUrl: 'admin/point/addPTlist.html',
        cache: false
    })
    //点位下终端
    .state('app.PT.addPTterminal', {
        url: '/addPTterminal',
        params: { "id": null },
        templateUrl: 'admin/point/addPTterminal.html',
        cache: false
    })
    //点位播放列表
    .state('app.PT.playList', {
        url: '/playList',
        params: { "id": null, "name": null },
        templateUrl: 'admin/point/playList.html',
        cache: false
    })
    //点位播放日历
    .state('app.PT.pointDate', {
        url: '/pointDate',
        params: { "id": null, "pointName": null, 'pointType': null },
        templateUrl: 'admin/point/pointDate.html',
        cache: false
    })
    //wifi探针人流量
    .state('app.PT.wifiProbeList', {
        url: '/wifiProbeList',
        params: { "id": null, "name": null },
        templateUrl: 'admin/point/wifiProbeList.html',
        cache: false
    })

    //订单管理
    .state('app.order', {
        abstract: true,
        url: '/order',
        template: '<div ui-view class="fade-in"></div>'
    })
    //项目列表
    .state('app.order.orderList', {
        url: '/orderList',
        templateUrl: 'admin/order/orderList.html',
        cache: false
    })

    //广告单审核列表
    .state('app.order.checkSheetList', {
        url: '/checkSheetList',
        templateUrl: 'admin/order/checkSheetList.html',
        cache: false
    })

    ////广告投放
    //.state('app.advertisement', {
    //    abstract: true,
    //    url: '/advertisement',
    //    template: '<div ui-view class="fade-in"></div>',
    //})
    //广告投放详情(正常跳转)
    .state('app.order.desc', {
        url: '/advertisementDesc',
        params: { 'projectId': null, "id": null, "bool": null },
        templateUrl: 'admin/order/advertisementDesc.html',
        cache: false
    })
    //广告投放详情(审核跳转)
    .state('app.order.examineDesc', {
        url: '/examineDesc',
        params: { "id": null },
        templateUrl: 'admin/order/examineDesc.html',
        cache: false
    })
    //广告单列表
    .state('app.order.adOrderList', {
        url: '/adOrderList',
        params: { "deviceId": null, 'projectName': null, "projectNum": null },
        templateUrl: 'admin/order/adOrderList.html',
        cache: false
    })
    //广告单投放站点
    .state('app.order.adPointList', {
        url: '/adPointList',
        params: { "projectId": null, "billId": null, "bool": null, "xiaKangBool": null },
        templateUrl: 'admin/order/adPointList.html',
        cache: false
    })

    //添加广告单第一步选择点位
    .state('app.order.addAdOrder1', {
        url: '/addAdOrder1',
        params: { "projectId": null, "billId": null, "addFlag": null },
        templateUrl: 'admin/order/addAdOrder1.html',
        cache: false
    })
    //添加广告单第二步选择素材
    .state('app.order.addAdOrder2', {
        url: '/addAdOrder2',
        params: { "projectId": null, "addFlag": null },
        templateUrl: 'admin/order/addAdOrder2.html',
        cache: false
    })
    //添加广告单第三步设置播放方式
    .state('app.order.addAdOrder3', {
        url: '/addAdOrder3',
        params: { "projectId": null, "addFlag": null },
        templateUrl: 'admin/order/addAdOrder3.html',
        cache: false
    })
    //广告投放排期表
    .state('app.order.playList', {
        url: '/advertisementPlayList',
        params: { "id": null, "name": null },
        templateUrl: 'admin/order/adPlayList.html',
        cache: false
    })
    //广告播放统计
    .state('app.order.adProjectCount', {
        url: '/adProjectCount',
        params: { "projectName": null, "projectNum": null, "id": null, "billId": null, 'isAdInto': null },
        templateUrl: 'admin/order/adProjectCount.html',
        cache: false
    })
    //广告播放统计详情
    .state('app.order.adProjectCountDetail', {
        url: '/adProjectCountDetail',
        params: { "projectName": null, "projectNum": null, "id": null, 'date': null, 'isAdInto': null, 'billId': null },
        templateUrl: 'admin/order/adProjectCountDetail.html',
        cache: false
    })
    //默认播放素材页面
    .state('app.defaultPlayList', {
        abstract: true,
        url: '/defaultPlayList',
        template: '<div ui-view class="fade-in"></div>'
    }).state('app.defaultPlayList.playList', {
        url: '/defaultPlayList',
        params: { "id": null, "name": null },
        templateUrl: 'admin/defaultPlayList/defaultPlayList.html',
        cache: false
    });
}]);

/***/ }),
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(105);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./advertisement.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./advertisement.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(106);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./base.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./base.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(107);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./block.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./block.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(108);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./defaultPlayList.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./defaultPlayList.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(109);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./device.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./device.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(110);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./login.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./login.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(111);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./media.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./media.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(112);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./modal.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./modal.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./order.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./order.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(114);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./point.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./point.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(115);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./pointDate.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./pointDate.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(116);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./program.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./program.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(117);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./role.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./role.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(118);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./send.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./send.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(119);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./system.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.9@css-loader/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./system.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 92 */,
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(121);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.9@css-loader/index.js!../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./app.css", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.9@css-loader/index.js!../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(78);

__webpack_require__(93);

__webpack_require__(79);

__webpack_require__(83);

__webpack_require__(88);

__webpack_require__(82);

__webpack_require__(91);

__webpack_require__(89);

__webpack_require__(81);

__webpack_require__(90);

__webpack_require__(86);

__webpack_require__(85);

__webpack_require__(84);

__webpack_require__(77);

__webpack_require__(80);

__webpack_require__(87);

__webpack_require__(37);

__webpack_require__(38);

__webpack_require__(24);

__webpack_require__(26);

__webpack_require__(28);

__webpack_require__(23);

__webpack_require__(25);

__webpack_require__(22);

__webpack_require__(30);

__webpack_require__(19);

__webpack_require__(27);

__webpack_require__(20);

__webpack_require__(21);

__webpack_require__(29);

__webpack_require__(31);

__webpack_require__(32);

__webpack_require__(33);

__webpack_require__(34);

__webpack_require__(35);

__webpack_require__(36);

/***/ }),
/* 103 */,
/* 104 */,
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#advertisementDesc {\n  font-family: \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n}\n#advertisementDesc .tabs {\n  display: inline-block;\n  padding-top: 12px;\n  margin-bottom: 20px;\n}\n#advertisementDesc .tabs a {\n  color: #f6911a;\n}\n#advertisementDesc .tabs a:hover {\n  color: #f6911a ;\n}\n#advertisementDesc .member-header {\n  clear: both;\n  overflow: hidden;\n  margin-bottom: 20px;\n}\n#advertisementDesc .member-header .managers {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  float: left;\n  overflow: hidden;\n  border-radius: 2px;\n}\n#advertisementDesc .member-header .managers i {\n  padding: 5px;\n}\n#advertisementDesc .member-header .managers .manager {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#advertisementDesc .member-header .managers .manager:nth-of-type(2):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#advertisementDesc .member-header .managers .chengyuan {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#advertisementDesc .member-header .header-right {\n  float: right;\n  height: 38px;\n  width: 350px;\n  line-height: 38px;\n  height: 45px;\n}\n#advertisementDesc .member-header .header-right .search {\n  width: 198px;\n  height: 36px;\n  float: left;\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  border-radius: 2px;\n  margin-right: 20px;\n  overflow: hidden;\n  border-width: 1px;\n  position: relative;\n}\n#advertisementDesc .member-header .header-right .search i {\n  padding: 5px;\n}\n#advertisementDesc .member-header .header-right .search .search-box {\n  height: 34px;\n  width: 160px;\n  border: none;\n  position: absolute;\n  background-color: #eceeef;\n}\n#advertisementDesc .member-header .header-right .delete {\n  width: 128px;\n  height: 36px;\n  line-height: 36px;\n  float: right;\n  background-color: #fff;\n  color: #f6911a;\n  text-align: center;\n  border-radius: 2px;\n  cursor: pointer;\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#advertisementDesc .member-header .header-right .delete:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#advertisementDesc .member-header .header-right .delete i {\n  padding: 5px;\n}\n#advertisementDesc .adInfo {\n  width: 100%;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#advertisementDesc .adInfo h1 {\n  color: #27231e;\n  font-size: 16px;\n}\n#advertisementDesc .adInfo .time {\n  height: 15px;\n}\n#advertisementDesc .adInfo .time span {\n  float: left;\n  color: #a7afb7;\n  font-size: 10px;\n  margin-right: 25px;\n}\n#advertisementDesc .adInfo .infoList {\n  width: 820px;\n  margin-top: 22px;\n  overflow: hidden;\n}\n#advertisementDesc .adInfo .infoList .infoDesc {\n  float: left;\n  width: 362px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .name {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  width: 85px;\n  float: left;\n}\n#advertisementDesc .adInfo .infoList .infoDesc p {\n  width: 275px;\n  border-bottom: 1px solid #e6e9ec;\n  font-size: 12px;\n  color: #28241f;\n  float: left;\n  margin-bottom: 0;\n  height: 25px;\n  line-height: 25px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .selectTime {\n  overflow: hidden;\n  border-bottom: 1px solid #e6e9ec;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .selectTime p {\n  border-bottom: 0;\n  width: 105px;\n  margin-right: 20px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .selectTime .name2 {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  float: left;\n  margin-bottom: 10px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .selectTime .name2 span {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  width: 80px;\n  display: inline-block;\n  text-align: center;\n  border-bottom: 1px solid #e6e9ec;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview {\n  width: 1290px;\n  overflow: hidden;\n  float: left;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview .preLeft {\n  float: left;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview .preRight {\n  margin-left: 5px;\n  width: 180px;\n  float: left;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview .preRight img {\n  width: 180px;\n  height: 101px;\n  margin-bottom: 3px;\n  border-radius: 5px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview .longPic img {\n  width: 180px;\n  height: 310px;\n  margin-bottom: 0px;\n  border-radius: 5px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview .preRight1 {\n  width: 142px;\n  float: left;\n  margin-left: 3px;\n  margin-right: 3px;\n}\n#advertisementDesc .adInfo .infoList .infoDesc .preview .preRight1 img {\n  width: 142px;\n  height: 255px;\n  margin-bottom: 0px;\n  border-radius: 5px;\n}\n#advertisementDesc .adInfo .infoList .infoPre {\n  width: 100%;\n  margin-bottom: 50px;\n}\n#advertisementDesc .adInfo .infoList .fr {\n  float: right;\n}\n#advertisementDesc .ml60 {\n  margin-left: 60px;\n}\n#advertisementDesc .mt60 {\n  margin-top: 60px;\n}\n#advertisementDesc .video-js .vjs-big-play-button {\n  color: #332e29;\n  background: #fff;\n  border-radius: 50%;\n  border: 0;\n  line-height: 2em;\n  height: 2em;\n  width: 2em;\n  font-size: 16px;\n}\n#advertisementDesc .video-js {\n  border-radius: 5px;\n}\n#advertisementDesc .vjs-paused .vjs-big-play-button {\n  display: block;\n}\n#advertisementDesc .video-body {\n  border-radius: 5px;\n  overflow: hidden;\n  border: 1px solid #cfd3d6;\n  position: relative;\n  width: 550px;\n  height: 310px;\n}\n#advertisementDesc .video-body1 {\n  border-radius: 5px;\n  overflow: hidden;\n  border: 1px solid #cfd3d6;\n  position: relative;\n  width: 455px;\n  height: 255px;\n}\n#advertisementDesc #game {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 50;\n  background: #fff;\n}\n#advertisementDesc #game span {\n  margin-top: 80px;\n  margin-left: 230px;\n  width: 100px;\n  height: 100px;\n  float: left;\n  background: url(" + escape(__webpack_require__(5)) + ");\n  margin-bottom: 10px;\n}\n#advertisementDesc #game p {\n  clear: both;\n  font-size: 12px;\n  color: #28241f;\n  text-align: center;\n  margin-top: 20px;\n  display: inline;\n  border: 0;\n  width: 100%;\n}\n#advertisementDesc .header-right {\n  width: 100%;\n  clear: both;\n  line-height: 38px;\n  height: 45px;\n  position: relative;\n  margin-bottom: 50px;\n}\n#advertisementDesc .header-right .middle {\n  width: 130px;\n  position: absolute;\n  left: 50%;\n  top: 0;\n  transform: translate(-50%, 0);\n}\n#advertisementDesc .header-right .middle .search {\n  width: 198px;\n  height: 36px;\n  float: left;\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  border-radius: 2px;\n  margin-right: 20px;\n  overflow: hidden;\n  border-width: 1px;\n  position: relative;\n}\n#advertisementDesc .header-right .middle .search i {\n  padding: 5px;\n}\n#advertisementDesc .header-right .middle .search .search-box {\n  height: 34px;\n  width: 160px;\n  border: none;\n  position: absolute;\n  background-color: #eceeef;\n}\n#advertisementDesc .header-right .middle .delete {\n  width: 128px;\n  height: 36px;\n  line-height: 36px;\n  float: right;\n  background-color: #fff;\n  color: #f6911a;\n  margin-left: 20px;\n  text-align: center;\n  border-radius: 2px;\n  cursor: pointer;\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#advertisementDesc .header-right .middle .delete:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#advertisementDesc .header-right .middle .delete i {\n  padding: 5px;\n}\n#examineDesc {\n  font-family: \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n}\n#examineDesc .tabs {\n  float: left;\n  display: inline-block;\n  padding-top: 12px;\n  margin-bottom: 20px;\n}\n#examineDesc .tabs a {\n  color: #f6911a;\n}\n#examineDesc .tabs a:hover {\n  color: #f6911a ;\n}\n#examineDesc .member-header {\n  clear: both;\n  overflow: hidden;\n  margin-bottom: 20px;\n}\n#examineDesc .member-header .managers {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  float: left;\n  overflow: hidden;\n  border-radius: 2px;\n}\n#examineDesc .member-header .managers i {\n  padding: 5px;\n}\n#examineDesc .member-header .managers .manager {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#examineDesc .member-header .managers .manager:nth-of-type(2):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#examineDesc .member-header .managers .chengyuan {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#examineDesc .mediaList {\n  margin-top: 20px;\n}\n#examineDesc .adInfo {\n  width: 100%;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#examineDesc .adInfo h1 {\n  color: #27231e;\n  font-size: 16px;\n}\n#examineDesc .adInfo .time {\n  height: 15px;\n}\n#examineDesc .adInfo .time span {\n  float: left;\n  color: #a7afb7;\n  font-size: 10px;\n  margin-right: 25px;\n}\n#examineDesc .adInfo .infoList {\n  width: 685px;\n  margin-top: 22px;\n  overflow: hidden;\n}\n#examineDesc .adInfo .infoList .infoDesc {\n  float: left;\n  width: 295px;\n  margin-right: 20px;\n}\n#examineDesc .adInfo .infoList .infoDesc .name {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  width: 85px;\n  float: left;\n}\n#examineDesc .adInfo .infoList .infoDesc p {\n  width: 210px;\n  border-bottom: 1px solid #e6e9ec;\n  font-size: 12px;\n  color: #28241f;\n  float: left;\n  margin-bottom: 0;\n  height: 25px;\n  line-height: 25px;\n}\n#examineDesc .adInfo .infoList .infoDesc .selectTime {\n  overflow: hidden;\n  border-bottom: 1px solid #e6e9ec;\n}\n#examineDesc .adInfo .infoList .infoDesc .selectTime p {\n  border-bottom: 0;\n  width: 105px;\n  margin-right: 20px;\n}\n#examineDesc .adInfo .infoList .infoDesc .selectTime .name2 {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  float: left;\n  margin-bottom: 10px;\n}\n#examineDesc .adInfo .infoList .infoDesc .selectTime .name2 span {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  width: 80px;\n  display: inline-block;\n  text-align: center;\n  border-bottom: 1px solid #e6e9ec;\n}\n#examineDesc .adInfo .infoList .infoDesc .preview {\n  width: 683px;\n  overflow: hidden;\n  float: left;\n  clear: both;\n}\n#examineDesc .adInfo .infoList .infoDesc .preview .preLeft {\n  float: left;\n}\n#examineDesc .adInfo .infoList .infoDesc .preview .preRight {\n  width: 180px;\n  float: right;\n}\n#examineDesc .adInfo .infoList .infoDesc .preview .preRight img {\n  width: 180px;\n  height: 101px;\n  margin-bottom: 3px;\n  border-radius: 5px;\n}\n#examineDesc .adInfo .infoList .infoDesc .preview .longPic img {\n  width: 180px;\n  height: 310px;\n  margin-bottom: 0px;\n  border-radius: 5px;\n}\n#examineDesc .adInfo .infoList .infoPre {\n  width: 100%;\n  margin-bottom: 50px;\n}\n#examineDesc .adInfo .infoList .fr {\n  float: right;\n}\n#examineDesc .adInfo1 {\n  width: 100%;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#examineDesc .adInfo1 h1 {\n  color: #27231e;\n  font-size: 16px;\n}\n#examineDesc .adInfo1 .time {\n  height: 15px;\n}\n#examineDesc .adInfo1 .time span {\n  float: left;\n  color: #a7afb7;\n  font-size: 10px;\n  margin-right: 25px;\n}\n#examineDesc .adInfo1 .infoList {\n  width: 100%;\n  margin-top: 22px;\n  overflow: hidden;\n}\n#examineDesc .adInfo1 .infoList .infoDesc {\n  float: left;\n  width: 295px;\n  margin-right: 20px;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .name {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  width: 85px;\n  float: left;\n}\n#examineDesc .adInfo1 .infoList .infoDesc p {\n  width: 210px;\n  border-bottom: 1px solid #e6e9ec;\n  font-size: 12px;\n  color: #28241f;\n  float: left;\n  margin-bottom: 0;\n  height: 25px;\n  line-height: 25px;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .selectTime {\n  overflow: hidden;\n  border-bottom: 1px solid #e6e9ec;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .selectTime p {\n  border-bottom: 0;\n  width: 105px;\n  margin-right: 20px;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .selectTime .name2 {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  float: left;\n  margin-bottom: 10px;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .selectTime .name2 span {\n  font-size: 12px;\n  color: #889098;\n  line-height: 25px;\n  width: 80px;\n  display: inline-block;\n  text-align: center;\n  border-bottom: 1px solid #e6e9ec;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .preview {\n  width: 100%;\n  overflow: hidden;\n  float: left;\n  clear: both;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .preview .preLeft {\n  float: left;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .preview .preRight {\n  width: 180px;\n  float: left;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .preview .preRight img {\n  width: 180px;\n  height: 101px;\n  margin-bottom: 3px;\n  border-radius: 5px;\n}\n#examineDesc .adInfo1 .infoList .infoDesc .preview .longPic img {\n  width: 180px;\n  height: 310px;\n  margin-bottom: 0px;\n  border-radius: 5px;\n}\n#examineDesc .adInfo1 .infoList .infoPre {\n  width: 100%;\n  margin-bottom: 50px;\n}\n#examineDesc .adInfo1 .infoList .fr {\n  float: right;\n}\n#examineDesc .infoRight .infoList {\n  width: 330px;\n}\n#examineDesc .ml40 {\n  margin-left: 40px;\n}\n#examineDesc .ml30 {\n  margin-left: 30px;\n}\n#examineDesc .ml10 {\n  margin-left: 10px;\n}\n#examineDesc .mt40 {\n  margin-top: 40px;\n}\n#examineDesc .video-js .vjs-big-play-button {\n  color: #332e29;\n  background: #fff;\n  border-radius: 50%;\n  border: 0;\n  line-height: 2em;\n  height: 2em;\n  width: 2em;\n  font-size: 16px;\n}\n#examineDesc .video-js {\n  border-radius: 5px;\n}\n#examineDesc .vjs-paused .vjs-big-play-button {\n  display: block;\n}\n#examineDesc .video-body {\n  border-radius: 5px;\n  overflow: hidden;\n  border: 1px solid #cfd3d6;\n  position: relative;\n  width: 500px;\n  height: 310px;\n}\n#examineDesc .infoLeft {\n  float: left;\n}\n#examineDesc .infoRight {\n  width: 380px;\n  float: right;\n}\n#examineDesc .icon-gougou {\n  position: relative;\n  top: 2px;\n  font-size: 14px;\n  color: #5e88df;\n}\n#examineDesc .money {\n  margin-right: 20px;\n}\n#examineDesc #game {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 50;\n  background: #fff;\n}\n#examineDesc #game span {\n  margin-top: 80px;\n  margin-left: 205px;\n  width: 100px;\n  height: 100px;\n  float: left;\n  background: url(" + escape(__webpack_require__(5)) + ");\n  margin-bottom: 10px;\n}\n#examineDesc #game p {\n  clear: both;\n  font-size: 12px;\n  color: #28241f;\n  text-align: center;\n  margin-top: 20px;\n  display: inline;\n  border: 0;\n  width: 100%;\n}\n#examineDesc .header-right {\n  width: 100%;\n  clear: both;\n  line-height: 38px;\n  height: 45px;\n  position: relative;\n  top: 40px;\n}\n#examineDesc .header-right .middle {\n  width: 350px;\n  position: absolute;\n  left: 50%;\n  top: 0;\n  transform: translate(-50%, 0);\n}\n#examineDesc .header-right .middle .search {\n  width: 198px;\n  height: 36px;\n  float: left;\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  border-radius: 2px;\n  margin-right: 20px;\n  overflow: hidden;\n  border-width: 1px;\n  position: relative;\n}\n#examineDesc .header-right .middle .search i {\n  padding: 5px;\n}\n#examineDesc .header-right .middle .search .search-box {\n  height: 34px;\n  width: 160px;\n  border: none;\n  position: absolute;\n  background-color: #eceeef;\n}\n#examineDesc .header-right .middle .delete {\n  width: 128px;\n  height: 36px;\n  line-height: 36px;\n  float: right;\n  background-color: #fff;\n  color: #f6911a;\n  margin-left: 20px;\n  text-align: center;\n  border-radius: 2px;\n  cursor: pointer;\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#examineDesc .header-right .middle .delete:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#examineDesc .header-right .middle .delete i {\n  padding: 5px;\n}\n#setPointModal {\n  width: 860px;\n  padding: 40px 40px;\n}\n#setPointModal .optiscroll-h {\n  display: none !important;\n}\n#setPointModal .optiscroll-h .optiscroll-htrack {\n  display: none !important;\n}\n#setPointModal .pointHead {\n  width: 100%;\n  height: 70px;\n}\n#setPointModal .pointHead .title {\n  float: left;\n  color: #27231e;\n  font-size: 16px;\n}\n#setPointModal .pointHead .locationGroup {\n  float: left;\n  font-size: 14px;\n  color: #889098;\n  line-height: 40px;\n  margin-left: 132px;\n}\n#setPointModal .pointHead .locationGroup .chooseCity {\n  margin-left: 6px;\n}\n#setPointModal .pointHead .locationGroup select {\n  width: 88px;\n  height: 38px;\n  font-size: 14px;\n  text-indent: 8px;\n  border: 1px solid #cfd3d6;\n  border-radius: 2px;\n  font-weight: 500;\n}\n#setPointModal .pointHead .searchGroup {\n  float: right;\n  width: 200px;\n}\n#setPointModal .pointHead .searchGroup i {\n  top: 10px;\n  cursor: pointer;\n  color: #889098;\n}\n#setPointModal .pointHead .searchGroup .input {\n  width: 200px;\n  height: 40px;\n  border-radius: 2px;\n  margin-bottom: 20px;\n}\n#setPointModal .siteHead {\n  width: 360px;\n  height: 30px;\n  border-bottom: 1px solid #e6e9ec;\n}\n#setPointModal .siteHead .i-checks {\n  float: left;\n  margin-top: -2px;\n  margin-right: 20px;\n  width: 12px;\n  height: 12px;\n}\n#setPointModal .siteHead .i-checks input,\n#setPointModal .siteHead .i-checks input[type=\"radio\"],\n#setPointModal .siteHead .i-checks input[type=\"checkbox\"] {\n  display: none;\n}\n#setPointModal .siteHead .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  background-color: #f6911a;\n}\n#setPointModal .siteHead .i-checks > i {\n  width: 12px;\n  height: 12px;\n  border: 1px solid #f6911a;\n}\n#setPointModal .siteHead span {\n  width: 100px;\n  margin-right: 40px;\n  text-align: center;\n  font-size: 12px;\n  color: #889098;\n  display: block;\n  float: left;\n}\n#setPointModal .siteHead .site {\n  color: #889098;\n  text-align: left;\n}\n#setPointModal .memLeft {\n  border-right: 1px solid #e6e9ec;\n  width: 390px;\n  height: 425px;\n  padding-right: 30px;\n  float: left;\n}\n#setPointModal .memLeft .memList {\n  width: 360px;\n  height: 410px;\n  overflow: hidden;\n}\n#setPointModal .memLeft .memList .roleItem {\n  height: 45px;\n  width: 360px;\n}\n#setPointModal .memLeft .memList .roleItem .i-checks {\n  float: left;\n  margin-top: 12px;\n  margin-right: 20px;\n  width: 12px;\n  height: 12px;\n}\n#setPointModal .memLeft .memList .roleItem .i-checks input,\n#setPointModal .memLeft .memList .roleItem .i-checks input[type=\"radio\"],\n#setPointModal .memLeft .memList .roleItem .i-checks input[type=\"checkbox\"] {\n  display: none;\n}\n#setPointModal .memLeft .memList .roleItem .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  background-color: #f6911a;\n}\n#setPointModal .memLeft .memList .roleItem .i-checks > i {\n  width: 12px;\n  height: 12px;\n  border: 1px solid #f6911a;\n}\n#setPointModal .memLeft .memList .roleItem .email {\n  font-size: 12px;\n  color: #28241f;\n  width: 180px;\n}\n#setPointModal .memLeft .memList .roleItem span {\n  float: left;\n  width: 140px;\n  line-height: 45px;\n  font-size: 12px;\n  color: #28241f;\n}\n#setPointModal .memright {\n  float: right;\n  width: 385px;\n  height: 425px;\n  padding-left: 30px;\n}\n#setPointModal .memright .head {\n  height: 25px;\n  color: #889098;\n  font-size: 12px;\n}\n#setPointModal .memright .head a {\n  float: right;\n}\n#setPointModal .memright .head a i {\n  font-size: 12px;\n  color: #d2d2d2;\n}\n#setPointModal .memright .memberList {\n  height: 400px;\n}\n#setPointModal .memright .memberList .roleItem {\n  float: left;\n  width: 355px;\n  margin-bottom: 15px;\n  height: 30px;\n}\n#setPointModal .memright .memberList .roleItem .name {\n  color: #28241f;\n  float: left;\n  width: 140px;\n  line-height: 30px;\n  font-size: 12px;\n}\n#setPointModal .memright .memberList .roleItem .email {\n  color: #28241f;\n  float: left;\n  line-height: 30px;\n  font-size: 12px;\n}\n#setPointModal .memright .memberList .roleItem a {\n  float: right;\n  margin-top: 3px;\n}\n#setPointModal .memright .memberList .roleItem a i {\n  font-size: 12px;\n  color: #d2d2d2;\n}\n#setPointModal .membottom {\n  height: 70px;\n  width: 100%;\n  clear: both;\n  padding-top: 30px;\n}\n#setPointModal .membottom .add {\n  height: 40px;\n  width: 65px;\n  float: right;\n  background: #f6911a;\n  margin-left: 45px;\n  font-size: 14px;\n  color: #fff;\n  line-height: 40px;\n  text-align: center;\n  border-radius: 2px;\n  display: block;\n}\n#setPointModal .membottom .cancel {\n  height: 40px;\n  width: 65px;\n  float: right;\n  background: #fff;\n  font-size: 14px;\n  margin-left: 20px;\n  color: #889098;\n  line-height: 40px;\n  text-align: center;\n  border-radius: 2px;\n  border: 1px solid #889098;\n  display: block;\n}\n#setPointModal .membottom p {\n  font-size: 12px;\n  color: #889098;\n  line-height: 40px;\n  float: right;\n}\n#setPointModal .membottom p i {\n  font-size: 16px;\n  color: #f6911a;\n}\n", ""]);

// exports


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".app {\n  background-color: #eceeef;\n}\n.app-header {\n  height: 58px;\n  box-shadow: 0px 13px 24px 0px rgba(119, 97, 71, 0.21);\n}\n.headerNav .navbar-nav p {\n  margin: 0;\n}\n.headerNav .navbar-nav .systemTitle {\n  padding-top: 10px;\n  font-size: 18px;\n  color: #3f3c39;\n}\n.headerNav .navbar-nav .sysTitleEn {\n  font-size: 12px;\n  color: #f6911a;\n}\n.headerNav .navbar-right {\n  height: 58px;\n}\n.headerNav .navbar-right li {\n  height: 58px;\n}\n.headerNav .navbar-right .userInfo {\n  cursor: pointer;\n  padding: 0 10px;\n  border-right: 1px solid #e4e4e4;\n}\n.headerNav .navbar-right .userInfo .userId {\n  display: inline-block;\n  padding-top: 10px;\n  color: #9295a6;\n}\n.headerNav .navbar-right .userInfo .userName {\n  color: #f6911a;\n}\n.headerNav .navbar-right .userInfo:hover {\n  background-color: #f6911a;\n}\n.headerNav .navbar-right .userInfo:hover .userId {\n  color: #fff;\n}\n.headerNav .navbar-right .userInfo:hover .userName {\n  color: #fff;\n}\n.headerNav .navbar-right .userInfo span {\n  font-size: 12px;\n}\n.headerNav .navbar-right .logOut {\n  padding: 0 25px;\n  cursor: pointer;\n}\n.headerNav .navbar-right .logOut i {\n  line-height: 58px;\n  font-size: 22px;\n  font-weight: 700;\n  color: #c4c6d6;\n}\n.headerNav .navbar-right .logOut:hover {\n  background-color: #f6911a;\n}\n.headerNav .navbar-right .logOut:hover i {\n  color: #fff;\n}\n.app-aside {\n  margin-top: 40px;\n  position: fixed;\n}\n.app-aside .aside-wrap .navi {\n  padding: 30px 0;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n.app-aside .aside-wrap .nav li a {\n  color: #6f6a64;\n  width: auto;\n  font-size: 12px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n.app-aside .aside-wrap .nav li a:hover {\n  width: 77px;\n  background-color: #6f6a64;\n  color: #fff;\n  border-right: 2px solid #f6911a;\n  box-shadow: 5px 5px 5px #c3c2c1;\n}\n.app-aside .aside-wrap .nav li a:hover i {\n  color: #fff;\n}\n.app-aside .aside-wrap .nav li a:focus {\n  width: 77px;\n  background-color: #6f6a64;\n  color: #fff;\n  border-right: 2px solid #f6911a;\n  box-shadow: 5px 5px 5px #c3c2c1;\n}\n.app-aside .aside-wrap .nav li a:focus i {\n  color: #fff;\n}\n.app-aside .aside-wrap .nav li a i {\n  color: #6f6a64;\n  height: 40px;\n  line-height: 40px !important;\n}\n.app-content {\n  padding: 40px;\n  background-color: #eceeef;\n}\n.app-content .app-content-body {\n  padding: 0;\n}\n.fl {\n  float: left;\n}\n.fr {\n  float: right;\n}\n.tal {\n  text-align: left !important;\n}\n.tac {\n  text-align: center !important;\n}\n.tar {\n  text-align: right !important;\n}\ni {\n  font-style: normal;\n}\n.table thead {\n  color: #889098;\n}\n.table thead .i-checks i {\n  width: 12px;\n  height: 12px;\n  border-radius: 2px;\n}\n.table thead .i-checks input:checked + i {\n  border-color: #f6911a;\n  background-color: #fff;\n}\n.table thead .i-checks input:checked + i:before {\n  width: 6px;\n  height: 6px;\n  top: 2px;\n  left: 2px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n.table tbody {\n  color: #28241f;\n}\n.table tbody .i-checks i {\n  width: 12px;\n  height: 12px;\n  border-radius: 2px;\n}\n.table tbody .i-checks input:checked + i {\n  border-color: #f6911a;\n  background-color: #fff;\n}\n.table tbody .i-checks input:checked + i:before {\n  width: 6px;\n  height: 6px;\n  top: 2px;\n  left: 2px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n.noData {\n  padding: 50px 0;\n  width: 100%;\n  text-align: center;\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n  background-color: #fff;\n  margin-bottom: 10px;\n}\n.noData .noDataImg {\n  width: 170px;\n  height: 120px;\n  margin: 0 auto;\n  background-image: url(" + escape(__webpack_require__(136)) + ");\n}\n.noData p {\n  font-size: 14px;\n  color: #6d7290;\n  margin: 30px;\n}\n.noData p a {\n  color: #f6911a;\n}\n.dirType {\n  background: url(" + escape(__webpack_require__(4)) + ") no-repeat -104px 0;\n}\n.picType {\n  background: url(" + escape(__webpack_require__(4)) + ") no-repeat -156px 0;\n}\n.videoType {\n  background: url(" + escape(__webpack_require__(4)) + ") no-repeat -130px 0;\n}\n.otherType {\n  background: url(" + escape(__webpack_require__(4)) + ") no-repeat -182px 0;\n}\n.btn {\n  border-radius: 2px !important;\n}\na {\n  text-decoration: none !important;\n}\n.navActive {\n  width: 77px !important;\n  background-color: #6f6a64 !important;\n  color: #fff !important;\n  border-right: 2px solid #f6911a !important;\n  box-shadow: 5px 5px 5px #c3c2c1 !important;\n}\n.navActive i {\n  color: #fff !important;\n}\n.selectedTr {\n  background-color: #fff3e4 !important;\n  box-shadow: none !important;\n}\n.selectedTr td {\n  border-bottom: 1px solid #fff !important;\n}\n.i-switch {\n  width: 38px;\n  position: relative;\n}\n.i-switch:before {\n  content: 'on';\n  position: absolute;\n  top: 1px;\n  left: 18px;\n  color: #fff;\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.i-switch:after {\n  content: 'off';\n  position: absolute;\n  top: 1px;\n  left: 0;\n  color: #fff;\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.i-switch input:checked + i:after {\n  margin-left: -17px !important;\n}\n.bg-diy {\n  background-color: #f6911a  !important;\n}\n.i-switch i:before {\n  background-color: #d0d0d0 !important;\n}\n.tw {\n  width: 410px !important;\n}\n.i-checks input:checked + i {\n  border-color: #f6911a ;\n}\n.i-checks input:checked + i:before {\n  background-color: #f6911a;\n}\n.bootstrap-datetimepicker-widget.dropdown-menu.top.change:before {\n  left: 240px;\n}\n.bootstrap-datetimepicker-widget.dropdown-menu.top.change:after {\n  left: 240px;\n}\n.input-group-addon {\n  background-color: #fff !important;\n  color: #4095fe !important;\n}\n.diy-SS {\n  width: 952px !important;\n}\n.diy-lg3 {\n  width: 1140px !important;\n}\n.diy-sm {\n  width: 420px !important;\n}\n.diy-lg {\n  width: 860px !important;\n}\n.diy-lg2 {\n  width: 998px !important;\n}\n.pageSquare {\n  width: 100%;\n  background-color: #fff;\n}\n.myPagination {\n  padding-right: 50px;\n  padding-bottom: 20px;\n}\n.myPagination ul {\n  margin: 0;\n  vertical-align: middle;\n}\n.pagination > .active > a,\n.pagination > .active > span,\n.pagination > .active > a:hover,\n.pagination > .active > span:hover,\n.pagination > .active > a:focus,\n.pagination > .active > span:focus {\n  background-color: #f6911a !important;\n  border-color: #f6911a !important;\n}\n.jumpPage {\n  display: inline-block;\n  padding-right: 20px;\n  color: #889098;\n}\n.jumpPage input {\n  width: 40px !important;\n  text-align: center;\n}\n.jumpPage input::-webkit-outer-spin-button,\n.jumpPage input::-webkit-inner-spin-button {\n  -webkit-appearance: none !important;\n  margin: 0;\n}\n.jumpPage input[type=\"number\"] {\n  -moz-appearance: textfield;\n}\n.diy-SS .modal-content {\n  overflow: inherit !important;\n}\n", ""]);

// exports


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".navbar-header .navbar-brand {\n  width: 100%;\n  background-color: #f6911a;\n  height: 58px;\n  line-height: 58px;\n}\n.navbar-header .navbar-brand .fa-paper-plane {\n  color: #fff;\n}\n.modal-content {\n  border: 0!important;\n}\n.modal-lg {\n  width: 550px !important;\n}\n.modal-sm {\n  width: 450px !important;\n}\n.modal-dialog {\n  margin: 100px auto !important;\n}\n.modal-dialog .modalWrap {\n  width: 450px;\n  height: 185px;\n  padding: 30px;\n}\n.modal-dialog .modalWrap .delMsg {\n  font-size: 14px;\n  color: #28241f;\n}\n.modal-dialog .modalWrap .delMsg p {\n  margin: 15px 0 45px 0px;\n}\n.modal-dialog .modalWrap .delMsg p i {\n  font-size: 28px;\n  color: #f6911a;\n  position: relative;\n  top: 6px;\n}\n.modal-dialog .modalWrap .inputArea input {\n  margin-top: 10px;\n  width: 100%;\n}\n.modal-dialog .modalWrap .inputArea .createPro {\n  height: 40px;\n  line-height: 40px;\n  border: 1px solid #74b2fe;\n  padding-left: 20px;\n}\n.modal-dialog .modalWrap .inputArea p {\n  height: 38px;\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n  color: #889098;\n}\n.modal-dialog .modalWrap .inputArea p i {\n  color: #f6911a;\n}\n.modal-dialog .modalWrap .inputArea p span {\n  line-height: 38px;\n}\n.modal-dialog .modalWrap .modal-footer {\n  border-top: 0 none;\n  padding: 0px;\n  text-align: right;\n}\n.modal-dialog .modalWrap .modal-footer .btn {\n  width: auto;\n  height: 40px;\n  color: #acb2b7;\n  margin-left: 20px;\n}\n.modal-dialog .modalWrap .modal-footer .btnSubmit {\n  background-color: #f6911a;\n  color: #fff;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n}\n.modal-dialog .modalWrap .modal-footer .btnCancel {\n  border: 1px solid #acb2b7;\n  line-height: 26px;\n}\n.modal-dialog .modalWrap .modal-footer .btnCancel:hover {\n  border: 1px solid rgba(0, 0, 0, 0);\n  background-color: #f6911a;\n  color: #fff;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n}\n.loadingWrap {\n  position: absolute;\n  left: 50%;\n  top: 160px;\n  margin-left: -45px;\n  z-index: 9999;\n}\n.loadingWrap .loadingSquare {\n  padding: 10px;\n  border-radius: 2px;\n}\n.loadingWrap .loadingSquare p {\n  font-size: 14px;\n  color: #fff;\n  text-align: center;\n  line-height: 24px;\n  margin: 0;\n}\n.loadingWrap .loadingSquare p i {\n  vertical-align: middle;\n  font-size: 24px;\n}\n.loadingWrap .onLoading {\n  background-color: #f8a748;\n}\n.loadingWrap .ctrlSuccess {\n  background-color: rgba(93, 136, 223, 0.8);\n}\n.loadingWrap .ctrlError {\n  background-color: #eb607a;\n}\n/* 文件操作模态框样式 */\n.file-box {\n  width: 450px;\n  height: 444px;\n  background: white;\n  /*margin: 100px auto;*/\n  border: 1px solid #fff;\n  /*padding: 20px 0;*/\n}\n.file-box h2 {\n  line-height: 20px;\n  font-size: 16PX;\n  height: 20px;\n  /*padding-top:16px;*/\n  text-indent: 30px;\n}\n.close-box {\n  float: right;\n  padding-right: 20px;\n}\n.need-operate-file {\n  padding: 20px 30px 0;\n}\n.single-img {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  float: left;\n  /*margin-top:12px;*/\n  /*background: url('../images/icon/icon_video.png') no-repeat;*/\n  padding-right: 10px;\n}\n.single-file {\n  height: 12px;\n  line-height: 24px;\n  font-size: 14px;\n}\n.all-file-list {\n  height: 38px;\n  width: 390px;\n  height: 220px;\n  margin: 28px 30px 0;\n  background-color: #faf6f1;\n}\n.all-file-list h3 {\n  font-weight: normal;\n  font-size: 14px;\n  padding: 12px 0;\n  text-indent: 28px;\n  margin: 0;\n  border-bottom: 1px solid #ede5db;\n}\n.all-file-lists ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.botton-class {\n  padding-top: 35px;\n}\n.botton-class button:nth-of-type(1) {\n  background-color: #f6911a;\n  width: 128px;\n  font-size: 14px;\n  height: 38px;\n  line-height: 38px;\n  color: #fff;\n  margin-left: 202px;\n  border: none;\n  margin-right: 25px;\n}\n.botton-class button:nth-of-type(2) {\n  width: 68px;\n  font-size: 14px;\n  height: 38px;\n  line-height: 38px;\n  border: 1px solid #acb2b7;\n  color: #889098;\n  background-color: #fff;\n}\n.all-file-lists {\n  height: 180px;\n  padding: 10px 20px;\n  overflow-y: auto;\n}\n.file-detail {\n  height: 36px;\n  line-height: 36px;\n  display: block;\n}\n.file-detail:hover {\n  background-color: #f6911a;\n  color: #fff;\n}\n.file-detail-hover {\n  background-color: #f6911a;\n  color: #fff;\n}\n.single-img-detail {\n  width: 24px;\n  height: 24px;\n  float: left;\n  padding: 6px 12px 6px 42px;\n}\n.single-name-detail {\n  font-size: 14px;\n}\n.text-ident {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  float: left;\n}\n.wenjianjia {\n  width: 25px;\n  height: 25px;\n  display: inline-block;\n  background: url(" + escape(__webpack_require__(8)) + ") no-repeat;\n}\n.meiti {\n  width: 25px;\n  height: 25px;\n  display: inline-block;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n.text-title {\n  top: -8px;\n  position: relative;\n}\n.node_name {\n  background: url(" + escape(__webpack_require__(8)) + ") no-repeat;\n  background-position-y: 5px;\n  display: inline-block;\n  text-indent: 38px;\n}\n.node_name1 {\n  background: url(" + escape(__webpack_require__(130)) + ") no-repeat;\n  background-position-y: 5px;\n  display: inline-block;\n  text-indent: 38px;\n}\n.node_name2 {\n  background: url(" + escape(__webpack_require__(139)) + ") no-repeat;\n  background-position-y: 5px;\n  display: inline-block;\n  text-indent: 38px;\n}\n.node_name3 {\n  background: url(" + escape(__webpack_require__(137)) + ") no-repeat;\n  background-position-y: 5px;\n  display: inline-block;\n  text-indent: 38px;\n}\n.crumbsNav {\n  line-height: 35px;\n  height: 36px;\n  position: absolute;\n}\n.crumbsNav .crumbs .crumbGroup {\n  display: inline-block;\n}\n.crumbsNav .crumbs .crumbGroup a,\n.crumbsNav .crumbs .crumbGroup i {\n  color: #f1bf84;\n}\n.searchGroup {\n  position: relative;\n}\n.searchGroup i {\n  position: absolute;\n  top: 6px;\n  left: 8px;\n}\n.searchGroup input {\n  width: 198px;\n  height: 36px;\n  border: 1px solid #c4c8cc;\n  background-color: rgba(0, 0, 0, 0);\n  padding-left: 30px;\n  border-radius: 2px;\n}\n.mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px '\\5FAE\\8F6F\\96C5\\9ED1';\n  border: 1px solid #c4c8cc !important;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n  border-radius: 2px !important;\n  height: 36px;\n}\n.mediaBtn:hover {\n  border: 1px solid transparent !important;\n  background-color: #fff;\n  color: #f6911a;\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n", ""]);

// exports


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".defaultPlayList .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n.defaultPlayList .btn {\n  padding: 0;\n}\n.defaultPlayList .deviceCtrlGroup {\n  padding-bottom: 15px;\n}\n.defaultPlayList .deviceCtrlGroup .head {\n  font-size: 16px;\n  color: #889098;\n  line-height: 40px;\n  float: left;\n  margin: 0;\n  margin-right: 60px;\n}\n.defaultPlayList .deviceCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n.defaultPlayList .deviceCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.defaultPlayList .deviceCtrlGroup .uploadMedia {\n  color: #889098;\n  border-color: #f6911a;\n  width: 130px;\n  height: 38px;\n  margin-right: 30px;\n}\n.defaultPlayList .deviceCtrlGroup .mediaType {\n  color: #889098;\n  border-color: #f6911a;\n  width: 60px;\n  height: 38px;\n  margin-right: 10px;\n}\n.defaultPlayList .deviceCtrlGroup .select {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0) !important;\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.defaultPlayList .deviceListCtrl {\n  background-color: #fff;\n  position: relative;\n}\n.defaultPlayList .deviceListCtrl .detailTitle {\n  color: #889098;\n  font-size: 16px;\n  height: 40px;\n  line-height: 40px;\n  display: block;\n  float: left;\n}\n.defaultPlayList .deviceListCtrl .detailDate {\n  display: block;\n  text-align: center;\n  color: #889098;\n  font-size: 16px;\n  height: 40px;\n  line-height: 40px;\n}\n.defaultPlayList .deviceListCtrl .deviceTable {\n  padding: 10px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .loadingWrap {\n  position: absolute;\n  top: -4px;\n  left: 50%;\n  margin-left: -83px;\n  box-shadow: 0px 3px 10px 0px rgba(43, 67, 113, 0.35);\n}\n.defaultPlayList .deviceListCtrl .deviceTable .loadingWrap .loadingSquare {\n  padding: 10px 11px;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table {\n  font: 12px \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td:nth-child(1) {\n  width: 10%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td:nth-child(2) {\n  width: 15%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td:nth-child(3) {\n  width: 15%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td:nth-child(4) {\n  width: 15%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td:nth-child(5) {\n  width: 5%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table thead tr td:nth-child(6) {\n  width: 12%;\n  min-width: 200px;\n  position: relative;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr:hover {\n  background-color: #fff3e5;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr:hover .td1 {\n  color: #4095fe;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .edit {\n  display: none;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td {\n  text-align: center;\n  vertical-align: middle;\n  padding: 15px 15px;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td p {\n  overflow: hidden;\n  margin: 0;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td p span {\n  display: inline-block;\n  width: 88px;\n  margin: 0 auto;\n  line-height: 20px;\n  overflow: hidden;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(1) {\n  width: 10%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(2) {\n  width: 15%;\n  text-indent: 3%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(3) {\n  width: 15%;\n  text-indent: 3%;\n  padding: 10px 15px 15px 15px;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(3) p {\n  margin-top: 5px;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(4) {\n  width: 15%;\n  text-indent: 3%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(5) {\n  width: 5%;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) {\n  width: 12%;\n  min-width: 200px;\n  position: relative;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) .icon-off1,\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) .icon-on {\n  font-size: 30px;\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) .icon-off1 {\n  color: #889098;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .td1 {\n  cursor: pointer;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch {\n  position: relative;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch span {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch .turnOn {\n  top: 5px;\n  left: 5px;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n.defaultPlayList .deviceListCtrl .deviceTable .table tbody .editTr .edit {\n  display: block;\n}\n", ""]);

// exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#device .deviceCtrlGroup {\n  padding-bottom: 30px;\n}\n#device .deviceCtrlGroup .crumb a {\n  line-height: 36px;\n  color: #f1bf84;\n}\n#device .deviceCtrlGroup .crumb i {\n  color: #f1bf84;\n}\n#device .deviceCtrlGroup .crumb span {\n  line-height: 36px;\n  color: #28241f;\n  font-size: \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#device .deviceCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#device .deviceCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#device .deviceCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n#device .deviceCtrlGroup .selectGroup .title {\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  color: #889098;\n  line-height: 36px;\n}\n#device .deviceCtrlGroup .selectGroup select {\n  color: #889098;\n  height: 36px;\n  background-color: #eceeef;\n}\n#device .deviceCtrlGroup .selectGroup .selectSquare {\n  margin-right: 22px;\n}\n#device .deviceCtrlGroup .selectGroup .form-control:focus {\n  border: 1px solid #ccc;\n  box-shadow: none;\n}\n#device .deviceListCtrl {\n  background-color: #fff;\n  position: relative;\n}\n#device .deviceListCtrl .deviceTable {\n  padding: 10px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n#device .deviceListCtrl .deviceTable .loadingWrap {\n  position: absolute;\n  top: -4px;\n  left: 50%;\n  margin-left: -83px;\n  box-shadow: 0px 3px 10px 0px rgba(43, 67, 113, 0.35);\n}\n#device .deviceListCtrl .deviceTable .loadingWrap .loadingSquare {\n  padding: 10px 11px;\n}\n#device .deviceListCtrl .deviceTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#device .deviceListCtrl .deviceTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#device .deviceListCtrl .deviceTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(1) {\n  width: 5%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(2) {\n  width: 20%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(3) {\n  width: 15%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(4) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(5) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(6) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(7) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table thead tr td:nth-child(8) {\n  width: 20%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .edit {\n  display: none;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 20px 15px;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .newCheckbox {\n  width: 0.5% !important;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(1) {\n  width: 5%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(2) {\n  width: 20%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(3) {\n  width: 15%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(4) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(5) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(7) {\n  width: 10%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr td:nth-child(8) {\n  width: 20%;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .newInput {\n  width: 100% !important;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch {\n  position: relative;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch span {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n#device .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch .turnOn {\n  top: 5px;\n  left: 5px;\n}\n#device .deviceListCtrl .deviceTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n#device .deviceListCtrl .deviceTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#device .deviceListCtrl .deviceTable .table tbody .editTr .edit {\n  display: block;\n}\n.setTimeWrap .title {\n  font-size: 16px;\n  margin-bottom: 15px;\n}\n.setTimeWrap form .input-class select {\n  width: 90px;\n}\n.setTimeWrap .setTime .timeComponent {\n  margin-top: 20px;\n}\n.setTimeWrap .setTime .timeComponent .stComp {\n  width: 50%;\n  float: left;\n}\n.setTimeWrap .setTime .timeComponent .stComp p {\n  width: 75%;\n}\n.setTimeWrap .setTime .timeComponent .etComp {\n  width: 50%;\n  float: left;\n  text-align: right;\n}\n.setTimeWrap .setTime .timeComponent .etComp p {\n  width: 124%;\n}\n.setTimeWrap .setTime .timeComponent p {\n  margin-top: 15px;\n  text-align: center;\n  font-size: 16px;\n  color: #27231e;\n}\n.setTimeWrap .setDate .dateComponent {\n  margin-bottom: 20px;\n}\n.setTimeWrap .setDate .dateComponent label {\n  display: block;\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n.setTimeWrap .setDate .dateComponent .taskTime {\n  width: 40%;\n  display: inline-block;\n}\n.setTimeWrap .setDate .dateComponent .taskLine {\n  width: 20%;\n}\n.setTimeWrap .setDate .dateComponent .taskLine .arroLine {\n  height: 3px;\n  margin: 15px 10px;\n  background-color: #e6e9ec;\n}\n.setTimeWrap .setTitle {\n  padding: 5px 0;\n  border-bottom: 1px solid #e6e9ec;\n}\n.setTimeWrap .setTitle p {\n  margin: 0;\n}\n.setTimeWrap .modal-footer .btnSubmit {\n  font-size: 14px;\n  width: 130px;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  background-color: #f6911a;\n  color: #fff;\n  box-shadow: 0 0 5px #f6911a;\n  margin-right: 20px;\n}\n.setTimeWrap .modal-footer .btnCancel {\n  font-size: 14px;\n  width: 68px;\n  height: 40px;\n  line-height: 26px;\n  border: 1px solid #dee0e2;\n  background-color: #fff;\n  color: #889098;\n}\n.setTimeWrap .timeInputGroup {\n  display: inline-block;\n}\n.setTimeWrap .timeInputGroup span {\n  display: block;\n}\n.setTimeWrap .timeInputGroup input {\n  margin-right: 3px;\n  border: 1px solid #ccd0d3;\n  width: 30px;\n  height: 40px;\n  outline: none;\n  font-family: inherit;\n  font-size: 28px;\n  font-weight: inherit;\n  text-align: center;\n  line-height: 40px;\n  color: #d5dbe2;\n  background: rgba(255, 255, 255, 0);\n}\n.setTimeWrap .timeInputGroup input:focus {\n  border-color: #74b2fe;\n  color: #514d47;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n}\n#SSWrap .type1 {\n  width: 955px;\n  height: 425px;\n  border: 15px solid #fff;\n}\n#SSWrap .type1 .img1Box {\n  display: inline-block;\n  position: relative;\n}\n#SSWrap .type1 .img1Box .img1 {\n  width: 100%;\n  height: 395px;\n}\n#SSWrap .type1 .img2Box {\n  position: relative;\n  display: inline-block;\n}\n#SSWrap .type1 .img2Box .img2 {\n  width: 215px;\n  height: 395px;\n}\n#SSWrap .type1 .hoverDownload {\n  width: 100%;\n  height: 395px;\n  line-height: 395px;\n  transition: all 0.5s ease-in-out 0s;\n  background: rgba(0, 0, 0, 0);\n  text-align: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n#SSWrap .type1 .hoverDownload a {\n  color: rgba(0, 0, 0, 0);\n}\n#SSWrap .type1 .hoverDownload a i {\n  font-size: 32px;\n}\n#SSWrap .type1 .hoverDownload:hover {\n  background-color: rgba(37, 21, 2, 0.3);\n}\n#SSWrap .type1 .hoverDownload:hover a {\n  color: #fff;\n}\n#SSWrap .closePlay {\n  position: absolute;\n  top: -30px;\n  right: -30px;\n  height: 30px;\n  width: 30px;\n  background: #fff;\n  border-radius: 50%;\n  padding: 1px 8px;\n}\n#SSWrap .closePlay i {\n  line-height: 30px;\n  color: #9299a1;\n}\n#SSWrap .closePlay:hover {\n  background-color: #f6911a;\n}\n#SSWrap .closePlay:hover i {\n  color: #fff;\n}\n#SSWrap .SSinfo {\n  width: 800px;\n  background-color: rgba(37, 21, 2, 0.3);\n  position: absolute;\n  bottom: 10px;\n  color: #fff;\n}\n#SSWrap .SSinfo .left {\n  width: 50%;\n  padding-left: 25px;\n}\n#SSWrap .SSinfo .left .title {\n  padding: 10px 0;\n  font: 18px '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n#SSWrap .SSinfo .left .detail {\n  padding-bottom: 10px;\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n  color: rgba(255, 255, 255, 0.6);\n}\n#SSWrap .SSinfo .right {\n  width: 50%;\n  text-align: right;\n  padding: 24px 30px;\n}\n#SSWrap .SSinfo .right a {\n  color: #fff;\n}\n#SSWrap .SSinfo .right a i {\n  font-size: 27px;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".loginBg {\n  margin-top: -58px;\n  width: 100%;\n  height: auto;\n  background: url(" + escape(__webpack_require__(134)) + ") no-repeat center center;\n  background-size: cover;\n  position: relative;\n}\n.loginBg .w-xxl {\n  width: 342px;\n}\n.loginBg .findPass {\n  font-size: 12px;\n  color: #d8d6d4;\n  float: right;\n}\n.loginBg .findPass:hover {\n  color: #f6911a;\n}\n.loginBg .container {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin-left: -167px;\n  margin-top: -235px;\n  padding: 0 30px;\n  background: url(" + escape(__webpack_require__(135)) + ") no-repeat;\n  background-size: cover;\n}\n.loginBg .container .logo {\n  text-align: center;\n  padding-bottom: 30px;\n}\n.loginBg .container .logo .logoIcon {\n  margin: -40px auto 10px;\n  width: 70px;\n  height: 70px;\n  line-height: 85px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n.loginBg .container .logo .logoIcon i {\n  font-size: 36px;\n  color: #fff;\n}\n.loginBg .container .logo .logoTitle {\n  font: 24px '\\5FAE\\8F6F\\96C5\\9ED1';\n  color: #532f04;\n}\n.loginBg .container .logo .logoEnTitle {\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n  color: #f6911a;\n}\n.loginBg .container .inputText {\n  position: relative;\n}\n.loginBg .container .inputText .text-danger {\n  position: absolute;\n  top: 140px;\n  right: 0px;\n  color: #ece3ff;\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n  font-size: 14px;\n}\n.loginBg .container .inputText .list-group-item {\n  padding: 0;\n  background-color: #fff;\n  border: 0 none;\n}\n.loginBg .container .inputText .list-group-item input {\n  border: 0 none;\n  position: relative;\n  border-bottom: 1px solid #eceae8;\n  outline: none;\n  box-shadow: none;\n  margin-bottom: 20px;\n  border-radius: 0;\n}\n.loginBg .container .inputText .list-group-item input:focus {\n  border-color: #f6911a;\n}\n.loginBg .container .inputText .list-group-item input::-webkit-input-placeholder {\n  color: #cec8ce;\n  font: 14px '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.loginBg .container .inputText .contact {\n  float: right;\n  font: 14px '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.loginBg .container .inputText .contact a {\n  color: #a7cfd1;\n}\n.loginBg .container .inputText .contact a:hover {\n  color: #fff;\n}\n.loginBg .container .m-b-lg {\n  margin-bottom: 35px;\n}\n.loginBg .container .list-group {\n  margin-bottom: 10px;\n}\n.loginBg .container .rememberPassword {\n  font-size: 12px;\n  color: #d8d6d4;\n  font-weight: 400;\n}\n.loginBg .container .rememberPassword:hover {\n  color: #f6911a;\n}\n.loginBg .container .rememberPassword i {\n  width: 14px;\n  height: 14px;\n}\n.loginBg .container .i-checks input:checked + i {\n  border-color: #f6911a;\n}\n.loginBg .container .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 8px;\n  height: 8px;\n  background-color: #f6911a;\n}\n.loginBg .container .errorMsg {\n  height: 40px;\n  color: #eb607a;\n}\n.loginBg .container .btnSubmit {\n  width: 100%;\n  height: 45px;\n  background-color: #f6911a;\n  color: #fff;\n  text-align: center;\n  font-size: 16px;\n  margin: 0 0 30px 0;\n  border: 0 none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n.loginBg .container .btnSubmit:hover {\n  box-shadow: 0 5px 5px #fcdebb;\n}\n.modal-content {\n  overflow: hidden;\n}\n.modal-content .logoutWrap {\n  width: 400px;\n}\n.modal-content .logoutWrap .delMsg {\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.modal-content .logoutWrap .delMsg .title {\n  color: #6d7290;\n  padding: 30px 0px;\n  font: 700 18px '\\5FAE\\8F6F\\96C5\\9ED1';\n  text-align: center;\n}\n.modal-content .logoutWrap .delMsg .info {\n  text-align: center;\n  font-size: 14px;\n  padding: 0 0 30px 0;\n}\n.modal-content .logoutWrap .delMsg .info a {\n  color: #4e8bd6;\n}\n.modal-content .logoutWrap .delMsg .uploadFile {\n  text-align: center;\n  margin: -10px auto 20px;\n}\n.modal-content .logoutWrap .delMsg input {\n  margin: -10px auto 20px;\n  width: 88px;\n  height: 41px;\n  overflow: hidden;\n}\n.modal-content .logoutWrap .delMsg ::-ms-browse,\n.modal-content .logoutWrap .delMsg [type='file'] {\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n  padding: 10px 15px;\n  border: 1px solid #a0b3d6;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n  background: #4e8bd6;\n  color: #fff;\n  cursor: pointer;\n}\n.modal-content .logoutWrap .delMsg ::-webkit-file-upload-button {\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n  padding: 10px 15px;\n  border: 1px solid #a0b3d6;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n  background-color: #4e8bd6;\n  color: #fff;\n  cursor: pointer;\n}\n.modal-content .logoutWrap .delMsg ::-webkit-file-upload-button:hover {\n  background-color: #467dc0;\n}\n.modal-content .logoutWrap .delMsg p {\n  text-align: center;\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n  color: #9698a6;\n}\n.modal-content .logoutWrap .delDesc {\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n  width: 350px;\n  height: 65px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  border-color: #cfdadd;\n  resize: none;\n  margin: 0 25px 30px;\n  background-color: #f1f5f8;\n}\n.modal-content .delMember .w5c-error {\n  margin-left: 30px;\n  color: #f05858;\n}\n.modal-content .modal-footer {\n  padding: 0;\n  border: 0;\n  text-align: left;\n}\n.modal-content .modal-footer .btn {\n  margin: 0;\n  width: 200px;\n  height: 40px;\n  color: #fff;\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.modal-content .modal-footer .btn-info {\n  float: left;\n  border: 0;\n  background-color: #4bc5c3;\n}\n.modal-content .modal-footer .btn-info:hover {\n  background-color: #43b1af;\n}\n.modal-content .modal-footer .btn-dark {\n  line-height: 25px;\n  border: 0;\n  background-color: #8c98b2;\n}\n.modal-content .modal-footer .btn-dark:hover {\n  background-color: #7e89a0;\n}\n.findPassword {\n  width: 100%;\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n.findPassword .findTitle {\n  width: 100%;\n  height: 70px;\n}\n.findPassword .findTitle p {\n  color: #6d7290;\n  font-size: 18px;\n  font-weight: 600;\n  text-align: center;\n  line-height: 70px;\n  display: block;\n}\n.findPassword .pl-30 {\n  padding-left: 30px;\n}\n.findPassword .pb-20 {\n  margin-bottom: 15px;\n}\n.findPassword .findBodyTitle p {\n  color: #6d7290;\n  font-size: 14px;\n}\n.findPassword .findList label {\n  font-size: 13px;\n  color: #abafc5;\n  margin-right: 10px;\n}\n.findPassword .findList span {\n  color: #6d7290;\n  font-size: 14px;\n}\n.findPassword .modal-footer {\n  height: 40px;\n  width: 100%;\n  margin-top: 20px;\n}\n.findPassword .modal-footer a {\n  width: 50%;\n  background-color: #4e8bd6;\n  color: #fff;\n  line-height: 40px;\n  height: 40px;\n  float: left;\n  text-align: center;\n  font-size: 14px;\n}\n.findPassword .modal-footer .cancel {\n  background-color: #bfc0c1;\n}\n", ""]);

// exports


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#mediaList .tabs {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  border-radius: 2px;\n  position: relative;\n}\n#mediaList .tabs .countNum {\n  display: inline-block;\n  text-decoration: none;\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  top: -10px;\n  right: -10px;\n  background-color: #f6911a;\n  border-radius: 50%;\n  line-height: 20px;\n  text-align: center;\n  color: #fff;\n}\n#mediaList .tabs i {\n  padding: 5px;\n}\n#mediaList .tabs .tabBtn {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#mediaList .tabs .tabBtn:nth-of-type(1):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#mediaList .tabs .tabBtn:nth-of-type(2):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#mediaList .tabs .listMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n}\n#mediaList .tabs .leftListMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n}\n#mediaList #scroll {\n  overflow: hidden;\n  height: 300px;\n}\n#mediaList #uploadList {\n  overflow: hidden;\n  height: 300px;\n}\n#mediaList .mediaCtrlGroup {\n  padding-bottom: 10px;\n}\n#mediaList .mediaCtrlGroup .selectGroup .title {\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  color: #889098;\n  line-height: 36px;\n}\n#mediaList .mediaCtrlGroup .selectGroup select {\n  color: #889098;\n  height: 36px;\n  background-color: #eceeef;\n}\n#mediaList .mediaCtrlGroup .selectGroup .selectSquare {\n  margin-right: 22px;\n}\n#mediaList .mediaCtrlGroup .selectGroup .form-control:focus {\n  border: 1px solid #ccc;\n  box-shadow: none;\n}\n#mediaList .mediaCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#mediaList .mediaCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#mediaList .mediaCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n#mediaList .mediaCtrlGroup .dropdown-menu {\n  top: 64px;\n  left: -74px;\n  min-width: 130px;\n  border: 0 none !important;\n  border-radius: 0;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#mediaList .mediaCtrlGroup .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#mediaList .mediaCtrlGroup .dropdown-menu:before .btn-group {\n  perspective: 400px;\n}\n#mediaList .mediaCtrlGroup li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#mediaList .mediaCtrlGroup li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  padding: 8px 35px;\n  font-size: 13px;\n  color: #889098;\n}\n#mediaList .mediaCtrlGroup li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#mediaList .mediaListCtrl {\n  position: relative;\n}\n#mediaList .mediaListCtrl .mediaTable {\n  padding: 10px 30px;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#mediaList .mediaListCtrl .mediaTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  margin-bottom: 120px;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td:nth-child(1) {\n  width: 5%;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td:nth-child(2) {\n  width: 15%;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td:nth-child(3) {\n  width: 10%;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td:nth-child(4) {\n  width: 20%;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td:nth-child(5) {\n  width: 20%;\n}\n#mediaList .mediaListCtrl .mediaTable .table thead tr td:nth-child(6) {\n  width: 20%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .edit {\n  display: none;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 15px 15px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .newCheckbox {\n  width: 50px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(1) {\n  width: 5%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(2) {\n  width: 15%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(3) {\n  width: 10%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(4) {\n  width: 20%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(5) {\n  width: 20%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(6) {\n  width: 20%;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .newInput {\n  width: 100% !important;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .successButton {\n  color: #4095fe;\n  padding: 5px 10px;\n  border: 1px solid #fff;\n  border-radius: 2px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .successButton:hover {\n  border-color: #4095fe;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .failButton {\n  color: #eb607a;\n  padding: 5px 10px;\n  border: 1px solid #fff;\n  border-radius: 2px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .failButton:hover {\n  border-color: #eb607a;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .shuLine {\n  display: inline-block;\n  height: 16px;\n  width: 1px;\n  background-color: #cdcdcd;\n  vertical-align: top;\n  margin: 0 10px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .fontShow {\n  color: #889098;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-toggle {\n  box-shadow: none;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu {\n  top: 43px;\n  left: -50px;\n  min-width: 94px;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n  border: 0 none !important;\n  border-radius: 0;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu .btn-group {\n  perspective: 400px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  font-size: 13px;\n  color: #889098;\n  padding: 10px 26px;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody tr .operateBtn li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border-width: 1px;\n  border-color: #74b2fe;\n  border-style: solid;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 0px 8px 0px rgba(72, 88, 107, 0.2);\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#mediaList .mediaListCtrl .mediaTable .table tbody .editTr .edit {\n  display: block;\n}\n#mediaList .upload-btn {\n  position: absolute;\n  right: -7px;\n  bottom: 3px;\n  width: 38px;\n  height: 38px;\n  border-color: #f6911a;\n  padding: 0;\n  border-radius: 2px !important;\n  background-color: #f6911a !important;\n  box-shadow: 0px 9px 13px 0px rgba(246, 145, 26, 0.27);\n}\n#mediaList .upload-btn i {\n  font-size: 20px;\n  color: #fff;\n}\n#mediaList .settings {\n  width: 412px;\n  height: 407px;\n  right: -419px;\n  top: 160px;\n  padding-left: 30px;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#mediaList .settings .active {\n  right: 1px;\n}\n#mediaList .settings .btn {\n  left: -7px;\n  bottom: -7px;\n  width: 38px;\n  height: 38px;\n  box-shadow: 0px 0px 10px #f6911a;\n  background: #f6911a !important;\n  border-color: #f6911a;\n  padding: 0;\n}\n#mediaList .settings .btn i {\n  font-size: 20px;\n  color: #fff;\n}\n#mediaList .settings .panel-heading {\n  padding: 0;\n  height: 70px;\n  line-height: 70px;\n  text-align: center;\n  color: #889098;\n  background: #fff;\n  border-bottom: 1px solid #f2f4f5;\n  font-size: 14px;\n}\n#mediaList .settings .panel-body {\n  padding: 0;\n}\n#mediaList .settings .panel-body .item-list {\n  height: 50px;\n  position: relative;\n}\n#mediaList .settings .panel-body .item-list .progress {\n  height: 100%;\n  background: #fff;\n  border-radius: 0;\n}\n#mediaList .settings .panel-body .item-list .progress .progress-bar {\n  background: #fff3e4;\n}\n#mediaList .settings .panel-body .item-list .file-img {\n  position: absolute;\n  left: 10px;\n  top: 15px;\n  width: 20px;\n}\n#mediaList .settings .panel-body .item-list .file-name {\n  font-size: 12px;\n  width: 220px;\n  overflow: hidden;\n  color: #38394f;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  position: absolute;\n  left: 36px;\n  top: 15px;\n}\n#mediaList .settings .panel-body .item-list .file-progress {\n  font-size: 12px;\n  color: #4095fe;\n  position: absolute;\n  right: 75px;\n  top: 15px;\n}\n#mediaList .settings .panel-body .item-list .file-status {\n  position: absolute;\n  right: 42px;\n  top: 15px;\n}\n#mediaList .settings .panel-body .item-list .file-status i {\n  font-size: 13px;\n  color: #4095fe;\n}\n#mediaList .settings .panel-body .item-list .file-status .icon-cuowu {\n  color: #889098;\n}\n#mediaList .settings .panel-body .item-list .file-del {\n  right: 15px;\n}\n#mediaList .settings .panel-body .item-list .file-error {\n  color: #eb607a;\n}\n#mediaList .settings .panel-body .item-list .file-error i {\n  color: #eb607a;\n}\n#mediaList .settings .panel-error {\n  height: 40px;\n  border-bottom: 1px solid #fff;\n  background: #ffe8cb;\n  display: none;\n}\n#mediaList .settings .panel-error span {\n  font-size: 12px;\n  color: #38394f;\n  line-height: 40px;\n  display: block;\n  margin-left: 8px;\n  float: left;\n}\n#mediaList .settings .panel-error span em {\n  color: #eb607a;\n  font-style: normal;\n}\n#mediaList .settings .panel-error i {\n  color: #f6bd76;\n  float: left;\n  margin-left: 19px;\n  margin-top: 8px;\n}\n#mediaList .active {\n  right: 1px;\n}\n#mediaCheck .tabs {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  border-radius: 2px;\n  position: relative;\n}\n#mediaCheck .tabs .countNum {\n  display: inline-block;\n  text-decoration: none;\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  top: -10px;\n  right: -10px;\n  background-color: #f6911a;\n  border-radius: 50%;\n  line-height: 20px;\n  text-align: center;\n}\n#mediaCheck .tabs i {\n  padding: 5px;\n}\n#mediaCheck .tabs .tabBtn {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#mediaCheck .tabs .tabBtn:nth-of-type(1):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#mediaCheck .tabs .listMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n}\n#mediaCheck #scroll {\n  overflow: hidden;\n  height: 300px;\n}\n#mediaCheck #uploadList {\n  overflow: hidden;\n  height: 300px;\n}\n#mediaCheck .mediaCtrlGroup {\n  padding-bottom: 10px;\n}\n#mediaCheck .mediaCtrlGroup .selectGroup .title {\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  color: #889098;\n  line-height: 36px;\n}\n#mediaCheck .mediaCtrlGroup .selectGroup select {\n  color: #889098;\n  height: 36px;\n  background-color: #eceeef;\n}\n#mediaCheck .mediaCtrlGroup .selectGroup .selectSquare {\n  margin-right: 22px;\n}\n#mediaCheck .mediaCtrlGroup .selectGroup .form-control:focus {\n  border: 1px solid #ccc;\n  box-shadow: none;\n}\n#mediaCheck .mediaCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#mediaCheck .mediaCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#mediaCheck .mediaCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n#mediaCheck .mediaCtrlGroup .dropdown-menu {\n  top: 64px;\n  left: -74px;\n  min-width: 130px;\n  border: 0 none !important;\n  border-radius: 0;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#mediaCheck .mediaCtrlGroup .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#mediaCheck .mediaCtrlGroup .dropdown-menu:before .btn-group {\n  perspective: 400px;\n}\n#mediaCheck .mediaCtrlGroup li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#mediaCheck .mediaCtrlGroup li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  padding: 8px 35px;\n  font-size: 13px;\n  color: #889098;\n}\n#mediaCheck .mediaCtrlGroup li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#mediaCheck .mediaListCtrl {\n  position: relative;\n}\n#mediaCheck .mediaListCtrl .mediaTable {\n  padding: 10px 30px;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#mediaCheck .mediaListCtrl .mediaTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  margin-bottom: 120px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td:nth-child(1) {\n  width: 10%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td:nth-child(2) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td:nth-child(3) {\n  width: 10%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td:nth-child(4) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td:nth-child(5) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table thead tr td:nth-child(6) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr:hover {\n  background-color: #fff3e5;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr:hover .td1 {\n  color: #4095fe;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .edit {\n  display: none;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 15px 15px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .newCheckbox {\n  width: 0.5% !important;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td:nth-child(1) {\n  width: 17%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td:nth-child(2) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td:nth-child(3) {\n  width: 10%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td:nth-child(4) {\n  width: 22%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td:nth-child(5) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr td:nth-child(6) {\n  width: 15%;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .newInput {\n  width: 100% !important;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .successButton {\n  color: #4095fe;\n  padding: 5px 10px;\n  border: 1px solid #fff;\n  border-radius: 2px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .successButton:hover {\n  border-color: #4095fe;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .failButton {\n  color: #eb607a;\n  padding: 5px 10px;\n  border: 1px solid #fff;\n  border-radius: 2px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .failButton:hover {\n  border-color: #eb607a;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .shuLine {\n  display: inline-block;\n  height: 16px;\n  width: 1px;\n  background-color: #cdcdcd;\n  vertical-align: top;\n  margin: 0 10px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .fontShow {\n  color: #889098;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-toggle {\n  box-shadow: none;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu {\n  top: 43px;\n  left: -50px;\n  min-width: 94px;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n  border: 0 none !important;\n  border-radius: 0;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu .btn-group {\n  perspective: 400px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  font-size: 13px;\n  color: #889098;\n  padding: 10px 26px;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody tr .operateBtn li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border-width: 1px;\n  border-color: #74b2fe;\n  border-style: solid;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 0px 8px 0px rgba(72, 88, 107, 0.2);\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#mediaCheck .mediaListCtrl .mediaTable .table tbody .editTr .edit {\n  display: block;\n}\n#mediaCheck .upload-btn {\n  position: absolute;\n  right: -7px;\n  bottom: 3px;\n  width: 38px;\n  height: 38px;\n  border-color: #f6911a;\n  padding: 0;\n  border-radius: 2px !important;\n  background-color: #f6911a !important;\n  box-shadow: 0px 9px 13px 0px rgba(246, 145, 26, 0.27);\n}\n#mediaCheck .upload-btn i {\n  font-size: 20px;\n  color: #fff;\n}\n#mediaCheck .settings {\n  width: 412px;\n  height: 407px;\n  right: -419px;\n  top: 160px;\n  padding-left: 30px;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#mediaCheck .settings .active {\n  right: 1px;\n}\n#mediaCheck .settings .btn {\n  left: -7px;\n  bottom: -7px;\n  width: 38px;\n  height: 38px;\n  box-shadow: 0px 0px 10px #f6911a;\n  background: #f6911a !important;\n  border-color: #f6911a;\n  padding: 0;\n}\n#mediaCheck .settings .btn i {\n  font-size: 20px;\n  color: #fff;\n}\n#mediaCheck .settings .panel-heading {\n  padding: 0;\n  height: 70px;\n  line-height: 70px;\n  text-align: center;\n  color: #889098;\n  background: #fff;\n  border-bottom: 1px solid #f2f4f5;\n  font-size: 14px;\n}\n#mediaCheck .settings .panel-body {\n  padding: 0;\n}\n#mediaCheck .settings .panel-body .item-list {\n  height: 50px;\n  position: relative;\n}\n#mediaCheck .settings .panel-body .item-list .progress {\n  height: 100%;\n  background: #fff;\n  border-radius: 0;\n}\n#mediaCheck .settings .panel-body .item-list .progress .progress-bar {\n  background: #fff3e4;\n}\n#mediaCheck .settings .panel-body .item-list .file-img {\n  position: absolute;\n  left: 10px;\n  top: 15px;\n  width: 20px;\n}\n#mediaCheck .settings .panel-body .item-list .file-name {\n  font-size: 12px;\n  width: 220px;\n  overflow: hidden;\n  color: #38394f;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  position: absolute;\n  left: 36px;\n  top: 15px;\n}\n#mediaCheck .settings .panel-body .item-list .file-progress {\n  font-size: 12px;\n  color: #4095fe;\n  position: absolute;\n  right: 75px;\n  top: 15px;\n}\n#mediaCheck .settings .panel-body .item-list .file-status {\n  position: absolute;\n  right: 42px;\n  top: 15px;\n}\n#mediaCheck .settings .panel-body .item-list .file-status i {\n  font-size: 13px;\n  color: #4095fe;\n}\n#mediaCheck .settings .panel-body .item-list .file-status .icon-cuowu {\n  color: #889098;\n}\n#mediaCheck .settings .panel-body .item-list .file-del {\n  right: 15px;\n}\n#mediaCheck .settings .panel-body .item-list .file-error {\n  color: #eb607a;\n}\n#mediaCheck .settings .panel-body .item-list .file-error i {\n  color: #eb607a;\n}\n#mediaCheck .settings .panel-error {\n  height: 40px;\n  border-bottom: 1px solid #fff;\n  background: #ffe8cb;\n  display: none;\n}\n#mediaCheck .settings .panel-error span {\n  font-size: 12px;\n  color: #38394f;\n  line-height: 40px;\n  display: block;\n  margin-left: 8px;\n  float: left;\n}\n#mediaCheck .settings .panel-error span em {\n  color: #eb607a;\n  font-style: normal;\n}\n#mediaCheck .settings .panel-error i {\n  color: #f6bd76;\n  float: left;\n  margin-left: 19px;\n  margin-top: 8px;\n}\n#mediaCheck .active {\n  right: 1px;\n}\n#mediaCheck #videoMask {\n  display: none;\n}\n#mediaCheck #video {\n  display: none;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  padding-bottom: 10px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  z-index: 1090;\n}\n#mediaCheck #video .videoPic {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  left: 0;\n  background: #000;\n}\n#mediaCheck #video .videoPic img {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n#mediaCheck #video .video-body {\n  width: 920px;\n  height: 600px;\n  padding: 10px;\n  background: #fff;\n  margin: 0 auto;\n  margin-top: 80px;\n  box-shadow: 0 0 10px #210c0e;\n  border-radius: 4px;\n  position: relative;\n}\n#mediaCheck #video .video-body .closePlay {\n  position: absolute;\n  top: -30px;\n  right: -30px;\n  height: 30px;\n  width: 30px;\n  background: #fff;\n  border-radius: 50%;\n  padding: 1px 8px;\n}\n#mediaCheck #video .video-body .closePlay i {\n  line-height: 30px;\n  color: #9299a1;\n}\n#mediaCheck #video .video-body .closePlay:hover {\n  background: #f6911a;\n}\n#mediaCheck #video .video-body .closePlay:hover i {\n  color: #fff;\n}\n#mediaCheck #video .video-js .vjs-big-play-button {\n  color: #332e29;\n  background: #fff;\n  border-radius: 50%;\n  border: 0;\n  line-height: 2em;\n  height: 2em;\n  width: 2em;\n}\n#mediaCheck #video .videoList {\n  width: 100%;\n  margin-top: 35px;\n  position: relative;\n}\n#mediaCheck #video .videoList .videoListInfo {\n  width: 92%;\n  position: absolute;\n  overflow: hidden;\n  left: 50%;\n  transform: translate(-50%, 0);\n}\n#mediaCheck #video .videoList .videoListInfo .tempWrap {\n  margin: 0 auto;\n}\n#mediaCheck #video .videoList .btnLeft {\n  float: left;\n  margin-top: 20px;\n  width: 3%;\n  height: 160px;\n  background: #fff;\n  color: #f6911a;\n  text-align: center;\n  line-height: 160px;\n  border-radius: 3px;\n}\n#mediaCheck #video .videoList .btnLeft i {\n  font-size: 30px;\n}\n#mediaCheck #video .videoList .btnRight {\n  float: right;\n  position: relative;\n}\n#mediaCheck #video .picScroll-left .prevStop i {\n  color: #c0c0c0;\n}\n#mediaCheck #video .picScroll-left .nextStop i {\n  color: #c0c0c0;\n}\n#mediaCheck #video .picScroll-left .bd ul {\n  overflow: hidden;\n  zoom: 1;\n}\n#mediaCheck #video .picScroll-left .bd ul li {\n  margin-left: 20px;\n  margin-right: 20px;\n  float: left;\n  _display: inline;\n  overflow: hidden;\n  text-align: center;\n  position: relative;\n}\n#mediaCheck #video .picScroll-left .bd ul li .playBtn {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: #332e29;\n  border-radius: 50%;\n  height: 20px;\n  width: 20px;\n}\n#mediaCheck #video .picScroll-left .bd ul li .playBtn i {\n  color: #fff;\n  font-size: 26px;\n  line-height: 24px;\n  margin-left: -2px;\n}\n#mediaCheck #video .picScroll-left .bd ul li .pic {\n  text-align: center;\n  background: #000;\n}\n#mediaCheck #video .picScroll-left .bd ul li .pic img {\n  width: 250px;\n  height: 160px;\n  display: block;\n  border-radius: 3px;\n}\n#mediaCheck #video .vjs-paused .vjs-big-play-button {\n  display: block;\n}\n", ""]);

// exports


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".new_add_modal {\n  padding-top: 20px;\n}\n.add_modal {\n  padding: 40px;\n  background-color: #fff;\n}\n.add_modal .content_header .headerTitle {\n  font-size: 16px;\n}\n.add_modal .content_header .headerInfo {\n  font-size: 12px;\n  color: #a7afb7;\n}\n.add_modal #addScreen .input-class {\n  margin-top: 25px;\n}\n.add_modal .input-class {\n  height: 36px;\n  line-height: 30px;\n  margin-top: 15px;\n  margin-bottom: 5px;\n  position: relative;\n}\n.add_modal .input-class .detailInfo {\n  display: inline-block;\n  width: 270px;\n  font-size: 12px;\n  color: #28241f;\n  border-bottom: 1px solid #e6e9ec;\n}\n.add_modal .input-class select {\n  width: 270px;\n  display: inline-block;\n}\n.add_modal .input-class label {\n  width: 65px;\n  color: #889098;\n  font-size: 12px;\n  font-weight: normal;\n}\n.add_modal .input-class .inputText {\n  width: 270px;\n  border: none;\n  font-size: 12px;\n  color: #28241f;\n  border-bottom: 1px solid #e6e9ec;\n}\n.add_modal .input-class .radio {\n  width: 270px;\n  display: inline-block;\n}\n.add_modal .input-class .i-checks {\n  width: 43px;\n  margin-right: 20px;\n}\n.add_modal .input-class .i-checks i {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  margin-right: 0;\n}\n.add_modal .input-class .i-checks input:checked + i {\n  border-color: #f6911a;\n  background-color: #fff;\n}\n.add_modal .input-class .i-checks input:checked + i:before {\n  width: 6px;\n  height: 6px;\n  top: 2px;\n  left: 2px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n.add_modal .input-class .multiple_check {\n  width: 80px;\n}\n.add_modal .input-class .multiple_check i {\n  border-radius: 2px;\n}\n.add_modal .input-class .setDate {\n  width: 270px;\n  float: right;\n}\n.add_modal .input-class .setDate .taskTime {\n  width: 120px;\n  display: inline-block;\n}\n.add_modal .input-class .setDate .taskTime .input-group-addon {\n  padding: 5px;\n}\n.add_modal .input-class .setDate .taskTime .dateCtrl {\n  box-shadow: none;\n  border-right: 0 none;\n  padding: 5px 10px;\n}\n.add_modal .input-class .setDate .taskLine {\n  width: 11%;\n}\n.add_modal .input-class .setDate .taskLine .arroLine {\n  height: 3px;\n  margin: 15px 10px;\n  background-color: #e6e9ec;\n}\n.add_modal .input-class .error {\n  border-bottom: 1px solid #eb5e7b;\n  background: url(" + escape(__webpack_require__(7)) + ") no-repeat;\n  background-position: right;\n}\n.add_modal .input-class .w5c-error {\n  z-index: 9999;\n  position: absolute;\n  right: 0px;\n  top: 38px;\n  height: 30px;\n  padding: 0 10px;\n  line-height: 30px;\n  color: #fff;\n  background-color: #eb5e7b;\n  border-radius: 4px;\n}\n.add_modal .button-bottom {\n  overflow: hidden;\n  padding-bottom: 5px;\n}\n.add_modal .button-bottom .addMember {\n  float: right;\n  padding: 10px 20px;\n  color: #fff;\n  margin-top: 30px;\n  margin-right: 20px;\n  border: none;\n  border-radius: 2px;\n  background-color: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n}\n.add_modal .button-bottom .cancel {\n  float: right;\n  padding: 10px 20px;\n  margin-top: 30px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  right: 40px;\n  background-color: #fff;\n  color: #889098;\n}\n.add_modal .button-bottom .cancel:hover {\n  background: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n  color: #fff;\n  border: 1px solid #f6911a;\n}\n#selectCitySiteModel {\n  width: 418px;\n  height: auto;\n  background-color: #fff;\n  margin: 30px 50px;\n}\n#selectCitySiteModel .title {\n  font-size: 16px;\n}\n#selectCitySiteModel .button-bottom {\n  overflow: hidden;\n  padding-bottom: 5px;\n}\n#selectCitySiteModel .button-bottom .tipShow {\n  font-size: 12px;\n  color: #889098;\n  margin-top: 40px;\n}\n#selectCitySiteModel .button-bottom .tipShow .num {\n  color: #f6911a;\n  font-size: 14px;\n}\n#selectCitySiteModel .button-bottom .addMember {\n  float: right;\n  padding: 10px 20px;\n  color: #fff;\n  margin-top: 30px;\n  margin-right: 20px;\n  border: none;\n  border-radius: 2px;\n  background-color: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n}\n#selectCitySiteModel .button-bottom .cancel {\n  float: right;\n  padding: 10px 20px;\n  margin-top: 30px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  right: 40px;\n  background-color: #fff;\n  color: #889098;\n}\n#selectCitySiteModel .button-bottom .cancel:hover {\n  background: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n  color: #fff;\n  border: 1px solid #f6911a;\n}\n#selectCitySiteModel .addPermissionPanel {\n  border: 0;\n  margin-top: 10px;\n}\n#selectCitySiteModel .addPermissionPanel .col-lg-12 {\n  padding: 0;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body {\n  padding: 0;\n  border: 0;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .permissionClass {\n  position: relative;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body ul {\n  width: 36%;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body ul li {\n  background-color: #e0e4ef;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body ul li a {\n  border: 0;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body ul .active {\n  background-color: #fff;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container {\n  border: 0;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .active a:hover,\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .active a:focus {\n  border: 0;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .checkGroupChild {\n  margin-left: 46px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .checkGroupChild .group {\n  float: left;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .checkGroupChild .group .i-checks > span {\n  margin-left: 0px;\n  font-weight: 500;\n  color: #28241f;\n  font-size: 12px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab {\n  padding-left: 10px;\n  margin-bottom: -10px;\n  margin-top: 25px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks > span {\n  margin-left: 0px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .warp {\n  padding: 0px;\n  overflow: hidden;\n  background: #fff;\n  border-bottom: 1px solid #ccc;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .warp .titleStyle {\n  margin-top: 30px;\n  margin-left: 30px;\n  font: 700 14px '\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD';\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .warp .checkGroup {\n  padding: 10px 10px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks > i {\n  width: 12px;\n  height: 12px;\n  border-radius: 2px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks input:checked + i {\n  border-color: #f6911a;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .permissionTab .iconfont {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  background: #ffe8cb;\n  text-align: center;\n  line-height: 25px;\n  border-radius: 3px;\n  color: #f6911a;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .personTab .title {\n  margin: 0px -5px 5px;\n  padding: 0;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .personTab .checkGroup {\n  padding: 10px 15px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .modal-footer {\n  top: -83px;\n  right: 18px;\n  border: 0;\n  position: absolute;\n  width: 400px;\n  height: 45px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn {\n  position: absolute;\n  width: 400px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn .btn {\n  float: right;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn button {\n  width: 140px;\n  height: 38px;\n  background-color: #fff;\n  color: #f6911a;\n  font-size: 14px;\n  box-shadow: 0 0 15px #ddd;\n  border: 0;\n  padding: 0;\n  -webkit-border-radius: 5px 5px;\n  -moz-border-radius: 5px 5px;\n  border-radius: 5px 5px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn .btnCancel {\n  color: #889098;\n  float: right;\n  margin-right: 20px;\n  line-height: 38px;\n  text-align: center;\n  border: 1px solid #c4c8cc;\n  background: #eceeef;\n  display: inline-block;\n  width: 100px;\n  height: 38px;\n  border-radius: 0px;\n}\n#selectCitySiteModel .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn .btnCancel:hover {\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  background-color: #fff;\n}\n.editPT .map {\n  height: 175px;\n  width: 100%;\n}\n.editPT .location {\n  height: 40px;\n  text-align: center;\n  background-color: #f69421;\n}\n.editPT .location p {\n  line-height: 40px;\n  margin: 0;\n  color: #fff;\n}\n.editPT .location p i {\n  color: #fff;\n}\n.editPT .ptContent {\n  padding: 30px 40px !important;\n}\n.editPT .setTime {\n  vertical-align: middle;\n  border-bottom: 0 none !important;\n}\n.editPT .setTime .timeComponent {\n  margin: 0 ;\n}\n.editPT .setTime .timeComponent input {\n  width: 20px;\n  height: 30px;\n  vertical-align: middle;\n  color: #28241f;\n}\n.editPT .setTime .timeComponent .stComp {\n  width: 45%;\n}\n.editPT .setTime .timeComponent .etComp {\n  width: 45%;\n}\n.editPT .setTime .timeComponent .timeLine {\n  height: 2px;\n  width: 10%;\n  background-color: #a7afb7;\n  margin-top: 16px;\n}\n.editPT .input-class .detailInfo {\n  border-bottom: 0 none;\n}\n.editPT .input-class .detailInfo .flow {\n  width: 225px;\n  border: 0 none;\n  border-bottom: 1px solid #e6e9ec;\n}\n.editPT .modal-footer {\n  margin-top: 30px;\n}\n#conflictModal {\n  overflow: hidden;\n  padding: 20px 30px;\n}\n#conflictModal .head {\n  width: 100%;\n  overflow: hidden;\n}\n#conflictModal .head p {\n  float: left;\n  color: #28241f;\n  font-size: 12px;\n}\n#conflictModal .head p i {\n  color: #f6911a;\n}\n#conflictModal .head .iconfont {\n  float: right;\n  font-size: 14px;\n  color: #889098;\n  cursor: pointer;\n}\n#conflictModal .contain {\n  height: 246px;\n  width: 100%;\n}\n#conflictModal .contain .table {\n  text-align: center;\n}\n#conflictModal .foot {\n  margin-top: 70px;\n  overflow: hidden;\n  width: 100%;\n  margin-bottom: 40px;\n}\n#conflictModal .foot .cancel {\n  width: 70px;\n  height: 40px;\n  border: 1px solid #cfd3d6;\n  float: left;\n  background: #fff;\n  color: #889098;\n  text-align: center;\n  line-height: 40px;\n  font-size: 14px;\n  border-radius: 2px;\n  margin-left: 345px;\n}\n#conflictModal .foot .cancel:hover {\n  border: 1px solid #f6911a;\n  background: #f6911a;\n  color: #fff;\n}\n#conflictModal .foot .submit {\n  width: 90px;\n  margin-left: 20px;\n}\n#conflictModal .foot p {\n  float: left;\n  margin-left: 20px;\n  color: #afb3b7;\n  font-size: 12px;\n  line-height: 40px;\n}\n#conflictModal .table > thead > tr > th,\n#conflictModal .table > tbody > tr > th,\n#conflictModal .table > tfoot > tr > th,\n#conflictModal .table > thead > tr > td,\n#conflictModal .table > tbody > tr > td,\n#conflictModal .table > tfoot > tr > td {\n  padding: 10px;\n  text-align: center;\n}\n#defulatPlayListModal .btn:active,\n#defulatPlayListModal .btn.active {\n  box-shadow: none;\n}\n#defulatPlayListModal .item {\n  width: 100%;\n  margin-bottom: 30px;\n}\n#defulatPlayListModal .item label {\n  width: 80px;\n  color: #889098;\n  font-size: 12px;\n  font-weight: normal;\n}\n#defulatPlayListModal .item input {\n  width: 270px;\n  border: 0;\n  border-bottom: 1px solid #e6e9ec;\n}\n#defulatPlayListModal .item .error {\n  border-bottom: 1px solid #eb5e7b;\n}\n#defulatPlayListModal .returnButton {\n  color: #f6911a;\n  display: inline-block;\n  padding-top: 12px;\n}\n#defulatPlayListModal .btn-group {\n  margin-left: 20px;\n}\n#defulatPlayListModal .uploadMedia:hover {\n  color: #f6911a;\n}\n#defulatPlayListModal .hover:hover {\n  color: #f6911a;\n}\n#defulatPlayListModal .mainBox {\n  background-color: #fff;\n  position: relative;\n}\n#defulatPlayListModal .mainBox .head {\n  width: 100%;\n  color: #28241f;\n  font-size: 16px;\n  text-align: center;\n  margin-bottom: 20px;\n}\n#defulatPlayListModal .mainBox .cancel {\n  position: absolute;\n  right: 20px;\n  top: 20px;\n  font-size: 18px;\n  color: #939aa2;\n}\n#defulatPlayListModal .mainBox .contant {\n  overflow: hidden;\n  background: #fff;\n  width: 100%;\n}\n#defulatPlayListModal .mainBox .contant .contain {\n  width: 736px;\n  overflow: hidden;\n}\n#defulatPlayListModal .mainBox .contant .contain .mainScreen {\n  float: left;\n  margin-bottom: 5px;\n}\n#defulatPlayListModal .mainBox .contant .contain .otherScreen {\n  float: right;\n  margin-right: 20px;\n}\n#defulatPlayListModal .mainBox .contant .contain .radio {\n  float: right;\n  margin: 0;\n  margin-right: -28px;\n}\n#defulatPlayListModal .mainBox .contant .contain .radio .i-checks {\n  margin-right: 30px;\n}\n#defulatPlayListModal .mainBox .contant .contain .radio .i-checks > i {\n  position: relative;\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  margin-top: -2px;\n  margin-right: 4px;\n}\n#defulatPlayListModal .mainBox .contant .contain .radio .i-checks input:checked + i {\n  border-color: #f6911a;\n}\n#defulatPlayListModal .mainBox .contant .contain .radio .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  background-color: #f6911a;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv {\n  width: 100%;\n  height: 370px;\n  clear: both;\n  margin-top: 20px;\n  margin-bottom: 15px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen {\n  position: relative;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen .tip {\n  width: 55px;\n  height: 30px;\n  background: #eceeef;\n  text-align: center;\n  line-height: 30px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen img {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background-color: #fff;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen .mask {\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  background: #000;\n  opacity: 0.1;\n  top: 0;\n  right: 0;\n  z-index: 100;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen .edit {\n  position: absolute;\n  width: 24px;\n  height: 30px;\n  top: 0;\n  right: 0;\n  z-index: 200;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen .edit i {\n  color: #fff;\n  line-height: 30px;\n  font-size: 18px;\n  display: block;\n  float: left;\n  width: 50%;\n  text-align: center;\n  cursor: pointer;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 {\n  width: 550px;\n  height: 310px;\n  border: 1px dashed #cfd3d6;\n  float: left;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .tip {\n  width: 110px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .addBtn {\n  width: 125px;\n  height: 35px;\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  font-size: 14px;\n  text-align: center;\n  line-height: 35px;\n  margin: 0 auto;\n  margin-top: 96px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-bottom: 40px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .explain {\n  font-size: 12px;\n  color: #889098;\n  margin-left: 134px;\n  margin-bottom: 20px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .mask {\n  width: 30px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .edit {\n  width: 30px;\n  z-index: 600;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .edit i {\n  width: 100%;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .game {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 50;\n  background: #fff;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .game span {\n  margin-top: 125px;\n  margin-left: 300px;\n  width: 100px;\n  height: 100px;\n  float: left;\n  background: url(" + escape(__webpack_require__(5)) + ");\n  margin-bottom: 10px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1 .game p {\n  clear: both;\n  color: #28241f;\n  margin-top: 20px;\n  background: #fff;\n  position: absolute;\n  bottom: -10px;\n  display: block;\n  text-align: center;\n  width: 100%;\n  height: 40px;\n  line-height: 40px;\n  opacity: 0.5;\n  font-size: 16px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1_1 {\n  width: 455px;\n  height: 255px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1_1 .prompt {\n  width: 100%;\n  height: 100%;\n  background: #fff;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 700;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen1_1 .prompt p {\n  text-align: center;\n  color: #f6911a;\n  font-size: 14px;\n  margin-top: 90px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen5 {\n  width: 180px;\n  height: 310px;\n  border: 1px dashed #cfd3d6;\n  float: left;\n  margin-left: 4px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen5 .addBtn {\n  width: 125px;\n  height: 35px;\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  font-size: 14px;\n  text-align: center;\n  line-height: 35px;\n  margin: 0 auto;\n  margin-top: 96px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-bottom: 40px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen5 .explain {\n  font-size: 12px;\n  color: #889098;\n  margin-left: 40px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screen5_1 {\n  height: 255px;\n  margin-right: 4px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .newScreen1 {\n  width: 142px;\n  height: 256px;\n  float: left;\n  margin-left: 5px;\n  margin-right: 5px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .newScreen1 .addBtn {\n  margin-top: 80px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .newScreen1 .explain {\n  margin-left: 0px;\n  text-align: center;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screenMin {\n  width: 180px;\n  height: 310px;\n  float: left;\n  margin-left: 4px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screenMin .screen {\n  width: 180px;\n  height: 100px;\n  margin-bottom: 5px;\n  border: 1px dashed #cfd3d6;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screenMin .screen .addBtn {\n  width: 125px;\n  height: 35px;\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  font-size: 14px;\n  text-align: center;\n  line-height: 35px;\n  margin: 0 auto;\n  margin-top: 10px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-bottom: 15px;\n}\n#defulatPlayListModal .mainBox .contant .contain .screenDiv .screenMin .screen .explain {\n  font-size: 12px;\n  color: #889098;\n  margin-left: 50px;\n}\n#defulatPlayListModal .mainBox .contant .allDel {\n  font-size: 12px;\n  color: #f6911a;\n  float: right;\n  margin-bottom: 20px;\n  margin-top: 20px;\n}\n#defulatPlayListModal #order-video,\n#defulatPlayListModal #order-video1,\n#defulatPlayListModal #order-video2 {\n  display: none;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  opacity: 1 !important;\n  z-index: 90;\n}\n#defulatPlayListModal #order-video .video-body,\n#defulatPlayListModal #order-video1 .video-body,\n#defulatPlayListModal #order-video2 .video-body {\n  width: 700px;\n  height: 390px;\n  position: relative;\n}\n#defulatPlayListModal #order-video .video-body .closePlay,\n#defulatPlayListModal #order-video1 .video-body .closePlay,\n#defulatPlayListModal #order-video2 .video-body .closePlay {\n  position: absolute;\n  top: -30px;\n  right: -30px;\n  height: 30px;\n  width: 30px;\n  background: #fff;\n  border-radius: 50%;\n  padding: 1px 8px;\n}\n#defulatPlayListModal #order-video .video-body .closePlay i,\n#defulatPlayListModal #order-video1 .video-body .closePlay i,\n#defulatPlayListModal #order-video2 .video-body .closePlay i {\n  line-height: 30px;\n  color: #9299a1;\n}\n#defulatPlayListModal #order-video .video-body .closePlay:hover,\n#defulatPlayListModal #order-video1 .video-body .closePlay:hover,\n#defulatPlayListModal #order-video2 .video-body .closePlay:hover {\n  background: #f6911a;\n}\n#defulatPlayListModal #order-video .video-body .closePlay:hover i,\n#defulatPlayListModal #order-video1 .video-body .closePlay:hover i,\n#defulatPlayListModal #order-video2 .video-body .closePlay:hover i {\n  color: #fff;\n}\n#defulatPlayListModal #order-video .video-js .vjs-big-play-button,\n#defulatPlayListModal #order-video1 .video-js .vjs-big-play-button,\n#defulatPlayListModal #order-video2 .video-js .vjs-big-play-button {\n  color: #332e29;\n  background: #fff;\n  border-radius: 50%;\n  border: 0;\n  line-height: 2em;\n  height: 2em;\n  width: 2em;\n}\n#defulatPlayListModal #order-video .vjs-paused .vjs-big-play-button,\n#defulatPlayListModal #order-video1 .vjs-paused .vjs-big-play-button,\n#defulatPlayListModal #order-video2 .vjs-paused .vjs-big-play-button {\n  display: block;\n}\n#defulatPlayListModal .mediaBtn {\n  width: 130px;\n  height: 40px;\n  margin-bottom: 10px;\n}\n#defulatPlayListModal .input-class {\n  width: 80px;\n  float: left;\n}\n#defulatPlayListModal .input-class label {\n  color: #889098;\n  font-size: 12px;\n  font-weight: normal;\n}\n#defulatPlayListModal .w5c-error {\n  z-index: 9999;\n  position: absolute;\n  right: 0px;\n  top: 24px;\n  left: 180px;\n  width: 174px;\n  height: 30px;\n  padding: 0 10px;\n  line-height: 30px;\n  color: #fff;\n  background-color: #eb5e7b;\n  border-radius: 4px;\n}\n#defulatPlayListModal .add_modal_1 {\n  padding: 40px 20px;\n  background-color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".order .tabs {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  border-radius: 2px;\n  position: relative;\n}\n.order .tabs .returnButton {\n  color: #f6911a;\n  display: inline-block;\n  padding-top: 12px;\n}\n.order .tabs .countNum {\n  display: inline-block;\n  text-decoration: none;\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  top: -10px;\n  right: -10px;\n  background-color: #f6911a;\n  border-radius: 50%;\n  line-height: 20px;\n  text-align: center;\n  color: #fff;\n}\n.order .tabs i {\n  padding: 5px;\n}\n.order .tabs .tabBtn {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n.order .tabs .tabBtn:nth-of-type(1):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n.order .tabs .tabBtn:nth-of-type(2):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n.order .tabs .listMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n}\n.order .tabs .leftListMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n}\n.order .deviceCtrlGroup {\n  padding-bottom: 30px;\n}\n.order .deviceCtrlGroup .crumb a {\n  line-height: 36px;\n  color: #f1bf84;\n}\n.order .deviceCtrlGroup .crumb i {\n  color: #f1bf84;\n}\n.order .deviceCtrlGroup .crumb span {\n  line-height: 36px;\n  color: #28241f;\n  font-size: \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n.order .deviceCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n.order .deviceCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.order .deviceCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n  margin-left: 22px !important;\n}\n.order .deviceCtrlGroup .selectGroup .title {\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  color: #889098;\n  line-height: 36px;\n}\n.order .deviceCtrlGroup .selectGroup select {\n  color: #889098;\n  height: 36px;\n  background-color: #eceeef;\n}\n.order .deviceCtrlGroup .selectGroup .selectSquare {\n  margin-right: 22px;\n}\n.order .deviceCtrlGroup .selectGroup .form-control:focus {\n  border: 1px solid #ccc;\n  box-shadow: none;\n}\n.order .deviceListCtrl {\n  background-color: #fff;\n  position: relative;\n}\n.order .deviceListCtrl .detailTitle {\n  color: #889098;\n  font-size: 16px;\n  height: 40px;\n  line-height: 40px;\n  display: block;\n  float: left;\n}\n.order .deviceListCtrl .cancel {\n  float: right;\n  padding: 10px 20px;\n  margin-top: 30px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  right: 40px;\n  background-color: #fff;\n  color: #889098;\n  margin-bottom: 20px;\n}\n.order .deviceListCtrl .cancel:hover {\n  background: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n  color: #fff;\n  border: 1px solid #f6911a;\n}\n.order .deviceListCtrl .detailDate {\n  display: block;\n  text-align: center;\n  color: #889098;\n  font-size: 16px;\n  height: 40px;\n  line-height: 40px;\n}\n.order .deviceListCtrl .deviceTable {\n  padding: 10px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n.order .deviceListCtrl .deviceTable .loadingWrap {\n  position: absolute;\n  top: -4px;\n  left: 50%;\n  margin-left: -83px;\n  box-shadow: 0px 3px 10px 0px rgba(43, 67, 113, 0.35);\n}\n.order .deviceListCtrl .deviceTable .loadingWrap .loadingSquare {\n  padding: 10px 11px;\n}\n.order .deviceListCtrl .deviceTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n.order .deviceListCtrl .deviceTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n.order .deviceListCtrl .deviceTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(1) {\n  width: 15%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(2) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(3) {\n  width: 5%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(4) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(5) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(6) {\n  width: 12%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(7) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(8) {\n  width: 5%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(9) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table thead tr td:nth-child(10) {\n  width: 15%;\n  min-width: 200px;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr:hover {\n  background-color: #fff3e5;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr:hover .td1 {\n  color: #4095fe;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .edit {\n  display: none;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td {\n  text-align: center;\n  vertical-align: middle;\n  padding: 15px 15px;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td p {\n  overflow: hidden;\n  margin: 0;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td p span {\n  display: inline-block;\n  width: 88px;\n  margin: 0 auto;\n  line-height: 20px;\n  overflow: hidden;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td .successButton {\n  color: #4095fe;\n  padding: 5px 10px;\n  border: 1px solid #fff;\n  border-radius: 2px;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td .successButton:hover {\n  border-color: #4095fe;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td .finish {\n  border-left: 1px solid #e6e6e6;\n  padding-left: 5px;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td .doing {\n  padding-right: 5px;\n  text-align: left;\n  padding-left: 5px;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td .waiting {\n  color: #4095fe;\n  cursor: pointer;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(1) {\n  width: 15%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(2) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(3) {\n  width: 5%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(4) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(5) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) {\n  width: 12%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(7) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(8) {\n  width: 5%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(9) {\n  width: 10%;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr td:nth-child(10) {\n  width: 15%;\n  min-width: 200px;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .td1 {\n  cursor: pointer;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch {\n  position: relative;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch span {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.order .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch .turnOn {\n  top: 5px;\n  left: 5px;\n}\n.order .deviceListCtrl .deviceTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n.order .deviceListCtrl .deviceTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n.order .deviceListCtrl .deviceTable .table tbody .editTr .edit {\n  display: block;\n}\n#checkSheetList .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#checkSheetList .table thead tr td:nth-child(1) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(2) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(3) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(4) {\n  width: 6%;\n}\n#checkSheetList .table thead tr td:nth-child(5) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(6) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(7) {\n  width: 6%;\n}\n#checkSheetList .table thead tr td:nth-child(8) {\n  width: 6%;\n}\n#checkSheetList .table thead tr td:nth-child(9) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(10) {\n  width: 8%;\n}\n#checkSheetList .table thead tr td:nth-child(11) {\n  width: 6%;\n}\n#checkSheetList .table thead tr td:nth-child(12) {\n  width: 10%;\n}\n#checkSheetList .table tbody tr td:nth-child(1) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(2) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(3) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(4) {\n  width: 6%;\n}\n#checkSheetList .table tbody tr td:nth-child(5) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(6) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(7) {\n  width: 6%;\n}\n#checkSheetList .table tbody tr td:nth-child(8) {\n  width: 6%;\n}\n#checkSheetList .table tbody tr td:nth-child(9) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(10) {\n  width: 8%;\n}\n#checkSheetList .table tbody tr td:nth-child(11) {\n  width: 6%;\n}\n#checkSheetList .table tbody tr td:nth-child(12) {\n  width: 10%;\n}\n#checkSheetList .table tbody tr .td12 {\n  width: 10%;\n}\n#buttonType {\n  text-align: center;\n}\n.buttonStep3 {\n  position: absolute;\n  bottom: 20px;\n  left: 40%;\n}\n#addAdOrder1 #colorLine2 {\n  height: 5px;\n  background: #f6911a;\n  width: 29%;\n  position: absolute;\n  top: 19px;\n  border-radius: 2px;\n  left: 170px;\n}\n#addAdOrder1 #colorLine3 {\n  height: 5px;\n  background: #f6911a;\n  width: 16%;\n  position: absolute;\n  top: 19px;\n  border-radius: 2px;\n  right: 0px;\n  z-index: 200;\n}\n#addAdOrder1 .returnButton {\n  color: #f6911a;\n  display: inline-block;\n  padding-top: 12px;\n}\n#addAdOrder1 .uploadMedia {\n  color: #889098;\n}\n#addAdOrder1 .uploadMedia:hover {\n  color: #f6911a;\n}\n#addAdOrder1 .mainBox {\n  background-color: #fff;\n  position: relative;\n  margin-top: 20px;\n}\n#addAdOrder1 .mainBox .titleNav {\n  position: relative;\n  text-align: center;\n  z-index: 100;\n}\n#addAdOrder1 .mainBox .titleNav .con-show01 {\n  width: 34px;\n  height: 40px;\n  float: left;\n  margin-left: 10px;\n  overflow: hidden;\n  transform: rotate(120deg);\n}\n#addAdOrder1 .mainBox .titleNav .con-show02 {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  transform: rotate(-60deg);\n}\n#addAdOrder1 .mainBox .titleNav .con-show03 {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  transform: rotate(-60deg);\n  position: relative;\n  background: #fff;\n  color: #f6911a;\n}\n#addAdOrder1 .mainBox .titleNav .con-show03:hover > div {\n  opacity: 1;\n}\n#addAdOrder1 .mainBox .titleNav .margin-left {\n  margin-left: 115px;\n}\n#addAdOrder1 .mainBox .titleNav .margin-top {\n  margin-top: -70px;\n}\n#addAdOrder1 .mainBox .titleNav .step {\n  position: absolute;\n  text-align: center;\n  color: #f6911a;\n  top: 10px;\n  left: 12px;\n}\n#addAdOrder1 .mainBox .titleNav .rect {\n  position: absolute;\n  background: #fff;\n  color: #f6911a;\n  width: 120px;\n  height: 20px;\n  left: 44px;\n  top: 10px;\n  box-shadow: 10px 5px 10px rgba(183, 168, 151, 0.21);\n}\n#addAdOrder1 .mainBox .titleNav .showColor {\n  background: #f6911a !important;\n  color: #fff;\n}\n#addAdOrder1 .mainBox .titleNav .halfCircle {\n  background: #fff;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  position: absolute;\n  left: 154px;\n  top: 10px;\n  box-shadow: 5px 0px 15px 0px rgba(183, 168, 151, 0.21);\n}\n#addAdOrder1 .mainBox .titleNav .colorLine1 {\n  height: 5px;\n  background: #f6911a;\n  width: 29%;\n  position: absolute;\n  top: 19px;\n  border-radius: 2px;\n  left: 170px;\n}\n#addAdOrder1 .mainBox .addMedia {\n  position: absolute;\n  left: 38%;\n  width: 100%;\n}\n#addAdOrder1 .mainBox .setPlay {\n  position: absolute;\n  left: 75%;\n}\n#addAdOrder1 .mainBox .contant {\n  overflow: hidden;\n  position: absolute;\n  background: #fff;\n  width: 100%;\n  top: 20px;\n}\n#addAdOrder1 .mainBox .contant .input-class label {\n  width: 100px;\n}\n#addAdOrder1 .mainBox .contant .input-class .i-checks {\n  width: 150px;\n}\n#addAdOrder1 .mainBox .contant .input-class .radio {\n  width: 90%;\n}\n#addAdOrder1 .mainBox .contant .tipAlert .alertBox {\n  box-shadow: 0 0 8px rgba(136, 144, 152, 0.5);\n  border-radius: 4px;\n  height: 36px;\n  line-height: 36px;\n  padding-left: 20px;\n  display: inline-block;\n  margin-top: 10px;\n  color: #889098;\n  font-size: 14px;\n}\n#addAdOrder1 .mainBox .contant .tipAlert .alertBox .numShow {\n  color: #f6911a;\n  font-size: 16px;\n  padding: 0 6px;\n}\n#addAdOrder1 .mainBox .contant .tipAlert .alertBox a {\n  color: #f6911a;\n  padding: 0 10px;\n}\n#addAdOrder1 .mainBox .contant .tipAlert .left1 {\n  margin-left: 100px;\n}\n#addAdOrder1 .mainBox .contant .tipAlert .left2 {\n  margin-left: 270px;\n}\n#addAdOrder1 .mainBox .contant .tipAlert .left3 {\n  margin-left: 450px;\n}\n#addAdOrder2 #colorLine2 {\n  height: 5px;\n  background: #f6911a;\n  width: 29%;\n  position: absolute;\n  top: 19px;\n  border-radius: 2px;\n  left: 170px;\n}\n#addAdOrder2 .btn:active,\n#addAdOrder2 .btn.active {\n  box-shadow: none;\n}\n#addAdOrder2 .returnButton {\n  color: #f6911a;\n  display: inline-block;\n  padding-top: 12px;\n}\n#addAdOrder2 .btn-group {\n  margin-left: 20px;\n}\n#addAdOrder2 .uploadMedia:hover {\n  color: #f6911a;\n}\n#addAdOrder2 .hover:hover {\n  color: #f6911a;\n}\n#addAdOrder2 .mainBox {\n  background-color: #fff;\n  position: relative;\n  margin-top: 20px;\n}\n#addAdOrder2 .mainBox .titleNav {\n  position: relative;\n  text-align: center;\n  z-index: 100;\n}\n#addAdOrder2 .mainBox .titleNav .con-show01 {\n  width: 34px;\n  height: 40px;\n  float: left;\n  margin-left: 10px;\n  overflow: hidden;\n  transform: rotate(120deg);\n}\n#addAdOrder2 .mainBox .titleNav .con-show02 {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  transform: rotate(-60deg);\n}\n#addAdOrder2 .mainBox .titleNav .con-show03 {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  transform: rotate(-60deg);\n  position: relative;\n  background: #fff;\n  color: #f6911a;\n}\n#addAdOrder2 .mainBox .titleNav .con-show03:hover > div {\n  opacity: 1;\n}\n#addAdOrder2 .mainBox .titleNav .margin-left {\n  margin-left: 115px;\n}\n#addAdOrder2 .mainBox .titleNav .margin-top {\n  margin-top: -70px;\n}\n#addAdOrder2 .mainBox .titleNav .step {\n  position: absolute;\n  text-align: center;\n  color: #f6911a;\n  top: 10px;\n  left: 12px;\n}\n#addAdOrder2 .mainBox .titleNav .rect {\n  position: absolute;\n  background: #fff;\n  color: #f6911a;\n  width: 120px;\n  height: 20px;\n  left: 44px;\n  top: 10px;\n  box-shadow: 10px 5px 10px rgba(183, 168, 151, 0.21);\n}\n#addAdOrder2 .mainBox .titleNav .showColor {\n  background: #f6911a !important;\n  color: #fff;\n}\n#addAdOrder2 .mainBox .titleNav .halfCircle {\n  background: #fff;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  position: absolute;\n  left: 154px;\n  top: 10px;\n  box-shadow: 5px 0px 15px 0px rgba(183, 168, 151, 0.21);\n}\n#addAdOrder2 .mainBox .titleNav .colorLine1 {\n  height: 5px;\n  background: #f6911a;\n  width: 29%;\n  position: absolute;\n  top: 19px;\n  border-radius: 2px;\n  left: 170px;\n}\n#addAdOrder2 .mainBox .addMedia {\n  position: absolute;\n  left: 38%;\n}\n#addAdOrder2 .mainBox .setPlay {\n  position: absolute;\n  left: 75%;\n}\n#addAdOrder2 .mainBox .contant {\n  overflow: hidden;\n  position: absolute;\n  background: #fff;\n  width: 100%;\n  margin-top: 20px;\n}\n#addAdOrder2 .mainBox .contant .contain {\n  width: 925px;\n  overflow: hidden;\n  margin: 0 auto;\n}\n#addAdOrder2 .mainBox .contant .contain .mainScreen {\n  float: left;\n  margin-bottom: 20px;\n}\n#addAdOrder2 .mainBox .contant .contain .otherScreen {\n  float: right;\n  margin-right: 20px;\n}\n#addAdOrder2 .mainBox .contant .contain .radio {\n  float: right;\n  margin: 0;\n  margin-right: 30px;\n}\n#addAdOrder2 .mainBox .contant .contain .radio .i-checks {\n  margin-right: 30px;\n}\n#addAdOrder2 .mainBox .contant .contain .radio .i-checks > i {\n  position: relative;\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  margin-top: -2px;\n  margin-right: 4px;\n}\n#addAdOrder2 .mainBox .contant .contain .radio .i-checks input:checked + i {\n  border-color: #f6911a;\n}\n#addAdOrder2 .mainBox .contant .contain .radio .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  background-color: #f6911a;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv {\n  width: 100%;\n  height: 395px;\n  clear: both;\n  margin-top: 20px;\n  margin-bottom: 15px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen {\n  position: relative;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen .tip {\n  width: 55px;\n  height: 30px;\n  background: #eceeef;\n  text-align: center;\n  line-height: 30px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen img {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background-color: #fff;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen .mask {\n  position: absolute;\n  width: 55px;\n  height: 30px;\n  background: #000;\n  opacity: 0.1;\n  top: 0;\n  right: 0;\n  z-index: 100;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen .edit {\n  position: absolute;\n  width: 55px;\n  height: 30px;\n  top: 0;\n  right: 0;\n  z-index: 200;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen .edit i {\n  color: #fff;\n  line-height: 30px;\n  font-size: 18px;\n  display: block;\n  float: left;\n  width: 50%;\n  text-align: center;\n  cursor: pointer;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 {\n  width: 700px;\n  height: 390px;\n  border: 1px dashed #cfd3d6;\n  float: left;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .tip {\n  width: 110px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .addBtn {\n  width: 125px;\n  height: 35px;\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  font-size: 14px;\n  text-align: center;\n  line-height: 35px;\n  margin: 0 auto;\n  margin-top: 135px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-bottom: 40px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .explain {\n  font-size: 12px;\n  color: #889098;\n  margin-left: 222px;\n  margin-bottom: 20px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .mask {\n  width: 30px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .edit {\n  width: 30px;\n  z-index: 600;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .edit i {\n  width: 100%;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .game {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 50;\n  background: #fff;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .game span {\n  margin-top: 125px;\n  margin-left: 300px;\n  width: 100px;\n  height: 100px;\n  float: left;\n  background: url(" + escape(__webpack_require__(5)) + ");\n  margin-bottom: 10px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen1 .game p {\n  clear: both;\n  color: #28241f;\n  margin-top: 20px;\n  background: #fff;\n  position: absolute;\n  bottom: -10px;\n  display: block;\n  text-align: center;\n  width: 100%;\n  height: 40px;\n  line-height: 40px;\n  opacity: 0.5;\n  font-size: 16px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen5 {\n  width: 220px;\n  height: 390px;\n  border: 1px dashed #cfd3d6;\n  float: right;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen5 .addBtn {\n  width: 125px;\n  height: 35px;\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  font-size: 14px;\n  text-align: center;\n  line-height: 35px;\n  margin: 0 auto;\n  margin-top: 135px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-bottom: 40px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screen5 .explain {\n  font-size: 12px;\n  color: #889098;\n  margin-left: 50px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen {\n  width: 455px;\n  height: 256px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen .addBtn {\n  margin-top: 80px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen .explain {\n  text-align: center;\n  margin-left: 0;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen .prompt {\n  width: 100%;\n  height: 100%;\n  background: #fff;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 700;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen .prompt p {\n  text-align: center;\n  color: #f6911a;\n  font-size: 14px;\n  margin-top: 90px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen1 {\n  width: 142px;\n  height: 256px;\n  float: left;\n  margin-left: 5px;\n  margin-right: 5px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen1 .addBtn {\n  margin-top: 80px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .newScreen1 .explain {\n  margin-left: 0px;\n  text-align: center;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screenMin {\n  width: 220px;\n  height: 390px;\n  float: right;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screenMin .screen {\n  width: 220px;\n  height: 127px;\n  margin-bottom: 5px;\n  border: 1px dashed #cfd3d6;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screenMin .screen .addBtn {\n  width: 125px;\n  height: 35px;\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  font-size: 14px;\n  text-align: center;\n  line-height: 35px;\n  margin: 0 auto;\n  margin-top: 10px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-bottom: 15px;\n}\n#addAdOrder2 .mainBox .contant .contain .screenDiv .screenMin .screen .explain {\n  font-size: 12px;\n  color: #889098;\n  margin-left: 50px;\n}\n#addAdOrder2 .mainBox .contant .allDel {\n  font-size: 12px;\n  color: #f6911a;\n  float: right;\n  margin-bottom: 20px;\n  margin-top: 20px;\n}\n#addAdOrder2 #videoMask {\n  display: none;\n}\n#addAdOrder2 #preview {\n  display: none;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  padding-bottom: 10px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  z-index: 1290;\n}\n#addAdOrder2 #preview .videoPic {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  left: 0;\n  background: #000;\n}\n#addAdOrder2 #preview .videoPic img {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n#addAdOrder2 #preview .video-body {\n  width: 920px;\n  height: 600px;\n  padding: 10px;\n  background: #fff;\n  margin: 0 auto;\n  margin-top: 80px;\n  box-shadow: 0 0 10px #210c0e;\n  border-radius: 4px;\n  position: relative;\n}\n#addAdOrder2 #preview .video-body .closePlay {\n  position: absolute;\n  top: -30px;\n  right: -30px;\n  height: 30px;\n  width: 30px;\n  background: #fff;\n  border-radius: 50%;\n  padding: 1px 8px;\n}\n#addAdOrder2 #preview .video-body .closePlay i {\n  line-height: 30px;\n  color: #9299a1;\n}\n#addAdOrder2 #preview .video-body .closePlay:hover {\n  background: #f6911a;\n}\n#addAdOrder2 #preview .video-body .closePlay:hover i {\n  color: #fff;\n}\n#addAdOrder2 #order-video {\n  display: none;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  opacity: 1 !important;\n  z-index: 90;\n}\n#addAdOrder2 #order-video .video-body {\n  width: 700px;\n  height: 390px;\n  position: relative;\n}\n#addAdOrder2 #order-video .video-body .closePlay {\n  position: absolute;\n  top: -30px;\n  right: -30px;\n  height: 30px;\n  width: 30px;\n  background: #fff;\n  border-radius: 50%;\n  padding: 1px 8px;\n}\n#addAdOrder2 #order-video .video-body .closePlay i {\n  line-height: 30px;\n  color: #9299a1;\n}\n#addAdOrder2 #order-video .video-body .closePlay:hover {\n  background: #f6911a;\n}\n#addAdOrder2 #order-video .video-body .closePlay:hover i {\n  color: #fff;\n}\n#addAdOrder2 #order-video .video-js .vjs-big-play-button {\n  color: #332e29;\n  background: #fff;\n  border-radius: 50%;\n  border: 0;\n  line-height: 2em;\n  height: 2em;\n  width: 2em;\n}\n#addAdOrder2 #order-video .vjs-paused .vjs-big-play-button {\n  display: block;\n}\n.addAdOrder3 .roundTime .w5c-error {\n  right: auto !important;\n  left: 103px !important;\n}\n.addAdOrder3 .roundTime .hoverTips {\n  width: 300px;\n  height: 180px;\n  background: #fff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n  border-radius: 2px 2px 2px 2px;\n  position: absolute;\n  z-index: 999;\n  padding: 16px;\n  top: -10px;\n  left: 320px;\n  font-size: 12px;\n}\n.addAdOrder3 .roundTime .hoverTips .tipsTitle {\n  text-align: center;\n  font-size: 16px;\n}\n.addAdOrder3 .roundTime .hoverTips .tipsContent {\n  color: #889098;\n  line-height: 20px;\n}\n.addAdOrder3 .dayTime .w5c-error {\n  right: auto !important;\n  left: 188px !important;\n}\n.addAdOrder3 .dayTime .timeShow {\n  color: #6a6c7c;\n  width: 114px;\n  height: 18px;\n  line-height: 18px;\n  font-size: 12px;\n  margin: 0px 10px;\n  text-align: center;\n  font-weight: normal;\n  display: inline-block;\n}\n.addAdOrder3 .dayTime .active label {\n  color: #f6911a;\n}\n.addAdOrder3 .dayTime .timeBox {\n  height: 135px;\n  margin-left: 250px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n  border-radius: 2px 2px 2px 2px;\n}\n.addAdOrder3 .dayTime .timeBox .inlineBox {\n  margin: auto;\n  width: 756px;\n  height: 135px;\n}\n.addAdOrder3 .dayTime .timeBox .timeFloat {\n  float: left;\n  width: 600px;\n}\n.addAdOrder3 .step3Content {\n  padding-bottom: 300px !important;\n}\n.addAdOrder3 .deviceCtrlGroup .backStep {\n  display: inline-block;\n  padding: 6px 12px;\n  font-size: 14px;\n  text-align: center;\n  background-color: rgba(0, 0, 0, 0);\n  border: 1px solid #c4c8cc !important;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n  border-radius: 2px !important;\n  height: 36px;\n  float: left;\n  margin-right: 20px;\n  color: #f6911a;\n}\n.addAdOrder3 .deviceCtrlGroup .backStep:hover {\n  border: 1px solid transparent !important;\n  background-color: #fff;\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.addAdOrder3 .deviceCtrlGroup .backStep i {\n  color: #f6911a;\n}\n.addAdOrder3 .mainBox .input-class {\n  height: 100%;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot {\n  padding-left: 103px;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .addBtn {\n  display: inline-block;\n  padding: 6px 12px;\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .addBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid transparent !important;\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .timeChose {\n  padding-left: 40px;\n  display: inline-block;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .timeChose .setTime {\n  width: 205px;\n  position: relative;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .timeChose .setTime .lineTime {\n  width: 90px;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .timeChose .setTime .arroLine {\n  margin: 15px 4px !important;\n}\n.addAdOrder3 .mainBox .input-class .timeSlot .timeChose .setTime .delectIcon {\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  top: 0;\n  left: 215px;\n  cursor: pointer;\n}\n.addAdOrder3 .mainBox .input-class .setDate {\n  width: 270px;\n  float: none;\n  display: inline-block;\n  vertical-align: middle;\n}\n.addAdOrder3 .mainBox .input-class .setDate .taskTime {\n  width: 120px;\n  display: inline-block;\n}\n.addAdOrder3 .mainBox .input-class .setDate .taskTime .input-group-addon {\n  padding: 5px;\n}\n.addAdOrder3 .mainBox .input-class .setDate .taskTime .dateCtrl {\n  box-shadow: none;\n  border-right: 0 none;\n  padding: 5px 10px;\n}\n.addAdOrder3 .mainBox .input-class .setDate .taskLine {\n  width: 11%;\n}\n.addAdOrder3 .mainBox .input-class .setDate .taskLine .arroLine {\n  height: 3px;\n  margin: 15px 10px;\n  background-color: #e6e9ec;\n}\n.addAdOrder3 .mainBox .input-class .i-checks {\n  margin: 0;\n}\n.addAdOrder3 .mainBox .input-class .smallInput {\n  width: 70px;\n}\n#adPlayListCtrl .deviceListCtrl {\n  background-color: #fff;\n  position: relative;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#adPlayListCtrl .deviceListCtrl .detailTitle {\n  color: #889098;\n  height: 40px;\n  line-height: 40px;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable {\n  padding: 10px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .loadingWrap {\n  position: absolute;\n  top: -47px;\n  left: 50%;\n  margin-left: -83px;\n  box-shadow: 0px 3px 10px 0px rgba(43, 67, 113, 0.35);\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .loadingWrap .loadingSquare {\n  padding: 10px 11px;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table thead tr td {\n  text-align: center;\n  padding: 20px 10px;\n  border-bottom: 2px solid #eaeff0;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr:hover {\n  background-color: #fff3e5;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr:hover .td1 {\n  color: #4095fe;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr td {\n  text-align: center;\n  vertical-align: middle;\n  padding: 20px 10px;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr td p {\n  padding: 0;\n  margin-bottom: 5px;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr td .unPlay {\n  color: #6a6c7c;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr td .play {\n  color: #3cb034;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr td .playFont {\n  font-size: 14px;\n}\n#adPlayListCtrl .deviceListCtrl .deviceTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#adPlayListCtrl .playListHead {\n  width: 100%;\n  height: 42px;\n  margin-bottom: 20px;\n}\n#adPlayListCtrl .playListHead .return {\n  float: left;\n  margin-top: 14px;\n  line-height: 14px;\n  color: #f6911a;\n  font-size: 12px;\n  border-right: 1px solid #f6911a;\n  width: 72px;\n}\n#adPlayListCtrl .playListHead .headName {\n  float: left;\n  font-size: 18px;\n  line-height: 42px;\n  color: #889098;\n  margin-left: 10px;\n}\n#adPlayListCtrl .videoType {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n#adPlayListCtrl .playTitle {\n  width: 147px;\n  height: 50px;\n  position: absolute;\n  left: 0;\n  top: -21px;\n  background: url(" + escape(__webpack_require__(10)) + ");\n}\n#adPlayListCtrl .timeBg {\n  width: 35px;\n  height: 35px;\n  float: right;\n  background: url(" + escape(__webpack_require__(9)) + ");\n}\n#adPlayListCtrl .dateFromCtrl {\n  width: 123px;\n  height: 35px;\n  float: right;\n}\n#adPlayListCtrl .dateFromCtrl .input-group input {\n  border: 1px solid #c4c8cc;\n  color: #28241f;\n  border-radius: 2px;\n  background-color: #eceeef;\n  height: 35px;\n  width: 123px;\n}\n#adPlayListCtrl .dateFromCtrl .input-group-addon {\n  font-size: 14px;\n  height: 17px;\n  background: #eceeef !important;\n  border: 0px;\n  position: absolute;\n  z-index: 10;\n  right: 15px;\n  top: 6px;\n}\n#adPlayListCtrl .dateFromCtrl .input-group-addon span {\n  position: absolute;\n  top: 3px;\n  color: #4295ff;\n  font-size: 18px;\n}\n#adPlayListCtrl .dateFromCtrl .form-control {\n  font-size: 14px;\n  border-radius: 2px;\n  box-shadow: none;\n}\n#adPlayListCtrl .hour1 {\n  width: 70px;\n  height: 35px;\n  float: right;\n}\n#adPlayListCtrl .hour1 .input-group input {\n  border: 1px solid #c4c8cc;\n  color: #28241f;\n  border-radius: 2px;\n  background-color: #eceeef;\n  height: 35px;\n  width: 70px;\n}\n#adPlayListCtrl .hour1 .input-group-addon {\n  font-size: 14px;\n  height: 17px;\n  background: #eceeef !important;\n  color: #514d47 !important;\n  border: 0px;\n  position: absolute;\n  z-index: 10;\n  right: 17px;\n  top: 5px;\n  text-indent: -10px;\n}\n#adPlayListCtrl .hour1 .input-group-addon span {\n  position: absolute;\n  top: 5px;\n  color: #b0b6ba;\n  font-size: 18px;\n  right: -12px;\n}\n#adPlayListCtrl .hour1 .form-control {\n  font-size: 14px;\n  border-radius: 2px;\n  box-shadow: none;\n}\n#adPlayListCtrl .playListInfo {\n  margin-left: 30px;\n  margin-top: 10px;\n}\n#adPlayListCtrl .playListInfo p {\n  color: #6a6c7c;\n  margin-right: 30px;\n  float: left;\n}\n#adPlayListCtrl .playListInfo p span {\n  color: #f6911a;\n}\n#adPlayListCtrl .playListInfo .length {\n  color: #6a6c7c;\n}\n", ""]);

// exports


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".point .tabs {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  border-radius: 2px;\n  position: relative;\n}\n.point .tabs .countNum {\n  display: inline-block;\n  text-decoration: none;\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  top: -10px;\n  right: -10px;\n  background-color: #f6911a;\n  border-radius: 50%;\n  line-height: 20px;\n  text-align: center;\n  color: #fff;\n}\n.point .tabs i {\n  padding: 5px;\n}\n.point .tabs .tabBtn {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n.point .tabs .tabBtn:nth-of-type(1):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n.point .tabs .tabBtn:nth-of-type(2):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n.point .tabs .listMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n}\n.point .tabs .leftListMedia {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n}\n.point .pointCount p {\n  margin: 0;\n  font-size: 14px;\n  color: #889098;\n  line-height: 36px;\n}\n.point .pointCount p span {\n  color: #f6911a;\n}\n.point .deviceCtrlGroup {\n  padding-bottom: 30px;\n}\n.point .deviceCtrlGroup .crumb a {\n  line-height: 36px;\n  color: #f1bf84;\n}\n.point .deviceCtrlGroup .crumb i {\n  color: #f1bf84;\n}\n.point .deviceCtrlGroup .crumb span {\n  line-height: 36px;\n  color: #28241f;\n  font-size: \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n.point .deviceCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n.point .deviceCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n.point .deviceCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n.point .deviceCtrlGroup .selectGroup .title {\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  color: #889098;\n  line-height: 36px;\n}\n.point .deviceCtrlGroup .selectGroup select {\n  font-weight: normal;\n  color: #889098;\n  height: 36px;\n  background-color: #eceeef;\n}\n.point .deviceCtrlGroup .selectGroup .selectSquare {\n  margin-right: 4px;\n}\n.point .deviceCtrlGroup .selectGroup .form-control:focus {\n  border: 1px solid #ccc;\n  box-shadow: none;\n}\n.point .deviceListCtrl {\n  background-color: #fff;\n  position: relative;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n.point .deviceListCtrl .deviceTable {\n  padding: 10px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n.point .deviceListCtrl .deviceTable .loadingWrap {\n  position: absolute;\n  top: -8px;\n  left: 50%;\n  margin-left: -83px;\n  box-shadow: 0px 3px 10px 0px rgba(43, 67, 113, 0.35);\n}\n.point .deviceListCtrl .deviceTable .loadingWrap .loadingSquare {\n  padding: 10px 11px;\n}\n.point .deviceListCtrl .deviceTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n.point .deviceListCtrl .deviceTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n.point .deviceListCtrl .deviceTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(1) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(2) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(3) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(4) {\n  width: 15%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(5) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(6) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(7) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(8) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table thead tr td:nth-child(9) {\n  width: 15%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr:hover {\n  background-color: #fff3e5;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr:hover .td1 {\n  color: #4095fe;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 20px 15px;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(1) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(2) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(3) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(4) {\n  width: 15%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(5) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(6) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(7) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(8) {\n  width: 10%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr td:nth-child(9) {\n  width: 15%;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .newCheckbox {\n  width: 0.5% !important;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .newInput {\n  width: 100% !important;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch {\n  position: relative;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch span {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.point .deviceListCtrl .deviceTable .table tbody tr .operateBtn .i-switch .turnOn {\n  top: 5px;\n  left: 5px;\n}\n.point .deviceListCtrl .deviceTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n.point .deviceListCtrl .deviceTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n.point .deviceListCtrl .deviceTable .table tbody .editTr .edit {\n  display: block;\n}\n#deviceListCtrl {\n  clear: both;\n}\n#deviceListCtrl .color {\n  color: #74b2ff;\n}\n#deviceListCtrl .iconfont {\n  cursor: pointer;\n}\n#deviceListCtrl .dropdown-menu {\n  top: 43px;\n  left: -80px;\n  min-width: 125px;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n  border: 0 none !important;\n  border-radius: 0;\n}\n#deviceListCtrl .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#deviceListCtrl .dropdown-toggle {\n  box-shadow: none;\n}\n#deviceListCtrl .dropdown-menu > li > a {\n  display: block;\n  padding: 3px 20px;\n  clear: both;\n  font-weight: normal;\n  color: #28241f;\n  font-size: 12px;\n  white-space: nowrap;\n  height: 32px;\n  line-height: 32px;\n}\n#deviceListCtrl .disabled a {\n  color: #889098 !important;\n}\n#deviceListCtrl .dropdown-menu > li > a:hover,\n#deviceListCtrl .dropdown-menu > li > a:focus {\n  background-color: #fff !important;\n  color: #f6911a;\n}\n#deviceListCtrl .dropdown-menu .select {\n  color: #f6911a !important;\n}\n#deviceListCtrl .dropdown-menu .select i {\n  visibility: visible;\n}\n#deviceListCtrl .dropdown-menu i {\n  visibility: hidden;\n}\n#deviceListCtrl .hand {\n  cursor: pointer;\n}\n#deviceListCtrl .table tbody tr {\n  transition: all 0s ease-in-out 0s;\n}\n#playListCtrl .playListHead {\n  width: 100%;\n  height: 42px;\n  margin-bottom: 20px;\n}\n#playListCtrl .playListHead .return {\n  float: left;\n  margin-top: 14px;\n  line-height: 14px;\n  color: #f6911a;\n  font-size: 12px;\n  border-right: 1px solid #f6911a;\n  width: 72px;\n}\n#playListCtrl .playListHead .headName {\n  float: left;\n  font-size: 18px;\n  line-height: 42px;\n  color: #889098;\n  margin-left: 10px;\n}\n#playListCtrl .videoType {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n#playListCtrl .playTitle {\n  width: 147px;\n  height: 50px;\n  position: absolute;\n  left: 0;\n  top: -21px;\n  background: url(" + escape(__webpack_require__(10)) + ");\n}\n#playListCtrl .wifiTitle {\n  width: 165px;\n  height: 50px;\n  position: absolute;\n  left: 0;\n  top: -21px;\n  background: url(" + escape(__webpack_require__(140)) + ");\n}\n#playListCtrl .timeBg {\n  width: 35px;\n  height: 35px;\n  float: right;\n  background: url(" + escape(__webpack_require__(9)) + ");\n}\n#playListCtrl .dateFromCtrl {\n  width: 123px;\n  height: 35px;\n  float: right;\n}\n#playListCtrl .dateFromCtrl .input-group input {\n  border: 1px solid #c4c8cc;\n  color: #28241f;\n  border-radius: 2px;\n  background-color: #eceeef;\n  height: 35px;\n  width: 123px;\n}\n#playListCtrl .dateFromCtrl .input-group-addon {\n  font-size: 14px;\n  height: 17px;\n  background: #eceeef !important;\n  border: 0px;\n  position: absolute;\n  z-index: 10;\n  right: 15px;\n  top: 6px;\n}\n#playListCtrl .dateFromCtrl .input-group-addon span {\n  position: absolute;\n  top: 3px;\n  color: #4295ff;\n  font-size: 18px;\n}\n#playListCtrl .dateFromCtrl .form-control {\n  font-size: 14px;\n  border-radius: 2px;\n  box-shadow: none;\n}\n#playListCtrl .hour1 {\n  width: 70px;\n  height: 35px;\n  float: right;\n}\n#playListCtrl .hour1 .input-group input {\n  border: 1px solid #c4c8cc;\n  color: #28241f;\n  border-radius: 2px;\n  background-color: #eceeef;\n  height: 35px;\n  width: 70px;\n}\n#playListCtrl .hour1 .input-group-addon {\n  font-size: 14px;\n  height: 17px;\n  background: #eceeef !important;\n  color: #514d47 !important;\n  border: 0px;\n  position: absolute;\n  z-index: 10;\n  right: 17px;\n  top: 5px;\n  text-indent: -10px;\n}\n#playListCtrl .hour1 .input-group-addon span {\n  position: absolute;\n  top: 5px;\n  color: #b0b6ba;\n  font-size: 18px;\n  right: -12px;\n}\n#playListCtrl .hour1 .form-control {\n  font-size: 14px;\n  border-radius: 2px;\n  box-shadow: none;\n}\n#playListCtrl .wifiInfoHead {\n  height: 40px;\n  width: 100%;\n  margin-bottom: 10px;\n}\n#playListCtrl .wifiInfoHead p {\n  color: #889098;\n  font-size: 14px;\n  line-height: 40px;\n  float: left;\n}\n#playListCtrl .wifiInfoHead .exportData {\n  width: 106px;\n  height: 38px;\n  border: 1px solid #cfd3d6;\n  text-align: center;\n  color: #889098;\n  font-size: 12px;\n  line-height: 36px;\n  float: right;\n  cursor: pointer;\n  margin-left: 10px;\n}\n#playListCtrl .wifiInfoHead .exportData:hover {\n  border: 1px solid #fff;\n  background-color: #fff;\n  color: #f6911a;\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#playListCtrl .table > tbody > tr > td {\n  border-top: none;\n}\n.mr-30 {\n  margin-right: 30px;\n}\n.mr-20 {\n  margin-right: 20px;\n}\n#pointDate .main {\n  margin: 0 auto;\n}\n#pointDate .main #calendar {\n  width: 100%;\n  margin: 20px auto;\n  padding: 20px;\n  background-color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#pointDate {\n  /* Header\n    ------------------------------------------------------------------------*/\n  /* buttons edges butting together */\n  /* button layering (for border precedence) */\n  /* Content\n    ------------------------------------------------------------------------*/\n  /* Cell Styles\n    ------------------------------------------------------------------------*/\n  /* Buttons\n    ------------------------------------------------------------------------*/\n  /*\n        Our default prev/next buttons use HTML entities like &lsaquo; &rsaquo; &laquo; &raquo;\n        and we'll try to make them look good cross-browser.\n    */\n  /* icon (for jquery ui) */\n  /*\n    button states\n    borrowed from twitter bootstrap (http://twitter.github.com/bootstrap/)\n    */\n  /* Global Event Styles\n    ------------------------------------------------------------------------*/\n  /* Horizontal Events\n    ------------------------------------------------------------------------*/\n  /* resizable */\n  /* Reusable Separate-border Table\n    ------------------------------------------------------------*/\n  /* Month View, Basic Week View, Basic Day View\n    ------------------------------------------------------------------------*/\n  /* event styles */\n  /* right-to-left */\n  /* Agenda Week View, Agenda Day View\n    ------------------------------------------------------------------------*/\n  /* make axis border take precedence */\n  /* all-day area */\n  /* divider (between all-day and slots) */\n  /* slot rows */\n  /* Vertical Events\n    ------------------------------------------------------------------------*/\n  /* resizable */\n}\n#pointDate .fc {\n  direction: ltr;\n  text-align: left;\n}\n#pointDate .fc table {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n#pointDate html .fc,\n#pointDate .fc table {\n  font-size: 1em;\n}\n#pointDate .fc td,\n#pointDate .fc th {\n  padding: 0;\n  vertical-align: top;\n}\n#pointDate .fc-header td {\n  white-space: nowrap;\n  background-color: #f6911a;\n}\n#pointDate .fc-header-left {\n  width: 25%;\n  text-align: left;\n}\n#pointDate .fc-header-center {\n  text-align: center;\n}\n#pointDate .fc-header-right {\n  width: 25%;\n  text-align: right;\n}\n#pointDate .fc-header-title {\n  display: inline-block;\n  vertical-align: top;\n}\n#pointDate .fc-header-title h2 {\n  margin-top: 0;\n  font-size: 16px;\n  white-space: nowrap;\n  height: 36px;\n  line-height: 48px;\n  color: #fff;\n}\n#pointDate .fc .fc-header-space {\n  padding-left: 10px;\n}\n#pointDate .fc-header .fc-button {\n  margin-bottom: 1em;\n  vertical-align: top;\n  background: #f6911a;\n  color: #fff;\n}\n#pointDate .fc-header .fc-button {\n  margin-right: -1px;\n}\n#pointDate .fc-header .fc-corner-right,\n#pointDate .fc-header .ui-corner-right {\n  /* theme */\n  margin-right: 0;\n  /* back to normal */\n}\n#pointDate .fc-header .fc-state-hover,\n#pointDate .fc-header .ui-state-hover {\n  z-index: 2;\n}\n#pointDate .fc-header .fc-state-down {\n  z-index: 3;\n}\n#pointDate .fc-header .fc-state-active,\n#pointDate .fc-header .ui-state-active {\n  z-index: 4;\n}\n#pointDate .fc-content {\n  clear: both;\n}\n#pointDate .fc-view {\n  width: 100%;\n  /* needed for view switching (when view is absolute) */\n  overflow: hidden;\n}\n#pointDate .fc-widget-header,\n#pointDate .fc-widget-content {\n  /* <td>, usually */\n  border: 1px solid #ddd;\n}\n#pointDate .fc-widget-header {\n  background: #f7f7f7;\n}\n#pointDate .fc-state-highlight {\n  /* <td> today cell */\n  /* TODO: add .fc-today to <th> */\n  background: #eceeef;\n}\n#pointDate .fc-cell-overlay {\n  /* semi-transparent rectangle while dragging */\n  background: #bce8f1;\n  opacity: .3;\n  filter: alpha(opacity=30);\n  /* for IE */\n}\n#pointDate .fc-button {\n  position: relative;\n  display: inline-block;\n  padding: 0 .6em;\n  overflow: hidden;\n  height: 1.9em;\n  line-height: 1.9em;\n  white-space: nowrap;\n  cursor: pointer;\n}\n#pointDate .fc-state-default {\n  /* non-theme */\n}\n#pointDate .fc-state-default.fc-corner-left {\n  /* non-theme */\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n  margin: 10px;\n}\n#pointDate .fc-state-default.fc-corner-right {\n  /* non-theme */\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n#pointDate .fc-text-arrow {\n  margin: 0 .1em;\n  font-size: 2em;\n  font-family: \"Courier New\", Courier, monospace;\n  vertical-align: baseline;\n  /* for IE7 */\n}\n#pointDate .fc-button-prev .fc-text-arrow,\n#pointDate .fc-button-next .fc-text-arrow {\n  /* for &lsaquo; &rsaquo; */\n  font-weight: bold;\n}\n#pointDate .fc-button .fc-icon-wrap {\n  position: relative;\n  float: left;\n  top: 50%;\n}\n#pointDate .fc-button .ui-icon {\n  position: relative;\n  float: left;\n  margin-top: -50%;\n  *margin-top: 0;\n  *top: -50%;\n}\n#pointDate .fc-state-default {\n  background-color: #f5f5f5;\n  background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));\n  background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);\n  background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);\n  background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);\n  background-repeat: repeat-x;\n}\n#pointDate .fc-state-hover,\n#pointDate .fc-state-down,\n#pointDate .fc-state-active,\n#pointDate .fc-state-disabled {\n  color: #333333;\n  background-color: #e6e6e6;\n}\n#pointDate .fc-state-hover {\n  color: #333333;\n  text-decoration: none;\n  background-position: 0 -15px;\n  -webkit-transition: background-position 0.1s linear;\n  -moz-transition: background-position 0.1s linear;\n  -o-transition: background-position 0.1s linear;\n  transition: background-position 0.1s linear;\n}\n#pointDate .fc-state-down,\n#pointDate .fc-state-active {\n  background-color: #cccccc;\n  background-image: none;\n  outline: 0;\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);\n}\n#pointDate .fc-state-disabled {\n  cursor: default;\n  background-image: none;\n  opacity: 0.65;\n  filter: alpha(opacity=65);\n  box-shadow: none;\n}\n#pointDate .fc-event {\n  border: 1px solid #ffe8cb;\n  background-color: #ffe8cb;\n  height: 36px;\n  line-height: 36px;\n  text-align: center;\n  /* text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); */\n  /* font-size: .85em; */\n  cursor: default;\n}\n#pointDate a.fc-event {\n  text-decoration: none;\n}\n#pointDate a.fc-event,\n#pointDate .fc-event-draggable {\n  cursor: pointer;\n}\n#pointDate .fc-rtl .fc-event {\n  text-align: right;\n}\n#pointDate .fc-event-inner {\n  width: 100%;\n  overflow: hidden;\n}\n#pointDate .fc-event-time,\n#pointDate .fc-event-title {\n  padding: 0 1px;\n}\n#pointDate .fc .ui-resizable-handle {\n  display: block;\n  position: absolute;\n  z-index: 99999;\n  overflow: hidden;\n  /* hacky spaces (IE6/7) */\n  font-size: 300%;\n  /* */\n  line-height: 50%;\n  /* */\n}\n#pointDate .fc-event-hori {\n  border-width: 1px 0;\n  margin-bottom: 1px;\n}\n#pointDate .fc-ltr .fc-event-hori.fc-event-start,\n#pointDate .fc-rtl .fc-event-hori.fc-event-end {\n  border-left-width: 1px;\n  border-top-left-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n#pointDate .fc-ltr .fc-event-hori.fc-event-end,\n#pointDate .fc-rtl .fc-event-hori.fc-event-start {\n  border-right-width: 1px;\n  border-top-right-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n#pointDate .fc-event-hori .ui-resizable-e {\n  top: 0           !important;\n  /* importants override pre jquery ui 1.7 styles */\n  right: -3px !important;\n  width: 7px       !important;\n  height: 100%     !important;\n  cursor: e-resize;\n}\n#pointDate .fc-event-hori .ui-resizable-w {\n  top: 0           !important;\n  left: -3px !important;\n  width: 7px       !important;\n  height: 100%     !important;\n  cursor: w-resize;\n}\n#pointDate .fc-event-hori .ui-resizable-handle {\n  _padding-bottom: 14px;\n  /* IE6 had 0 height */\n}\n#pointDate table.fc-border-separate {\n  border-collapse: separate;\n}\n#pointDate .fc-border-separate th,\n#pointDate .fc-border-separate td {\n  border-width: 1px 0 0 1px;\n}\n#pointDate .fc-border-separate th.fc-last,\n#pointDate .fc-border-separate td.fc-last {\n  border-right-width: 1px;\n}\n#pointDate .fc-border-separate tr.fc-last th,\n#pointDate .fc-border-separate tr.fc-last td {\n  border-bottom-width: 1px;\n}\n#pointDate .fc-border-separate tbody tr.fc-first td,\n#pointDate .fc-border-separate tbody tr.fc-first th {\n  border-top-width: 0;\n}\n#pointDate .fc-grid th {\n  text-align: center;\n}\n#pointDate .fc .fc-week-number {\n  width: 22px;\n  text-align: center;\n}\n#pointDate .fc .fc-week-number div {\n  padding: 0 2px;\n}\n#pointDate .fc-grid .fc-day-number {\n  float: right;\n  padding: 0 2px;\n}\n#pointDate .fc-grid .fc-other-month .fc-day-number {\n  opacity: 0.3;\n  filter: alpha(opacity=30);\n  /* for IE */\n  /* opacity with small font can sometimes look too faded\n        might want to set the 'color' property instead\n        making day-numbers bold also fixes the problem */\n}\n#pointDate .fc-grid .fc-day-content {\n  clear: both;\n  padding: 2px 2px 1px;\n  /* distance between events and day edges */\n}\n#pointDate .fc-grid .fc-event-time {\n  font-weight: bold;\n}\n#pointDate .fc-rtl .fc-grid .fc-day-number {\n  float: left;\n}\n#pointDate .fc-rtl .fc-grid .fc-event-time {\n  float: right;\n}\n#pointDate .fc-agenda table {\n  border-collapse: separate;\n}\n#pointDate .fc-agenda-days th {\n  text-align: center;\n}\n#pointDate .fc-agenda .fc-agenda-axis {\n  width: 50px;\n  padding: 0 4px;\n  vertical-align: middle;\n  text-align: right;\n  white-space: nowrap;\n  font-weight: normal;\n}\n#pointDate .fc-agenda .fc-week-number {\n  font-weight: bold;\n}\n#pointDate .fc-agenda .fc-day-content {\n  padding: 2px 2px 1px;\n}\n#pointDate .fc-agenda-days .fc-agenda-axis {\n  border-right-width: 1px;\n}\n#pointDate .fc-agenda-days .fc-col0 {\n  border-left-width: 0;\n}\n#pointDate .fc-agenda-allday th {\n  border-width: 0 1px;\n}\n#pointDate .fc-agenda-allday .fc-day-content {\n  min-height: 34px;\n  /* TODO: doesnt work well in quirksmode */\n  _height: 34px;\n}\n#pointDate .fc-agenda-divider-inner {\n  height: 2px;\n  overflow: hidden;\n}\n#pointDate .fc-widget-header .fc-agenda-divider-inner {\n  background: #eee;\n}\n#pointDate .fc-agenda-slots th {\n  border-width: 1px 1px 0;\n}\n#pointDate .fc-agenda-slots td {\n  border-width: 1px 0 0;\n  background: none;\n}\n#pointDate .fc-agenda-slots td div {\n  height: 20px;\n}\n#pointDate .fc-agenda-slots tr.fc-slot0 th,\n#pointDate .fc-agenda-slots tr.fc-slot0 td {\n  border-top-width: 0;\n}\n#pointDate .fc-agenda-slots tr.fc-minor th,\n#pointDate .fc-agenda-slots tr.fc-minor td {\n  border-top-style: dotted;\n}\n#pointDate .fc-agenda-slots tr.fc-minor th.ui-widget-header {\n  *border-top-style: solid;\n  /* doesn't work with background in IE6/7 */\n}\n#pointDate .fc-event-vert {\n  border-width: 0 1px;\n}\n#pointDate .fc-event-vert.fc-event-start {\n  border-top-width: 1px;\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n#pointDate .fc-event-vert.fc-event-end {\n  border-bottom-width: 1px;\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n#pointDate .fc-event-vert .fc-event-time {\n  white-space: nowrap;\n  font-size: 10px;\n}\n#pointDate .fc-event-vert .fc-event-inner {\n  position: relative;\n  z-index: 2;\n}\n#pointDate .fc-event-vert .fc-event-bg {\n  /* makes the event lighter w/ a semi-transparent overlay  */\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #fff;\n  opacity: .3;\n  filter: alpha(opacity=30);\n}\n#pointDate .fc .ui-draggable-dragging .fc-event-bg,\n#pointDate .fc-select-helper .fc-event-bg {\n  display: none\\9;\n  /* for IE6/7/8. nested opacity filters while dragging don't work */\n}\n#pointDate .fc-event-vert .ui-resizable-s {\n  bottom: 0        !important;\n  /* importants override pre jquery ui 1.7 styles */\n  width: 100%      !important;\n  height: 8px      !important;\n  overflow: hidden !important;\n  line-height: 8px !important;\n  font-size: 11px  !important;\n  font-family: monospace;\n  text-align: center;\n  cursor: s-resize;\n}\n#pointDate .fc-agenda .ui-resizable-resizing {\n  /* TODO: better selector */\n  _overflow: hidden;\n}\n", ""]);

// exports


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#programList .programCtrlGroup {\n  padding-bottom: 30px;\n}\n#programList .programCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#programList .programCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#programList .programCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n#programList .proListCtrl {\n  background-color: #fff;\n  position: relative;\n}\n#programList .proListCtrl .proTable {\n  padding: 10px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n#programList .proListCtrl .proTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#programList .proListCtrl .proTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#programList .proListCtrl .proTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n#programList .proListCtrl .proTable .table thead tr td:nth-child(1) {\n  width: 5%;\n}\n#programList .proListCtrl .proTable .table thead tr td:nth-child(2) {\n  width: 30%;\n}\n#programList .proListCtrl .proTable .table thead tr td:nth-child(3) {\n  width: 15%;\n}\n#programList .proListCtrl .proTable .table thead tr td:nth-child(4) {\n  width: 15%;\n}\n#programList .proListCtrl .proTable .table thead tr td:nth-child(5) {\n  width: 15%;\n}\n#programList .proListCtrl .proTable .table thead tr td:nth-child(6) {\n  width: 20%;\n}\n#programList .proListCtrl .proTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#programList .proListCtrl .proTable .table tbody tr .edit {\n  display: none;\n}\n#programList .proListCtrl .proTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 20px 15px;\n}\n#programList .proListCtrl .proTable .table tbody tr .newCheckbox {\n  width: 0.5% !important;\n}\n#programList .proListCtrl .proTable .table tbody tr td:nth-child(1) {\n  width: 5%;\n}\n#programList .proListCtrl .proTable .table tbody tr td:nth-child(2) {\n  width: 30%;\n}\n#programList .proListCtrl .proTable .table tbody tr td:nth-child(3) {\n  width: 15%;\n}\n#programList .proListCtrl .proTable .table tbody tr td:nth-child(4) {\n  width: 15%;\n}\n#programList .proListCtrl .proTable .table tbody tr td:nth-child(5) {\n  width: 15%;\n}\n#programList .proListCtrl .proTable .table tbody tr td:nth-child(6) {\n  width: 20%;\n}\n#programList .proListCtrl .proTable .table tbody tr .newInput {\n  width: 100% !important;\n}\n#programList .proListCtrl .proTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#programList .proListCtrl .proTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#programList .proListCtrl .proTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#programList .proListCtrl .proTable .table tbody tr .tableDirName .dataName {\n  display: block;\n  cursor: pointer;\n}\n#programList .proListCtrl .proTable .table tbody tr .tableDirName .dataName:hover {\n  color: #00a8f3;\n}\n#programList .proListCtrl .proTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n#programList .proListCtrl .proTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn .dropdown-toggle {\n  box-shadow: none;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu {\n  min-width: 95px;\n  top: 43px;\n  left: -50px;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu .btn-group {\n  perspective: 400px;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n  border-top: 1px solid #c4c8cc;\n  border-left: 1px solid #c4c8cc;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  font-size: 13px;\n  color: #889098;\n}\n#programList .proListCtrl .proTable .table tbody tr .operateBtn li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#programList .proListCtrl .proTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n#programList .proListCtrl .proTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#programList .proListCtrl .proTable .table tbody .editTr .edit {\n  display: block;\n}\n#addProgram .ztrees * {\n  font-size: 12px;\n}\n#addProgram .ztrees li a {\n  padding-left: 30px;\n  padding-right: 20px;\n}\n#addProgram .addProCtrlGroup {\n  padding-bottom: 30px;\n}\n#addProgram .addProCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#addProgram .addProCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#addProgram .returnBefore {\n  color: #f6911a;\n  cursor: pointer;\n  margin-right: 10px;\n  line-height: 26px;\n}\n#addProgram .editProName {\n  line-height: 18px;\n}\n#addProgram .editProName span {\n  display: inline-block;\n  color: #889098;\n  font: 18px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#addProgram .editProName i {\n  font-size: 16px;\n  color: #f6911a;\n  cursor: pointer;\n}\n#addProgram .programName {\n  padding-left: 5px;\n}\n#addProgram .programName .btn-info:active {\n  background-color: #4e8bd6;\n  border: 0;\n}\n#addProgram .programName .btn:active,\n#addProgram .programName .btn.active {\n  box-shadow: 0 0 0 #4e8bd6;\n}\n#addProgram .programName .inputArea {\n  height: 38px;\n  margin-right: 20px;\n  float: left;\n  position: relative;\n}\n#addProgram .programName .inputArea .w5c-error {\n  right: -345px;\n  top: 8px;\n  color: #eb607a;\n  position: absolute;\n}\n#addProgram .programName .form-control {\n  width: 230px;\n  float: left;\n}\n#addProgram .programName .saveBtn {\n  float: left;\n}\n#addProgram .programName .saveBtn .btnSubmit {\n  height: 24px;\n  width: 24px;\n  margin-right: 5px;\n  padding: 0;\n  background: #eceeef;\n  border: 0;\n  margin-top: 6px;\n}\n#addProgram .programName .saveBtn .btnSubmit .done {\n  color: #5d88df;\n}\n#addProgram .programName .saveBtn .btnSubmit .wrong {\n  color: #eb607a;\n}\n#addProgram .programName .saveBtn .btnSubmit1 {\n  height: 24px;\n  width: 24px;\n  margin-right: 5px;\n  padding: 0;\n  background: #eceeef;\n  border: 0;\n  margin-top: 6px;\n}\n#addProgram .programName .saveBtn .btnSubmit1 .done {\n  color: #5d88df;\n}\n#addProgram .programName .saveBtn .btnSubmit1 .wrong {\n  color: #eb607a;\n}\n#addProgram .programName form .form-group {\n  padding-top: 0px;\n}\n#addProgram .programName form .form-group label {\n  float: left;\n  font: 12px '\\5FAE\\8F6F\\96C5\\9ED1';\n  color: #6d7290;\n  line-height: 33px;\n  margin-left: 10px;\n}\n#addProgram .programName form .form-group .inputArea {\n  padding-left: 15px;\n  float: left;\n  width: 400px;\n  height: 33px;\n}\n#addProgram .programName form .form-group .inputArea .w5c-error {\n  left: 525px;\n  top: 15px;\n  color: #eb607a;\n  position: relative;\n}\n#addProgram .programName form .form-group .inputArea input {\n  width: 300px;\n}\n#addProgram .programName form .form-group .inputArea label {\n  margin-right: 10px;\n  margin-left: 10px;\n}\n#addProgram .programName form .form-group .saveBtn button {\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n  margin-left: 20px;\n  width: 80px;\n  height: 34px;\n  background-color: #4e8bd6;\n  border: 0;\n  -webkit-border-radius: 5px 5px;\n  -moz-border-radius: 5px 5px;\n  border-radius: 5px 5px;\n}\n#addProgram .programName form .form-group .saveBtn button:hover {\n  background-color: #467dc0;\n}\n#addProgram .programName form .form-group .saveBtn span {\n  padding-left: 20px;\n  color: #eb6100;\n}\n#addProgram .proCtrlWrap {\n  width: 100%;\n  background-color: #fff;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n#addProgram .proCtrlWrap .proLeft {\n  width: 22%;\n  border-right: 1px solid #eaeff0;\n}\n#addProgram .proCtrlWrap .proLeft .MaterialCtrl {\n  margin: 20px 0 0;\n}\n#addProgram .proCtrlWrap .proLeft .MaterialCtrl .searchGroup {\n  margin: 10px 30px;\n}\n#addProgram .proCtrlWrap .proLeft .MaterialCtrl .searchGroup input {\n  width: 100%;\n}\n#addProgram .proCtrlWrap .proLeft .footBtnGroup {\n  width: 100%;\n  overflow: hidden;\n}\n#addProgram .proCtrlWrap .proLeft .footBtnGroup .cancelChoose {\n  width: 55%;\n  height: 50px;\n  line-height: 50px;\n  float: left;\n  text-indent: 30px;\n  color: #f6911a;\n  cursor: pointer;\n  background-color: #fff3e4;\n}\n#addProgram .proCtrlWrap .proLeft .footBtnGroup .importMedia {\n  width: 45%;\n  height: 50px;\n  line-height: 50px;\n  float: right;\n  text-align: center;\n  color: #fff;\n  cursor: pointer;\n  background-color: #f6911a;\n}\n#addProgram .proCtrlWrap .proRight {\n  width: 78%;\n  padding: 30px;\n  background-color: #fff;\n}\n#addProgram .proCtrlWrap .proRight .programTable {\n  border-radius: 2px;\n  background-color: #ffffff;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table {\n  font: 12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td:nth-child(1) {\n  width: 5%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td:nth-child(2) {\n  width: 15%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td:nth-child(3) {\n  width: 30%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td:nth-child(4) {\n  width: 15%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td:nth-child(5) {\n  width: 25%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table thead tr td:nth-child(6) {\n  width: 10%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .i-checks input:checked + i {\n  border-color: #f6911a;\n  background-color: #fff;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .i-checks input:checked + i:before {\n  background-color: #f6911a;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .edit {\n  display: none;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 15px 15px;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td .text {\n  text-align: center;\n  color: #28241f;\n  border-radius: 2px;\n  border: 1px solid #c4c8cc;\n  width: 100px;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td .text:focus {\n  border: 1px solid #74b2fe;\n  box-shadow: 0 0 5px #74b2fe;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .newCheckbox {\n  width: 0.5% !important;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td:nth-child(1) {\n  width: 5%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td:nth-child(2) {\n  width: 15%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td:nth-child(3) {\n  width: 30%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td:nth-child(4) {\n  width: 15%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td:nth-child(5) {\n  width: 25%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr td:nth-child(6) {\n  width: 10%;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .tableDirName .dataName {\n  display: block;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn .dropdown-toggle {\n  box-shadow: none;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn .dropdown-menu {\n  top: 43px;\n  left: -50px;\n  min-width: 94px;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n  border: 0 none !important;\n  border-radius: 0;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn .dropdown-menu .btn-group {\n  perspective: 400px;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  font-size: 13px;\n  color: #889098;\n  padding: 10px 26px;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody tr .operateBtn li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .selectedTr {\n  background-color: #fff3e4;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .selectedTr td {\n  border-bottom: 1px solid #fff;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#addProgram .proCtrlWrap .proRight .programTable .table tbody .editTr .edit {\n  display: block;\n}\n", ""]);

// exports


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#roleList .btn.active,\n#roleList .btn:active {\n  box-shadow: none;\n}\n#roleList .fr {\n  float: right;\n}\n#roleList .fl {\n  float: left;\n}\n#roleList .roleCtrlGroup {\n  padding-bottom: 30px;\n}\n#roleList .roleCtrlGroup .managers {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  float: left;\n  overflow: hidden;\n  border-radius: 2px;\n}\n#roleList .roleCtrlGroup .managers i {\n  padding: 5px;\n}\n#roleList .roleCtrlGroup .managers .manager {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#roleList .roleCtrlGroup .managers .manager:nth-of-type(1):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#roleList .roleCtrlGroup .managers .chengyuan {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n}\n#roleList .roleCtrlGroup .searchGroup {\n  position: relative;\n}\n#roleList .roleCtrlGroup .searchGroup i {\n  position: absolute;\n  top: 9px;\n  left: 8px;\n}\n#roleList .roleCtrlGroup .searchGroup input {\n  width: 198px;\n  height: 37px;\n  border: 1px solid #c4c8cc;\n  background-color: rgba(0, 0, 0, 0);\n  padding-left: 30px;\n}\n#roleList .roleCtrlGroup .uploadMedia {\n  width: 128px;\n  margin-left: 20px;\n  cursor: pointer;\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#roleList .roleCtrlGroup .uploadMedia:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#roleList .roleCtrlList {\n  background: #fff;\n  width: 100%;\n  box-shadow: 0 0 20px #d6d4d0;\n  min-width: 1100px;\n}\n@media only screen and (min-width: 1661px) {\n  #roleList .roleCtrlList .roleItem {\n    width: 12.5%;\n  }\n}\n@media only screen and (min-width: 1441px) and (max-width: 1660px) {\n  #roleList .roleCtrlList .roleItem {\n    width: 16.666%;\n  }\n}\n@media only screen and (max-width: 1441px) {\n  #roleList .roleCtrlList .roleItem {\n    width: 20%;\n  }\n}\n#roleList .roleCtrlList .roleItem {\n  border-right: 1px solid #e6e9ec;\n  border-bottom: 1px solid #e6e9ec;\n  height: 124px;\n  position: relative;\n}\n#roleList .roleCtrlList .roleItem .addRole {\n  display: block;\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n#roleList .roleCtrlList .roleItem .plus {\n  position: absolute;\n  transform: translate(-50%, -50%);\n  top: 50%;\n  left: 50%;\n  background: url(" + escape(__webpack_require__(138)) + ") no-repeat;\n  width: 75px;\n  height: 75px;\n}\n#roleList .roleCtrlList .roleItem .itemContain {\n  width: 77%;\n  height: 60px;\n  position: absolute;\n  transform: translate(-50%, -50%);\n  top: 50%;\n  left: 50%;\n}\n#roleList .roleCtrlList .roleItem .itemContain .name {\n  position: absolute;\n  left: 0;\n  top: 0;\n  color: #28241f;\n  font-size: 14px;\n  font-weight: 600;\n}\n#roleList .roleCtrlList .roleItem .itemContain .time {\n  color: #9e9e9e;\n  font-size: 12px;\n  position: absolute;\n  top: 3px;\n  right: 0;\n}\n#roleList .roleCtrlList .roleItem .itemContain .number {\n  color: #9e9e9e;\n  font-size: 12px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n}\n#roleList .roleCtrlList .roleItem .itemContain .number i {\n  font-size: 16px;\n  color: #f6911a;\n}\n#roleList .roleCtrlList .roleItem .itemContain div {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n}\n#roleList .roleCtrlList .roleItem .itemContain div i {\n  color: #4095fe;\n  margin-left: 14px;\n  font-size: 16px;\n}\n#roleList .roleCtrlList .roleItem .del {\n  position: absolute;\n  right: 10px;\n  top: 10px;\n  font-size: 12px;\n}\n#roleList .roleCtrlList .roleItem .del i {\n  font-size: 12px;\n  color: #fff;\n}\n#roleList .roleCtrlList .roleItem .i-checks {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n}\n#roleList .roleCtrlList .roleItem .i-checks i {\n  width: 12px;\n  height: 12px;\n  border: 0;\n}\n#roleList .roleCtrlList .roleItem .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: #fff;\n}\n#roleList .roleCtrlList .roleItem .i-checks input:checked + i {\n  border-color: #fff;\n}\n#roleList .roleCtrlList .selectedDiv {\n  background: #f6911a;\n  box-shadow: 0px 9px 10px 0px rgba(246, 145, 26, 0.27);\n  border-bottom: 0;\n  border-right: 1px solid #fff;\n}\n#roleList .roleCtrlList .selectedDiv .i-checks > i {\n  background-color: #f6911a;\n  border: 1px solid #fff;\n}\n#roleList .roleCtrlList .selectedDiv i,\n#roleList .roleCtrlList .selectedDiv a,\n#roleList .roleCtrlList .selectedDiv span {\n  color: #fff !important;\n}\n#roleList .roleCtrlList .itemCtrl:hover {\n  background: #f6911a;\n  box-shadow: 0px 9px 10px 0px rgba(246, 145, 26, 0.27);\n  border-bottom: 0;\n}\n#roleList .roleCtrlList .itemCtrl:hover .i-checks input:checked + i:before {\n  background-color: #fff;\n  border: 1px solid #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .i-checks input:checked + i {\n  border: 1px solid #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .i-checks > i {\n  background-color: #f6911a;\n  border: 1px solid #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .number {\n  color: #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .number i {\n  color: #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .name {\n  color: #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .time {\n  color: #fff;\n}\n#roleList .roleCtrlList .itemCtrl:hover .iconfont {\n  color: #fff;\n}\n#roleList .roleCtrlList .icon-btn {\n  cursor: pointer;\n}\n#addPermission {\n  font-family: '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n#addPermission .backBtn {\n  -webkit-border-radius: 5px 5px;\n  -moz-border-radius: 5px 5px;\n  border-radius: 5px 5px;\n  font: 14px '\\5FAE\\8F6F\\96C5\\9ED1';\n}\n#addPermission .addPermissionForm {\n  border-radius: 10px 10px;\n  overflow: hidden;\n}\n#addPermission .addPermissionForm .panel-body {\n  padding: 0px;\n}\n#addPermission .addPermissionForm .panel-body .editProName {\n  line-height: 18px;\n  height: 38px;\n}\n#addPermission .addPermissionForm .panel-body .editProName span {\n  display: inline-block;\n  color: #889098;\n  font: 18px \"\\5FAE\\8F6F\\96C5\\9ED1\";\n}\n#addPermission .addPermissionForm .panel-body .editProName i {\n  font-size: 16px;\n  color: #f6911a;\n  cursor: pointer;\n}\n#addPermission .addPermissionForm .panel-body .RMform .btn-info:active {\n  background-color: #4e8bd6;\n  border: 0;\n}\n#addPermission .addPermissionForm .panel-body .RMform .btn:active,\n#addPermission .addPermissionForm .panel-body .RMform .btn.active {\n  box-shadow: 0 0 0 #4e8bd6;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName {\n  padding-left: 5px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .inputArea {\n  height: 38px;\n  margin-right: 20px;\n  float: left;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .inputArea .w5c-error {\n  line-height: 32px;\n  color: #eb607a;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .form-control {\n  width: 230px;\n  float: left;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn {\n  float: left;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn .btnSubmit {\n  height: 24px;\n  width: 24px;\n  margin-right: 5px;\n  padding: 0;\n  background: #eceeef;\n  border: 0;\n  margin-top: 6px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn .btnSubmit .done {\n  color: #5d88df;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn .btnSubmit .wrong {\n  color: #eb607a;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn .btnSubmit1 {\n  height: 24px;\n  width: 24px;\n  margin-right: 5px;\n  padding: 0;\n  background: #eceeef;\n  border: 0;\n  margin-top: 6px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn .btnSubmit1 .done {\n  color: #5d88df;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName .saveBtn .btnSubmit1 .wrong {\n  color: #eb607a;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group {\n  padding-top: 0px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group label {\n  float: left;\n  font: 12px '\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD';\n  color: #6d7290;\n  line-height: 33px;\n  margin-left: 10px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .inputArea {\n  padding-left: 15px;\n  float: left;\n  width: 400px;\n  height: 33px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .inputArea .w5c-error {\n  left: 525px;\n  top: 15px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .inputArea input {\n  width: 300px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .inputArea label {\n  margin-right: 10px;\n  margin-left: 10px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .saveBtn button {\n  font-family: '\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD';\n  margin-left: 20px;\n  width: 80px;\n  height: 34px;\n  background-color: #4e8bd6;\n  border: 0;\n  -webkit-border-radius: 5px 5px;\n  -moz-border-radius: 5px 5px;\n  border-radius: 5px 5px;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .saveBtn button:hover {\n  background-color: #467dc0;\n}\n#addPermission .addPermissionForm .panel-body .RMform .permissionName form .form-group .saveBtn span {\n  padding-left: 20px;\n  color: #eb6100;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel {\n  border: 0;\n  margin-top: 10px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .col-lg-12 {\n  padding: 0;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body {\n  padding: 0;\n  border: 0;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .permissionClass {\n  position: relative;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body ul {\n  width: 36%;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body ul li {\n  background-color: #e0e4ef;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body ul li a {\n  border: 0;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body ul .active {\n  background-color: #fff;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container {\n  border: 0;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .active a:hover,\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .active a:focus {\n  border: 0;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .checkGroupChild {\n  margin-left: 46px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .checkGroupChild .group {\n  float: left;\n  margin-right: 30px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .checkGroupChild .group .i-checks > span {\n  margin-left: 10px;\n  font-weight: 500;\n  color: #28241f;\n  font-size: 12px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab {\n  padding-left: 10px;\n  margin-bottom: -10px;\n  margin-top: 25px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks > span {\n  margin-left: 10px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .warp {\n  padding: 0px;\n  margin-bottom: 30px;\n  overflow: hidden;\n  background: #fff;\n  height: 120px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .warp .titleStyle {\n  margin-top: 30px;\n  margin-left: 30px;\n  font: 700 14px '\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD';\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .warp .checkGroup {\n  padding: 10px 15px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks > i {\n  width: 12px;\n  height: 12px;\n  border-radius: 2px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .i-checks input:checked + i {\n  border-color: #f6911a;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .permissionTab .iconfont {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  background: #ffe8cb;\n  text-align: center;\n  line-height: 25px;\n  border-radius: 3px;\n  color: #f6911a;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .personTab .title {\n  margin: 0px -5px 5px;\n  padding: 0;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .personTab .checkGroup {\n  padding: 10px 15px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .modal-footer {\n  top: -83px;\n  right: 18px;\n  border: 0;\n  position: absolute;\n  width: 400px;\n  height: 45px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn {\n  position: absolute;\n  width: 400px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn .btn {\n  float: right;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn button {\n  width: 140px;\n  height: 38px;\n  background-color: #fff;\n  color: #f6911a;\n  font-size: 14px;\n  box-shadow: 0 0 15px #ddd;\n  border: 0;\n  padding: 0;\n  -webkit-border-radius: 5px 5px;\n  -moz-border-radius: 5px 5px;\n  border-radius: 5px 5px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn .btnCancel {\n  color: #889098;\n  float: right;\n  margin-right: 20px;\n  line-height: 38px;\n  text-align: center;\n  border: 1px solid #c4c8cc;\n  background: #eceeef;\n  display: inline-block;\n  width: 100px;\n  height: 38px;\n  border-radius: 0px;\n}\n#addPermission .addPermissionForm .panel-body .addPermissionPanel .panel-body .tab-container .modal-footer .saveBtn .btnCancel:hover {\n  border: 1px solid #f6911a;\n  color: #f6911a;\n  background-color: #fff;\n}\n#addMemberList .member-header {\n  overflow: hidden;\n}\n#addMemberList .member-header .head-return {\n  color: #f6911a;\n  cursor: pointer;\n}\n#addMemberList .member-header .head-name {\n  color: #889098;\n  font-size: 18px;\n}\n#addMemberList .member-header .head-name i {\n  color: #f6911a;\n  font-size: 18px;\n}\n#addMemberList .member-header .managers {\n  height: 38px;\n  float: left;\n  overflow: hidden;\n  border-radius: 2px;\n}\n#addMemberList .member-header .managers i {\n  padding: 5px;\n}\n#addMemberList .member-header .managers .manager {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#addMemberList .member-header .managers .manager:hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n}\n#addMemberList .member-header .managers .chengyuan {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#addMemberList .member-header .header-right {\n  float: right;\n  height: 38px;\n  width: 350px;\n  line-height: 38px;\n}\n#addMemberList .member-header .header-right .search {\n  width: 198px;\n  height: 38px;\n  float: left;\n  color: #889098;\n  border: 1px solid #889098;\n  border-radius: 1px;\n  margin-right: 20px;\n  overflow: hidden;\n}\n#addMemberList .member-header .header-right .search i {\n  padding: 5px;\n  cursor: pointer;\n}\n#addMemberList .member-header .header-right .search .search-box {\n  height: 34px;\n  width: 160px;\n  border: none;\n  background-color: #eceeef;\n}\n#addMemberList .member-header .header-right .delete {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  float: left;\n  background-color: #fff;\n  color: #f6911a;\n  text-align: center;\n  cursor: pointer;\n}\n#addMemberList .member-header .header-right .delete i {\n  padding: 5px;\n}\n#addMemberList .member-lists .add-member {\n  width: 250px;\n  height: 145px;\n  background-color: #fff;\n  border-radius: 2px;\n  position: relative;\n  margin-top: 40px;\n  margin-right: 40px;\n  float: left;\n}\n#addMemberList .member-lists .add-member .circle {\n  border-radius: 50%;\n  width: 76px;\n  height: 76px;\n  background-color: #ffe8cb;\n  margin: 35px 88px;\n  position: absolute;\n  cursor: pointer;\n}\n#addMemberList .member-lists .add-member .circle .h {\n  position: absolute;\n  margin-left: 21px;\n  width: 32px;\n  height: 5px;\n  border-radius: 5px;\n  top: 48%;\n  background-color: #f4af55;\n}\n#addMemberList .member-lists .add-member .circle .v {\n  position: absolute;\n  margin-left: 34px;\n  width: 5px;\n  height: 32px;\n  border-radius: 5px;\n  top: 30%;\n  background-color: #f4af55;\n}\n#addMemberList .member-lists .selected-card {\n  background-color: #f6911a !important;\n  color: #fff !important;\n}\n#addMemberList .member-lists .member-card {\n  width: 250px;\n  height: 145px;\n  background-color: #fff;\n  border-radius: 2px;\n  float: left;\n  margin-right: 40px;\n  margin-top: 40px;\n  position: relative;\n}\n#addMemberList .member-lists .member-card:hover {\n  background-color: #f6911a;\n  color: #fff;\n}\n#addMemberList .member-lists .member-card:hover .edit {\n  color: #fff;\n}\n#addMemberList .member-lists .member-card:hover .level {\n  color: #fff;\n}\n#addMemberList .member-lists .member-card .i-checks i {\n  width: 12px;\n  height: 12px;\n  left: 10px;\n  border-radius: 2px;\n  top: 5px;\n  border: 1px solid #fff;\n}\n#addMemberList .member-lists .member-card .i-checks input:checked + i {\n  border-color: #f6911a;\n  background-color: #fff;\n}\n#addMemberList .member-lists .member-card .i-checks input:checked + i:before {\n  width: 6px;\n  height: 6px;\n  top: 2px;\n  left: 2px;\n  border-radius: 50%;\n  background-color: #f6911a;\n}\n#addMemberList .member-lists .member-card .first-name {\n  position: absolute;\n  border-radius: 50%;\n  width: 48px;\n  height: 48px;\n  top: -23px;\n  left: 102px;\n  background-color: #ffe8cb;\n  cursor: pointer;\n}\n#addMemberList .member-lists .member-card .first-name span {\n  width: 48px;\n  height: 48px;\n  line-height: 48px;\n  text-align: center;\n  display: inline-block;\n  color: #f4af55;\n  font-size: 15px;\n  font-weight: bolder;\n}\n#addMemberList .member-lists .member-card .close-icon {\n  position: absolute;\n  right: 10px;\n  top: 10px;\n  font-size: 10px;\n  cursor: pointer;\n  color: #fff;\n}\n#addMemberList .member-lists .member-card p {\n  padding: 0;\n  margin: 0;\n}\n#addMemberList .member-lists .member-card .name {\n  margin-top: 20px;\n  font-size: 14px;\n  font-weight: bolder;\n  text-align: center;\n  cursor: pointer;\n  margin-bottom: 20px;\n}\n#addMemberList .member-lists .member-card .level {\n  font-size: 12px;\n  margin-top: 6px;\n  text-align: center;\n  cursor: pointer;\n  color: #9e9e9e;\n}\n#addMemberList .member-lists .member-card .email {\n  font-size: 12px;\n  margin-top: 6px;\n  text-indent: 36px;\n  cursor: pointer;\n}\n#addMemberList .member-lists .member-card .department {\n  font-size: 12px;\n  margin-top: 6px;\n  text-indent: 36px;\n  cursor: pointer;\n  margin-bottom: 10px;\n}\n#addMemberList .member-lists .member-card .edit {\n  position: absolute;\n  bottom: 25px;\n  right: 25px;\n  width: 20px;\n  height: 20px;\n  color: #4095fe;\n  cursor: pointer;\n}\n#addRoleMemberModal {\n  width: 550px;\n  padding: 20px 20px;\n}\n#addRoleMemberModal .optiscroll-h {\n  display: none !important;\n}\n#addRoleMemberModal .optiscroll-h .optiscroll-htrack {\n  display: none !important;\n}\n#addRoleMemberModal .memLeft {\n  border-right: 1px solid #e6e9ec;\n  width: 240px;\n  height: 450px;\n  padding: 0 20px;\n  float: left;\n}\n#addRoleMemberModal .memLeft .searchGroup i {\n  top: 10px;\n  cursor: pointer;\n}\n#addRoleMemberModal .memLeft .input {\n  width: 200px;\n  height: 40px;\n  border-radius: 4px;\n  margin-bottom: 20px;\n}\n#addRoleMemberModal .memLeft .memList {\n  width: 200px;\n  height: 390px;\n  overflow: hidden;\n}\n#addRoleMemberModal .memLeft .memList .roleItem {\n  height: 40px;\n  width: 200px;\n  margin-bottom: 10px;\n}\n#addRoleMemberModal .memLeft .memList .roleItem .i-checks {\n  float: right;\n  margin-top: 10px;\n  width: 12px;\n  height: 12px;\n}\n#addRoleMemberModal .memLeft .memList .roleItem .i-checks input,\n#addRoleMemberModal .memLeft .memList .roleItem .i-checks input[type=\"radio\"],\n#addRoleMemberModal .memLeft .memList .roleItem .i-checks input[type=\"checkbox\"] {\n  display: none;\n}\n#addRoleMemberModal .memLeft .memList .roleItem .i-checks input:checked + i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n  background-color: #f6911a;\n}\n#addRoleMemberModal .memLeft .memList .roleItem .i-checks > i {\n  width: 12px;\n  height: 12px;\n  border: 1px solid #f6911a;\n}\n#addRoleMemberModal .memLeft .memList .roleItem .email {\n  font-size: 10px;\n  color: #b0afad;\n}\n#addRoleMemberModal .memLeft .memList .roleItem span {\n  float: left;\n  width: 180px;\n}\n#addRoleMemberModal .memright {\n  float: right;\n  width: 270px;\n  height: 450px;\n  padding: 0 20px;\n}\n#addRoleMemberModal .memright .head {\n  height: 40px;\n  line-height: 40px;\n  color: #889098;\n  margin-bottom: 20px;\n}\n#addRoleMemberModal .memright .memberList {\n  height: 340px;\n}\n#addRoleMemberModal .memright .memberList .roleItem {\n  float: left;\n  width: 100px;\n  margin-right: 15px;\n  margin-bottom: 10px;\n  background: #f4f4f4;\n  height: 30px;\n  border: 1px solid #e6e9ec;\n}\n#addRoleMemberModal .memright .memberList .roleItem .name {\n  color: #28241f;\n  float: left;\n  line-height: 30px;\n  text-indent: 8px;\n  font-size: 12px;\n}\n#addRoleMemberModal .memright .memberList .roleItem a {\n  float: right;\n  margin-top: 4px;\n  margin-right: 5px;\n}\n#addRoleMemberModal .memright .memberList .roleItem a i {\n  font-size: 12px;\n  color: #d2d2d2;\n}\n#addRoleMemberModal .memright .add {\n  height: 40px;\n  width: 100px;\n  margin-left: 25px;\n  background: #f6911a;\n  font-size: 14px;\n  color: #fff;\n  line-height: 40px;\n  text-align: center;\n  border-radius: 4px;\n  display: block;\n  float: left;\n  margin-right: 20px;\n}\n#addRoleMemberModal .memright .cancel {\n  height: 40px;\n  width: 65px;\n  background: #fff;\n  font-size: 14px;\n  color: #889098;\n  line-height: 40px;\n  text-align: center;\n  border-radius: 4px;\n  border: 1px solid #889098;\n  display: block;\n  float: left;\n}\n", ""]);

// exports


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#sendList #scroll {\n  overflow: hidden;\n  height: 300px;\n}\n#sendList #uploadList {\n  overflow: hidden;\n  height: 300px;\n}\n#sendList .mediaCtrlGroup {\n  padding-bottom: 30px;\n}\n#sendList .mediaCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#sendList .mediaCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#sendList .mediaCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n#sendList .mediaCtrlGroup .dropdown-menu {\n  top: 64px;\n  left: -74px;\n  min-width: 130px;\n  border: 0 none !important;\n  border-radius: 0;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#sendList .mediaCtrlGroup .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#sendList .mediaCtrlGroup .dropdown-menu:before .btn-group {\n  perspective: 400px;\n}\n#sendList .mediaCtrlGroup li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#sendList .mediaCtrlGroup li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  padding: 8px 35px;\n  font-size: 13px;\n  color: #889098;\n}\n#sendList .mediaCtrlGroup li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#sendList .mediaListCtrl {\n  position: relative;\n}\n#sendList .mediaListCtrl .mediaTable {\n  padding: 10px 30px;\n  border-radius: 2px;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.21);\n}\n#sendList .mediaListCtrl .mediaTable .table {\n  font: 12px \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td {\n  text-align: center;\n  padding: 20px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr .theadCheckBox {\n  width: 50px;\n  border-bottom: 1px solid #eaeff0;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(1) {\n  width: 5%;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(2) {\n  width: 20%;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(3) {\n  width: 20%;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(4) {\n  width: 10%;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(5) {\n  width: 10%;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(6) {\n  width: 15%;\n}\n#sendList .mediaListCtrl .mediaTable .table thead tr td:nth-child(7) {\n  width: 20%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .edit {\n  display: none;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 15px 15px;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td .iconfont {\n  vertical-align: middle;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td .blue {\n  color: #4296fe;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td .yellow {\n  color: #f9b15d;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .newCheckbox {\n  width: 0.5% !important;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(1) {\n  width: 5%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(2) {\n  width: 20%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(3) {\n  width: 20%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(4) {\n  width: 10%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(5) {\n  width: 10%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(6) {\n  width: 15%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr td:nth-child(7) {\n  width: 20%;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .newInput {\n  width: 100% !important;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .tableDirName .dataName {\n  display: block;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .tbodyCheckBox {\n  border-bottom: 1px solid #fff;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropBtn {\n  border: 0;\n  background: #fff;\n  width: 31px;\n  padding: 0;\n  text-align: center;\n  color: #4095fe;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .disableBtn i {\n  color: #6f6a64;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-toggle {\n  box-shadow: none;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu {\n  top: 43px;\n  left: -50px;\n  min-width: 94px;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n  border: 0 none !important;\n  border-radius: 0;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu .btn-group {\n  perspective: 400px;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  font-size: 13px;\n  color: #889098;\n  padding: 10px 30px;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody tr .operateBtn li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .selectedTr {\n  background-color: #fff3e4;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .selectedTr td {\n  border-bottom: 1px solid #fff;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .selectedTr .i-checks input:checked + i {\n  border-color: #f6911a;\n  background-color: #fff3e4;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .selectedTr .i-checks input:checked + i:before {\n  background-color: #f6911a;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#sendList .mediaListCtrl .mediaTable .table tbody .editTr .edit {\n  display: block;\n}\n#rejectRequestModal {\n  font-family: \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n  border-radius: 4px;\n  padding: 30px;\n  overflow: hidden;\n}\n#rejectRequestModal p {\n  margin-bottom: 15px;\n  margin-top: 30px;\n}\n#rejectRequestModal .form-control {\n  border-color: #e6e9ec;\n  box-shadow: none;\n}\n#rejectRequestModal .rejectArea {\n  height: 75px;\n  width: 100%;\n  border-color: #e6e9ec;\n  border-radius: 4px;\n  resize: none;\n}\n#rejectRequestModal .num {\n  text-align: right;\n  margin-bottom: 20px;\n  font-size: 12px;\n}\n#rejectRequestModal .modal-footer {\n  width: 100%;\n  margin-top: 35px;\n}\n#rejectRequestModal .btnSubmit {\n  float: right;\n  margin-left: 20px;\n  height: 40px;\n  width: 70px;\n  border-radius: 3px;\n  border: 1px solid #c3c8cb;\n  color: #889098;\n  line-height: 40px;\n  font-size: 14px;\n  text-align: center;\n}\n#rejectRequestModal .btnSubmit:hover {\n  background: #f6911a;\n  border: 1px solid #f6911a;\n  color: #fff;\n  box-shadow: 0 0 5px #c3c8cb;\n}\n#rejectRequestModal .error {\n  border: 1px solid #f05858;\n}\n#rejectRequestModal .w5c-error {\n  color: #f05858;\n}\n#videoMask {\n  display: none;\n}\n#video {\n  display: none;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  padding-bottom: 10px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  z-index: 1090;\n}\n#video .videoPic {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  left: 0;\n  background: #000;\n}\n#video .videoPic img {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n#video .video-body {\n  width: 920px;\n  height: 600px;\n  padding: 10px;\n  background: #fff;\n  margin: 0 auto;\n  margin-top: 80px;\n  box-shadow: 0 0 10px #210c0e;\n  border-radius: 4px;\n  position: relative;\n}\n#video .video-body .closePlay {\n  position: absolute;\n  top: -30px;\n  right: -30px;\n  height: 30px;\n  width: 30px;\n  background: #fff;\n  border-radius: 50%;\n  padding: 1px 8px;\n}\n#video .video-body .closePlay i {\n  line-height: 30px;\n  color: #9299a1;\n}\n#video .video-body .closePlay:hover {\n  background: #f6911a;\n}\n#video .video-body .closePlay:hover i {\n  color: #fff;\n}\n#video .video-js .vjs-big-play-button {\n  color: #332e29;\n  background: #fff;\n  border-radius: 50%;\n  border: 0;\n  line-height: 2em;\n  height: 2em;\n  width: 2em;\n}\n#video .videoList {\n  width: 100%;\n  margin-top: 35px;\n  position: relative;\n}\n#video .videoList .videoListInfo {\n  width: 92%;\n  position: absolute;\n  overflow: hidden;\n  left: 50%;\n  transform: translate(-50%, 0);\n}\n#video .videoList .videoListInfo .tempWrap {\n  margin: 0 auto;\n}\n#video .videoList .btnLeft {\n  float: left;\n  margin-top: 20px;\n  width: 3%;\n  height: 160px;\n  background: #fff;\n  color: #f6911a;\n  text-align: center;\n  line-height: 160px;\n  border-radius: 3px;\n}\n#video .videoList .btnLeft i {\n  font-size: 30px;\n}\n#video .videoList .btnRight {\n  float: right;\n  position: relative;\n}\n#video .picScroll-left .prevStop i {\n  color: #c0c0c0;\n}\n#video .picScroll-left .nextStop i {\n  color: #c0c0c0;\n}\n#video .picScroll-left .bd ul {\n  overflow: hidden;\n  zoom: 1;\n}\n#video .picScroll-left .bd ul li {\n  margin-left: 20px;\n  margin-right: 20px;\n  float: left;\n  _display: inline;\n  overflow: hidden;\n  text-align: center;\n  position: relative;\n}\n#video .picScroll-left .bd ul li .playBtn {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: #332e29;\n  border-radius: 50%;\n  height: 20px;\n  width: 20px;\n}\n#video .picScroll-left .bd ul li .playBtn i {\n  color: #fff;\n  font-size: 26px;\n  line-height: 24px;\n  margin-left: -2px;\n}\n#video .picScroll-left .bd ul li .pic {\n  text-align: center;\n  background: #000;\n}\n#video .picScroll-left .bd ul li .pic img {\n  width: 250px;\n  height: 160px;\n  display: block;\n  border-radius: 3px;\n}\n#video .vjs-paused .vjs-big-play-button {\n  display: block;\n}\n#addSendTAsk {\n  min-width: 1122px !important;\n}\n#addSendTAsk .sendCtrlGroup {\n  padding-bottom: 30px;\n}\n#addSendTAsk .sendCtrlGroup .mediaBtn {\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  font: 14px \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n  border: 1px solid #c4c8cc;\n  margin-left: 22px;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#addSendTAsk .sendCtrlGroup .mediaBtn:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0 0 10px #d6d4d0;\n}\n#addSendTAsk .sendCtrlGroup .uploadMedia {\n  color: #f6911a;\n  border-color: #f6911a;\n}\n#addSendTAsk .sendCtrlGroup .return {\n  float: left;\n  font-size: 12px;\n  color: #f6911a;\n  line-height: 66px;\n}\n#addSendTAsk .list1 {\n  width: 260px;\n  float: left;\n  margin-right: 40px;\n}\n#addSendTAsk .list1 td:nth-child(1) {\n  width: 4% !important;\n}\n#addSendTAsk .list1 td:nth-child(2) {\n  width: 96% !important;\n}\n#addSendTAsk .list2 {\n  float: left;\n  min-width: 480px !important;\n}\n#addSendTAsk .list2 .proTable .table tbody tr td {\n  text-align: left;\n  padding-left: 3px;\n}\n#addSendTAsk .list3 {\n  width: 300px;\n  float: left;\n  margin-left: 40px;\n}\n#addSendTAsk .list3 .radioGroup {\n  width: 100%;\n  clear: both;\n  margin-bottom: 30px;\n}\n#addSendTAsk .list3 .radioGroup label {\n  color: #28241f;\n  font-size: 12px;\n  font-weight: normal;\n}\n#addSendTAsk .list3 .radioGroup i {\n  width: 12px;\n  height: 12px;\n}\n#addSendTAsk .list3 .radioGroup i:before {\n  top: 2px;\n  left: 2px;\n  width: 6px;\n  height: 6px;\n}\n#addSendTAsk .list3 .timeCtrl {\n  width: 100%;\n  margin-bottom: 20px;\n  height: 40px;\n}\n#addSendTAsk .list3 .dateFromCtrl {\n  width: 110px;\n  height: 40px;\n  float: left;\n  margin-right: 20px;\n}\n#addSendTAsk .list3 .dateFromCtrl .input-group-addon {\n  padding: 6px 6px;\n  font-size: 14px;\n  color: #4496ff;\n  background: #fff;\n  border: 0px;\n  position: absolute;\n  z-index: 10;\n  right: 15px;\n  top: 2px;\n}\n#addSendTAsk .list3 .dateFromCtrl .input-group-addon:hover {\n  cursor: pointer;\n}\n#addSendTAsk .list3 .dateFromCtrl .form-control {\n  padding: 6px 8px;\n  font-size: 14px;\n  border-radius: 2px;\n  box-shadow: none;\n}\n#addSendTAsk .list3 .timeFrom {\n  width: 45px;\n  margin-right: 0;\n}\n#addSendTAsk .list3 .timeFrom .input-group-addon {\n  font-size: 14px;\n  color: #4496ff;\n  background: #fff;\n  border: 0px;\n  position: absolute;\n  z-index: 10;\n  right: 17px;\n  top: 3px;\n  padding: 6px 0;\n}\n#addSendTAsk .list3 .timeline {\n  color: #6e6d6a;\n  text-align: center;\n  line-height: 35px;\n  font-weight: 600;\n  float: left;\n  width: 20px;\n}\n#addSendTAsk .sendListCtrl {\n  background-color: #fff;\n  position: relative;\n}\n#addSendTAsk .sendListCtrl .list-head1 {\n  position: absolute;\n  top: -21px;\n  left: -1px;\n  width: 145px;\n  height: 50px;\n  background: url(" + escape(__webpack_require__(131)) + ");\n}\n#addSendTAsk .sendListCtrl .list-head2 {\n  position: absolute;\n  top: -21px;\n  left: -1px;\n  width: 145px;\n  height: 50px;\n  background: url(" + escape(__webpack_require__(132)) + ");\n}\n#addSendTAsk .sendListCtrl .list-head3 {\n  position: absolute;\n  top: -21px;\n  left: -1px;\n  width: 145px;\n  height: 50px;\n  background: url(" + escape(__webpack_require__(133)) + ");\n}\n#addSendTAsk .sendListCtrl .proTable {\n  padding: 40px 30px;\n  box-shadow: 0 0 20px #d6d4d0;\n}\n#addSendTAsk .sendListCtrl .proTable .searchGroup {\n  color: #889098;\n}\n#addSendTAsk .sendListCtrl .proTable .searchGroup input {\n  width: 100%;\n  height: 36px;\n}\n#addSendTAsk .sendListCtrl .proTable .selectGroup {\n  width: 100%;\n  height: 38px;\n}\n#addSendTAsk .sendListCtrl .proTable .selectGroup .selectSquare {\n  width: 120px;\n  height: 36px;\n  margin-left: 10px;\n}\n#addSendTAsk .sendListCtrl .proTable .selectGroup .selectSquare .input-sm {\n  width: 120px;\n  height: 36px;\n  line-height: 36px;\n  border: 1px solid #cfd3d6;\n  border-radius: 2px;\n}\n#addSendTAsk .sendListCtrl .proTable .selectGroup .searchGroup input {\n  width: 160px;\n}\n#addSendTAsk .sendListCtrl .proTable .table {\n  font: 12px \"\\3A2\\FFFD\\FFFD\\FFFD\\17A\\FFFD\";\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr {\n  transition: all 0.2s ease-in-out 0s;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .edit {\n  display: none;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr td {\n  text-align: center;\n  vertical-align: baseline;\n  padding: 20px 10px;\n  border: 0;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr td:nth-child(1) {\n  width: 5%;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr td:nth-child(2) {\n  width: 32.5%;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr td:nth-child(3) {\n  width: 32.5%;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr td:nth-child(4) {\n  width: 15%;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr td:nth-child(5) {\n  width: 15%;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .dirName {\n  width: 324px;\n  color: #28241f;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .dirName .icon-gougou {\n  color: #6b92e2;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .dirName .icon-cuowu {\n  color: #f0869a;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .tableDirName .dataName {\n  display: block;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .tableDirName .typeIcon {\n  vertical-align: middle;\n  display: inline-block;\n  width: 26px;\n  height: 26px;\n  background: url(" + escape(__webpack_require__(3)) + ") no-repeat;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn {\n  width: 120px;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn a i {\n  font-size: 18px;\n  color: #4095fe;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn .dropdown-toggle {\n  box-shadow: none;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu {\n  min-width: 95px;\n  top: 43px;\n  left: -50px;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu .btn-group {\n  perspective: 400px;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu .btn-group button {\n  border: 0;\n  background: #fff;\n  width: 31px;\n  padding: 0;\n  text-align: center;\n  color: #4095fe;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn .dropdown-menu:before {\n  z-index: -1;\n  content: '';\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  position: absolute;\n  top: -11px;\n  right: 10px;\n  transform: rotate(45deg);\n  border-top: 1px solid #c4c8cc;\n  border-left: 1px solid #c4c8cc;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn li:hover {\n  transform: translateZ(-14px) scale(1);\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn li a {\n  position: relative;\n  transform-style: preserve-3d;\n  transition: 0.2s;\n  font-size: 13px;\n  color: #889098;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody tr .operateBtn li a:hover {\n  transform: translateZ(14px) scale(1.1);\n  background-color: #f6911a !important;\n  color: #fff;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody .dirInput {\n  width: 230px;\n  height: 20px;\n  border: 1px solid #74b2fe;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody .editTr .dataName {\n  display: none !important;\n}\n#addSendTAsk .sendListCtrl .proTable .table tbody .editTr .edit {\n  display: block;\n}\n", ""]);

// exports


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#memberList .member-header {\n  overflow: hidden;\n  margin-bottom: 20px;\n}\n#memberList .member-header .managers {\n  cursor: pointer;\n  height: 38px;\n  width: 256px;\n  float: left;\n  overflow: hidden;\n  border-radius: 2px;\n}\n#memberList .member-header .managers i {\n  padding: 5px;\n}\n#memberList .member-header .managers .manager {\n  width: 128px;\n  height: 38px;\n  line-height: 38px;\n  font-size: 14px;\n  float: left;\n  text-align: center;\n  background-color: #fff;\n  color: #889098;\n}\n#memberList .member-header .managers .manager:nth-of-type(2):hover {\n  color: #fff;\n  background-color: #6f6a64;\n  border-right: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#memberList .member-header .managers .chengyuan {\n  color: #fff;\n  background-color: #6f6a64;\n  border-left: 2px solid #f6911a;\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#memberList .member-header .header-right {\n  float: right;\n  height: 38px;\n  width: 350px;\n  line-height: 38px;\n  height: 45px;\n}\n#memberList .member-header .header-right .search {\n  width: 198px;\n  height: 36px;\n  float: left;\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  border-radius: 2px;\n  margin-right: 20px;\n  overflow: hidden;\n  border-width: 1px;\n  position: relative;\n}\n#memberList .member-header .header-right .search i {\n  padding: 5px;\n}\n#memberList .member-header .header-right .search .search-box {\n  height: 34px;\n  width: 160px;\n  border: none;\n  position: absolute;\n  background-color: #eceeef;\n}\n#memberList .member-header .header-right .delete {\n  width: 128px;\n  height: 36px;\n  line-height: 36px;\n  float: left;\n  background-color: #fff;\n  color: #f6911a;\n  text-align: center;\n  border-radius: 2px;\n  cursor: pointer;\n  background-color: rgba(0, 0, 0, 0);\n  color: #889098;\n  border: 1px solid #c4c8cc;\n  transition: box-shadow 0.3s ease-in-out 0s, width 0.3s ease-in-out 0s;\n}\n#memberList .member-header .header-right .delete:hover {\n  background-color: #fff;\n  color: #f6911a;\n  border: 1px solid rgba(0, 0, 0, 0);\n  box-shadow: 0px 0px 10px 0px rgba(119, 97, 71, 0.2);\n}\n#memberList .member-header .header-right .delete i {\n  padding: 5px;\n}\n#memberList .member-lists .add-member {\n  width: 250px;\n  height: 200px;\n  background-color: #fff;\n  border-radius: 2px;\n  position: relative;\n  margin-top: 40px;\n  margin-right: 40px;\n  float: left;\n  box-shadow: 0px 5px 10px 0px rgba(183, 168, 151, 0.21);\n}\n#memberList .member-lists .add-member:hover {\n  background-color: #f6911a;\n  box-shadow: 0px 9px 10px 0px rgba(246, 145, 26, 0.27);\n}\n#memberList .member-lists .add-member .circle {\n  border-radius: 50%;\n  width: 76px;\n  height: 76px;\n  background-color: #ffe8cb;\n  margin: 60px 88px;\n  position: absolute;\n  cursor: pointer;\n}\n#memberList .member-lists .add-member .circle .h {\n  position: absolute;\n  margin-left: 21px;\n  width: 32px;\n  height: 5px;\n  border-radius: 5px;\n  top: 48%;\n  background-color: #f4af55;\n}\n#memberList .member-lists .add-member .circle .v {\n  position: absolute;\n  margin-left: 34px;\n  width: 5px;\n  height: 32px;\n  border-radius: 5px;\n  top: 30%;\n  background-color: #f4af55;\n}\n#memberList .member-lists .selected-card {\n  color: #fff !important;\n  background-color: #f6911a !important;\n  box-shadow: 0px 9px 10px 0px rgba(246, 145, 26, 0.27) !important;\n}\n#memberList .member-lists .selected-card .level {\n  color: #fff!important;\n}\n#memberList .member-lists .selected-card i {\n  color: #fff!important;\n}\n#memberList .member-lists .member-card {\n  width: 250px;\n  height: 200px;\n  background-color: #fff;\n  border-radius: 2px;\n  float: left;\n  margin-right: 40px;\n  margin-top: 40px;\n  position: relative;\n  box-shadow: 0px 5px 10px 0px rgba(183, 168, 151, 0.21);\n}\n#memberList .member-lists .member-card:hover {\n  background-color: #f6911a;\n  color: #fff;\n}\n#memberList .member-lists .member-card:hover .edit {\n  color: #fff;\n}\n#memberList .member-lists .member-card:hover .level {\n  color: #fff;\n}\n#memberList .member-lists .member-card .i-checks i {\n  visibility: hidden;\n  width: 12px;\n  height: 12px;\n  left: 10px;\n  top: 5px;\n  border-radius: 2px;\n  background-color: #f6911a;\n  border: 1px solid #fff;\n}\n#memberList .member-lists .member-card .i-checks input:checked + i {\n  border-color: #fff;\n  background-color: #f6911a;\n}\n#memberList .member-lists .member-card .i-checks input:checked + i:before {\n  width: 6px;\n  height: 6px;\n  top: 2px;\n  left: 2px;\n  background-color: #fff;\n  border-radius: 50%;\n}\n#memberList .member-lists .member-card .first-name {\n  position: absolute;\n  border-radius: 50%;\n  width: 48px;\n  height: 48px;\n  top: -23px;\n  left: 102px;\n  background-color: #ffe8cb;\n  cursor: pointer;\n}\n#memberList .member-lists .member-card .first-name span {\n  width: 48px;\n  height: 48px;\n  line-height: 48px;\n  text-align: center;\n  display: inline-block;\n  color: #f4af55;\n  font-size: 15px;\n  font-weight: bolder;\n}\n#memberList .member-lists .member-card .close-icon {\n  position: absolute;\n  right: 10px;\n  top: 10px;\n  font-size: 10px;\n  display: none;\n  cursor: pointer;\n}\n#memberList .member-lists .member-card p {\n  padding: 0;\n  margin: 0;\n}\n#memberList .member-lists .member-card .name {\n  margin-top: 36px;\n  font-size: 14px;\n  font-weight: bolder;\n  text-align: center;\n  cursor: pointer;\n}\n#memberList .member-lists .member-card .level {\n  font-size: 12px;\n  margin-top: 6px;\n  text-align: center;\n  cursor: pointer;\n  color: #9e9e9e;\n}\n#memberList .member-lists .member-card .email {\n  font-size: 12px;\n  margin-top: 6px;\n  text-indent: 36px;\n  cursor: pointer;\n}\n#memberList .member-lists .member-card .department {\n  font-size: 12px;\n  margin-top: 6px;\n  text-indent: 36px;\n  cursor: pointer;\n}\n#memberList .member-lists .member-card .edit {\n  position: absolute;\n  bottom: 25px;\n  right: 25px;\n  width: 20px;\n  height: 20px;\n  color: #4095fe;\n  cursor: pointer;\n  font-size: 18px;\n}\n#memberModel {\n  width: 418px;\n  height: auto;\n  background-color: #fff;\n  margin: 30px 50px;\n}\n#memberModel .input-class {\n  height: 36px;\n  line-height: 30px;\n  margin-top: 15px;\n  margin-bottom: 5px;\n  position: relative;\n}\n#memberModel .input-class select {\n  width: 276px;\n  display: inline-block;\n}\n#memberModel .input-class label {\n  width: 70px;\n  color: #889098;\n  font-size: 12px;\n  font-weight: normal;\n}\n#memberModel .input-class input {\n  width: 276px;\n  border: none;\n  font-size: 12px;\n  color: #28241f;\n  border-bottom: 1px solid #e6e9ec;\n}\n#memberModel .input-class .error {\n  border-bottom: 1px solid #eb5e7b;\n  background: url(" + escape(__webpack_require__(7)) + ") no-repeat;\n  background-position: right;\n}\n#memberModel .input-class .w5c-error {\n  z-index: 9999;\n  position: absolute;\n  right: 40px;\n  top: 38px;\n  height: 30px;\n  padding: 0 10px;\n  line-height: 30px;\n  color: #fff;\n  background-color: #eb5e7b;\n  border-radius: 4px;\n}\n#memberModel .button-bottom {\n  overflow: hidden;\n  padding-bottom: 5px;\n}\n#memberModel .button-bottom .addMember {\n  float: right;\n  padding: 10px 20px;\n  color: #fff;\n  margin-top: 30px;\n  margin-right: 20px;\n  border: none;\n  border-radius: 2px;\n  background-color: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n}\n#memberModel .button-bottom .cancel {\n  float: right;\n  padding: 10px 20px;\n  margin-right: 68px;\n  margin-top: 30px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  right: 40px;\n  background-color: #fff;\n  color: #889098;\n}\n#memberModel .button-bottom .cancel:hover {\n  background: #f6911a;\n  box-shadow: 0px 2px 8px 0px rgba(158, 114, 62, 0.28);\n  color: #fff;\n  border: 1px solid #f6911a;\n}\n.modal-backdrop.in {\n  opacity: 0.2!important;\n  color: #332e29!important;\n  background-color: #332e29!important;\n}\n.modal-content {\n  border-radius: 2px!important;\n  background-color: #ffffff;\n  box-shadow: 0px 5px 18px 0px rgba(119, 97, 71, 0.35) !important;\n}\n", ""]);

// exports


/***/ }),
/* 120 */,
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/* \n\n*/\nhtml {\n  background-color: #f0f3f4;\n}\nbody {\n  font-family: \"Source Sans Pro\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  -webkit-font-smoothing: antialiased;\n  line-height: 1.42857143;\n  color: #58666e;\n  background-color: transparent;\n}\n*:focus {\n  outline: 0 !important;\n}\n.h1,\n.h2,\n.h3,\n.h4,\n.h5,\n.h6 {\n  margin: 0;\n}\na {\n  color: #363f44;\n  text-decoration: none;\n  cursor: pointer;\n}\na:hover,\na:focus {\n  color: #141719;\n  text-decoration: none;\n}\nlabel {\n  font-weight: normal;\n}\nsmall,\n.small {\n  font-size: 13px;\n}\n.badge,\n.label {\n  font-weight: bold;\n  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n}\n.badge.bg-light,\n.label.bg-light {\n  text-shadow: none;\n}\n.badge {\n  background-color: #cfdadd;\n}\n.badge.up {\n  position: relative;\n  top: -10px;\n  padding: 3px 6px;\n  margin-left: -10px;\n}\n.badge-sm {\n  padding: 2px 5px !important;\n  font-size: 85%;\n}\n.label-sm {\n  padding-top: 0;\n  padding-bottom: 1px;\n}\n.badge-white {\n  padding: 2px 6px;\n  background-color: transparent;\n  border: 1px solid rgba(255, 255, 255, 0.35);\n}\n.badge-empty {\n  color: inherit;\n  background-color: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n}\nblockquote {\n  border-color: #dee5e7;\n}\n.caret-white {\n  border-top-color: #fff;\n  border-top-color: rgba(255, 255, 255, 0.65);\n}\na:hover .caret-white {\n  border-top-color: #fff;\n}\n.thumbnail {\n  border-color: #dee5e7;\n}\n.progress {\n  background-color: #edf1f2;\n}\n.progress-xxs {\n  height: 2px;\n}\n.progress-xs {\n  height: 6px;\n}\n.progress-sm {\n  height: 12px;\n}\n.progress-sm .progress-bar {\n  font-size: 10px;\n  line-height: 1em;\n}\n.progress,\n.progress-bar {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.progress-bar-primary {\n  background-color: #7266ba;\n}\n.progress-bar-info {\n  background-color: #23b7e5;\n}\n.progress-bar-success {\n  background-color: #27c24c;\n}\n.progress-bar-warning {\n  background-color: #fad733;\n}\n.progress-bar-danger {\n  background-color: #f05050;\n}\n.progress-bar-black {\n  background-color: #1c2b36;\n}\n.progress-bar-white {\n  background-color: #fff;\n}\n.accordion-group,\n.accordion-inner {\n  border-color: #dee5e7;\n  border-radius: 2px;\n}\n.alert {\n  font-size: 13px;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.alert .close i {\n  display: block;\n  font-size: 12px;\n  font-weight: normal;\n}\n.form-control {\n  border-color: #cfdadd;\n  border-radius: 2px;\n}\n.form-control,\n.form-control:focus {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.form-control:focus {\n  border-color: #23b7e5;\n}\n.form-horizontal .control-label.text-left {\n  text-align: left;\n}\n.form-control-spin {\n  position: absolute;\n  top: 50%;\n  right: 10px;\n  z-index: 2;\n  margin-top: -7px;\n}\n.input-lg {\n  height: 45px;\n}\n.input-group-addon {\n  background-color: #edf1f2;\n  border-color: #cfdadd;\n}\n.list-group {\n  border-radius: 2px;\n}\n.list-group.no-radius .list-group-item {\n  border-radius: 0 !important;\n}\n.list-group.no-borders .list-group-item {\n  border: none;\n}\n.list-group.no-border .list-group-item {\n  border-width: 1px 0;\n}\n.list-group.no-bg .list-group-item {\n  background-color: transparent;\n}\n.list-group-item {\n  padding-right: 15px;\n  border-color: #e7ecee;\n}\na.list-group-item:hover,\na.list-group-item:focus,\na.list-group-item.hover {\n  background-color: #f6f8f8;\n}\n.list-group-item.media {\n  margin-top: 0;\n}\n.list-group-item.active {\n  color: #fff;\n  background-color: #23b7e5 !important;\n  border-color: #23b7e5 !important;\n}\n.list-group-item.active .text-muted {\n  color: #ace4f5 !important;\n}\n.list-group-item.active a {\n  color: #fff;\n}\n.list-group-item.focus {\n  background-color: #e4eaec !important;\n}\n.list-group-item.select {\n  position: relative;\n  z-index: 1;\n  background-color: #dbeef9 !important;\n  border-color: #c5e4f5;\n}\n.list-group-alt .list-group-item:nth-child(2n+2) {\n  background-color: rgba(0, 0, 0, 0.02) !important;\n}\n.list-group-lg .list-group-item {\n  padding-top: 15px;\n  padding-bottom: 15px;\n}\n.list-group-sm .list-group-item {\n  padding: 6px 10px;\n}\n.list-group-sp .list-group-item {\n  margin-bottom: 5px;\n  border-radius: 3px;\n}\n.list-group-item > .badge {\n  margin-right: 0;\n}\n.list-group-item > .fa-chevron-right {\n  float: right;\n  margin-top: 4px;\n  margin-right: -5px;\n}\n.list-group-item > .fa-chevron-right + .badge {\n  margin-right: 5px;\n}\n.nav-pills.no-radius > li > a {\n  border-radius: 0;\n}\n.nav-pills > li.active > a {\n  color: #fff !important;\n  background-color: #23b7e5;\n}\n.nav-pills > li.active > a:hover,\n.nav-pills > li.active > a:active {\n  background-color: #19a9d5;\n}\n.nav > li > a:hover,\n.nav > li > a:focus {\n  background-color: #f6f8f8;\n}\n.nav.nav-lg > li > a {\n  padding: 20px 20px;\n}\n.nav.nav-md > li > a {\n  padding: 15px 15px;\n}\n.nav.nav-sm > li > a {\n  padding: 6px 12px;\n}\n.nav.nav-xs > li > a {\n  padding: 4px 10px;\n}\n.nav.nav-xxs > li > a {\n  padding: 1px 10px;\n}\n.nav.nav-rounded > li > a {\n  border-radius: 20px;\n}\n.nav .open > a,\n.nav .open > a:hover,\n.nav .open > a:focus {\n  background-color: #f6f8f8;\n}\n.nav-tabs {\n  border-color: #dee5e7;\n}\n.nav-tabs > li > a {\n  border-bottom-color: #dee5e7;\n  border-radius: 2px 2px 0 0;\n}\n.nav-tabs > li:hover > a,\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:hover {\n  border-color: #dee5e7;\n}\n.nav-tabs > li.active > a {\n  border-bottom-color: #fff !important;\n}\n.nav-tabs-alt .nav-tabs.nav-justified > li {\n  display: table-cell;\n  width: 1%;\n}\n.nav-tabs-alt .nav-tabs > li > a {\n  background: transparent !important;\n  border-color: transparent !important;\n  border-bottom-color: #dee5e7 !important;\n  border-radius: 0;\n}\n.nav-tabs-alt .nav-tabs > li.active > a {\n  border-bottom-color: #23b7e5 !important;\n}\n.tab-container {\n  margin-bottom: 15px;\n}\n.tab-container .tab-content {\n  padding: 15px;\n  background-color: #fff;\n  border: 1px solid #dee5e7;\n  border-top-width: 0;\n  border-radius: 0 0 2px 2px;\n}\n.pagination > li > a {\n  border-color: #dee5e7;\n}\n.pagination > li > a:hover,\n.pagination > li > a:focus {\n  background-color: #edf1f2;\n  border-color: #dee5e7;\n}\n.panel {\n  border-radius: 2px;\n}\n.panel .accordion-toggle {\n  display: block;\n  font-size: 14px;\n  cursor: pointer;\n}\n.panel .list-group-item {\n  border-color: #edf1f2;\n}\n.panel.no-borders {\n  border-width: 0;\n}\n.panel.no-borders .panel-heading,\n.panel.no-borders .panel-footer {\n  border-width: 0;\n}\n.panel-heading {\n  border-radius: 2px 2px 0 0;\n}\n.panel-default .panel-heading {\n  background-color: #f6f8f8;\n}\n.panel-heading.no-border {\n  margin: -1px -1px 0 -1px;\n  border: none;\n}\n.panel-heading .nav {\n  margin: -10px -15px;\n}\n.panel-heading .list-group {\n  background: transparent;\n}\n.panel-footer {\n  background-color: #ffffff;\n  border-color: #edf1f2;\n  border-radius: 0 0 2px 2px;\n}\n.panel-default {\n  border-color: #dee5e7;\n}\n.panel-default > .panel-heading,\n.panel-default > .panel-footer {\n  border-color: #edf1f2;\n}\n.panel-group .panel-heading + .panel-collapse .panel-body {\n  border-top: 1px solid #eaedef;\n}\n.table > tbody > tr > td,\n.table > tfoot > tr > td {\n  padding: 8px 15px;\n  border-bottom: 1px solid #eaeff0;\n  border-top: 0;\n}\n.table > thead > tr > th {\n  padding: 8px 15px;\n  border-bottom: 1px solid #eaeff0;\n}\n.table-bordered {\n  border-color: #eaeff0;\n}\n.table-bordered > tbody > tr > td {\n  border-color: #eaeff0;\n}\n.table-bordered > thead > tr > th {\n  border-color: #eaeff0;\n}\n.table-striped > tbody > tr:nth-child(odd) > td,\n.table-striped > tbody > tr:nth-child(odd) > th {\n  /*background-color: #fafbfc;*/\n}\n.table-striped > thead > th {\n  background-color: #fafbfc;\n  border-right: 1px solid #eaeff0;\n}\n.table-striped > thead > th:last-child {\n  border-right: none;\n}\n.well,\npre {\n  background-color: #edf1f2;\n  border-color: #dee5e7;\n}\n.dropdown-menu {\n  border: 1px solid #dee5e7;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 2px;\n  -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\n}\n.dropdown-menu.pull-left {\n  left: 100%;\n}\n.dropdown-menu > .panel {\n  margin: -5px 0;\n  border: none;\n}\n.dropdown-menu > li > a {\n  padding: 5px 15px;\n}\n.dropdown-menu > li > a:hover,\n.dropdown-menu > li > a:focus,\n.dropdown-menu > .active > a,\n.dropdown-menu > .active > a:hover,\n.dropdown-menu > .active > a:focus {\n  color: #141719;\n  background-color: #edf1f2 !important;\n  background-image: none;\n  filter: none;\n}\n.dropdown-header {\n  padding: 5px 15px;\n}\n.dropdown-submenu {\n  position: relative;\n}\n.dropdown-submenu:hover > a,\n.dropdown-submenu:focus > a {\n  color: #58666e;\n  background-color: #edf1f2 !important;\n}\n.dropdown-submenu:hover > .dropdown-menu,\n.dropdown-submenu:focus > .dropdown-menu {\n  display: block;\n}\n.dropdown-submenu.pull-left {\n  float: none !important;\n}\n.dropdown-submenu.pull-left > .dropdown-menu {\n  left: -100%;\n  margin-left: 10px;\n}\n.dropdown-submenu .dropdown-menu {\n  top: 0;\n  left: 100%;\n  margin-top: -6px;\n  margin-left: -1px;\n}\n.dropup .dropdown-submenu > .dropdown-menu {\n  top: auto;\n  bottom: 0;\n}\n.btn-group > .btn {\n  margin-left: -1px;\n}\n/*cols*/\n.col-lg-2-4 {\n  position: relative;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px;\n}\n.col-0 {\n  clear: left;\n}\n.row.no-gutter {\n  margin-right: 0;\n  margin-left: 0;\n}\n.no-gutter [class*=\"col\"] {\n  padding: 0;\n}\n.row-sm {\n  margin-right: -10px;\n  margin-left: -10px;\n}\n.row-sm > div {\n  padding-right: 10px;\n  padding-left: 10px;\n}\n.modal-backdrop {\n  background-color: #3a3f51;\n}\n.modal-backdrop.in {\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n.modal-over {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.modal-center {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n/*layout*/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  overflow-x: hidden;\n}\n.app {\n  position: relative;\n  width: 100%;\n  height: auto;\n  min-height: 100%;\n}\n.app:before {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: -1;\n  display: block;\n  width: inherit;\n  background-color: #f0f3f4;\n  border: inherit;\n  content: \"\";\n}\n.app-header-fixed {\n  padding-top: 58px;\n}\n.app-header-fixed .app-header {\n  position: fixed;\n  top: 0;\n  width: 100%;\n}\n.app-header {\n  z-index: 1025;\n  border-radius: 0;\n}\n.app-aside {\n  float: left;\n}\n.app-aside:before {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: -1;\n  width: inherit;\n  background-color: inherit;\n  border: inherit;\n  content: \"\";\n}\n.app-aside-footer {\n  position: absolute;\n  bottom: 0;\n  z-index: 1000;\n  width: 100%;\n  max-width: 200px;\n}\n.app-aside-folded .app-aside-footer {\n  max-width: 60px;\n}\n.app-aside-footer ~ div {\n  padding-bottom: 50px;\n}\n.app-aside-right {\n  padding-bottom: 50px;\n}\n.app-content {\n  height: 100%;\n}\n.app-content:before,\n.app-content:after {\n  display: table;\n  content: \" \";\n}\n.app-content:after {\n  clear: both;\n}\n.app-content-full {\n  position: absolute;\n  top: 50px;\n  bottom: 50px;\n  width: auto !important;\n  height: auto;\n  padding: 0 !important;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.app-content-full.h-full {\n  bottom: 0;\n  height: auto;\n}\n.app-content-body {\n  float: left;\n  width: 100%;\n  padding-bottom: 50px;\n}\n.app-footer {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1005;\n}\n.app-footer.app-footer-fixed {\n  position: fixed;\n}\n.hbox {\n  display: table;\n  width: 100%;\n  height: 100%;\n  border-spacing: 0;\n  table-layout: fixed;\n}\n.hbox .col {\n  display: table-cell;\n  float: none;\n  height: 100%;\n  vertical-align: top;\n}\n.v-middle {\n  vertical-align: middle !important;\n}\n.v-top {\n  vertical-align: top !important;\n}\n.v-bottom {\n  vertical-align: bottom !important;\n}\n.vbox {\n  position: relative;\n  display: table;\n  width: 100%;\n  height: 100%;\n  min-height: 240px;\n  border-spacing: 0;\n}\n.vbox .row-row {\n  display: table-row;\n  height: 100%;\n}\n.vbox .row-row .cell {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.ie .vbox .row-row .cell {\n  display: table-cell;\n}\n.vbox .row-row .cell .cell-inner {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.navbar {\n  margin: 0;\n  border-width: 0;\n  border-radius: 0;\n}\n.navbar .navbar-form-sm {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.navbar-md {\n  min-height: 60px;\n}\n.navbar-md .navbar-btn {\n  margin-top: 13px;\n}\n.navbar-md .navbar-form {\n  margin-top: 15px;\n}\n.navbar-md .navbar-nav > li > a {\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n.navbar-md .navbar-brand {\n  line-height: 60px;\n}\n.navbar-header > button {\n  padding: 10px 17px;\n  font-size: 16px;\n  line-height: 30px;\n  text-decoration: none;\n  background-color: transparent;\n  border: none;\n}\n.navbar-brand {\n  display: inline-block;\n  float: none;\n  height: auto;\n  padding: 0 20px;\n  font-size: 20px;\n  font-weight: 700;\n  line-height: 50px;\n  text-align: center;\n}\n.navbar-brand:hover {\n  text-decoration: none;\n}\n.navbar-brand img {\n  max-height: 20px;\n  margin-top: -4px;\n  vertical-align: middle;\n}\n@media (min-width: 768px) {\n  .app-aside,\n  .navbar-header {\n    width: 200px;\n  }\n  .navbar-collapse,\n  .app-content,\n  .app-footer {\n    margin-left: 200px;\n  }\n  .app-aside-right {\n    position: absolute;\n    top: 50px;\n    right: 0;\n    bottom: 0;\n    z-index: 1000;\n  }\n  .app-aside-right.pos-fix {\n    z-index: 1010;\n  }\n  .visible-folded {\n    display: none;\n  }\n  .app-aside-folded .hidden-folded {\n    display: none !important;\n  }\n  .app-aside-folded .visible-folded {\n    display: inherit;\n  }\n  .app-aside-folded .text-center-folded {\n    text-align: center;\n  }\n  .app-aside-folded .pull-none-folded {\n    float: none !important;\n  }\n  .app-aside-folded .w-auto-folded {\n    width: auto;\n  }\n  .app-aside-folded .app-aside,\n  .app-aside-folded .navbar-header {\n    width: 75px;\n  }\n  .app-aside-folded .navbar-collapse,\n  .app-aside-folded .app-content,\n  .app-aside-folded .app-footer {\n    margin-left: 75px;\n  }\n  .app-aside-folded .navbar-collapse {\n    background-color: #fff;\n  }\n  .app-aside-folded .app-header .navbar-brand {\n    display: block;\n    padding: 0;\n  }\n  .app-aside-fixed .app-header .navbar-header {\n    position: fixed;\n  }\n  .app-aside-fixed .aside-wrap {\n    position: fixed;\n    top: 50px;\n    bottom: 0;\n    left: 0;\n    z-index: 1000;\n    width: 200px;\n    overflow: hidden;\n  }\n  .app-aside-fixed .aside-wrap .navi-wrap {\n    position: relative;\n    width: 217px;\n    height: 100%;\n    overflow-x: hidden;\n    overflow-y: scroll;\n    -webkit-overflow-scrolling: touch;\n  }\n  .app-aside-fixed .aside-wrap .navi-wrap::-webkit-scrollbar {\n    -webkit-appearance: none;\n  }\n  .app-aside-fixed .aside-wrap .navi-wrap::-webkit-scrollbar:vertical {\n    width: 17px;\n  }\n  .smart .app-aside-fixed .aside-wrap .navi-wrap {\n    width: 200px;\n  }\n  .app-aside-fixed.app-aside-folded .app-aside {\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    z-index: 1010;\n  }\n  .app-aside-fixed.app-aside-folded .aside-wrap {\n    width: 60px;\n  }\n  .app-aside-fixed.app-aside-folded .aside-wrap .navi-wrap {\n    width: 77px;\n  }\n  .smart .app-aside-fixed.app-aside-folded .aside-wrap .navi-wrap {\n    width: 60px;\n  }\n  .bg-auto:before {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    z-index: -1;\n    width: inherit;\n    background-color: inherit;\n    border: inherit;\n    content: \"\";\n  }\n  .bg-auto.b-l:before {\n    margin-left: -1px;\n  }\n  .bg-auto.b-r:before {\n    margin-right: -1px;\n  }\n  .col.show {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .hbox-auto-sm {\n    display: block;\n  }\n  .hbox-auto-sm > .col {\n    display: block;\n    width: auto;\n    height: auto;\n  }\n  .hbox-auto-sm > .col.show {\n    display: block !important;\n  }\n}\n@media (max-width: 767px) {\n  .app-aside {\n    float: none;\n  }\n  .app-content-full {\n    width: 100% !important;\n  }\n  .hbox-auto-xs {\n    display: block;\n  }\n  .hbox-auto-xs > .col {\n    display: block;\n    width: auto;\n    height: auto;\n  }\n  .navbar-nav {\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n  .navbar-nav > li > a {\n    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);\n  }\n  .navbar-nav > li > a .up {\n    top: 0;\n  }\n  .navbar-nav > li > a .avatar {\n    width: 30px;\n    margin-top: -5px;\n  }\n  .navbar-nav .open .dropdown-menu {\n    background-color: #fff;\n  }\n  .navbar-form {\n    margin-top: 0 !important;\n    margin-bottom: 0 !important;\n    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);\n  }\n  .navbar-form .form-group {\n    margin-bottom: 0;\n  }\n}\nhtml {\n  /*background: url('../img/bg.jpg');*/\n  background-color: #eceeef;\n  background-attachment: fixed;\n  background-size: cover;\n}\n.app.container {\n  padding-right: 0;\n  padding-left: 0;\n}\n@media (min-width: 768px) {\n  .app.container {\n    width: 750px;\n    -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);\n    box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);\n  }\n  .app.container .app-aside {\n    overflow-x: hidden;\n  }\n  .app.container.app-aside-folded .app-aside {\n    overflow-x: visible;\n  }\n  .app.container.app-aside-fixed .aside-wrap {\n    left: inherit;\n  }\n  .app.container.app-aside-fixed.app-aside-folded .app-aside > ul.nav {\n    position: absolute;\n  }\n  .app.container .app-header,\n  .app.container .app-aside {\n    max-width: 750px;\n  }\n  .app.container .app-footer-fixed {\n    right: auto;\n    left: auto;\n    width: 100%;\n    max-width: 550px;\n  }\n  .app.container.app-aside-folded .app-footer-fixed {\n    max-width: 690px;\n  }\n  .app.container.app-aside-dock .app-footer-fixed {\n    max-width: 750px;\n  }\n}\n@media (min-width: 992px) {\n  .app.container {\n    width: 970px;\n  }\n  .app.container .app-header,\n  .app.container .app-aside {\n    max-width: 970px;\n  }\n  .app.container .app-footer-fixed {\n    max-width: 770px;\n  }\n  .app.container.app-aside-folded .app-footer-fixed {\n    max-width: 910px;\n  }\n  .app.container.app-aside-dock .app-footer-fixed {\n    max-width: 970px;\n  }\n}\n@media (min-width: 1200px) {\n  .app.container {\n    width: 1170px;\n  }\n  .app.container .app-header,\n  .app.container .app-aside {\n    max-width: 1170px;\n  }\n  .app.container .app-footer-fixed {\n    max-width: 970px;\n  }\n  .app.container.app-aside-folded .app-footer-fixed {\n    max-width: 1110px;\n  }\n  .app.container.app-aside-dock .app-footer-fixed {\n    max-width: 1170px;\n  }\n}\n.nav-sub {\n  height: 0;\n  margin-left: -20px;\n  overflow: hidden;\n  opacity: 0;\n  -webkit-transition: all 0.2s ease-in-out 0s;\n  transition: all 0.2s ease-in-out 0s;\n}\n.active .nav-sub,\n.app-aside-folded li:hover .nav-sub,\n.app-aside-folded li:focus .nav-sub,\n.app-aside-folded li:active .nav-sub {\n  height: auto !important;\n  margin-left: 0;\n  overflow: auto;\n  opacity: 1;\n}\n.nav-sub-header {\n  display: none !important;\n}\n.nav-sub-header a {\n  padding: 15px 20px;\n}\n.navi ul.nav li {\n  position: relative;\n  display: block;\n}\n.navi ul.nav li li a {\n  padding-left: 55px;\n}\n.navi ul.nav li a {\n  position: relative;\n  display: block;\n  padding: 10px 20px;\n  font-weight: normal;\n  text-transform: none;\n  /*-webkit-transition: background-color 0.2s ease-in-out 0s;*/\n  /*transition: background-color 0.2s ease-in-out 0s;*/\n}\n.navi ul.nav li a .badge,\n.navi ul.nav li a .label {\n  padding: 2px 5px;\n  margin-top: 2px;\n  font-size: 11px;\n}\n.navi ul.nav li a > i {\n  position: relative;\n  float: left;\n  width: 40px;\n  margin: -10px -10px;\n  margin-right: 5px;\n  overflow: hidden;\n  line-height: 40px;\n  text-align: center;\n}\n.navi ul.nav li a > i:before {\n  position: relative;\n  z-index: 2;\n}\n@media (min-width: 768px) {\n  .app-aside-folded .nav-sub-header {\n    display: block !important;\n  }\n  .app-aside-folded .nav-sub-header a {\n    padding: 15px 20px !important;\n  }\n  .app-aside-folded .navi > ul > li > a {\n    position: relative;\n    height: 70px;\n    padding: 0;\n    text-align: center;\n    border: none;\n  }\n  .app-aside-folded .navi > ul > li > a span {\n    display: none;\n  }\n  .app-aside-folded .navi > ul > li > a span.pull-right {\n    display: none !important;\n  }\n  .app-aside-folded .navi > ul > li > a i {\n    display: block;\n    float: none;\n    width: auto;\n    margin: 0;\n    font-size: 26px;\n    line-height: 50px;\n    border: none !important;\n  }\n  .app-aside-folded .navi > ul > li > a i b {\n    left: 0 !important;\n  }\n  .app-aside-folded .navi > ul > li > a .badge,\n  .app-aside-folded .navi > ul > li > a .label {\n    position: absolute;\n    top: 8px;\n    right: 12px;\n    z-index: 3;\n  }\n  .app-aside-folded .navi > ul ul {\n    position: absolute;\n    top: 0 !important;\n    left: 100%;\n    z-index: 1050;\n    width: 200px;\n    height: 0 !important;\n    -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\n  }\n  .app-aside-folded .navi li li a {\n    padding-left: 20px !important;\n  }\n  .app-aside-folded.app-aside-fixed .app-aside > ul.nav {\n    position: fixed;\n    left: 80px;\n    z-index: 1010;\n    display: block;\n    width: 260px;\n    height: auto;\n    overflow: visible;\n    overflow-y: auto;\n    opacity: 1;\n    -webkit-overflow-scrolling: touch;\n  }\n  .app-aside-folded.app-aside-fixed .app-aside > ul.nav:before {\n    position: absolute;\n    top: 0;\n    left: -60px;\n    width: 60px;\n    height: 50px;\n    content: \"\";\n  }\n  .app-aside-folded.app-aside-fixed .app-aside > ul.nav a {\n    padding-right: 20px !important;\n    padding-left: 20px !important;\n  }\n}\n@media (max-width: 767px) {\n  .app {\n    overflow-x: hidden;\n  }\n  .app-content {\n    -webkit-transition: -webkit-transform 0.2s ease;\n    -moz-transition: -moz-transform 0.2s ease;\n    -o-transition: -o-transform 0.2s ease;\n    transition: transform 0.2s ease;\n  }\n  .off-screen {\n    position: absolute;\n    top: 50px;\n    bottom: 0;\n    z-index: 1010;\n    display: block !important;\n    width: 75%;\n    overflow-x: hidden;\n    overflow-y: auto;\n    visibility: visible;\n    -webkit-overflow-scrolling: touch;\n  }\n  .off-screen + * {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: 1015;\n    width: 100%;\n    padding-top: 50px;\n    overflow: hidden;\n    background-color: #f0f3f4;\n    -webkit-transform: translate3d(75%, 0, 0px);\n    transform: translate3d(75%, 0, 0px);\n    -webkit-transition: -webkit-transform 0.2s ease;\n    -moz-transition: -moz-transform 0.2s ease;\n    -o-transition: -o-transform 0.2s ease;\n    transition: transform 0.2s ease;\n    -webkit-backface-visibility: hidden;\n    -moz-backface-visibility: hidden;\n    backface-visibility: hidden;\n  }\n  .off-screen + * .off-screen-toggle {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: 1020;\n    display: block !important;\n  }\n  .off-screen.pull-right {\n    right: 0;\n  }\n  .off-screen.pull-right + * {\n    -webkit-transform: translate3d(-75%, 0, 0px);\n    transform: translate3d(-75%, 0, 0px);\n  }\n}\n@media (min-width: 992px) {\n  .app-aside-dock .app-content,\n  .app-aside-dock .app-footer {\n    margin-left: 0;\n  }\n  .app-aside-dock .app-aside-footer ~ div {\n    padding-bottom: 0;\n  }\n  .app-aside-dock.app-aside-fixed.app-header-fixed {\n    padding-top: 115px;\n  }\n  .app-aside-dock.app-aside-fixed .app-aside {\n    position: fixed;\n    top: 50px;\n    z-index: 1000;\n    width: 100%;\n  }\n  .app-aside-dock .app-aside,\n  .app-aside-dock .aside-wrap,\n  .app-aside-dock .navi-wrap {\n    position: relative;\n    top: 0;\n    float: none;\n    width: 100% !important;\n    overflow: visible !important;\n  }\n  .app-aside-dock .app-aside {\n    bottom: auto !important;\n  }\n  .app-aside-dock .app-aside.b-r {\n    border-bottom: 1px solid #dee5e7;\n    border-right-width: 0;\n  }\n  .app-aside-dock .app-aside:before {\n    display: none;\n  }\n  .app-aside-dock .app-aside nav > .nav {\n    float: left;\n  }\n  .app-aside-dock .app-aside .hidden-folded,\n  .app-aside-dock .app-aside .line,\n  .app-aside-dock .app-aside .navi-wrap > div {\n    display: none !important;\n  }\n  .app-aside-dock .app-aside .navi > ul > li {\n    position: relative;\n    display: inline-block;\n    float: left;\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a {\n    height: auto;\n    padding: 10px 15px 12px 15px;\n    text-align: center;\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a > .badge,\n  .app-aside-dock .app-aside .navi > ul > li > a > .label {\n    position: absolute;\n    top: 5px;\n    right: 8px;\n    padding: 1px 4px;\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a > i {\n    display: block;\n    float: none;\n    width: 40px;\n    margin-top: -10px;\n    margin-right: auto;\n    margin-bottom: -7px;\n    margin-left: auto;\n    font-size: 14px;\n    line-height: 40px;\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a > span.pull-right {\n    position: absolute;\n    bottom: 2px;\n    left: 50%;\n    display: block !important;\n    margin-left: -6px;\n    line-height: 1;\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a > span.pull-right i {\n    width: 12px;\n    font-size: 12px;\n    line-height: 12px;\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a > span.pull-right i.text {\n    line-height: 14px;\n    -webkit-transform: rotate(90deg);\n    -ms-transform: rotate(90deg);\n    transform: rotate(90deg);\n  }\n  .app-aside-dock .app-aside .navi > ul > li > a > span {\n    display: block;\n    font-weight: normal;\n  }\n  .app-aside-dock .app-aside .navi > ul > li .nav-sub {\n    position: absolute;\n    top: auto !important;\n    left: 0;\n    z-index: 1050;\n    display: none;\n    width: 200px;\n    height: auto !important;\n    -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\n  }\n  .app-aside-dock .app-aside .navi > ul > li .nav-sub-header {\n    display: none !important;\n  }\n  .app-aside-dock .app-aside .navi li li a {\n    padding-left: 15px;\n  }\n  .app-aside-dock .app-aside .navi li:hover .nav-sub,\n  .app-aside-dock .app-aside .navi li:focus .nav-sub,\n  .app-aside-dock .app-aside .navi li:active .nav-sub {\n    display: block;\n    height: auto !important;\n    margin-left: 0;\n    overflow: auto;\n    opacity: 1;\n  }\n}\n.arrow {\n  z-index: 10;\n  border-width: 9px;\n}\n.arrow,\n.arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.arrow:after {\n  border-width: 8px;\n  content: \"\";\n}\n.arrow.top {\n  top: -9px;\n  left: 50%;\n  margin-left: -9px;\n  border-bottom-color: rgba(0, 0, 0, 0.1);\n  border-top-width: 0;\n}\n.arrow.top:after {\n  top: 1px;\n  margin-left: -8px;\n  border-bottom-color: #ffffff;\n  border-top-width: 0;\n}\n.arrow.top.arrow-primary:after {\n  border-bottom-color: #7266ba;\n}\n.arrow.top.arrow-info:after {\n  border-bottom-color: #23b7e5;\n}\n.arrow.top.arrow-success:after {\n  border-bottom-color: #27c24c;\n}\n.arrow.top.arrow-danger:after {\n  border-bottom-color: #f05050;\n}\n.arrow.top.arrow-warning:after {\n  border-bottom-color: #fad733;\n}\n.arrow.top.arrow-light:after {\n  border-bottom-color: #edf1f2;\n}\n.arrow.top.arrow-dark:after {\n  border-bottom-color: #3a3f51;\n}\n.arrow.top.arrow-black:after {\n  border-bottom-color: #1c2b36;\n}\n.arrow.right {\n  top: 50%;\n  right: -9px;\n  margin-top: -9px;\n  border-left-color: rgba(0, 0, 0, 0.1);\n  border-right-width: 0;\n}\n.arrow.right:after {\n  right: 1px;\n  bottom: -8px;\n  border-left-color: #ffffff;\n  border-right-width: 0;\n}\n.arrow.right.arrow-primary:after {\n  border-left-color: #7266ba;\n}\n.arrow.right.arrow-info:after {\n  border-left-color: #23b7e5;\n}\n.arrow.right.arrow-success:after {\n  border-left-color: #27c24c;\n}\n.arrow.right.arrow-danger:after {\n  border-left-color: #f05050;\n}\n.arrow.right.arrow-warning:after {\n  border-left-color: #fad733;\n}\n.arrow.right.arrow-light:after {\n  border-left-color: #edf1f2;\n}\n.arrow.right.arrow-dark:after {\n  border-left-color: #3a3f51;\n}\n.arrow.right.arrow-black:after {\n  border-left-color: #1c2b36;\n}\n.arrow.bottom {\n  bottom: -9px;\n  left: 50%;\n  margin-left: -9px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n  border-bottom-width: 0;\n}\n.arrow.bottom:after {\n  bottom: 1px;\n  margin-left: -8px;\n  border-top-color: #ffffff;\n  border-bottom-width: 0;\n}\n.arrow.bottom.arrow-primary:after {\n  border-top-color: #7266ba;\n}\n.arrow.bottom.arrow-info:after {\n  border-top-color: #23b7e5;\n}\n.arrow.bottom.arrow-success:after {\n  border-top-color: #27c24c;\n}\n.arrow.bottom.arrow-danger:after {\n  border-top-color: #f05050;\n}\n.arrow.bottom.arrow-warning:after {\n  border-top-color: #fad733;\n}\n.arrow.bottom.arrow-light:after {\n  border-top-color: #edf1f2;\n}\n.arrow.bottom.arrow-dark:after {\n  border-top-color: #3a3f51;\n}\n.arrow.bottom.arrow-black:after {\n  border-top-color: #1c2b36;\n}\n.arrow.left {\n  top: 50%;\n  left: -9px;\n  margin-top: -9px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-left-width: 0;\n}\n.arrow.left:after {\n  bottom: -8px;\n  left: 1px;\n  border-right-color: #ffffff;\n  border-left-width: 0;\n}\n.arrow.left.arrow-primary:after {\n  border-right-color: #7266ba;\n}\n.arrow.left.arrow-info:after {\n  border-right-color: #23b7e5;\n}\n.arrow.left.arrow-success:after {\n  border-right-color: #27c24c;\n}\n.arrow.left.arrow-danger:after {\n  border-right-color: #f05050;\n}\n.arrow.left.arrow-warning:after {\n  border-right-color: #fad733;\n}\n.arrow.left.arrow-light:after {\n  border-right-color: #edf1f2;\n}\n.arrow.left.arrow-dark:after {\n  border-right-color: #3a3f51;\n}\n.arrow.left.arrow-black:after {\n  border-right-color: #1c2b36;\n}\n.arrow.pull-left {\n  left: 19px;\n}\n.arrow.pull-right {\n  right: 19px;\n  left: auto;\n}\n.arrow.pull-up {\n  top: 19px;\n}\n.arrow.pull-down {\n  top: auto;\n  bottom: 19px;\n}\n.btn {\n  font-weight: 500;\n  border-radius: 2px;\n  outline: 0!important;\n}\n.btn-link {\n  color: #58666e;\n}\n.btn-link.active {\n  box-shadow: none;\n  webkit-box-shadow: none;\n}\n.btn-default {\n  color: #58666e !important;\n  background-color: #fcfdfd;\n  background-color: #fff;\n  border-color: #dee5e7;\n  border-bottom-color: #d8e1e3;\n  -webkit-box-shadow: 0 1px 1px rgba(90, 90, 90, 0.1);\n  box-shadow: 0 1px 1px rgba(90, 90, 90, 0.1);\n}\n.btn-default:hover,\n.btn-default:focus,\n.btn-default:active,\n.btn-default.active,\n.open .dropdown-toggle.btn-default {\n  color: #58666e !important;\n  background-color: #edf1f2;\n  border-color: #c7d3d6;\n}\n.btn-default:active,\n.btn-default.active,\n.open .dropdown-toggle.btn-default {\n  background-image: none;\n}\n.btn-default.disabled,\n.btn-default[disabled],\nfieldset[disabled] .btn-default,\n.btn-default.disabled:hover,\n.btn-default[disabled]:hover,\nfieldset[disabled] .btn-default:hover,\n.btn-default.disabled:focus,\n.btn-default[disabled]:focus,\nfieldset[disabled] .btn-default:focus,\n.btn-default.disabled:active,\n.btn-default[disabled]:active,\nfieldset[disabled] .btn-default:active,\n.btn-default.disabled.active,\n.btn-default[disabled].active,\nfieldset[disabled] .btn-default.active {\n  background-color: #fcfdfd;\n  border-color: #dee5e7;\n}\n.btn-default.btn-bg {\n  border-color: rgba(0, 0, 0, 0.1);\n  background-clip: padding-box;\n}\n.btn-primary {\n  color: #ffffff !important;\n  background-color: #7266ba;\n  border-color: #7266ba;\n}\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  color: #ffffff !important;\n  background-color: #6254b2;\n  border-color: #5a4daa;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled,\n.btn-primary[disabled],\nfieldset[disabled] .btn-primary,\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled:active,\n.btn-primary[disabled]:active,\nfieldset[disabled] .btn-primary:active,\n.btn-primary.disabled.active,\n.btn-primary[disabled].active,\nfieldset[disabled] .btn-primary.active {\n  background-color: #7266ba;\n  border-color: #7266ba;\n}\n.btn-success {\n  color: #ffffff !important;\n  background-color: #27c24c;\n  border-color: #27c24c;\n}\n.btn-success:hover,\n.btn-success:focus,\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  color: #ffffff !important;\n  background-color: #23ad44;\n  border-color: #20a03f;\n}\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled,\n.btn-success[disabled],\nfieldset[disabled] .btn-success,\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled:active,\n.btn-success[disabled]:active,\nfieldset[disabled] .btn-success:active,\n.btn-success.disabled.active,\n.btn-success[disabled].active,\nfieldset[disabled] .btn-success.active {\n  background-color: #27c24c;\n  border-color: #27c24c;\n}\n.btn-info {\n  color: #ffffff !important;\n  background-color: #23b7e5;\n  border-color: #23b7e5;\n}\n.btn-info:hover,\n.btn-info:focus,\n.btn-info:active,\n.btn-info.active,\n.open .dropdown-toggle.btn-info {\n  color: #ffffff !important;\n  background-color: #19a9d5;\n  border-color: #189ec8;\n}\n.btn-info:active,\n.btn-info.active,\n.open .dropdown-toggle.btn-info {\n  background-image: none;\n}\n.btn-info.disabled,\n.btn-info[disabled],\nfieldset[disabled] .btn-info,\n.btn-info.disabled:hover,\n.btn-info[disabled]:hover,\nfieldset[disabled] .btn-info:hover,\n.btn-info.disabled:focus,\n.btn-info[disabled]:focus,\nfieldset[disabled] .btn-info:focus,\n.btn-info.disabled:active,\n.btn-info[disabled]:active,\nfieldset[disabled] .btn-info:active,\n.btn-info.disabled.active,\n.btn-info[disabled].active,\nfieldset[disabled] .btn-info.active {\n  background-color: #23b7e5;\n  border-color: #23b7e5;\n}\n.btn-warning {\n  color: #ffffff !important;\n  background-color: #fad733;\n  border-color: #fad733;\n}\n.btn-warning:hover,\n.btn-warning:focus,\n.btn-warning:active,\n.btn-warning.active,\n.open .dropdown-toggle.btn-warning {\n  color: #ffffff !important;\n  background-color: #f9d21a;\n  border-color: #f9cf0b;\n}\n.btn-warning:active,\n.btn-warning.active,\n.open .dropdown-toggle.btn-warning {\n  background-image: none;\n}\n.btn-warning.disabled,\n.btn-warning[disabled],\nfieldset[disabled] .btn-warning,\n.btn-warning.disabled:hover,\n.btn-warning[disabled]:hover,\nfieldset[disabled] .btn-warning:hover,\n.btn-warning.disabled:focus,\n.btn-warning[disabled]:focus,\nfieldset[disabled] .btn-warning:focus,\n.btn-warning.disabled:active,\n.btn-warning[disabled]:active,\nfieldset[disabled] .btn-warning:active,\n.btn-warning.disabled.active,\n.btn-warning[disabled].active,\nfieldset[disabled] .btn-warning.active {\n  background-color: #fad733;\n  border-color: #fad733;\n}\n.btn-danger {\n  color: #ffffff !important;\n  background-color: #f05050;\n  border-color: #f05050;\n}\n.btn-danger:hover,\n.btn-danger:focus,\n.btn-danger:active,\n.btn-danger.active,\n.open .dropdown-toggle.btn-danger {\n  color: #ffffff !important;\n  background-color: #ee3939;\n  border-color: #ed2a2a;\n}\n.btn-danger:active,\n.btn-danger.active,\n.open .dropdown-toggle.btn-danger {\n  background-image: none;\n}\n.btn-danger.disabled,\n.btn-danger[disabled],\nfieldset[disabled] .btn-danger,\n.btn-danger.disabled:hover,\n.btn-danger[disabled]:hover,\nfieldset[disabled] .btn-danger:hover,\n.btn-danger.disabled:focus,\n.btn-danger[disabled]:focus,\nfieldset[disabled] .btn-danger:focus,\n.btn-danger.disabled:active,\n.btn-danger[disabled]:active,\nfieldset[disabled] .btn-danger:active,\n.btn-danger.disabled.active,\n.btn-danger[disabled].active,\nfieldset[disabled] .btn-danger.active {\n  background-color: #f05050;\n  border-color: #f05050;\n}\n.btn-dark {\n  color: #ffffff !important;\n  background-color: #3a3f51;\n  border-color: #3a3f51;\n}\n.btn-dark:hover,\n.btn-dark:focus,\n.btn-dark:active,\n.btn-dark.active,\n.open .dropdown-toggle.btn-dark {\n  color: #ffffff !important;\n  background-color: #2f3342;\n  border-color: #292d39;\n}\n.btn-dark:active,\n.btn-dark.active,\n.open .dropdown-toggle.btn-dark {\n  background-image: none;\n}\n.btn-dark.disabled,\n.btn-dark[disabled],\nfieldset[disabled] .btn-dark,\n.btn-dark.disabled:hover,\n.btn-dark[disabled]:hover,\nfieldset[disabled] .btn-dark:hover,\n.btn-dark.disabled:focus,\n.btn-dark[disabled]:focus,\nfieldset[disabled] .btn-dark:focus,\n.btn-dark.disabled:active,\n.btn-dark[disabled]:active,\nfieldset[disabled] .btn-dark:active,\n.btn-dark.disabled.active,\n.btn-dark[disabled].active,\nfieldset[disabled] .btn-dark.active {\n  background-color: #3a3f51;\n  border-color: #3a3f51;\n}\n.btn-black {\n  color: #ffffff !important;\n  background-color: #1c2b36;\n  border-color: #1c2b36;\n}\n.btn-black:hover,\n.btn-black:focus,\n.btn-black:active,\n.btn-black.active,\n.open .dropdown-toggle.btn-black {\n  color: #ffffff !important;\n  background-color: #131e25;\n  border-color: #0e161b;\n}\n.btn-black:active,\n.btn-black.active,\n.open .dropdown-toggle.btn-black {\n  background-image: none;\n}\n.btn-black.disabled,\n.btn-black[disabled],\nfieldset[disabled] .btn-black,\n.btn-black.disabled:hover,\n.btn-black[disabled]:hover,\nfieldset[disabled] .btn-black:hover,\n.btn-black.disabled:focus,\n.btn-black[disabled]:focus,\nfieldset[disabled] .btn-black:focus,\n.btn-black.disabled:active,\n.btn-black[disabled]:active,\nfieldset[disabled] .btn-black:active,\n.btn-black.disabled.active,\n.btn-black[disabled].active,\nfieldset[disabled] .btn-black.active {\n  background-color: #1c2b36;\n  border-color: #1c2b36;\n}\n.btn-icon {\n  width: 34px;\n  height: 34px;\n  padding: 0 !important;\n  text-align: center;\n}\n.btn-icon i {\n  position: relative;\n  top: -1px;\n  line-height: 34px;\n}\n.btn-icon.btn-sm {\n  width: 30px;\n  height: 30px;\n}\n.btn-icon.btn-sm i {\n  line-height: 30px;\n}\n.btn-icon.btn-lg {\n  width: 45px;\n  height: 45px;\n}\n.btn-icon.btn-lg i {\n  line-height: 45px;\n}\n.btn-rounded {\n  padding-right: 15px;\n  padding-left: 15px;\n  border-radius: 50px;\n}\n.btn-rounded.btn-lg {\n  padding-right: 25px;\n  padding-left: 25px;\n}\n.btn > i.pull-left,\n.btn > i.pull-right {\n  line-height: 1.42857143;\n}\n.btn-block {\n  padding-right: 12px;\n  padding-left: 12px;\n}\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 2px;\n}\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-bottom-left-radius: 2px;\n}\n.btn-addon i {\n  position: relative;\n  float: left;\n  width: 34px;\n  height: 34px;\n  margin: -7px -12px;\n  margin-right: 12px;\n  line-height: 34px;\n  text-align: center;\n  background-color: rgba(0, 0, 0, 0.1);\n  border-radius: 2px 0 0 2px;\n}\n.btn-addon i.pull-right {\n  margin-right: -12px;\n  margin-left: 12px;\n  border-radius: 0 2px 2px 0;\n}\n.btn-addon.btn-sm i {\n  width: 30px;\n  height: 30px;\n  margin: -6px -10px;\n  margin-right: 10px;\n  line-height: 30px;\n}\n.btn-addon.btn-sm i.pull-right {\n  margin-right: -10px;\n  margin-left: 10px;\n}\n.btn-addon.btn-lg i {\n  width: 45px;\n  height: 45px;\n  margin: -11px -16px;\n  margin-right: 16px;\n  line-height: 45px;\n}\n.btn-addon.btn-lg i.pull-right {\n  margin-right: -16px;\n  margin-left: 16px;\n}\n.btn-addon.btn-default i {\n  background-color: transparent;\n  border-right: 1px solid #dee5e7;\n}\n.btn-groups .btn {\n  margin-bottom: 5px;\n}\n.list-icon i {\n  display: inline-block;\n  width: 40px;\n  margin: 0;\n  font-size: 14px;\n  text-align: center;\n  vertical-align: middle;\n  -webkit-transition: font-size 0.2s;\n  transition: font-size 0.2s;\n}\n.list-icon div {\n  line-height: 40px;\n  white-space: nowrap;\n}\n.list-icon div:hover i {\n  font-size: 26px;\n}\n.settings {\n  position: fixed;\n  top: 120px;\n  right: -240px;\n  z-index: 1050;\n  width: 240px;\n  -webkit-transition: right 0.2s;\n  transition: right 0.2s;\n}\n.settings.active {\n  right: -1px;\n}\n.settings > .btn {\n  position: absolute;\n  left: -42px;\n  padding: 10px 15px;\n  background: #f6f8f8 !important;\n  border-color: #dee5e7;\n  border-right-width: 0;\n}\n.settings .i-checks span b {\n  display: inline-block;\n  float: left;\n  width: 50%;\n  height: 20px;\n}\n.settings .i-checks span b.header {\n  height: 10px;\n}\n.streamline {\n  position: relative;\n  border-color: #dee5e7;\n}\n.streamline .sl-item:after,\n.streamline:after {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 9px;\n  height: 9px;\n  margin-left: -5px;\n  background-color: #fff;\n  border-color: inherit;\n  border-style: solid;\n  border-width: 1px;\n  border-radius: 10px;\n  content: '';\n}\n.sl-item {\n  position: relative;\n  padding-bottom: 1px;\n  border-color: #dee5e7;\n}\n.sl-item:before,\n.sl-item:after {\n  display: table;\n  content: \" \";\n}\n.sl-item:after {\n  clear: both;\n}\n.sl-item:after {\n  top: 6px;\n  bottom: auto;\n}\n.sl-item.b-l {\n  margin-left: -1px;\n}\n.timeline {\n  padding: 0;\n  margin: 0;\n}\n.tl-item {\n  display: block;\n}\n.tl-item:before,\n.tl-item:after {\n  display: table;\n  content: \" \";\n}\n.tl-item:after {\n  clear: both;\n}\n.visible-left {\n  display: none;\n}\n.tl-wrap {\n  display: block;\n  padding: 15px 0 15px 20px;\n  margin-left: 6em;\n  border-color: #dee5e7;\n  border-style: solid;\n  border-width: 0 0 0 4px;\n}\n.tl-wrap:before,\n.tl-wrap:after {\n  display: table;\n  content: \" \";\n}\n.tl-wrap:after {\n  clear: both;\n}\n.tl-wrap:before {\n  position: relative;\n  top: 15px;\n  float: left;\n  width: 10px;\n  height: 10px;\n  margin-left: -27px;\n  background: #edf1f2;\n  border-color: inherit;\n  border-style: solid;\n  border-width: 3px;\n  border-radius: 50%;\n  content: \"\";\n  box-shadow: 0 0 0 4px #f0f3f4;\n}\n.tl-wrap:hover:before {\n  background: transparent;\n  border-color: #fff;\n}\n.tl-date {\n  position: relative;\n  top: 10px;\n  display: block;\n  float: left;\n  width: 4.5em;\n  margin-left: -7.5em;\n  text-align: right;\n}\n.tl-content {\n  position: relative;\n  display: inline-block;\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n.tl-content.block {\n  display: block;\n  width: 100%;\n}\n.tl-content.panel {\n  margin-bottom: 0;\n}\n.tl-header {\n  display: block;\n  width: 12em;\n  margin-left: 2px;\n  text-align: center;\n}\n.timeline-center .tl-item {\n  margin-left: 50%;\n}\n.timeline-center .tl-item .tl-wrap {\n  margin-left: -2px;\n}\n.timeline-center .tl-header {\n  width: auto;\n  margin: 0;\n}\n.timeline-center .tl-left {\n  margin-right: 50%;\n  margin-left: 0;\n}\n.timeline-center .tl-left .hidden-left {\n  display: none !important;\n}\n.timeline-center .tl-left .visible-left {\n  display: inherit;\n}\n.timeline-center .tl-left .tl-wrap {\n  float: right;\n  padding-right: 20px;\n  padding-left: 0;\n  margin-right: -2px;\n  border-right-width: 4px;\n  border-left-width: 0;\n}\n.timeline-center .tl-left .tl-wrap:before {\n  float: right;\n  margin-right: -27px;\n  margin-left: 0;\n}\n.timeline-center .tl-left .tl-date {\n  float: right;\n  margin-right: -8.5em;\n  margin-left: 0;\n  text-align: left;\n}\n.i-switch {\n  position: relative;\n  display: inline-block;\n  width: 35px;\n  height: 20px;\n  margin: 0;\n  cursor: pointer;\n  background-color: #27c24c;\n  border-radius: 30px;\n}\n.i-switch input {\n  position: absolute;\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n.i-switch input:checked + i:before {\n  top: 50%;\n  right: 5px;\n  bottom: 50%;\n  left: 50%;\n  border-width: 0;\n  border-radius: 5px;\n}\n.i-switch input:checked + i:after {\n  margin-left: 16px;\n}\n.i-switch i:before {\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n  background-color: #fff;\n  border: 1px solid #f0f0f0;\n  border-radius: 30px;\n  content: \"\";\n  -webkit-transition: all 0.2s;\n  transition: all 0.2s;\n}\n.i-switch i:after {\n  position: absolute;\n  top: 1px;\n  bottom: 1px;\n  width: 18px;\n  background-color: #fff;\n  border-radius: 50%;\n  content: \"\";\n  -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);\n  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);\n  -webkit-transition: margin-left 0.3s;\n  transition: margin-left 0.3s;\n}\n.i-switch-md {\n  width: 40px;\n  height: 24px;\n}\n.i-switch-md input:checked + i:after {\n  margin-left: 17px;\n}\n.i-switch-md i:after {\n  width: 22px;\n}\n.i-switch-lg {\n  width: 50px;\n  height: 30px;\n}\n.i-switch-lg input:checked + i:after {\n  margin-left: 21px;\n}\n.i-switch-lg i:after {\n  width: 28px;\n}\n.i-checks {\n  padding-left: 20px;\n  cursor: pointer;\n}\n.i-checks input {\n  position: absolute;\n  margin-left: -20px;\n  opacity: 0;\n}\n.i-checks input:checked + i {\n  border-color: #23b7e5;\n}\n.i-checks input:checked + i:before {\n  top: 4px;\n  left: 4px;\n  width: 10px;\n  height: 10px;\n  background-color: #23b7e5;\n}\n.i-checks input:checked + span .active {\n  display: inherit;\n}\n.i-checks input[type=\"radio\"] + i,\n.i-checks input[type=\"radio\"] + i:before {\n  border-radius: 50%;\n}\n.i-checks input[disabled] + i,\nfieldset[disabled] .i-checks input + i {\n  border-color: #dee5e7;\n}\n.i-checks input[disabled] + i:before,\nfieldset[disabled] .i-checks input + i:before {\n  background-color: #dee5e7;\n}\n.i-checks > i {\n  position: relative;\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  margin-top: -2px;\n  margin-right: 4px;\n  margin-left: -20px;\n  line-height: 1;\n  vertical-align: middle;\n  background-color: #fff;\n  border: 1px solid #cfdadd;\n}\n.i-checks > i:before {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  background-color: transparent;\n  content: \"\";\n  -webkit-transition: all 0.2s;\n  transition: all 0.2s;\n}\n.i-checks > span {\n  margin-left: -20px;\n}\n.i-checks > span .active {\n  display: none;\n}\n.i-checks-sm input:checked + i:before {\n  top: 3px;\n  left: 3px;\n  width: 8px;\n  height: 8px;\n}\n.i-checks-sm > i {\n  width: 16px;\n  height: 16px;\n  margin-right: 6px;\n  margin-left: -18px;\n}\n.i-checks-lg input:checked + i:before {\n  top: 8px;\n  left: 8px;\n  width: 12px;\n  height: 12px;\n}\n.i-checks-lg > i {\n  width: 30px;\n  height: 30px;\n}\n.datepicker {\n  margin: 0 5px;\n}\n.datepicker .btn-default {\n  border-width: 0;\n  box-shadow: none;\n}\n.datepicker .btn[disabled] {\n  opacity: 0.4;\n}\n.datepicker .btn-info .text-info {\n  color: #fff !important;\n}\n/*Charts*/\n.jqstooltip {\n  padding: 5px 10px !important;\n  background-color: rgba(0, 0, 0, 0.8) !important;\n  border: solid 1px #000 !important;\n  -webkit-border-radius: 3px;\n  -moz-border-radius: 3px;\n  border-radius: 3px;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.easyPieChart {\n  position: relative;\n  text-align: center;\n}\n.easyPieChart > div {\n  position: relative;\n  z-index: 1;\n}\n.easyPieChart > div .text {\n  position: absolute;\n  top: 60%;\n  width: 100%;\n  line-height: 1;\n}\n.easyPieChart > div img {\n  margin-top: -4px;\n}\n.easyPieChart canvas {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 0;\n}\n#flotTip {\n  z-index: 100;\n  padding: 4px 10px;\n  font-size: 12px;\n  color: #fff;\n  background-color: rgba(0, 0, 0, 0.8);\n  border: solid 1px #000 !important;\n  -webkit-border-radius: 3px;\n  -moz-border-radius: 3px;\n  border-radius: 3px;\n}\n.legendColorBox > div {\n  margin: 5px;\n  border: none !important;\n}\n.legendColorBox > div > div {\n  border-radius: 10px;\n}\n.sortable-placeholder {\n  min-height: 50px;\n  margin-bottom: 5px;\n  list-style: none;\n  border: 1px dashed #CCC;\n}\n.item {\n  position: relative;\n}\n.item .top {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.item .bottom {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n}\n.item .center {\n  position: absolute;\n  top: 50%;\n}\n.item-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: none;\n}\n.item-overlay.active,\n.item:hover .item-overlay {\n  display: block;\n}\n.form-validation .form-control.ng-dirty.ng-invalid {\n  border-color: #f05050;\n}\n.form-validation .form-control.ng-dirty.ng-valid,\n.form-validation .form-control.ng-dirty.ng-valid:focus {\n  border-color: #27c24c;\n}\n.form-validation .i-checks .ng-invalid.ng-dirty + i {\n  border-color: #f05050;\n}\n.ng-animate .bg-auto:before {\n  display: none;\n}\n[ui-view].ng-leave {\n  display: none;\n}\n[ui-view].ng-leave.smooth {\n  display: block;\n}\n.smooth.ng-animate {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.fade-in-right-big.ng-enter {\n  -webkit-animation: fadeInRightBig 0.5s;\n  animation: fadeInRightBig 0.5s;\n}\n.fade-in-right-big.ng-leave {\n  -webkit-animation: fadeOutLeftBig 0.5s;\n  animation: fadeOutLeftBig 0.5s;\n}\n.fade-in-left-big.ng-enter {\n  -webkit-animation: fadeInLeftBig 0.5s;\n  animation: fadeInLeftBig 0.5s;\n}\n.fade-in-left-big.ng-leave {\n  -webkit-animation: fadeOutRightBig 0.5s;\n  animation: fadeOutRightBig 0.5s;\n}\n.fade-in-up-big.ng-enter {\n  -webkit-animation: fadeInUpBig 0.5s;\n  animation: fadeInUpBig 0.5s;\n}\n.fade-in-up-big.ng-leave {\n  -webkit-animation: fadeOutUpBig 0.5s;\n  animation: fadeOutUpBig 0.5s;\n}\n.fade-in-down-big.ng-enter {\n  -webkit-animation: fadeInDownBig 0.5s;\n  animation: fadeInDownBig 0.5s;\n}\n.fade-in-down-big.ng-leave {\n  -webkit-animation: fadeOutDownBig 0.5s;\n  animation: fadeOutDownBig 0.5s;\n}\n.fade-in.ng-enter {\n  -webkit-animation: fadeIn 0.5s;\n  animation: fadeIn 0.5s;\n}\n.fade-in.ng-leave {\n  -webkit-animation: fadeOut 0.5s;\n  animation: fadeOut 0.5s;\n}\n.fade-in-right.ng-enter {\n  -webkit-animation: fadeInRight 0.5s;\n  animation: fadeInRight 0.5s;\n}\n.fade-in-right.ng-leave {\n  -webkit-animation: fadeOutLeft 0.5s;\n  animation: fadeOutLeft 0.5s;\n}\n.fade-in-left.ng-enter {\n  -webkit-animation: fadeInLeft 0.5s;\n  animation: fadeInLeft 0.5s;\n}\n.fade-in-left.ng-leave {\n  -webkit-animation: fadeOutRight 0.5s;\n  animation: fadeOutRight 0.5s;\n}\n.fade-in-up.ng-enter {\n  -webkit-animation: fadeInUp 0.5s;\n  animation: fadeInUp 0.5s;\n}\n.fade-in-up.ng-leave {\n  -webkit-animation: fadeOutUp 0.5s;\n  animation: fadeOutUp 0.5s;\n}\n.fade-in-down.ng-enter {\n  -webkit-animation: fadeInDown 0.5s;\n  animation: fadeInDown 0.5s;\n}\n.fade-in-down.ng-leave {\n  -webkit-animation: fadeOutDown 0.5s;\n  animation: fadeOutDown 0.5s;\n}\n.bg-gd {\n  background-image: -webkit-gradient(linear, left 0, left 100%, from(rgba(40, 50, 60, 0)), to(rgba(40, 50, 60, 0.075)));\n  background-image: -webkit-linear-gradient(top, rgba(40, 50, 60, 0), 0, rgba(40, 50, 60, 0.075), 100%);\n  background-image: -moz-linear-gradient(top, rgba(40, 50, 60, 0) 0, rgba(40, 50, 60, 0.075) 100%);\n  background-image: linear-gradient(to bottom, rgba(40, 50, 60, 0) 0, rgba(40, 50, 60, 0.075) 100%);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0028323c', endColorstr='#1328323c', GradientType=0);\n  filter: none;\n}\n.bg-gd-dk {\n  background-image: -webkit-gradient(linear, left 10%, left 100%, from(rgba(40, 50, 60, 0)), to(rgba(40, 50, 60, 0.5)));\n  background-image: -webkit-linear-gradient(top, rgba(40, 50, 60, 0), 10%, rgba(40, 50, 60, 0.5), 100%);\n  background-image: -moz-linear-gradient(top, rgba(40, 50, 60, 0) 10%, rgba(40, 50, 60, 0.5) 100%);\n  background-image: linear-gradient(to bottom, rgba(40, 50, 60, 0) 10%, rgba(40, 50, 60, 0.5) 100%);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0028323c', endColorstr='#8028323c', GradientType=0);\n  filter: none;\n}\n.bg-light {\n  color: #58666e;\n  background-color: #edf1f2;\n}\n.bg-light.lt,\n.bg-light .lt {\n  background-color: #f3f5f6;\n}\n.bg-light.lter,\n.bg-light .lter {\n  background-color: #f6f8f8;\n}\n.bg-light.dk,\n.bg-light .dk {\n  background-color: #e4eaec;\n}\n.bg-light.dker,\n.bg-light .dker {\n  background-color: #dde6e9;\n}\n.bg-light.bg,\n.bg-light .bg {\n  background-color: #edf1f2;\n}\n.bg-dark {\n  color: #a6a8b1;\n  background-color: #3a3f51;\n}\n.bg-dark.lt,\n.bg-dark .lt {\n  background-color: #474c5e;\n}\n.bg-dark.lter,\n.bg-dark .lter {\n  background-color: #54596a;\n}\n.bg-dark.dk,\n.bg-dark .dk {\n  background-color: #2e3344;\n}\n.bg-dark.dker,\n.bg-dark .dker {\n  background-color: #232735;\n}\n.bg-dark.bg,\n.bg-dark .bg {\n  background-color: #3a3f51;\n}\n.bg-dark a {\n  color: #c1c3c9;\n}\n.bg-dark a:hover {\n  color: #ffffff;\n}\n.bg-dark a.list-group-item:hover,\n.bg-dark a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-dark .nav > li:hover > a,\n.bg-dark .nav > li:focus > a,\n.bg-dark .nav > li.active > a {\n  color: #ffffff;\n  background-color: #2e3344;\n}\n.bg-dark .nav > li > a {\n  color: #b4b6bd;\n}\n.bg-dark .nav > li > a:hover,\n.bg-dark .nav > li > a:focus {\n  background-color: #32374a;\n}\n.bg-dark .nav .open > a {\n  background-color: #2e3344;\n}\n.bg-dark .caret {\n  border-top-color: #a6a8b1;\n  border-bottom-color: #a6a8b1;\n}\n.bg-dark.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #2e3344;\n}\n.bg-dark .open > a,\n.bg-dark .open > a:hover,\n.bg-dark .open > a:focus {\n  color: #ffffff;\n}\n.bg-dark .text-muted {\n  color: #8b8e99 !important;\n}\n.bg-dark .text-lt {\n  color: #eaebed !important;\n}\n.bg-dark.auto .list-group-item,\n.bg-dark .auto .list-group-item {\n  background-color: transparent;\n  border-color: #2f3342 !important;\n}\n.bg-dark.auto .list-group-item:hover,\n.bg-dark .auto .list-group-item:hover,\n.bg-dark.auto .list-group-item:focus,\n.bg-dark .auto .list-group-item:focus,\n.bg-dark.auto .list-group-item:active,\n.bg-dark .auto .list-group-item:active,\n.bg-dark.auto .list-group-item.active,\n.bg-dark .auto .list-group-item.active {\n  background-color: #2e3344 !important;\n}\n.bg-black {\n  color: #7793a7;\n  background-color: #1c2b36;\n}\n.bg-black.lt,\n.bg-black .lt {\n  background-color: #263845;\n}\n.bg-black.lter,\n.bg-black .lter {\n  background-color: #314554;\n}\n.bg-black.dk,\n.bg-black .dk {\n  background-color: #131e26;\n}\n.bg-black.dker,\n.bg-black .dker {\n  background-color: #0a1015;\n}\n.bg-black.bg,\n.bg-black .bg {\n  background-color: #1c2b36;\n}\n.bg-black a {\n  color: #96abbb;\n}\n.bg-black a:hover {\n  color: #ffffff;\n}\n.bg-black a.list-group-item:hover,\n.bg-black a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-black .nav > li:hover > a,\n.bg-black .nav > li:focus > a,\n.bg-black .nav > li.active > a {\n  color: #ffffff;\n  background-color: #131e26;\n}\n.bg-black .nav > li > a {\n  color: #869fb1;\n}\n.bg-black .nav > li > a:hover,\n.bg-black .nav > li > a:focus {\n  background-color: #16232d;\n}\n.bg-black .nav .open > a {\n  background-color: #131e26;\n}\n.bg-black .caret {\n  border-top-color: #7793a7;\n  border-bottom-color: #7793a7;\n}\n.bg-black.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #131e26;\n}\n.bg-black .open > a,\n.bg-black .open > a:hover,\n.bg-black .open > a:focus {\n  color: #ffffff;\n}\n.bg-black .text-muted {\n  color: #5c798f !important;\n}\n.bg-black .text-lt {\n  color: #c4d0d9 !important;\n}\n.bg-black.auto .list-group-item,\n.bg-black .auto .list-group-item {\n  background-color: transparent;\n  border-color: #131e25 !important;\n}\n.bg-black.auto .list-group-item:hover,\n.bg-black .auto .list-group-item:hover,\n.bg-black.auto .list-group-item:focus,\n.bg-black .auto .list-group-item:focus,\n.bg-black.auto .list-group-item:active,\n.bg-black .auto .list-group-item:active,\n.bg-black.auto .list-group-item.active,\n.bg-black .auto .list-group-item.active {\n  background-color: #131e26 !important;\n}\n.bg-primary {\n  color: #f4f3f9;\n  background-color: #7266ba;\n}\n.bg-primary.lt,\n.bg-primary .lt {\n  background-color: #847abf;\n}\n.bg-primary.lter,\n.bg-primary .lter {\n  background-color: #958dc6;\n}\n.bg-primary.dk,\n.bg-primary .dk {\n  background-color: #6051b5;\n}\n.bg-primary.dker,\n.bg-primary .dker {\n  background-color: #5244a9;\n}\n.bg-primary.bg,\n.bg-primary .bg {\n  background-color: #7266ba;\n}\n.bg-primary a {\n  color: #ffffff;\n}\n.bg-primary a:hover {\n  color: #ffffff;\n}\n.bg-primary a.list-group-item:hover,\n.bg-primary a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-primary .nav > li:hover > a,\n.bg-primary .nav > li:focus > a,\n.bg-primary .nav > li.active > a {\n  color: #ffffff;\n  background-color: #6051b5;\n}\n.bg-primary .nav > li > a {\n  color: #f2f2f2;\n}\n.bg-primary .nav > li > a:hover,\n.bg-primary .nav > li > a:focus {\n  background-color: #6658b8;\n}\n.bg-primary .nav .open > a {\n  background-color: #6051b5;\n}\n.bg-primary .caret {\n  border-top-color: #f4f3f9;\n  border-bottom-color: #f4f3f9;\n}\n.bg-primary.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #6051b5;\n}\n.bg-primary .open > a,\n.bg-primary .open > a:hover,\n.bg-primary .open > a:focus {\n  color: #ffffff;\n}\n.bg-primary .text-muted {\n  color: #d6d3e6 !important;\n}\n.bg-primary .text-lt {\n  color: #ffffff !important;\n}\n.bg-primary.auto .list-group-item,\n.bg-primary .auto .list-group-item {\n  background-color: transparent;\n  border-color: #6254b2 !important;\n}\n.bg-primary.auto .list-group-item:hover,\n.bg-primary .auto .list-group-item:hover,\n.bg-primary.auto .list-group-item:focus,\n.bg-primary .auto .list-group-item:focus,\n.bg-primary.auto .list-group-item:active,\n.bg-primary .auto .list-group-item:active,\n.bg-primary.auto .list-group-item.active,\n.bg-primary .auto .list-group-item.active {\n  background-color: #6051b5 !important;\n}\n.bg-success {\n  color: #c6efd0;\n  background-color: #27c24c;\n}\n.bg-success.lt,\n.bg-success .lt {\n  background-color: #31d257;\n}\n.bg-success.lter,\n.bg-success .lter {\n  background-color: #48d46a;\n}\n.bg-success.dk,\n.bg-success .dk {\n  background-color: #20af42;\n}\n.bg-success.dker,\n.bg-success .dker {\n  background-color: #1a9c39;\n}\n.bg-success.bg,\n.bg-success .bg {\n  background-color: #27c24c;\n}\n.bg-success a {\n  color: #eefaf1;\n}\n.bg-success a:hover {\n  color: #ffffff;\n}\n.bg-success a.list-group-item:hover,\n.bg-success a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-success .nav > li:hover > a,\n.bg-success .nav > li:focus > a,\n.bg-success .nav > li.active > a {\n  color: #ffffff;\n  background-color: #20af42;\n}\n.bg-success .nav > li > a {\n  color: #daf5e0;\n}\n.bg-success .nav > li > a:hover,\n.bg-success .nav > li > a:focus {\n  background-color: #22b846;\n}\n.bg-success .nav .open > a {\n  background-color: #20af42;\n}\n.bg-success .caret {\n  border-top-color: #c6efd0;\n  border-bottom-color: #c6efd0;\n}\n.bg-success.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #20af42;\n}\n.bg-success .open > a,\n.bg-success .open > a:hover,\n.bg-success .open > a:focus {\n  color: #ffffff;\n}\n.bg-success .text-muted {\n  color: #9ee4af !important;\n}\n.bg-success .text-lt {\n  color: #ffffff !important;\n}\n.bg-success.auto .list-group-item,\n.bg-success .auto .list-group-item {\n  background-color: transparent;\n  border-color: #23ad44 !important;\n}\n.bg-success.auto .list-group-item:hover,\n.bg-success .auto .list-group-item:hover,\n.bg-success.auto .list-group-item:focus,\n.bg-success .auto .list-group-item:focus,\n.bg-success.auto .list-group-item:active,\n.bg-success .auto .list-group-item:active,\n.bg-success.auto .list-group-item.active,\n.bg-success .auto .list-group-item.active {\n  background-color: #20af42 !important;\n}\n.bg-info {\n  color: #dcf2f8;\n  background-color: #23b7e5;\n}\n.bg-info.lt,\n.bg-info .lt {\n  background-color: #3dbde5;\n}\n.bg-info.lter,\n.bg-info .lter {\n  background-color: #55c3e6;\n}\n.bg-info.dk,\n.bg-info .dk {\n  background-color: #16aad8;\n}\n.bg-info.dker,\n.bg-info .dker {\n  background-color: #1199c4;\n}\n.bg-info.bg,\n.bg-info .bg {\n  background-color: #23b7e5;\n}\n.bg-info a {\n  color: #ffffff;\n}\n.bg-info a:hover {\n  color: #ffffff;\n}\n.bg-info a.list-group-item:hover,\n.bg-info a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-info .nav > li:hover > a,\n.bg-info .nav > li:focus > a,\n.bg-info .nav > li.active > a {\n  color: #ffffff;\n  background-color: #16aad8;\n}\n.bg-info .nav > li > a {\n  color: #f2f2f2;\n}\n.bg-info .nav > li > a:hover,\n.bg-info .nav > li > a:focus {\n  background-color: #17b2e2;\n}\n.bg-info .nav .open > a {\n  background-color: #16aad8;\n}\n.bg-info .caret {\n  border-top-color: #dcf2f8;\n  border-bottom-color: #dcf2f8;\n}\n.bg-info.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #16aad8;\n}\n.bg-info .open > a,\n.bg-info .open > a:hover,\n.bg-info .open > a:focus {\n  color: #ffffff;\n}\n.bg-info .text-muted {\n  color: #b0e1f1 !important;\n}\n.bg-info .text-lt {\n  color: #ffffff !important;\n}\n.bg-info.auto .list-group-item,\n.bg-info .auto .list-group-item {\n  background-color: transparent;\n  border-color: #19a9d5 !important;\n}\n.bg-info.auto .list-group-item:hover,\n.bg-info .auto .list-group-item:hover,\n.bg-info.auto .list-group-item:focus,\n.bg-info .auto .list-group-item:focus,\n.bg-info.auto .list-group-item:active,\n.bg-info .auto .list-group-item:active,\n.bg-info.auto .list-group-item.active,\n.bg-info .auto .list-group-item.active {\n  background-color: #16aad8 !important;\n}\n.bg-warning {\n  color: #fffefa;\n  background-color: #fad733;\n}\n.bg-warning.lt,\n.bg-warning .lt {\n  background-color: #f8da4e;\n}\n.bg-warning.lter,\n.bg-warning .lter {\n  background-color: #f7de69;\n}\n.bg-warning.dk,\n.bg-warning .dk {\n  background-color: #fcd417;\n}\n.bg-warning.dker,\n.bg-warning .dker {\n  background-color: #face00;\n}\n.bg-warning.bg,\n.bg-warning .bg {\n  background-color: #fad733;\n}\n.bg-warning a {\n  color: #ffffff;\n}\n.bg-warning a:hover {\n  color: #ffffff;\n}\n.bg-warning a.list-group-item:hover,\n.bg-warning a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-warning .nav > li:hover > a,\n.bg-warning .nav > li:focus > a,\n.bg-warning .nav > li.active > a {\n  color: #ffffff;\n  background-color: #fcd417;\n}\n.bg-warning .nav > li > a {\n  color: #f2f2f2;\n}\n.bg-warning .nav > li > a:hover,\n.bg-warning .nav > li > a:focus {\n  background-color: #fcd621;\n}\n.bg-warning .nav .open > a {\n  background-color: #fcd417;\n}\n.bg-warning .caret {\n  border-top-color: #fffefa;\n  border-bottom-color: #fffefa;\n}\n.bg-warning.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #fcd417;\n}\n.bg-warning .open > a,\n.bg-warning .open > a:hover,\n.bg-warning .open > a:focus {\n  color: #ffffff;\n}\n.bg-warning .text-muted {\n  color: #fbf2cb !important;\n}\n.bg-warning .text-lt {\n  color: #ffffff !important;\n}\n.bg-warning.auto .list-group-item,\n.bg-warning .auto .list-group-item {\n  background-color: transparent;\n  border-color: #f9d21a !important;\n}\n.bg-warning.auto .list-group-item:hover,\n.bg-warning .auto .list-group-item:hover,\n.bg-warning.auto .list-group-item:focus,\n.bg-warning .auto .list-group-item:focus,\n.bg-warning.auto .list-group-item:active,\n.bg-warning .auto .list-group-item:active,\n.bg-warning.auto .list-group-item.active,\n.bg-warning .auto .list-group-item.active {\n  background-color: #fcd417 !important;\n}\n.bg-danger {\n  color: #ffffff;\n  background-color: #f05050;\n}\n.bg-danger.lt,\n.bg-danger .lt {\n  background-color: #f06a6a;\n}\n.bg-danger.lter,\n.bg-danger .lter {\n  background-color: #f18282;\n}\n.bg-danger.dk,\n.bg-danger .dk {\n  background-color: #f13636;\n}\n.bg-danger.dker,\n.bg-danger .dker {\n  background-color: #f21b1b;\n}\n.bg-danger.bg,\n.bg-danger .bg {\n  background-color: #f05050;\n}\n.bg-danger a {\n  color: #ffffff;\n}\n.bg-danger a:hover {\n  color: #ffffff;\n}\n.bg-danger a.list-group-item:hover,\n.bg-danger a.list-group-item:focus {\n  background-color: inherit;\n}\n.bg-danger .nav > li:hover > a,\n.bg-danger .nav > li:focus > a,\n.bg-danger .nav > li.active > a {\n  color: #ffffff;\n  background-color: #f13636;\n}\n.bg-danger .nav > li > a {\n  color: #f2f2f2;\n}\n.bg-danger .nav > li > a:hover,\n.bg-danger .nav > li > a:focus {\n  background-color: #f13f3f;\n}\n.bg-danger .nav .open > a {\n  background-color: #f13636;\n}\n.bg-danger .caret {\n  border-top-color: #ffffff;\n  border-bottom-color: #ffffff;\n}\n.bg-danger.navbar .nav > li.active > a {\n  color: #ffffff;\n  background-color: #f13636;\n}\n.bg-danger .open > a,\n.bg-danger .open > a:hover,\n.bg-danger .open > a:focus {\n  color: #ffffff;\n}\n.bg-danger .text-muted {\n  color: #e6e6e6 !important;\n}\n.bg-danger .text-lt {\n  color: #ffffff !important;\n}\n.bg-danger.auto .list-group-item,\n.bg-danger .auto .list-group-item {\n  background-color: transparent;\n  border-color: #ee3939 !important;\n}\n.bg-danger.auto .list-group-item:hover,\n.bg-danger .auto .list-group-item:hover,\n.bg-danger.auto .list-group-item:focus,\n.bg-danger .auto .list-group-item:focus,\n.bg-danger.auto .list-group-item:active,\n.bg-danger .auto .list-group-item:active,\n.bg-danger.auto .list-group-item.active,\n.bg-danger .auto .list-group-item.active {\n  background-color: #f13636 !important;\n}\n.bg-white {\n  color: #58666e;\n  background-color: #fff;\n}\n.bg-white a {\n  color: #363f44;\n}\n.bg-white a:hover {\n  color: #1f2427;\n}\n.bg-white .text-muted {\n  color: #98a6ad !important;\n}\n.bg-white .lt,\n.bg-white .lter,\n.bg-white .dk,\n.bg-white .dker {\n  background-color: #fff;\n}\n.bg-white-only {\n  background-color: #fff;\n}\n.bg-white-opacity {\n  background-color: rgba(255, 255, 255, 0.5);\n}\n.bg-black-opacity {\n  background-color: rgba(32, 43, 54, 0.5);\n}\na.bg-light:hover {\n  color: #363f44;\n}\na.bg-primary:hover {\n  background-color: #6254b2;\n}\na.text-primary:hover {\n  color: #6254b2;\n}\n.text-primary {\n  color: #7266ba;\n}\n.text-primary-lt {\n  color: #8278c2;\n}\n.text-primary-lter {\n  color: #9289ca;\n}\n.text-primary-dk {\n  color: #6254b2;\n}\n.text-primary-dker {\n  color: #564aa3;\n}\na.bg-info:hover {\n  background-color: #19a9d5;\n}\na.text-info:hover {\n  color: #19a9d5;\n}\n.text-info {\n  color: #23b7e5;\n}\n.text-info-lt {\n  color: #3abee8;\n}\n.text-info-lter {\n  color: #51c6ea;\n}\n.text-info-dk {\n  color: #19a9d5;\n}\n.text-info-dker {\n  color: #1797be;\n}\na.bg-success:hover {\n  background-color: #23ad44;\n}\na.text-success:hover {\n  color: #23ad44;\n}\n.text-success {\n  color: #27c24c;\n}\n.text-success-lt {\n  color: #2ed556;\n}\n.text-success-lter {\n  color: #43d967;\n}\n.text-success-dk {\n  color: #23ad44;\n}\n.text-success-dker {\n  color: #1e983b;\n}\na.bg-warning:hover {\n  background-color: #f9d21a;\n}\na.text-warning:hover {\n  color: #f9d21a;\n}\n.text-warning {\n  color: #fad733;\n}\n.text-warning-lt {\n  color: #fbdc4c;\n}\n.text-warning-lter {\n  color: #fbe165;\n}\n.text-warning-dk {\n  color: #f9d21a;\n}\n.text-warning-dker {\n  color: #f4ca06;\n}\na.bg-danger:hover {\n  background-color: #ee3939;\n}\na.text-danger:hover {\n  color: #ee3939;\n}\n.text-danger {\n  color: #f05050;\n}\n.text-danger-lt {\n  color: #f26767;\n}\n.text-danger-lter {\n  color: #f47f7f;\n}\n.text-danger-dk {\n  color: #ee3939;\n}\n.text-danger-dker {\n  color: #ec2121;\n}\na.bg-dark:hover {\n  background-color: #2f3342;\n}\na.text-dark:hover {\n  color: #2f3342;\n}\n.text-dark {\n  color: #3a3f51;\n}\n.text-dark-lt {\n  color: #454b60;\n}\n.text-dark-lter {\n  color: #4f566f;\n}\n.text-dark-dk {\n  color: #2f3342;\n}\n.text-dark-dker {\n  color: #252833;\n}\na.bg-#000000:hover {\n  background-color: #131e25;\n}\na.text-#000000:hover {\n  color: #131e25;\n}\n.text-#000000 {\n  color: #1c2b36;\n}\n.text-#000000-lt {\n  color: #253847;\n}\n.text-#000000-lter {\n  color: #2d4658;\n}\n.text-#000000-dk {\n  color: #131e25;\n}\n.text-#000000-dker {\n  color: #0b1014;\n}\n.text-white {\n  color: #fff;\n}\n.text-muted {\n  color: #98a6ad;\n}\n.pos-rlt {\n  position: relative;\n}\n.pos-stc {\n  position: static !important;\n}\n.pos-abt {\n  position: absolute;\n}\n.pos-fix {\n  position: fixed;\n}\n.show {\n  visibility: visible;\n}\n.line {\n  width: 100%;\n  height: 2px;\n  margin: 10px 0;\n  overflow: hidden;\n  font-size: 0;\n}\n.line-xs {\n  margin: 0;\n}\n.line-lg {\n  margin-top: 15px;\n  margin-bottom: 15px;\n}\n.line-dashed {\n  background-color: transparent;\n  border-style: dashed !important;\n  border-width: 0;\n}\n.no-line {\n  border-width: 0;\n}\n.no-border,\n.no-borders {\n  border-color: transparent;\n  border-width: 0;\n}\n.no-radius {\n  border-radius: 0;\n}\n.block {\n  display: block;\n}\n.block.hide {\n  display: none;\n}\n.inline {\n  display: inline-block !important;\n}\n.none {\n  display: none;\n}\n.pull-none {\n  float: none;\n}\n.rounded {\n  border-radius: 500px;\n}\n.clear {\n  display: block;\n  overflow: hidden;\n}\n.no-bg {\n  color: inherit;\n  background-color: transparent;\n}\n.no-select {\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.l-h {\n  line-height: 1.42857143;\n}\n.l-h-0x {\n  line-height: 0;\n}\n.l-h-1x {\n  line-height: 1.2;\n}\n.l-h-2x {\n  line-height: 2em;\n}\n.l-s-1x {\n  letter-spacing: 1;\n}\n.l-s-2x {\n  letter-spacing: 2;\n}\n.l-s-3x {\n  letter-spacing: 3;\n}\n.font-normal {\n  font-weight: normal;\n}\n.font-thin {\n  font-weight: 300;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-3x {\n  font-size: 3em;\n}\n.text-2x {\n  font-size: 2em;\n}\n.text-lg {\n  font-size: 18px;\n}\n.text-md {\n  font-size: 16px;\n}\n.text-base {\n  font-size: 14px;\n}\n.text-sm {\n  font-size: 13px;\n}\n.text-xs {\n  font-size: 12px;\n}\n.text-xxs {\n  text-indent: -9999px;\n}\n.text-ellipsis {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.text-u-c {\n  text-transform: uppercase;\n}\n.text-l-t {\n  text-decoration: line-through;\n}\n.text-u-l {\n  text-decoration: underline;\n}\n.text-active,\n.active > .text,\n.active > .auto .text {\n  display: none !important;\n}\n.active > .text-active,\n.active > .auto .text-active {\n  display: inline-block !important;\n}\n.box-shadow {\n  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05);\n}\n.box-shadow-lg {\n  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.05);\n}\n.text-shadow {\n  font-size: 170px;\n  text-shadow: 0 1px 0 #dee5e7, 0 2px 0 #fcfdfd, 0 5px 10px rgba(0, 0, 0, 0.125), 0 10px 20px rgba(0, 0, 0, 0.2);\n}\n.no-shadow {\n  -webkit-box-shadow: none !important;\n  box-shadow: none !important;\n}\n.wrapper-xs {\n  padding: 5px;\n}\n.wrapper-sm {\n  padding: 10px;\n}\n.wrapper {\n  padding: 15px;\n}\n.wrapper-md {\n  padding: 20px;\n}\n.wrapper-lg {\n  padding: 30px;\n}\n.wrapper-xl {\n  padding: 50px;\n}\n.padder-lg {\n  padding-right: 30px;\n  padding-left: 30px;\n}\n.padder-md {\n  padding-right: 20px;\n  padding-left: 20px;\n}\n.padder {\n  padding-right: 15px;\n  padding-left: 15px;\n}\n.padder-v {\n  padding-top: 15px;\n  padding-bottom: 15px;\n}\n.no-padder {\n  padding: 0 !important;\n}\n.pull-in {\n  margin-right: -15px;\n  margin-left: -15px;\n}\n.pull-out {\n  margin: -10px -15px;\n}\n.b {\n  border: 1px solid rgba(0, 0, 0, 0.05);\n}\n.b-a {\n  border: 1px solid #dee5e7;\n}\n.b-t {\n  border-top: 1px solid #dee5e7;\n}\n.b-r {\n  border-right: 1px solid #dee5e7;\n}\n.b-b {\n  border-bottom: 1px solid #dee5e7;\n}\n.b-l {\n  border-left: 1px solid #dee5e7;\n}\n.b-light {\n  border-color: #edf1f2;\n}\n.b-dark {\n  border-color: #3a3f51;\n}\n.b-black {\n  border-color: #3a3f51;\n}\n.b-primary {\n  border-color: #7266ba;\n}\n.b-success {\n  border-color: #27c24c;\n}\n.b-info {\n  border-color: #23b7e5;\n}\n.b-warning {\n  border-color: #fad733;\n}\n.b-danger {\n  border-color: #f05050;\n}\n.b-white {\n  border-color: #ffffff;\n}\n.b-dashed {\n  border-style: dashed !important;\n}\n.b-l-light {\n  border-left-color: #edf1f2;\n}\n.b-l-dark {\n  border-left-color: #3a3f51;\n}\n.b-l-black {\n  border-left-color: #3a3f51;\n}\n.b-l-primary {\n  border-left-color: #7266ba;\n}\n.b-l-success {\n  border-left-color: #27c24c;\n}\n.b-l-info {\n  border-left-color: #23b7e5;\n}\n.b-l-warning {\n  border-left-color: #fad733;\n}\n.b-l-danger {\n  border-left-color: #f05050;\n}\n.b-l-white {\n  border-left-color: #ffffff;\n}\n.b-l-2x {\n  border-left-width: 2px;\n}\n.b-l-3x {\n  border-left-width: 3px;\n}\n.b-l-4x {\n  border-left-width: 4px;\n}\n.b-l-5x {\n  border-left-width: 5px;\n}\n.b-2x {\n  border-width: 2px;\n}\n.b-3x {\n  border-width: 3px;\n}\n.b-4x {\n  border-width: 4px;\n}\n.b-5x {\n  border-width: 5px;\n}\n.r {\n  border-radius: 2px 2px 2px 2px;\n}\n.r-2x {\n  border-radius: 4px;\n}\n.r-3x {\n  border-radius: 6px;\n}\n.r-l {\n  border-radius: 2px 0 0 2px;\n}\n.r-r {\n  border-radius: 0 2px 2px 0;\n}\n.r-t {\n  border-radius: 2px 2px 0 0;\n}\n.r-b {\n  border-radius: 0 0 2px 2px;\n}\n.m-xxs {\n  margin: 2px 4px;\n}\n.m-xs {\n  margin: 5px;\n}\n.m-sm {\n  margin: 10px;\n}\n.m {\n  margin: 15px;\n}\n.m-md {\n  margin: 20px;\n}\n.m-lg {\n  margin: 30px;\n}\n.m-xl {\n  margin: 50px;\n}\n.m-n {\n  margin: 0 !important;\n}\n.m-l-none {\n  margin-left: 0 !important;\n}\n.m-l-xs {\n  margin-left: 5px;\n}\n.m-l-sm {\n  margin-left: 10px;\n}\n.m-l {\n  margin-left: 15px;\n}\n.m-l-md {\n  margin-left: 20px;\n}\n.m-l-lg {\n  margin-left: 30px;\n}\n.m-l-xl {\n  margin-left: 40px;\n}\n.m-l-xxl {\n  margin-left: 50px;\n}\n.m-l-n-xxs {\n  margin-left: -1px;\n}\n.m-l-n-xs {\n  margin-left: -5px;\n}\n.m-l-n-sm {\n  margin-left: -10px;\n}\n.m-l-n {\n  margin-left: -15px;\n}\n.m-l-n-md {\n  margin-left: -20px;\n}\n.m-l-n-lg {\n  margin-left: -30px;\n}\n.m-l-n-xl {\n  margin-left: -40px;\n}\n.m-l-n-xxl {\n  margin-left: -50px;\n}\n.m-t-none {\n  margin-top: 0 !important;\n}\n.m-t-xxs {\n  margin-top: 1px;\n}\n.m-t-xs {\n  margin-top: 5px;\n}\n.m-t-sm {\n  margin-top: 10px;\n}\n.m-t {\n  margin-top: 15px;\n}\n.m-t-md {\n  margin-top: 20px;\n}\n.m-t-lg {\n  margin-top: 30px;\n}\n.m-t-xl {\n  margin-top: 40px;\n}\n.m-t-xxl {\n  margin-top: 50px;\n}\n.m-t-n-xxs {\n  margin-top: -1px;\n}\n.m-t-n-xs {\n  margin-top: -5px;\n}\n.m-t-n-sm {\n  margin-top: -10px;\n}\n.m-t-n {\n  margin-top: -15px;\n}\n.m-t-n-md {\n  margin-top: -20px;\n}\n.m-t-n-lg {\n  margin-top: -30px;\n}\n.m-t-n-xl {\n  margin-top: -40px;\n}\n.m-t-n-xxl {\n  margin-top: -50px;\n}\n.m-r-none {\n  margin-right: 0 !important;\n}\n.m-r-xxs {\n  margin-right: 1px;\n}\n.m-r-xs {\n  margin-right: 5px;\n}\n.m-r-sm {\n  margin-right: 10px;\n}\n.m-r {\n  margin-right: 15px;\n}\n.m-r-md {\n  margin-right: 20px;\n}\n.m-r-lg {\n  margin-right: 30px;\n}\n.m-r-xl {\n  margin-right: 40px;\n}\n.m-r-xxl {\n  margin-right: 50px;\n}\n.m-r-n-xxs {\n  margin-right: -1px;\n}\n.m-r-n-xs {\n  margin-right: -5px;\n}\n.m-r-n-sm {\n  margin-right: -10px;\n}\n.m-r-n {\n  margin-right: -15px;\n}\n.m-r-n-md {\n  margin-right: -20px;\n}\n.m-r-n-lg {\n  margin-right: -30px;\n}\n.m-r-n-xl {\n  margin-right: -40px;\n}\n.m-r-n-xxl {\n  margin-right: -50px;\n}\n.m-b-none {\n  margin-bottom: 0 !important;\n}\n.m-b-xxs {\n  margin-bottom: 1px;\n}\n.m-b-xs {\n  margin-bottom: 5px;\n}\n.m-b-sm {\n  margin-bottom: 10px;\n}\n.m-b {\n  margin-bottom: 15px;\n}\n.m-b-md {\n  margin-bottom: 20px;\n}\n.m-b-lg {\n  margin-bottom: 30px;\n}\n.m-b-xl {\n  margin-bottom: 40px;\n}\n.m-b-xxl {\n  margin-bottom: 50px;\n}\n.m-b-n-xxs {\n  margin-bottom: -1px;\n}\n.m-b-n-xs {\n  margin-bottom: -5px;\n}\n.m-b-n-sm {\n  margin-bottom: -10px;\n}\n.m-b-n {\n  margin-bottom: -15px;\n}\n.m-b-n-md {\n  margin-bottom: -20px;\n}\n.m-b-n-lg {\n  margin-bottom: -30px;\n}\n.m-b-n-xl {\n  margin-bottom: -40px;\n}\n.m-b-n-xxl {\n  margin-bottom: -50px;\n}\n.avatar {\n  position: relative;\n  display: block;\n  white-space: nowrap;\n  border-radius: 500px;\n}\n.avatar img {\n  width: 100%;\n  border-radius: 500px;\n}\n.avatar i {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 10px;\n  height: 10px;\n  margin: 2px;\n  border-style: solid;\n  border-width: 2px;\n  border-radius: 100%;\n}\n.avatar i.right {\n  right: 0;\n  left: auto;\n}\n.avatar i.bottom {\n  top: auto;\n  right: 0;\n  bottom: 0;\n  left: auto;\n}\n.avatar i.left {\n  top: auto;\n  bottom: 0;\n}\n.avatar i.on {\n  background-color: #27c24c;\n}\n.avatar i.off {\n  background-color: #98a6ad;\n}\n.avatar i.busy {\n  background-color: #f05050;\n}\n.avatar i.away {\n  background-color: #fad733;\n}\n.avatar.thumb-md i {\n  width: 12px;\n  height: 12px;\n  margin: 3px;\n}\n.avatar.thumb-sm i {\n  margin: 1px;\n}\n.avatar.thumb-xs i {\n  margin: 0;\n}\n.w-xxs {\n  width: 60px;\n}\n.w-xs {\n  width: 90px;\n}\n.w-sm {\n  width: 150px;\n}\n.w {\n  width: 200px;\n}\n.w-md {\n  width: 240px;\n}\n.w-lg {\n  width: 280px;\n}\n.w-xl {\n  width: 320px;\n}\n.w-xxl {\n  width: 360px;\n}\n.w-full {\n  width: 100%;\n}\n.w-auto {\n  width: auto;\n}\n.h-auto {\n  height: auto;\n}\n.h-full {\n  height: 100%;\n}\n.thumb-xl {\n  display: inline-block;\n  width: 128px;\n}\n.thumb-lg {\n  display: inline-block;\n  width: 96px;\n}\n.thumb-md {\n  display: inline-block;\n  width: 64px;\n}\n.thumb {\n  display: inline-block;\n  width: 50px;\n}\n.thumb-sm {\n  display: inline-block;\n  width: 40px;\n}\n.thumb-xs {\n  display: inline-block;\n  width: 34px;\n}\n.thumb-xxs {\n  display: inline-block;\n  width: 30px;\n}\n.thumb-wrapper {\n  padding: 2px;\n  border: 1px solid #dee5e7;\n}\n.thumb img,\n.thumb-xs img,\n.thumb-sm img,\n.thumb-md img,\n.thumb-lg img,\n.thumb-btn img {\n  height: auto;\n  max-width: 100%;\n  vertical-align: middle;\n}\n.img-full {\n  width: 100%;\n}\n.img-full img {\n  width: 100%;\n}\n.scrollable {\n  overflow-x: hidden;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.scrollable.hover {\n  overflow-y: hidden !important;\n}\n.scrollable.hover:hover {\n  overflow: visible !important;\n  overflow-y: auto !important;\n}\n.smart .scrollable {\n  overflow-y: auto !important;\n}\n.scroll-x,\n.scroll-y {\n  overflow: hidden;\n  -webkit-overflow-scrolling: touch;\n}\n.scroll-y {\n  overflow-y: auto;\n}\n.scroll-x {\n  overflow-x: auto;\n}\n.hover-action {\n  display: none;\n}\n.hover-rotate {\n  -webkit-transition: all 0.2s ease-in-out 0.1s;\n  transition: all 0.2s ease-in-out 0.1s;\n}\n.hover-anchor:hover > .hover-action,\n.hover-anchor:focus > .hover-action,\n.hover-anchor:active > .hover-action {\n  display: inherit;\n}\n.hover-anchor:hover > .hover-rotate,\n.hover-anchor:focus > .hover-rotate,\n.hover-anchor:active > .hover-rotate {\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n.backdrop {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n}\n.backdrop.fade {\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n.backdrop.in {\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n/*desktop*/\n@media screen and (min-width: 992px) {\n  .col-lg-2-4 {\n    float: left;\n    width: 20.000%;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm.show {\n    display: inherit !important;\n  }\n}\n/*phone*/\n@media (max-width: 767px) {\n  .w-auto-xs {\n    width: auto;\n  }\n  .shift {\n    display: none !important;\n  }\n  .shift.in {\n    display: block !important;\n  }\n  .row-2 [class*=\"col\"] {\n    float: left;\n    width: 50%;\n  }\n  .row-2 .col-0 {\n    clear: none;\n  }\n  .row-2 li:nth-child(odd) {\n    margin-left: 0;\n    clear: left;\n  }\n  .text-center-xs {\n    text-align: center;\n  }\n  .text-left-xs {\n    text-align: left;\n  }\n  .text-right-xs {\n    text-align: right;\n  }\n  .no-border-xs {\n    border-width: 0;\n  }\n  .pull-none-xs {\n    float: none !important;\n  }\n  .pull-right-xs {\n    float: right !important;\n  }\n  .pull-left-xs {\n    float: left !important;\n  }\n  .dropdown-menu.pull-none-xs {\n    left: 0;\n  }\n  .hidden-xs.show {\n    display: inherit !important;\n  }\n  .wrapper-lg,\n  .wrapper-md {\n    padding: 15px;\n  }\n  .padder-lg,\n  .padder-md {\n    padding-right: 15px;\n    padding-left: 15px;\n  }\n}\n.butterbar {\n  position: relative;\n  height: 3px;\n  margin-bottom: -3px;\n}\n.butterbar .bar {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  text-indent: -9999px;\n  background-color: #23b7e5;\n}\n.butterbar .bar:before {\n  position: absolute;\n  right: 50%;\n  left: 50%;\n  height: 3px;\n  background-color: inherit;\n  content: \"\";\n}\n.butterbar.active {\n  -webkit-animation: changebar 2.25s infinite 0.75s;\n  -moz-animation: changebar 2.25s infinite 0.75s;\n  animation: changebar 2.25s infinite 0.75s;\n}\n.butterbar.active .bar {\n  -webkit-animation: changebar 2.25s infinite;\n  -moz-animation: changebar 2.25s infinite;\n  animation: changebar 2.25s infinite;\n}\n.butterbar.active .bar:before {\n  -webkit-animation: movingbar 0.75s infinite;\n  -moz-animation: movingbar 0.75s infinite;\n  animation: movingbar 0.75s infinite;\n}\n/* Moving bar */\n@-webkit-keyframes movingbar {\n  0% {\n    right: 50%;\n    left: 50%;\n  }\n  99.9% {\n    right: 0;\n    left: 0;\n  }\n  100% {\n    right: 50%;\n    left: 50%;\n  }\n}\n@-moz-keyframes movingbar {\n  0% {\n    right: 50%;\n    left: 50%;\n  }\n  99.9% {\n    right: 0;\n    left: 0;\n  }\n  100% {\n    right: 50%;\n    left: 50%;\n  }\n}\n@keyframes movingbar {\n  0% {\n    right: 50%;\n    left: 50%;\n  }\n  99.9% {\n    right: 0;\n    left: 0;\n  }\n  100% {\n    right: 50%;\n    left: 50%;\n  }\n}\n/* change bar */\n@-webkit-keyframes changebar {\n  0% {\n    background-color: #23b7e5;\n  }\n  33.3% {\n    background-color: #23b7e5;\n  }\n  33.33% {\n    background-color: #fad733;\n  }\n  66.6% {\n    background-color: #fad733;\n  }\n  66.66% {\n    background-color: #7266ba;\n  }\n  99.9% {\n    background-color: #7266ba;\n  }\n}\n@-moz-keyframes changebar {\n  0% {\n    background-color: #23b7e5;\n  }\n  33.3% {\n    background-color: #23b7e5;\n  }\n  33.33% {\n    background-color: #fad733;\n  }\n  66.6% {\n    background-color: #fad733;\n  }\n  66.66% {\n    background-color: #7266ba;\n  }\n  99.9% {\n    background-color: #7266ba;\n  }\n}\n@keyframes changebar {\n  0% {\n    background-color: #23b7e5;\n  }\n  33.3% {\n    background-color: #23b7e5;\n  }\n  33.33% {\n    background-color: #fad733;\n  }\n  66.6% {\n    background-color: #fad733;\n  }\n  66.66% {\n    background-color: #7266ba;\n  }\n  99.9% {\n    background-color: #7266ba;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxY2Q0MTBmYi00MDZhLTQ3NjctOWVjYS01NDQxZDI3N2YzZmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTA0MzlGQzg0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTA0MzlGQzc0ODQxMTFFNzgwMEFFNjBCMTUxNzMwRjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MmYxYjVmNS1iZTNiLTQxYjktODUxOC1kOGNmMWE4NjhjYjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MWNkNDEwZmItNDA2YS00NzY3LTllY2EtNTQ0MWQyNzdmM2ZlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++I+lkQAAAWtJREFUeNrclstKw0AYhU9C24VtwaVVUQR9EN250GcQ6hP4OtInUBQFzaJQaLa6EUQEFa9tQxW15EaaNOPMaGqKlZiSCdgDk0x+yP9xzgyZSIQQpKEMu5Dbxiq9VegoJdy/RUdZWphRJOaIgpoCIH0YBU3LXw8lganx3jJS0viBMqO85F4/wDis8XlhfQXZxTkxjhjENyw+AuD/WSP3vgnn/Gqgll9bhlyYgFzM83kia2TXT+C1npGdnYI8WeS13NI8clsbyTlibty7BojThb5fpd8qIiY65iaQ96jBVk+TBwVuwrIoyHvSBmrE9WAc1NC9uBkNFHbz3ZVA36vyKJl6L2/oVHbhnF3CVFT4lh0PNMxNIP9dh3lU58072zvotV8/66YN81iNBxrqJiS23VlcLLawWHy/RSjHcfMX8QhNOxoU5SZKPELlZ4TBCSv0x4GesNL4HnwtgQwtDNoMCgmLbd9yfzOkoQ8BBgAwdLalhCPNXgAAAABJRU5ErkJggg=="

/***/ }),
/* 131 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAA3CAYAAAAMnajQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUM4Qzc2RDQ3OEVFMTFFNzhCMDg4RERFRTBGMEE5RjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUM4Qzc2RDU3OEVFMTFFNzhCMDg4RERFRTBGMEE5RjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QzhDNzZEMjc4RUUxMUU3OEIwODhEREVFMEYwQTlGNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QzhDNzZEMzc4RUUxMUU3OEIwODhEREVFMEYwQTlGNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoxnKXkAAAkhSURBVHja7FxpjBRFFH7d07MLKkdcRMN6IEtACIEEUYIXIioBDzSCJASNEo14BBVNSIwBj18mugl4RFBjYoi6ggoCnhwGEUQBBRHNRqKI6HJoQM5hprt9r7uqqampnpmenZldeuslX2Zrprv6qK++d3T1Gkfn9IKIZkTY1gVtsbPO03dntc2I5JFRg3gE8SviQdZWbactxmaWSB7abxzie0Qjog/iRdYex37XZNIkCiVPf8RyxFLEAGmfAez7DxH9JDKBJlPHIpE86LRdHeJ5pjbXF+j3RsQPbPs6tr8p9astpiSSVYdgIe5HbEc8zOKeYqyGbU/7TWX9mApXpy0mJApzXaMQGxBzmaKUYrTfPNbPKB0vxZNEsutKIPoiFiE+Rwwp07GGsP6aEL3ZcQzt4uJDIu5muiGeZXHPzRU65q2IH9lxumoXFx8SWSxu+QkxE9G5wsftzI5D8dIUpkqmgtSGRlXQKuPB7hrEpW1A4nMQb7LAfSTCgZNVbl3tLq+5edqG1HajkijRRgQSjY5/TI9z1ewEYhdiNWIhYqVEICMKmUxGIm0dy6j80oC4B/EZYhViIJRYz+N1IG0d265CrENcDeqnDJVXouQ183Ke7Go75awL4n3wH11FUiSrNUqU6H8vWEMmgXHmBe3mTtA5OTs/Aff4n0HbPX4AIHUAjJ6Dwd76gnIS2NsXgdPyBZjnXAdQ2z1nG2fnwuzZh9slBk6A9Kr7lG15W1WfQRCyZ31wvsE+F0wEo9v5wfkanc6F5JiX4cSS8ZW8fVRyeY0pUoYRyRHiJDdfYF2aYx3zFGS2LQNnS5P3d7tIQQ7+DrWTl8OJjx/3SEEkt3/72h+YHn3x94k5pDB7NIDNBpmIlrxsGtjblvrtLmeDUdcHUmz72ttXsIs/HYwzeuC+6nbml08CAiSvmgnOX1vVrqDXYEhvwPOWSErnVztlPTjNTR7BrGEzwP1nR7WSnNEIuhC7mCC7VSQ6Pn+4d4E0a9qLEXGIQIm+Y/3ZT4Nb28UnAyJx3ogsEiWvaMTBPwusgbd4U48GPlE/FJz/dnsDWDNhIaS/agz6T2+Y5w9+z0GocteHtt2D2QOeXjtDHQpc0ZhbRMPQwGn5GXOoI97xiZzuvzu93zpN3QJ288rQ/spkE1jmxomTV414nai0WS9JcHsiEiEx+DFIr5jluykkOhFIvvn2rvVg9h4Bzv5fg4FPr54JtXfhPRx2J2R+XJylWvxvckHOrrVe36p2MWThSkTnIFvqvWsDt5Ycfl/QDuunzDaSiYsrkCevOzMhRsbdDbkT7kq84jgpUs1pOGj+7+k1z/lkI1LgIDl7t6G07vXiI29gm1chsZrBGjwBEhdeHrgnIqZ10diTVbozXwlUwndrz4Dz+/pWK4XsNnmbVJOUqMJWz0jkMH64hQLrWD2rIndCrsnsWu8NJA08zV6a7aRE9CkHyV4A3nAtGOTSti/2gmMeKKcWjPCCWujU01cu7E8MzmlwuUp4N/SSpz33mXNeEdxZO1Aizg1bCK5DY6PYkYgI4rK4J1CLugZwty0AkL/vPhSSI2f72eX+HZ4bM/tN8me9FCiLRMlnKgKV4s7aWIn+Fso/tuTOctxa7AuNpChmXW9wD2wG/1nvyfTZ+WM1ZDa85Lk8e8cKL8bjSiMrQCQi7/s55zsVUXj2J9uxufVZqX6p59EK2wS5D8WNfJIVW6MaUfLyh7xsLbhgdFlu6jC4h1o8YvlTamagTNagKSdTe5z1XEEoW1PVmMRjmfXDINHvGsi8u6BgnSlITiR1DBQoiLGylYibWEKogH0EEZ70x45ENHMp26L0mAY+9cHdTIXwxm9s9NyVN6jNTYqaxd5AMShlp/pQoCCpA/nVZ88mr6iZ2TwvOF4p7kxWnDZQIiporYMIy0TKQiJKjTObm9oFiWpGPwmpt2/wB27Uc152RYTKGXQWeNMMp5iIroHcmVj0o6wsTEFy7gGpmoI8p5gdRsyGiEtBjKNzetE7YzviokSUSVWzfkUxV1htqJhtyIWSAoadM12P0X1AwWOUwY4iZjAVOsaQAn/ZSBr8xyAUZLudp++Od2Bd7QJoMYObb5tC6uWpY0vFr4lWmNJy5WZGFF6hFtFxYiJtRdlxxD7w17rT441vmOpwtbEFMjmFiGSxH7dA+d7qKMV+QTwKemlsRUVaFEfWthlx0oLL4nC4+5JI5IaRaDL4b2HQQNZV8cJoNrzBZoOK8ZpM5ScSh6MgEYctEMkp5NYsobNliLXgv/VBeXBtBS+GgjVaAPUO4ohwUUX7YW0lK5ErqBAHJ88JiUgiifLGRI5AJErxaC0D/cOGhxBXVuBCvkS8jmgRjiuerH7jo7IEAmnMMwo1EmOjgpPaEjpKCKC1rrMQF4P/Ok9DGS6EygivIjZLgZscxDmFfLC2srgzfs8zAmnSUtspZlKrSCQuDdmImIagtQ/0ZkDXEk78X/DfLftUODn5Mywb0ASqjBo5EpFUY2FDhBSfr6UVF2bLsQnFS/SC4x2I8UWWBqjfJYi3EIcU5MlIrLcVNQqtRJUhkhg6OFJYYUcNLUQlMqTIXTwIKRQ9PHoF/IdzDyCG5zlZWtQ8H/GngjzpPCTSSlR9NZLH2o06kbkSyT6Td5hkn5ZAJlrG9wQjEb3aIL7qsZPFPd8KxFARKJ1HhXRgXb0MrRCKGgOuRBAic3xwLUYoS4id6BnLd4ibELexlH2pkB7aIeqTLlKFdK2oOplaPtIUde9FEsnSZjPiyJ8JgUxEgkUMqtTRDlEfFYF0el8d8hTTjvwPHRyFK7MhuxBpC4Tjn+LKNyhQfygUSIfFQZpIbUMwiEoiWYESIS5NJJPo1gwpKLdDMjBV/cEu1Q9raz9mQe67RVxRTEUtgZPDKlKJbAV57FKzAG3tm0TiCn5bUhZTUChbiIUSkL2IW3aHdojbCsvANIFOYRKFDaCoFqakMvKbACAF56rildifJk8MSRQWocsqw7+zQf0qiRtSuHJ03NNxSCQTyJX+FlXJyEMiF9TLO3TW1YFIJA60oShMhf0nrUIFLE2eDkaifKrhKgiUr2ilydPBSVQMmaLsoy1mZriuHmdtrTNT3wJtmkTaNIm0aRJp0wb/CzAA1KOftC2xGYUAAAAASUVORK5CYII="

/***/ }),
/* 132 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAA3CAYAAAAMnajQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzZBMzVEQTk3OEVFMTFFNzkzNzdFN0Y5MDZEQzJDNjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzZBMzVEQUE3OEVFMTFFNzkzNzdFN0Y5MDZEQzJDNjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NkEzNURBNzc4RUUxMUU3OTM3N0U3RjkwNkRDMkM2NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NkEzNURBODc4RUUxMUU3OTM3N0U3RjkwNkRDMkM2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnY+efcAAAoASURBVHja7FxpjBRFFH59zIwoIHERDB4gl0IQEryCF6yoCXjgAZIoGi+CVzzQSGKMGvWPiW7iESPeMR5B8EBUPBCNonIIKiIqAWXjBYgGFXDn6G7fq64aamqq59rZmXG2XvKlt2d6qme6vv7e9153r7X7gQFQZlhlbBuAiaaLHtf9krNul0keFXHEDYiNiGv4um47E00cdoXkoc9NRnyBaEMMRjzE1yfz9w2ZDIkiyXMY4k3EIsQI5TMj+OuvIoYrZAJDpu5FInXSabsWxH1cbU4rMu4ZiC/59i3887YyrokmJZGqOgQXcRViPeJ67ntKiTjfnj53GR/H1qQ6E01CoqjU1YpYgXiQK0olQZ+by8dpNX6pOUmkpi4HMRSxAPEuYkyV9jWGjzcPMYjvxzIprnlIJNLMvoi7ue85q4v2eQ7ia76f3ibFNQ+JXO5bvkHMQfTo4v324PshvzSDq5KtIbVlUBN0KoTZ/QhxTB1IfADiaW7cxyN82NPlNt3u6kZQYN1S1oNySeTUiUBy0P7/NfNcs0ghfkJ8gJiPeF8hkFUOmWxOIhPdK6j9MgRxBeIdxFLESKiwnyf6QJ0Oq89YMzX/3zgJ8SliAuivMpSUzipz5QecCrGT5uAyvPoRpHZDZvULkFl1R12PiHPYTPDbF0PQ8XN2PejYAZDcAVa/0eCtvT/vM7GT54K3fgH4W95jvwsSffK28dvnZ08Yu/+R4H3/+J5jMXCadts8CZiyEDIrHmb7abDohXgZcSLiW57KfCm9BYVIVJESWXsdBPHJ94H/2zroeP0SNmE0WbHWWyBI/q2dqJo5yL82Q+KCNyH11s1sstwx08H78ZNwsvsOxfen5U203XcIeJw4RLTYcVeCt25RuN6rP1gtgyEptu/YBu7RWMwmemd/Z3zibeBtCK2FM3widDyVT6L4pOdxrH7sxAuLU3pxH3QouyD50imNQCRquTzOFSnDVakokSr2RM4RM/EA7A2pxRdmz3g6M70NS8E9fFJdjwQRhwjkDJ0UKgROlJXoxQhEhHAOHseQVaET2sDquT+4I89m2xMx/PaV4P/9C2Q+b2MESn/ctoek+HtTC6aBc+DY7AkV7Pwd0stmM9Df6gmXOH8Jfo+eEPzxAyMMIf3Rvex9sWyQoCJnIuQ2g60uSWfsjP6zXeP7dzXEkSAiEZzRN0F6ye1hmkKCEHloouXwfvoM7EHjwN++EVVqUzixH8yBxCVYvBx1MWS+fi0vPTEi4QnESNh6L2S+mpefUreuhmDHGrCHT4fMd4sZOen7EKH87ZuY+qXeuIZt02AxlVduQnkKqpHoE5VfI/IDmKdQKOXe5uV1PQLsrCc9xoljkyzSBykSqqc9YElWARjZiCDHzgJ/2zqWqsgf2QNGM1X1t28Ad/RUcA49no0XbFvLxiPlSr1/D6pMHwj+2Zrjj9Ir5jKykg8jgoiUR8QS6iVSmTt2FniblkR6qDrFeC4ugUSeyHRm7X5gwCBc/liVuhFzvj3wGEg+05pNcfUIUhxKTTS5QnUoZZHi0OTSUp00oQ5Woidk1ofKQwbbGTkV0ktnsZQEe/XLqoYYj7YTpM1RQhxLfC4+dT5TaP/XteBtXJxjqkmZ7L7DGWn9zZ/lqWSdIo3oz5fkjTwORir19lgXqtD2ZlXaKXeFCvXa1XUlkDDMgeR52NnSMgSCdc8BqK9jpRUbfwdY+w0EoInHNEbpJ/QwqFw9++IkhySJMr+UymLHX8uUiRGD9kGGmae95HPjGOkoZRJZIH4XG1fYAdp3x6PDGi2luZw4wlxHNiDtzpKIzqT42Y8ww0hmswFLV0Zyu2VQjvdg/gi/OyMBltw0oZRWaNIp/TDji2aaXhdGOCpYQYEp3Nr3EAi2hv4qs2Zu/umN4+nG1XrL+sZvUtFlFesbuZ0m0ITZkPqwra4lfbGeEVMJrNayP5pSXXInprstjFjhqTUnq0zuqBl7Snv0PqQiTOGwWpN/J/khSuHkDzOf3g3xs54BQP+UWfWU1izHTpzNvJdQOJEGmQo2VqyG/IviViHJqth3MAK9c2eOqWwI5cHvRmrAfAhOfPKVS7OTSiU7pStGig3z8j+Mxpq8Dhun3yhW3ot1albKpjgnhR0xkxHO/2MzOIMnZCszVYmY18LvF0MyCXXTeao6x+tQxpX+iklEZzNbjpnOoDOV9Qpq/CVfOD1bflN1pWs9+L0PZEaWJpHUgMp7SmeBZLqpKtNVTqRiRE5n2JRso5H2KZquiXOfZq/JRjmrREoV2WBKtBbCSyAl3yZC1Rk97rOpklRm4yRoja0i+7UO1vyrkbkvtC/5PXZtEVVOty15tgbxkjsRF0F4XxndVZHkkKs0qs6CqpDIRNPFbsRsrkL/SiRKFSORbY6dCQjvML0csYoTxZcajQEUua/INcevW0YHgi7w0b3udHljOVcdubEoyOQXI5LL3/wKqvdURyXxHeJGMLfGdmXIx1QQw+PESUspS8AHqUtdaG4EiS6A8CkMmsiWGv4wOhue5GeDjvGGTNUnkoCvIZGAJxHJL5bWXGmwNxDLIHzqg2r2RBf+GDJrdAPUi4hdkHsDVEl52ETFShRIKiQgyJNSiCSTqKAn8iUiUYlH/Xr6hw3XQniXW7V/yIeIJxBbpP3KX9Y88dG1BAJlzjMaNcq76FrME4mBHAl0mfZ2xJEQPs4zpAo/hNoIjyLWKMZNNXF+sRxsoirpTBzzjESatLLul3JS60gkl/2fI65E0K2K9GRA7wq++J8QPlv2tvTl1GVUNWAI1DVq5CtE0s2FB2WU+OJeWvmKvupNyC/RA47UzZxSYmuAxl2IeBbxj4Y8GYX1nqZHYZSoa4gkWwdfsRVeudZCViJLce7yTkih6OrjIxBenLsacWyBL0t3xT+G+FlDnnQBEhklqr0aqXMdlHsiCyVSc6YYMMaXrkQmuvnlVk4iupooXz1s575npUQMHYHSBVTIGOvaVWjFUNIcCCWCCJkTk+tyQrmSd6JrLNQmPxNxHi/ZF0nloRehPukSVcj0impTqRUiTUnHXiaRKm0eJ466dCQyEQkWcOhKRy9CfXQEMuV9bchTynrZ/9DB16QyD3IbkZ5EOLGU73yDIv2HYkY6ygcZItWHYFAuiVQFciJSmkwmOa1Ziin3IiowXf/BqzQPm2iccCH/2SKhKLamlyDI4ZaoRJ6GPF6lVYCJxiaR/GCapyiLLSmUJ3khB3Jv4lbToReRtqIqMEOg/zGJoiZQVgtbURn1SQBQzLmueSWPZ8jThCSKcuiqyojXPNA/ShJENK5843u6D4lUAgXK37IqWQVIFID+9g5TdXUjEskTbWkaU1FPRBZrYBnydDMSFVKNQEOgQk0rQ55uTqJSyFTOZ0w0WVhBYObZROfCPHdmwpDIhCGRCUMiEyYA/hNgABE+HzFX03K6AAAAAElFTkSuQmCC"

/***/ }),
/* 133 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAA3CAYAAAAMnajQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTJFODA3OTk3OEVFMTFFNzhCNkQ5MDAzMkNGNkNBMkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTJFODA3OUE3OEVFMTFFNzhCNkQ5MDAzMkNGNkNBMkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MkU4MDc5Nzc4RUUxMUU3OEI2RDkwMDMyQ0Y2Q0EyRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MkU4MDc5ODc4RUUxMUU3OEI2RDkwMDMyQ0Y2Q0EyRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plc8aGkAAAmfSURBVHja7J15jNRUHMd/7XRmWQ8wLoKCAgKiEASjKMEDRFCzKIiKkiAaRQ1e8cBEE2NMjP6jQRPxiICKMahBUJHFoIhijFweKIiABBMQUC4NisjuzLT193t9b+f1TTtHd3Zndvb9km9mO9vptO99+rva7hqu64I2bS0x6+isnsV+xihiXU1oFVrt/Xt8y2aR8KhKoB5EbUfdy5eD1tNWxWZGhIc+Nw71A+p5VF/Ui3x5HP+9hklDFArPmaiPUQ2ogcpnBvL3P0QNUGACDVPHgkiddFqvDjWTe5sr8mz3atSPfP06/nlT2a62KoVI9TokC3U3ajPqAZ73FGIJvj59bhrfjhkQ6rRVCURhoWs0ah1qFvcoUYw+N5tvZ7TOl6oTIjV0xVD9UYtQy1FDS/RdQ/n2FqD68O8xdIirHohEmOmCeornPRNa6TuvRf3Ev6ezDnHVA5HF85afUY+ialv5e2v591C+NJV7JTMAakOrTdQiE8nuV6gLygDxyah5PHEfhXIg0+XW3e7Smptj2VCW3WIhipUJINno+4/qeW4zS6J2oVaiFqI+VwAyioHJ5BBp61hG7Zd+qDtQn6K+QA2CiP080QdqkRmdTgXjhHP11LRfG4lajboUgq8yFBTOomXlJ18OiXEzwTiuq+f7kv+BvakBUl/PKPuoxC+bDakvpnujgIAbXfr5E4J9a8Bt3O3/zMXPQ3rTfIDG/ZCY8CY0vTc2+KTB7ZndzwP7l7mZseh9g28dZ+dC/1gpv89KWP7+FdxD68s5ZMej3kddgtrCQ5kjhTe35J6IBjIx8RWwd6yFxjnDgW4pSS57DGKDx4N1/pPlLzu7ZqCxBk8Fa9DEzDL+bHQfkeVNYwPGsIk0B0wG5+Cv4RtHyKzzp0FsyMOZ+DDmcYidNoKJfs6C+pIZzd9tdhvse4+WaR8rwKjlMpczYRQa2iJ7Ijpo99+DzWe7OPvsbWMhdvpFkP62jF4IPYpx3Ens1d61xhuB47uzCRY/Zx3PsBm4715+GR92C/OqnaZtwGM80LxOeusysDc+xzxYctENEB/9DC57ANJ6wgObPVZkn3TorePDp7P9Mur6sjES70HiWHB2rKmU0EZFzhgUHYRdSJIdGSJ7+zKmSjQCx+wzohkgeiVRyDA61WXAoslHICgsW+dOZh6VvIvzxyZIb17MoAsLzQykZTd50CFM6Q0LfL+PnXknOPu+Z56NwbypIQMUQmyeMtj3ngh5ahgsk03ilZsAJ2dYE32ios3Z+1l2CMFBiA24DFIrny3rCLCJwDOcXplX4p7HPbwPvcQQcH7fyF5TdDUPc6P4yEeZV4VO3ZgXavrgNpZDscmWchnaHgFH65NHSX7+NIJ4AtuunB+l1s1mALqNhxhEAtpmwPqNZaCq7xPkFWKjuHNxJXhC86LIEMlWc+MKHFzv1qL0+gW+AS1rck0A1WFulPw3PLfD3IjClHVWPfNSqVUvsYkXEIkQKCCik6fpvc/YtpmXw2O1hq5gY+ADGXMq4VUYfAgjhS4CGJJHMFwead42ecEItym3pvXkEDmcDzdfddbitjdVMRQazN716NofAeefPSx3KIfRfsSvfBmME3uDg3A4WG2Jyszo0gucA1uYh2DhTarQCCLmXfdKIOCEF1JpUiiLX3Qf80zM0xAcmOe0c7N4TmRymEJzo5JAJHIE5oFqOkP8wrvKBhHtR/rH+RCvmc72gUp9UalRCKKEmTyBlyj3yrmfFPKEx2HrI5BBZTgdt9lzmAfptgVgYtWVXHpvewboD8g0om0lnGWFtcihrGbqGt8AZ+L6b2Akjil/TiTyE6wek0tuZZ6B2hHpjYtYDkPes6WgUz6UqH/bA2z1U8ybJSYtxMr0jUDYWO7Ek3xZFWjfQ/ZF8ZwlfrSJQldPfZX0d6f6mnbWOVMxLGypmNFguQh6htSKJyDWv55BbvM8Lrn8kZwNvpzhDKH0hbCz72SezvlzB8T6XtpcmfmgU3KsCrYlUMSV/sgQ0Zln9lgINVM+bu6vkPunXCS5+J6yjgABQhMqKiEKLTShBBELP9Tr2Y8VWq/RYEfsEruH97IqLnbGNay5SGPQ9M5V7ISi8r7munnsPYKQJd0IHXloGqOwfaZkXO67lckw82eXQAq+TcT474Ue9LhPpNqSdXnxDKTGmThzw/KGSjB2fa9xf9blDnYCYOkuty3o2Kjkz3csotdU7O8q1KiMvRm8+8roroomrhT5DZ4fubX373FLBpG2qjKsOGAG90JHJYiS+SAy9dhpA+8O09tR33JQRIdaVulzIm3t2hpRdFGQ7nWnyxtrudcR3saWYHLygWTxX26A0j3VEcW2oh4CfWtsa5o8pgIMm4OTkkKWkCPClwKRGwbRFPCewqCJrGvDA6Oz4XV+NgQRr2EqPUhCTgBEQrYEkpMvrFnSxpaivgbvqY/JVHW24sFQskY3QL2LOgL+G6AKisPaInsiV/JCQgKepAKSDFHOnMiRQKISj55WpT/YcB94d7mV+kC+RL0G3lUqJ2Bn9RMfrQsQKHOeDvBGcm6U96S2pA3FJNFfMXoCdR54j/P0K8GBUBvhVdR6JXFTkzgnXwzWVpJwJsY8LUGTUpadQk7qIIjksv871F0oavXSkwGdI+z4X+A9W/aJtHPqa1g1oAFqHW/kKCAFzYUNRZT4ach+VETNTShfogccqZt5TYGtAdruR6i3UIcD4Ekr1NsBPQrtiVoHJDl1cJS0wi42tZA9kaFk7vKXkIc6hHoFvItzdHFseI6dXYWag9odAE8qB0TaE7W9N1Ln2i32RBaeSI2ZYoNx/mpJMO1EPcYhoquFvaXP7+R5zzcSGEEApXJ4IZ1Yt12Flk8FzYHwRBDi5sTkWhwoS8qd6BoLtcnHo67nJXuDVB7aId4nVaAX0r2itqnUckFT0NjLEKmuzebgqK8xCSaCYBFXUOloh3ifIIB0ed828BSyXPQfdHACQpkN/kakLQEnXuU73yBP/yFfIh2WB2mQygMYFAuR6oFiISFNhkkOa4aSlNshFVhQ/8GOGoe1VY5ZkP1skfAoZkAvQcBhFeiJ7AB47KhVgLbKhki+g99WPIspeShbyoVi4L+JWw2HdkjYCqvANEDtGKKwCZS9hal4GfVJAFCS86Dmlbw9DU8VQhSWoateRrxnQ/CjJG5I48rReU/HgUgFyFV+lr2SkQMiF4Jv79BVVweCSJ5oI6AxFfaXtPI1sDQ8HQyiXF7DDQAoV9NKw9PBISoEpmI+o63KzND/vlNbS00/d6ZNQ6RNQ6StCux/AQYAQjLHy5m1KtoAAAAASUVORK5CYII="

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d9af1d6bd12e4d8afce5448ca9427f82.png";

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "a7e23fb2545a17e0293d2a251a0eaac3.png";

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4de7a7de9885160816befac10c0c1fd5.png";

/***/ }),
/* 137 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkExMzlGN0Y1QjBBMTFFN0EwQjJCMjkwMjdDNEUzQUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkExMzlGODA1QjBBMTFFN0EwQjJCMjkwMjdDNEUzQUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQTEzOUY3RDVCMEExMUU3QTBCMkIyOTAyN0M0RTNBRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQTEzOUY3RTVCMEExMUU3QTBCMkIyOTAyN0M0RTNBRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnjoU9kAAAF5SURBVHjaxJbrboJAEIVnl7ug2MsfH6nP0b5WH6/aJk2jlYvscunMKLRoSVQgTrKJC3K+nTMzqFh+fD4BwCuuBQwbK1zPAgHLEcQbiBxRnGIhYeQYBGCZJsxnwb/3zD7CQggIJh4Evsf79Xc0HGDiOjANfJBS8D5TapgMXMfmU1vW/tGqqjgTrYt+ANu2YOpPwD4IF0WJq0CQxXud59cBTMNgjz20pA6lc8gyBT5mIvYOXQ7gAqIw2fE3lNKwjVMIZ7/+F2XJGZ0FIG+pgK7jNAJ1pLuMO+XxLuTM6tA673bgxGsCeO7JF2vxh/msKfBVgDjZQZJm6LmNmbgstkO/+eT3IQ/Vcei8OB9Qtx5BaFFG6nDCHIWklGDI9guAuukiQKuoB3HyvJ5UysrBtvWwTgZepyJfDWgNGM7B13rDUPI9wm4yDMkZ937ZCewo6vljra72vBhQlhVstlHnQPW2KE7S2/0e3BywGlH/nQAv9GEE8Tf62/IjwAB7fpVOp+ZWnQAAAABJRU5ErkJggg=="

/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUJBM0ZDNjc1RkMyMTFFN0FDRjBCODRBRDA0ODk1QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUJBM0ZDNjg1RkMyMTFFN0FDRjBCODRBRDA0ODk1QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQkEzRkM2NTVGQzIxMUU3QUNGMEI4NEFEMDQ4OTVCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQkEzRkM2NjVGQzIxMUU3QUNGMEI4NEFEMDQ4OTVCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu6owSEAAAT0SURBVHja7JxbaBNZGMe/aUyytGoFcVEEHdeqTwpStSL4oEUQL/gg+LKLYBFEQdZ984K7KEV98goqolYQXxRBxYog7b5IwTsKom29pMuCCqK2VrGpafx/mS8l1mk8SSaZmcz5wx+mTTP5zm/OOc25fUby9R1yQb/BtfAsuAaeDI+FR8JVcDXcDX8Sv4X/gzvhR/A9+EWpgzZKBGs0vAJeBtfD4x2452u4Bb4GX4V7/AyrAl4KN8DL4V+KWI4vAu0UfB0e8AusMPw7vBWe4UITb4f3wefgfqefvpP34lrUATe5BIrkc5skjgYny+jUjWbDbdIMTPKGTImnTeJzHVYU3g9zW64jb6pO4tsv8boCawp8E/4LDpG3FZI4b0rcJYW1Cr4PzyF/aY7EvapUsLbAF+Ex5E+NkfjXFxvWLviAD5qdSrM8Ae8oFiz+3vQ3lY8MuFHK5SisjfAeKk/tkfI5AmslfESeRDnKkPKtLBQW/5s9WwZ9lEofdlZmQ/KCFYEvyHRJEMTlPC/lzhnWXrLmnIKkWhmE5zTrMFuGCCEKnhLwXPiBSs3i3x0NKKh0/3XMjo0drHXwfAq26oRD1mY4gqx5bpO0YvA0+GsmnEz94SaoRHeM+p5dS11Ha5ZRqNrVZ2YKjzN2zZCvt7kZXTz2LyXjvSnHY61eqF1bMxllwuLFheluRpbs68m4/ugFWDOEyw+wGnQ3ZauGobDS63paP2qF8BmExet6Uc3FVlHhMwhrsWaSVYs1LHXVp2GZP5ua0EpNVZkV5N31Ps8NgRjWTM1BSTMZ1lTNQUlTK/SgWX2syLDGaQ5K+pWnaN6Tw6vLie4uDIRbUgPinMaGX79897MxIrf9b0ZkJEXMegpVTy4GrA88RVPl9F37njXnDEoFnsrf8xRPZe3GYsCq5GYY1i1MSRGuWT3pgaJjg6ma5RR/eYOS/Z9L2wzDlRSZsqRYsOLcZ/2Pi4leeHSfbx+iZKLPKngoSpXz/vRSzfrAzbBXtzAlvWNY7zQHJb1hWB2ag5I6GVa75qCkpxqWujoY1n3NQUn3GFYMfqlZZBXziaWnlVs1j6zi02eDc/AtmkdWtWbCaubxr2ZiPy8gfAZh8fjwquZiq2bh893y/Wm3ozKiozOuR3kF1qn0RSas625/m4+Yi8gIV5ERGYVrTyxldggX6wEO2cy2zgs1zEPiTSFNw8EKC01Tc6Iusnb+9ds1Q5IXGjWnlBppyBlruw24XO1uBRzULbvuyA4WH/PnGf9EQEFxuTeRTbqD4U5Y8Ib5wwGFdWS4yYVseR34DAufXA/SkRRO27IAjtu9mO3sDr9hDVk5YYKgbilvfLg/+NkROk6OszYA/VdCypk1GZDK4cwr8OYyh7VZykmFwmLxwZ/tZQpqu5SPnILF2luGX1j/kXKR07BYO8nKvDHgc0jcR22Ad+fypnySYByEV8MffQqqV+I/kesb802vcgmeBz/2GajHEvflfN5cSOKep2Tldjnkg2Y5IHFyvE/yvUmhKaF4jxDnpllINmeKPaIHEt8WiZfcgpVWmzw1HoDHPAKpS+KZK/EVrAqHq/pxss4s8gyjW9sC2uXzp0k8jo0+SpFNklMvccrNYp464+UqPi98knyWTdJOxc5T2lyKAb/hYgZc7uPSGXAnwRPISnFSLbVyQACwX5GVAfc5/BC+Sy5kwP0mwAAe1SgAI0xerwAAAABJRU5ErkJggg=="

/***/ }),
/* 139 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0JFMTYxQkY1QjBBMTFFN0JDOUJBQTREOEZFNjBEMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0JFMTYxQzA1QjBBMTFFN0JDOUJBQTREOEZFNjBEMjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QkUxNjFCRDVCMEExMUU3QkM5QkFBNEQ4RkU2MEQyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QkUxNjFCRTVCMEExMUU3QkM5QkFBNEQ4RkU2MEQyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph8gqw0AAAD8SURBVHjaYvz/4rQnAwPDXCCWZKAueA7EyYxAC57RwHC4JUw0NBwEJJkYaAxGLSAIWNAFfj87yfDr8TEGhn+/8WpkZOdn4FD3Z2DiliDNB78eHyVoOAj8//mR4feLC6T7gOHfH+L9D1X76/4ehr8fHzKwSlswsIhqUzcOfj06BPTJOYZ/39+CLSLsAxLA3/d3Gf7//YkINiQ2VXyAzUCqWsDIzE5bC5gFlRlYJU2QLGSjbhyAAJuCEzCs/sFTEWELmFiIT6pMzBBLFF2IDyI2GWugKCvh8GfnY2AVNySsDljh/B8tTQfcguc0NP8FyIIUEIMGhj8FNVsAAgwAKO5OC/R+hiMAAAAASUVORK5CYII="

/***/ }),
/* 140 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAAAyCAYAAAA9SBshAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REZFREQ5MzdEOEI2MTFFN0JFMkQ5OEQ3MEY4MkMyMDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REZFREQ5MzhEOEI2MTFFN0JFMkQ5OEQ3MEY4MkMyMDIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpERkVERDkzNUQ4QjYxMUU3QkUyRDk4RDcwRjgyQzIwMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpERkVERDkzNkQ4QjYxMUU3QkUyRDk4RDcwRjgyQzIwMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppca2gkAAAmdSURBVHja7FxpjBRFFH7T0+wS0ZW4iMiqIIviEgWDByEqigfJ4q0oiUc0RuOZqGhi9IfGaEw0SqImBkSjMYpRMd4XihpU1gM8wKAiHiseoGJQBHZ2prp973VVb3VN9czswh429ZIvsz1b3VUz9dX3jq6eXBiG4MzZQDJ/631N7ltwNqDMc1+BM0dKZ86que9uts91o60LVp31qlLmLKhDXINYg7hSHtvaOXO2XUlpIxmdMwPxGWIOYgzifnk8Q/7fkdPZdidlGhnHIV5BvIRoMc5pke8/h9jfICc4cjrbFlKaJKI2jYi7pRpOr3LNkxCfy/aN8nzPuK4zZzWR0lRFTyZClyNWIa6WcWMtVifb03kXyet4FtfuzJmVlGmuehriI8R9UvF6YnTePHmdaS7edNYdpVTkyCPGIhYiFiEmbqd+JsrrPYUYLfvJOZfuLI2UCrsibpNx4ym91N/piJWynwbn0p1Zs+wt946sx9cLELciRvRh3+sQNyIWIAKIiu16wd0V37NpYS2kpHjv8H4c5MeIozViOkJmj3iVjsvm2u9nQoLsf6ubx8xaJ2It4h3EM4jFBiFzJjndhgxnvW1UHmxGXIx4A/E2YjxUqF87Ujrra5uKWIo4Bux3/RwpnfWL7YJ4FqJb02WK6bvvp7INOnYeFN++FLwRJwDUDy1vUNgIwbo3I7eDbfJjW6H4/uxEk/yE6yD8fUXcrlJfYtVCa7vc4L3AP3R22bX9w26FsPAPiBX3lJ8zdBL4B56X2l/wzy/W8/rIqCQ4XypmSRKTk90djpTeqLNwgoeC+GZ+2cSZE87thzVHhJl6A4Sb1jPiSd9lD0bh6YhE+fEzuf2gI+ckJtxraALx90/Vx4bnChvxaaY6fua+6lqfAPH9u+Dt3hKPwdvzQO5DmfocuV2bIb//cSBWLy4nLJ7nj5zQn6RUSe5xiLcQYod1395wnMCmQ7ui8Ol3odJsArG2rYy8RK7czruz0pGVVj2PJwyB0rI5Xcf6OTjJxY/m8bVIGXtUS1nflp7GvnYu9xmsX859UH/Bn2ugc/Ht/Bl4Iaxt+79NyUyI7vDFbjwzSkmuM+zYAOHGT7uON37FCqMfi29fiBWSlMQb0cJEUkRU7jj8+zteut7oKUywAioKkRQ6N/M1iQD++NNQJY+P3WjwYxsE7c/0+DPQAvBGtcYqbn6+3PAuZaOx88L45JYu93/UbCg8PiVBcCJsquFnHQB2tCSlunmSIVLufSS6pBEc/7ECzrgbSiuf50mjeKz+7Eeh48HJsasmRcnvHU2gelVqR+6YyM0En3wpk5RIRy6P1IrISS7SGzaPiUxEpLiObPBl30L4758Q/Loidv1MNiQ3XYvd65I7y+JGGiPU7QT5McdYSUkLikKIXH0DL6y61jsg/KsdP9dbybhUjo3UXXfpaUYxcOnLx+PF3A/WJEkZSKXMTkxJE1V/xiNQlCoYbPgRCXawVEBUn/ZlsWpykI9EIviTZiViSXOSiVBqouPkQp6jFgD3LxUsv+8RrLy6YtL5tAgqqWj+oEugtHwB5MdNZ4LqY1UxZeeLF/JnIQIVl86F4Kd3sG0jExYGDwfo+J2vE48HiZlvmhTHwbnGZvx7Hat91wI8fiBMny9jSk52MhNTsrJ1boky4P1OBfHDElS24dGEk/p8/XL3viVUxsEXfRG5SFQSyoyJsKSErIj4Pzqm95V7pePcbqPYjar3a3LbSEIio1g5H1VyEWfZackO1DdI8k9lF87quccU9gD0qrtzUkpS9/i4cTQq7c5aSNAyEKbuN0nGeOdYphIdmlByR6SQweqnOMbLj7uEs1ObS6ymvIUFJ6Ir/iNSJlRFUkBSM/4/ZrTkhpVakjsm1SGXWnxvTkJFq5adpt3JYyfSEalIwbgEZSvxTJgZ/V0/hOPeqosVVZJUmpMvXLSUGKnjAWLLzUQnW6REIlHsxhOGEyzWvAb+xFkQ/PZlz5RXc6FEkkEYEyologycVYpiwW2wOLPXFI7ITjExkTDRljzAN4tk2WCINQ6MSl57xQpvVggSec4L1wyEaXsRjE3fmSIlTxLGS+KHD2L1IndKdb1tzeyJJEQW3ZUyeU55tIyYlDjV4r6p5ugf0MrJk2407s5Xr+cYmSsCKqQ46DR28VyM3/C9neTYN7lxHvc+0/hYIYeJlDdsbPI9g/h9bFQ3WwrGXtrMFc/NwL1j7n6JY7NAbv6WkjqfJp4IExY2c6mJXbmRfBB5iksg8T61Z5VaeltVQpJrNQlpEpMWQ2FBGycySvHJhXcuPCu5IAubOJYl4pFCqvEnO90Jk50xiTizbuRd/ZXs/Iu4BSxb12g/pdu7mJJ8kOLYMmZVBqr5WqRGmBnr5LVl2N0ZW0/PHSC2BTFbquRWiQJE29yKjpTO+troCVdyI6vJkWmISek2ZDjrbSPC/QHRs1m00fdDSUDahCE0BKBtyKBi3MR+HPTXiGvBPQqRqZxTD4/lsZBELEqUNATy/6Ei5TkQPWVIxGjsw4HT6nlYrh734Fg2iakQWEipIDRixkpJb9Ltjvch+jWLWYj6XhwsxQ20wfNJxGZt0KEBZ/9/pQw1lVRQZOw0iJkgpWIxpehUXKMfsLoKcVQvDPRdxEMQPV4bmIMB90Rj1ggJ2vwKzV0XDTcuTPdNb+Y1/IK4GXEIRL8j1LwdBkr3w+YiPjUCWzPINd24I2Y23Lea45JGwqJxnFBKnZT6HZ5liMsQVIGlJ9EaejCwvxCPIF7XOjdfhUUxnQvPjloGBjFtcy/0efclY/UHd8zYjuLNJYjzEadCbXeBqFPaTfsYYpOFjCVjlejEdEqZLWLqoVlghG3CFroppcwZmZJ+EVJQ2qL8AEQ3z69ATK4wGLrx/CDiZwsZixVI6ZQy+2ppciu0CZFSSjBISRgkX32NnO2ImyQpaW/WKG0Q7TJu/Fgjmo2QxQoq6RKd7Gbg1QCmUtpkVpHFlwT1tdiT7ll+gjgZcaYs8bykpfciRR2LNaokOGJmMhMPK4Rn8d++FmTqpBSSiOZrXiMnkWqhhC31FynqaCOkKwdlk4y1HFt/4EpAeeXdt6il/qrvFIYq9ahqiU1aHOmIuWMQFmyk1JUqn+LCdXLqbjxnJEkiJcO21aNEpbjC2Y5ripT6zt/4UUcoL3KXNFJWU0phIaOolHW56XCmSKkTQhjK52kKKrRYUpEyZyknCQsCKL9rA46QztJIaSOErmaeoYKJJ8+MWCGtOKpfz5HRWU1KacuITBVU7wko/11BgPI6Z1ghkXFkdJZq/wkwAORh5EEvLs54AAAAAElFTkSuQmCC"

/***/ })
/******/ ]);