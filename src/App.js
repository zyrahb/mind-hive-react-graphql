/* eslint-disable */

import Amplify from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import aws_exports from './aws-exports';
import Focus from './Focus';
import Vista from './Vista';

Amplify.configure(aws_exports);

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route path="/" exact component={Vista}/>
                    <Route path="/tag/:tags" exact component={Vista}/>
                    <Route
                        path="/topic/:topicId" exact
                        render={
                            props =>
                                <div>
                                    <Focus id={props.match.params.topicId}/>
                                </div>
                        }
                    />
                </div>
                <footer class="footer">
                    Copyright © 2020 Zyrah Bernardino, All Rights Reserved.
                </footer>
            </Router>

        );
    }
}

export default withAuthenticator(App, {includeGreetings: true});
