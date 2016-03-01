import React from 'react';
import { Router, Route, IndexRoute, useRouterHistory, hashHistory } from 'react-router';
import { createHashHistory } from 'history';

import Navigation from './components/navigation';
import Login from './components/Login';
import Users from './components/Users';
import Register from './components/Register';
import Products from './components/Products';
import ProductsNew from './components/products/New';
import ProductsEdit from './components/products/Edit';
import Transactions from './components/transactions/list';
import TransactionSales from './components/transactions/sales';
import Inventory from './components/inventory';
import Categories from './components/categories';
import FormInput from './components/FormInput';
import OrdersNew from './components/transactions/order';
import Action from './actions/users';

import Auth from './store/users';
import API from './api';

const history = useRouterHistory(createHashHistory)({ queryKey: false })

class NotFoundPage extends React.Component{
	render(){
		return <h1>Not Found</h1>
	}
}

class Home extends React.Component{
	render(){
		return <h1>Home</h1>
	}
}

function callback(user, nextState, replace){
	if(nextState.routes[nextState.routes.length-1].admin && !user.admin){
		replace({
			pathname: '/orders/new',
			state: { nextPathname: nextState.location.pathname }
		})
		window.nextPathname = nextState.location.pathname
	}
}
function requireAuth(callback, nextState, replace) {
	if(!Auth.loggedIn()){
		replace({
			pathname: '/login',
			state: { nextPathname: nextState.location.pathname}
		})
		window.nextPathname = nextState.location.pathname;
	}else{
		if(Auth.user()){
			callback(Auth.user(), nextState, replace)
		}else{
			Action.get(localStorage.user)
			API.get('/users/'+ localStorage.user).then(function(res){
				callback(res, nextState, replace)
			});		
		}
	}
}

module.exports = (
	<Router history={ history }>
		<Route path="/" component={ Navigation }>
		    <IndexRoute component={ Home } />
			<Route title="Login" path="login" component={ Login }/>
			<Route title="Register User" path="register" component={ Register }/>
			<Route title="New Order" path="orders/new" component={ OrdersNew } onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Inventory" path="inventory" component={ Inventory } onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Users" path="users" component={ Users } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Categories" path="categories" component={ Categories } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Products" path="products" component={ Products } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="New Product" path="products/new" component={ ProductsNew } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Edit Product" path="products/:id" component={ ProductsEdit } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Transaction Logs" path="transactions" component={ Transactions } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Sales" path="transactions/sales" component={ TransactionSales } admin onEnter={requireAuth.bind(this, callback)}/>
			<Route title="Page Not Found" path="*" component={NotFoundPage}/>
		</Route>
	</Router>
)