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
     * @returns A cache-enabled component.
     *          It returns cached JSX element when called if cache ID is found.
     *          It returns null if the props transform result is empty, which means the props
     *          passed to the createElement() indicates the element does not need to be created.
     *          Otherwise, it creates a new element and caches it if the transform function is provided.
     *          The original component can be accessed from the `_type` property of the return value.
     *          The props transform function can be accessed from the `_transform` property of the return value.
     */
    cacheComponent(type, prefix, transform) {
        const component = props => {
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
        component._type = type;
        component._transform = transform;
        return component;
    }
};
