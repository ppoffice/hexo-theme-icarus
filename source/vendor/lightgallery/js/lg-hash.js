/**!
 * lg-hash.js | 0.0.1 | August 1st 2016
 * http://sachinchoolur.github.io/lg-hash.js
 * Copyright (c) 2016 Sachin N; 
 * @license Apache 2.0 
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgHash = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.lgHash = mod.exports;
    }
})(this, function () {
    'use strict';

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var hashDefaults = {
        hash: true
    };
    var Hash = function Hash(element) {
        this.el = element;
        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = _extends({}, hashDefaults, this.core.s);
        if (this.core.s.hash) {
            this.oldHash = window.location.hash;
            this.init();
        }

        return this;
    };

    Hash.prototype.init = function () {
        var _this = this;
        var _hash;

        // Change hash value on after each slide transition
        utils.on(_this.core.el, 'onAfterSlide.lgtm', function (event) {
            window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + event.detail.index;
        });

        // Listen hash change and change the slide according to slide value
        utils.on(window, 'hashchange.lghash', function () {
            _hash = window.location.hash;
            var _idx = parseInt(_hash.split('&slide=')[1], 10);

            // it galleryId doesn't exist in the url close the gallery
            if (_hash.indexOf('lg=' + _this.core.s.galleryId) > -1) {
                _this.core.slide(_idx, false, false);
            } else if (_this.core.lGalleryOn) {
                _this.core.destroy();
            }
        });
    };

    Hash.prototype.destroy = function () {
        if (!this.core.s.hash) {
            return;
        }

        // Reset to old hash value
        if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
            window.location.hash = this.oldHash;
        } else {
            if (history.pushState) {
                history.pushState('', document.title, window.location.pathname + window.location.search);
            } else {
                window.location.hash = '';
            }
        }

        utils.off(this.core.el, '.lghash');
    };

    window.lgModules.hash = Hash;
});

},{}]},{},[1])(1)
});