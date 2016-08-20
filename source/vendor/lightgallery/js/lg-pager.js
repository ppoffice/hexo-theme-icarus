/**!
 * lg-pager.js | 0.0.1 | August 1st 2016
 * http://sachinchoolur.github.io/lg-pager.js
 * Copyright (c) 2016 Sachin N; 
 * @license Apache 2.0 
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgPager = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        global.lgPager = mod.exports;
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

    var pagerDefaults = {
        pager: false
    };

    var Pager = function Pager(element) {

        this.el = element;

        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = _extends({}, pagerDefaults, this.core.s);

        if (this.core.s.pager && this.core.items.length > 1) {
            this.init();
        }

        return this;
    };

    Pager.prototype.init = function () {
        var _this = this;
        var pagerList = '';
        var $pagerCont;
        var $pagerOuter;
        var timeout;

        _this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', '<div class="lg-pager-outer"></div>');

        if (_this.core.s.dynamic) {
            for (var j = 0; j < _this.core.s.dynamicEl.length; j++) {
                pagerList += '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' + _this.core.s.dynamicEl[j].thumb + '" /></div></span>';
            }
        } else {
            for (var i = 0; i < _this.core.items.length; i++) {
                if (!_this.core.s.exThumbImage) {
                    pagerList += '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' + _this.core.items[i].querySelector('img').getAttribute('src') + '" /></div></span>';
                } else {
                    pagerList += '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' + _this.core.items[i].getAttribute(_this.core.s.exThumbImage) + '" /></div></span>';
                }
            }
        }

        $pagerOuter = _this.core.outer.querySelector('.lg-pager-outer');

        $pagerOuter.innerHTML = pagerList;

        $pagerCont = _this.core.outer.querySelectorAll('.lg-pager-cont');
        for (var k = 0; k < $pagerCont.length; k++) {

            /*jshint loopfunc: true */
            (function (index) {
                utils.on($pagerCont[index], 'click.lg touchend.lg', function () {
                    _this.core.index = index;
                    _this.core.slide(_this.core.index, false, false);
                });
            })(k);
        }

        utils.on($pagerOuter, 'mouseover.lg', function () {
            clearTimeout(timeout);
            utils.addClass($pagerOuter, 'lg-pager-hover');
        });

        utils.on($pagerOuter, 'mouseout.lg', function () {
            timeout = setTimeout(function () {
                utils.removeClass($pagerOuter, 'lg-pager-hover');
            });
        });

        utils.on(_this.core.el, 'onBeforeSlide.lgtm', function (e) {
            for (var n = 0; n < $pagerCont.length; n++) {
                utils.removeClass($pagerCont[n], 'lg-pager-active');
                if (e.detail.index === n) {
                    utils.addClass($pagerCont[n], 'lg-pager-active');
                }
            }
        });
    };

    Pager.prototype.destroy = function () {};

    window.lgModules.pager = Pager;
});

},{}]},{},[1])(1)
});