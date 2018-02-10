const {keys} = Object;
// css json to inline style, very basic modular css implementation.
const setStyle = (style={})=>keys(style).map(key=>`${key}:${style[key]};`).join('');

export {setStyle}