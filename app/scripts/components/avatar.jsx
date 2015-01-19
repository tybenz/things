var React = require( 'react' );

var Avatar = module.exports = React.createClass({
    render: function() {
        var style = {
            backgroundImage: 'url(' + this.props.src + ')',
            backgroundSize: 'cover'
        };

        return (
            <div className="avatar" style={style}>
            </div>
        );
    }
});
