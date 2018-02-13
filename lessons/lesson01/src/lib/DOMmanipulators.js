import {test} from "./errorHandlers.js";

//wrapper for DOM manipulation methods
const appendNode = (parent, node) => test(parent, node)(() => parent.appendChild(node));
const createNode = (tag) => document.createElement(tag || 'div');
const removeNode = (node)=>test(node)(()=>node.remove());

export {appendNode, createNode, removeNode};