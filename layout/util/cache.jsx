'use strict';

const crypto = require('crypto');
const { Component } = require('inferno'); // eslint-disable-line no-unused-vars
const { createElement } = require('inferno-create-element');

const cache = {};

function computeHash(props) {
    return crypto.createHash('md5').update(JSON.stringify(props)).digest('hex');
}

module.exports = {

    /**
     * Create cached component from a given component class.
     * The cache ID is caculated from the input props.
     *
     * @param {Component}   type        JSX component class
     * @param {string}      prefix      Cache ID prefix
     * @param {Function}    transform   Transform the input props to target props and
     *                                  its result is used to compute cache ID
     * @returns Cached JSX element if cache ID is found.
     *          Return null if the props transform result is empty, which means the props
     *          passed to the createElement() indicates the element does not need to be created.
     *          Otherwise, create a new element and cache it if the transform function is provided.
     */
    cacheComponent(type, prefix, transform) {
        return props => {
            const targetProps = transform(props);
            if (!targetProps) {
                return null;
            }
            const cacheId = prefix + '-' + computeHash(targetProps);
            if (!cacheId) {
                return createElement(type, targetProps);
            }
            if (!cache[cacheId]) {
                cache[cacheId] = createElement(type, targetProps);
            }
            return cache[cacheId];
        };
    }
};
