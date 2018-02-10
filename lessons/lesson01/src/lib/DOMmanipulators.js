import {test} from "./errorHandlers.js";

//wrapper for DOM manipulation methods
const appendNode = (parent, child) => test(parent, child)(() => parent.appendChild(child));
const createNode = (type) => document.createElement(type || 'div');
const removeNode = (node)=>node.remove();

export {appendNode, createNode, removeNode};