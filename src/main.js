var React = require("react");

var Blink = require("./component/blink");

window.onload = function ()
{
    React.render( <Blink>MyComponent</Blink>, document.getElementById("root"))
};
