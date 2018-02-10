import {component} from './lib/Component.js';
import {createNode} from './lib/DOMmanipulators.js';

import {qs} from './lib/selectors.js';
import {getAttribute} from './lib/attributes.js';

import {getPhotos} from './AppModel.js';
import {template} from './appTemplate.js';

// Selecting Document body, as a root element for app.
const {body} = document;

// Doing some string preparation.
const listTemplate = items => items.map(_ => template(_)).join('\n');

// Because on html node has state, and we need to do some mutbable manipulations, we create small container, to
// define html, and event handlers.
const listComponent = component(createNode('ul'));

// selecting predefined div in body.
const appRoot = qs('#App', body);

// there is interesting part.
// We fetching remote data, and applying different steps to our container.
// Loading remote data for our component
getPhotos()
    // Apply our data to json
    .then((response) => listTemplate(response))
    // update our html content.
    .then(template => listComponent.update(template))
    // Rendering app
    .then(() => listComponent.render(appRoot))
    // adding click event to container body.
    .then(()=>listComponent.on('click', ({target})=>alert(getAttribute(target,'alt'))));