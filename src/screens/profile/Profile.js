import React, { Component } from 'react';
import '../profile/Profile.css';
import Header from '../../common/header/Header';
import { Redirect } from 'react-router';
class Profile extends Component {
    constructor(){
        super();
        this.state ={
            isloggedIn:window.sessionStorage.getItem("access-token")===null?false:true
        }
    }
    render() {
        return (
            (this.state.isloggedIn === false) ? <Redirect to="/" /> :
                <div>
                <Header Header/>
                <div>Profile Page</div>
                </div>
            
           
        )
    }
}
export default Profile;