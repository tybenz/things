var React = require( 'react' );

var Score = module.exports = React.createClass({
    render: function() {
        var style = {
            backgroundImage: 'url(' + this.props.src + ')'
        };

        return (
            <div onClick={this.props.onClick ? this.props.onClick : function(){}} className="score" data-id={this.props.userId}>
                <div className="score-avatar" style={style}>
                </div>
                <div className="score-digits">{this.props.score || 0}</div>
            </div>
        );
    }
});
