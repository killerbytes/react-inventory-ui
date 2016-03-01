import React from 'react';
import MUI from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ContentCreate from 'material-ui/lib/svg-icons/content/create';
import NavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import ActionAccountBox from 'material-ui/lib/svg-icons/action/account-box';
import SocialGroup from 'material-ui/lib/svg-icons/social/group';

import Store from '../store/users';
import Action from '../actions/users';

function getStateFromStores(){
	return {
	    open: false,
	    user: Store.user()
	}
}

module.exports = React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
	},
	childContextTypes: {
		location: React.PropTypes.object
	},
  	getInitialState: function (){
      return getStateFromStores();
    },
    componentDidMount: function() {
		Store.addChangeListener(this._onChange);
    	this.setState({
    		title: this.props.routes[this.props.routes.length-1].title
    	})
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	componentWillReceiveProps: function(next){
		this.setState({
			title: next.routes[this.props.routes.length-1].title
		})
	},
	render: function(){
		console.log(this.state)
		var display = this.state.user && this.state.user.hasOwnProperty("error") ? true : false;
		var user;
		var userId;
		let menus = [{
			text: 'Sales',
			url: '/transactions/sales',
			admin: true
		},{
			text: 'Transactions',
			url: '/transactions',
			admin: true
		},{
			text: 'Categories',
			url: '/categories',
			admin: true
		},{
			text: 'Products',
			url: '/products',
			admin: true
		},{
			text: 'Inventory',
			url: '/inventory'
		},{
			text: 'Order',
			url: '/orders/new'
		}]
		let menuItems;
		if(this.state.user){
			 menuItems = menus.map(function(i){
				console.log(i.admin, this.state.user)
				let item;
				if(!i.admin){
					item = <MUI.MenuItem key={i.url} onClick={this._handleMenuItemClick.bind(this, i.url) }>{i.text}</MUI.MenuItem>
				}else{
					if(this.state.user.admin){
						item = <MUI.MenuItem key={i.url} onClick={this._handleMenuItemClick.bind(this, i.url) }>{i.text}</MUI.MenuItem>
					}
				}
				return item;
					
			}.bind(this))

			userId = this.state.user.id || this.state.user.user_id;
			user = (
				<div>
					<MUI.FlatButton label="Logout" onClick={ this._handleLogout } />
					<MUI.Avatar style={{marginRight: 16}}>{ this.state.user && this.state.user.name.substr(0,2).toUpperCase()}</MUI.Avatar>
				</div>
				)
		}
		return (
			<div>
				<MUI.AppBar 
					title={ this.state.title }
					xshowMenuIconButton= { this.state.user ? true : false }
				    iconElementLeft={ <MUI.IconButton onClick={ this._onMenuClick }><NavigationMenu /></MUI.IconButton>}
				    iconElementRight={
				    	user
				    }

				    style={{position: 'fixed', top: 0}} />	
					<MUI.LeftNav 
						docked={false}
						onRequestChange={open => this.setState({open})}
						open={this.state.open}>
						{menuItems}
					</MUI.LeftNav>
				<section className="main container-fluid">						
					{this.props.children}
				</section>

			</div>
			)
	},
    _onChange: function(){
    	this.setState(getStateFromStores())
    },
    _onMenuClick: function(){
        this.setState({
        	open: !this.state.open
        })
    },
    _handleLogout: function(){
    	Action.logout();
    },
    _handleMenuItemClick: function(target){
        this.context.router.push(target)
    	this._onMenuClick();
    }

})
