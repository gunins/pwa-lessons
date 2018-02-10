// Test if context is part of dom element.
const error = (...context) => {
    throw `One of ${context} is not and instance of DOM`;
};

const test = (...context) => (cb) => context.filter(_ => (_ instanceof Element)).length > 0 ? cb() : error(context);

export {test, error}