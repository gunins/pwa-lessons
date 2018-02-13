import {appendNode} from './DOMmanipulators.js';

import {on} from './eventHandler.js';

const {assign} = Object;

// Component is class to manage html widget lifecycle.
class Component {
    // With initialising we attaching root element to class. And eventHandler set.
    constructor(rootElement) {
        this._handlers = new Set();
        this._rootElement = rootElement;
    }

    // API to change html content in our app
    update(innerHTML) {
        const {_rootElement} = this;
        assign(_rootElement, {innerHTML});
    }

    // Event handler API. Advantage there from class is, we can collect all events and remove them, when we remove component.
    on(name, handler) {
        const {_rootElement, _handlers} = this;
        const {remove} = on(_rootElement, name, handler);
        _handlers.add(remove);
        return {remove}
    }

    // method, to render on DOM
    render(container) {
        const {_rootElement} = this;
        return appendNode(container, _rootElement);
    }

    // Remove method will remove component and all attached event handlers.
    remove() {
        const {_rootElement, _handlers} = this;
        _handlers.forEach(remove => remove());
        _handlers.clear();
        _rootElement.remove();
    }
}

const component = (...args) => new Component(...args);

export {component, Component}