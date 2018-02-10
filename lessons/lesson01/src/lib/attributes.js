import {test} from './errorHandlers.js';
// wrapper for DOM attribute manipulation
const getAttribute = (element, attribute) => test(element)(() => element.getAttribute(attribute));
const setAttribute = (element, attribute, value) => test(element)(() => element.setAttribute(attribute, value));
const removeAttribute = (element, attribute, value) => test(element)(() => element.removeAttribute(attribute, value));

export {getAttribute, setAttribute, removeAttribute}