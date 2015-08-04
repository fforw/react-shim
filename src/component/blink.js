"use strict";

var Blink = React.createClass({

    getInitialState: function ()
    {
        return {
            highlight: false
        };
    },

    toggle: function ()
    {
        this.setState({
            highlight : !this.state.highlight
        });
    },

    componentDidMount: function ()
    {
        this.intervalId = setInterval(this.toggle, 1000);
    },
    componentWillUnmount: function ()
    {
        clearInterval(this.intervalId);
    },
    render: function ()
    {
        var styles = {
            color: this.state.highlight ? "#f00" : "#000"
        };

        return (
            <h1 style={ styles}>
                { this.props.children }
            </h1>
        );
    }
});

module.exports = Blink;
