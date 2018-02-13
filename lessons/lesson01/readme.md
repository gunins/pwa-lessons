## Lesson 1

### What we learn
In this lesson we will go true basic web app components: 

 - **Fetch** - loading remote data
    - Load remote data
    - modify response regards to your structure
    - Apply to DOM

- **Asynchronous** -  Content composition asynchronously.
    - Little bit about promises
    - Some functional patterns
    
- **Render** - Apply custom content on screen.
    - Basic DOM manipulation
    - DOM Containers
    - Using Templates
    - Event Handlers 
    
### Intro

In any web app planning usually is two scenarios, one load remote data, and update content, or update content and send to remote server.
There is also one important part, change data locally, and update different parts on screen.

In this tutorial, we start with scenario 1.

If we take some theory from functional programming we have `a->b->c` if we convert this to our app then steps need to create is
 `fetch->transformData->generateHTML->attachToDom->addingEvents`
 
Now we will go step by step, with example, by using flickr API, we load data, and add publish some images on screen.

### Fetching data

Before we start loading remote data we need setup some utilities. We will save in file `/lib/fetch.js`

First, need fetch remote data, and return in JSON format.

```javascript
    const request = (uri, options) => fetch(uri, options)
        .then(resp => resp.json());
```

In later examples, we will extend this method, to support more methods. At the moment, we only interested on `GET`.

Also We need convert `JSON` configuration to URI converted string.

```javascript
    const setParams = (params = {}) => keys(params).map(key => `${key}=${params[key]}`).join('&');
```

And last one, setURI will combine, uri and params together.

```javascript
    const setURI = (uri, params) => `${uri}?${setParams(params)}`;
```

Of course not forget, export those new created methods.

```javascript
    export {request, setURI, setParams};
```     

Ok, now we have our utilities done, and we can use them in another parts in our app later. 

> Good practice is, anything what is useful good idea create a module. Also try to keep modules small.

Anything what we will do with data, for any particular part of the screen, I'll name as `model`.
Because in this example we hav only one component, I save it in `src` folder root.

First step of course is import required libraries.

> there is `.js` at the end, because chrome understand only exact paths. With webpack and rollup in modules no need for `.js` extension.

```javascript
    import {request, setURI} from './lib/fetch.js'; 
```

Next flickr related REST API configuration (I not explain flick REST service, if you are interested you can check [here](https://www.flickr.com/services/api/) )

```javascript
    const rootURI = `https://api.flickr.com/services/rest/`;
    const params = {
        method:         'flickr.photos.getRecent',
        api_key:        'ca370d51a054836007519a00ff4ce59e',
        per_page:       10,
        format:         'json',
        nojsoncallback: 1
    };
```

`rootURI` is api entry point and `params` is json configuration to access our required images.

Now, the json we will get from flickr, not in the format, what we expecting for template. We will format to our requirements

```javascript
    const formatResult = (array = []) => array.map(({farm, server, id, title, secret}) => ({
        src: `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`,
        id,
        title
    }));

``` 

In `(array=[])` we giving default param empty array, in case no result will be empty array instead of error.
We iterating array using `.map` method. `.map` return new array, with function applied over each array item. In our case
we transforming one object to another. There is following steps:

- extracting values from incoming Object `({farm, server, id, title, secret})`
- returning new Object with new fields `{src, id, title}`
- `id, title` are same, and we just transfer to new object. `src` we need to setup link for image by using several properties from 
incoming object.

Now last step loading photos from remote server.

```javascript
    const getPhotos = () => request(setURI(rootURI, params))
        //slice and dice response
        .then(({photos}={}) => photos)
        .then(({photo}={}) => photo)
        //prepare response.
        .then(result => formatResult(result));
```

`request` and `setURI` we use from our created utilities. Also request will return `Promise`. Means there we can use synchronous/asynchronous 
 operations in same flow. In first two steps we extracting `photos.photo` from response. I split in two steps, because maybe response
 can contain different structure. Doing this way, we will get empty result instead of error.
 
 And Last bit don't forget to export your method.
 
 ```javascript
    export {getPhotos}
```

### Templates

Out there is different templating engines, I not review them yet. In our current example we will use es6 string templates.

In any html templates, you have to think about two things HTML and CSS. 

Now little bit about css. With css major problem is, there is no modules. Means everything available in global scope. 
There all tag selectors, or common names eg `show,hide` will overwrite each other. There is several techniques, but for the beginning
we will use inline styles. 

I quickly set function to convert json to css, in setStyle Function.

Example of style is.

```javascript
    const listStyle    = {
        'display':    'inline-block',
        'list-style': 'none'
    };
    const imgStyle     = {
        'height': '200px'
    };
```
And convertor function is.

```javascript
    const {keys} = Object;
    const setStyle = (style={})=>keys(style).map(key=>`${key}:${style[key]};`).join('');
```

We extracting keys from Object, and iterate over key array. Then just join all together.

In Template we can use variables and setting styles.

```javascript
    const template     = ({title, id, src} = {}) => `
        <li style="${setStyle(listStyle)}" data-id="${id}">
            <img style="${setStyle(imgStyle)}" src="${src}" alt="${title}">
        </li>
    `;
```

`{title, id, src}` coming from `formatResult` function, and setStyle, almost looks like native css.

Last part is export template.
```javascript
    export {template}
```

### DOM Manipulation/Controller

Before start to do anything with DOM, we need several utilities `selectors,attributes,DOMManipulators`, reason to not use them directly from 
DOM API, is if you have some browser related incompatibilities, you only fix them in one place, instead everywhere you use 
this API.

Before, I added error handler to test if given elements is part of DOM API, if they are 
then we return function to execute next step, if not throwing error. 

```javascript
    const error = (...context) => {
        throw `One of ${context} is not and instance of DOM`;
    };
    
    const test = (...context) => (cb) => context.filter(_ => (_ instanceof Element)).length > 0 ? cb() : error(context);
    
    export {test, error}
```

For selectors is simple API `qs` and `qsAll` both are self explained. Only `querySelectorAll` will return Array, not Array like.

```javascript
    import {test} from "./errorHandlers.js";

    const qs = (selector, container) => test(container)(() => container.querySelector(selector));
    const qsAll = (selector, container) => test(container)(() => Array.from(container.querySelectorAll(selector)));
    
    export {qs, qsAll}
```

Another feature we need is set and remove some attribute. 

```javascript
    import {test} from './errorHandlers.js';
    // wrapper for DOM attribute manipulation
    const getAttribute = (element, attribute) => test(element)(() => element.getAttribute(attribute));
    const setAttribute = (element, attribute, value) => test(element)(() => element.setAttribute(attribute, value));
    const removeAttribute = (element, attribute, value) => test(element)(() => element.removeAttribute(attribute, value));
    
    export {getAttribute, setAttribute, removeAttribute}

```

Comment for this utility is only We testing element, before add or remove some attribute. Later we can add test for attributes as well, but not at this stage.

Last functionality we need for current app, is `DOMmanipulators`.

```javascript
    import {test} from "./errorHandlers.js";
    
    const appendNode = (parent, node) => test(parent, node)(() => parent.appendChild(node));
    const createNode = (tag) => document.createElement(tag || 'div');
    const removeNode = (node)=>test(node)(()=>node.remove());
    
    export {appendNode, createNode, removeNode};
```

There is not much to comment, simple wrappers for DOM APIs.

Now before touching our key component, I want to little bit touch `addEventListener` functionality.

```javascript
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
```

I call this method `on` from most libraries people are familiar what `on` doing. Interesting part is `on` method taking
eventHandlers, and return `remove` function. In any application need to think this way, if we adding something, we need 
some easy way to remove as well.

Now is time to our key class, I name it `Component`. Reason for this class is simple, any part in UI, which you modifying
should stay encapsulated from any other nodes on DOM. One advantage there, you can remove one, and replace to another one, 
without breaking your entire app. Also same Components you can use in different app locations, or even in different Apps.

Ok, now let's have a look on Component. This component currently only has functionality, what we need to achieve in this Lesson,
later we add more, depends on requirements.

```javascript
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
``` 

Step by step now.

```javascript
...
        constructor(rootElement) {
            this._handlers = new Set();
            this._rootElement = rootElement;
        }
...
``` 
Constructor will take rootElement, for DOM container he owns. Also create new set for eventHandlers, reason for this is, if
we can remove all of them when we remove component from DOM.


```javascript
        ...
   update(innerHTML) {
        const {_rootElement} = this;
        assign(_rootElement, {innerHTML});
    }
        ...
```

`update` will change content for our component container, currently we expecting `innerHTML` is a string. In later lessons
we will touch microoptimisation parts.

```javascript
    ...
    render(container) {
        const {_rootElement} = this;
        return appendNode(container, _rootElement);
    }
    ...

```

Like any component need to render on screen. In our case, we just attach to parent element. `apppendNode` will do container
test for us, no need for double test.

```javascript
    ...
    on(name, handler) {
        const {_rootElement, _handlers} = this;
        const {remove} = on(_rootElement, name, handler);
        _handlers.add(remove);
        return {remove}
    }
    ...
``` 

`on` method doing same, like written above, except collecting remove handlers, for component remove.

To avoiding `new` use on any Component, we simply create function.

```javascript
    const component = (...args) => new Component(...args);
``` 

Now we are ready, put all this together and render on screen.

First need to import everything we need.

```javascript
    import {qs} from './lib/selectors.js';
    import {createNode} from './lib/DOMmanipulators.js';
    import {getAttribute} from './lib/attributes.js';
    import {component} from './lib/Component.js';
    
    import {getPhotos} from './model.js';
    import {template} from './template.js';
```

Now we select Document body, and div for app Container.

```javascript
const {body} = document;
const appRoot = qs('#App', body);

``` 

Because returning images are represent list, we adding function to iterate over data, and apply template on each image.
After convert to string.

```javascript
    const listTemplate = items => items.map(_ => template(_)).join('\n');

```
 
 > `_` is used, because we passing same object to another function. This is just code style.
 
 Now is time to create Component container.
 
 ```javascript
    const listComponent = component(createNode('ul'));
```

We creating new compponent, and because we are reldering list, we define `ul` element as root element for our component container.

Since we have all preprocess done, we can start load data and, render on page.

```javascript
getPhotos()
    .then((response) => listTemplate(response))
    .then(template => listComponent.update(template))
    .then(() => listComponent.render(appRoot))
    .then(()=>listComponent.on('click', ({target})=>alert(getAttribute(target,'alt'))));

```

Every step will use asynchronously.

- Fetch data from server
- generate htmlSting
- add string in to component root element
- render component on browser.
- add click event on component

> At the moment, I just added alert, on later examples we will go in more detailed.
Just major comment there is, we have only one event listener on component, and by clicking on list, you filter by event target.
For large tables, advantage is, you have only one event listener, no need update or remove handlers, on rerendering. Later will
show how to handle data bindings, using this approach.

Last missing bit is `index` file.

```html
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Lesson 01</title>
        </head>
        <body>
            <h3>Example of flickr photo module</h3>
            <div id="App"></div>
            <script type="module" src="src/app.js"></script>
        </body>
    </html>

```

Not think there need any comment. Now, you can see images on your browser.