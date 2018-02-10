import {test} from "./errorHandlers.js";
// Wrapper for DOM node selectors
const qs = (selector, container) => test(container)(() => container.querySelector(selector));
const qsAll = (selector, container) => test(container)(() => Array.from(container.querySelectorAll(selector)));

export {qs, qsAll}