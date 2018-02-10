import {test} from "./errorHandlers.js";
// Wrapper for addEventListener.
// there eventListener also return remove method.
const on = (el, ev, cb, context, ...args) => test(el)(() => {
    const events = ev.split(' ');

    const fn = (e) => {
        cb.apply(context || this, [e, el].concat(args));
    };

    events.forEach((event) => {
        el.addEventListener(event, fn);
    });
    return {
        remove() {
            events.forEach(event => el.removeEventListener(event, fn));
        }
    }
});

export {on}