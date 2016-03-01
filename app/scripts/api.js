import fetch from 'isomorphic-fetch';
import Dispatcher from './dispatcher';

// let apiURL = "//my-fm-api-staging.elasticbeanstalk.com";
// let apiURL = "//192.168.1.200:3000/api/v1";
let apiURL = "//localhost:3000/api/v1";


function getToken(){
	return "token=/FthKb3gjbO8eMcTYbXHwQFLJNui+b4QIQnkhitX2AXcPBbFH15UQ0QXjhZyFu5nC+ooHapolfHbfxWUuykeOw==, email=azid@azid.com";
}

function errorDispatcher(response){
	switch(response.status){
		case 401:
		    Dispatcher.dispatch({ type: "ERROR_UNAUTHORIZED" });
		    break;
		case 404:
		    Dispatcher.dispatch({ type: "ERROR_NOT_FOUND" });
			break;
		case 419:
		    Dispatcher.dispatch({ type: "ERROR_TOKEN_EXPIRED" });
			break;
		default:
			//do nothing
			return response.json();
	}

}
const API = {
	get: (url) => {
		return fetch(apiURL + url, {
			headers: {
	            'Authorization': 'Token ' + getToken(),
    	        'Accept': 'application/json'
        	}
		}).then(function(response){
			return errorDispatcher(response);
		});
	},
	put: (url, payload) => {
		return fetch(apiURL + url, {
			method: 'PUT',
			headers: {
	        	'Authorization': 'Bearer ' + getToken(),
         		'Content-Type': 'application/json',
	            'Accept': 'application/json'
        	},
			body: JSON.stringify(payload)
		})
	},
	patch: (url, payload) => {
		return fetch(apiURL + url, {
			method: 'PATCH',
			headers: {
	        	'Authorization': 'Bearer ' + getToken(),
         		'Content-Type': 'application/json',
	            'Accept': 'application/json'
        	},
			body: JSON.stringify(payload)
		})
	},
	post: (url, payload) => {
		return fetch(apiURL + url, {
			method: 'POST',
			headers: {
         	   'Content-Type': 'application/json'
        	},
			body: JSON.stringify(payload)
		})
		.then(function(response){
			return errorDispatcher(response);
	        // return response.json();
		});
	}
}

export default API;