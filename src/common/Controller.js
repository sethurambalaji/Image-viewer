import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../screens/login/Login';
import Home from '../screens/home/Home';
class Controller extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={({ history }, props) => <Login {...props} baseUrl={this.baseUrl} history={history} />} />
                    <Route path="/home" render={({ history }, props) => <Home {...props} baseUrl={this.baseUrl} history={history} />} />
                </Switch>
            </Router>
        )

    }
}
export default Controller;