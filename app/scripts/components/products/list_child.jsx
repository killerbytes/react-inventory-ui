import React from 'react';
import MUI from 'material-ui';

import FileFolder from 'material-ui/lib/svg-icons/file/folder';
import ToggleStar from 'material-ui/lib/svg-icons/toggle/star';

module.exports = React.createClass({
	contextTypes: {
    	// categories: React.PropTypes.array.isRequired
	},
    componentDidMount: function() {
    },
	componentWillUnmount: function() {
	},
	render: function(){
		let filter = _.filter(this.props.categories, {active: true})
		let categories = filter && filter.map(function(i){
			let results = _.filter(this.props.products, { category_id: i.id })

			let items = results && results.map(function(i){
				let isActive = i.active ? {} : { backgroundColor: '#EEE', color: '#999'};
				return <MUI.ListItem 
					key={i.id} 
					primaryText={i.name} 
			        leftIcon={<ToggleStar/>}
			        rightAvatar={<span style={{padding: '12px 0'}}>{i.price.toFixed(2)}</span>}
			        style={isActive}
					onTouchTap={ this._handleTouchTap.bind(this, i) }/>
			}.bind(this))

			return <MUI.ListItem 
				key={i.id} 
				primaryText={i.name} 
		        leftIcon={<FileFolder/>}
				initiallyOpen={false}
				primaryTogglesNestedList={true}
		        nestedItems={items}/>

		}.bind(this));

		return (
			<MUI.List>
				{ categories }
			</MUI.List>	
			)
	},
	_handleTouchTap: function(item){
		if(this.props.onClick) this.props.onClick(item)
	}
})
