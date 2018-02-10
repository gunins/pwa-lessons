import {setStyle} from './lib/setStyle.js';

// Some modular mechanism to handle css.
// This way is too simple, had many limitations, but for start to understand concept is fine.
const listStyle    = {
    'display':    'inline-block',
    'list-style': 'none'
};
const imgStyle     = {
    'height': '200px'
};

// Any component need htm representation, we start from simple string manipulations.
const template     = ({title, id, src} = {}) => `
    <li style="${setStyle(listStyle)}" data-id="${id}">
        <img style="${setStyle(imgStyle)}" src="${src}" alt="${title}">
    </li>
`;


export {template}