'use strict';

import 'font-awesome/css/font-awesome.css';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';
import '../style/default.scss';
import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, IndexRoute, useRouterHistory, hashHistory } from 'react-router';
import { createHashHistory } from 'history';
import MUI from 'material-ui';
import Formsy from 'formsy-react';

import routes from './routes';
	
const history = useRouterHistory(createHashHistory)({ queryKey: false })

//Needed for onTouchTap. Can go away when react 1.0 release
injectTapEventPlugin();

// Render the main app react component into the app div.
render(routes, document.getElementById('app'));