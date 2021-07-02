import React, { Component } from 'react';
import '../login/Login.css'
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import { Input, InputLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 240
    },
});

class Login extends Component {

    constructor() {
        super();
        this.state = {

            username: "",
            password: "",
            usernameRequired: 'dispNone',
            passwordRequired: 'dispNone',
            loginAuthentication: 'dispNone',
            isLoggedIn: window.sessionStorage.getItem("access-token") === null ? false : true
        };
    }



    loginValidationHandler = () => {
        if (this.state.isLoggedIn === true) {
            let username = this.state.username
            let password = this.state.password
            let mockUsername = "admin"
            let mockPassword = "8055"
            let accessToken = "IGQVJVbjdZATkF3emhUdlEzNUJmUDJKMW9Iay1WMGEtS1FoYW40ZAzVKQmxiX0d3Q3oyMVducnRSNjdUeENOdmVlTVZAjQ2JabnFXWS05Ui1sRUh0d20tNTJYYmtBNjI5bzVfX1BOcG02UmFhcFl4LU1RVgZDZD"
            if (username === "" || password === "") {
                username === "" ? this.setState({ usernameRequired: 'dispBlock' }) : this.setState({ usernameRequired: 'dispNone' });
                password === "" ? this.setState({ passwordRequired: 'dispBlock' }) : this.setState({ passwordRequired: 'dispNone' });
            }
            else {
                if (mockUsername === username && mockPassword === password) {
                    window.sessionStorage.setItem("access-token", accessToken);
                    this.props.history.push('/home');
                }
                else {
                    this.setState({ loginAuthentication: "dispBlock" })
                }
            }
            
        }
    }

    usernameInputChangeHandler = (e) => {
        this.setState({ username: e.target.value })
        this.setState({ usernameRequired: 'dispNone' })

    }

    passwordInputChangeHandler = (e) => {
        this.setState({ password: e.target.value })
        this.setState({ passwordRequired: 'dispNone' })
    }


    render() {
        const { classes } = this.props
        return (
            <div>
                <Header /><br /><br />
                <div className="login-card-container">
                    <Card>
                        <CardContent>
                            <FormControl className={classes.formControl}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    LOGIN
                                </Typography>
                            </FormControl><br />

                            <FormControl className={classes.formControl} required>
                                <InputLabel htmlFor="userName">Username</InputLabel>
                                <Input id="userName" type="text" username={this.state.username} onChange={this.usernameInputChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className='redError'>required</span>
                                </FormHelperText>
                            </FormControl><br />

                            <FormControl className={classes.formControl} required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.passwordInputChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}>
                                    <span className='redError'>required</span>
                                </FormHelperText>
                            </FormControl><br />

                            <FormHelperText className={this.state.loginAuthentication}>
                                <span className='redError' authentication={this.state.loginAuthentication}>Incorrect username and/or password</span>
                            </FormHelperText><br />

                            <Button variant='contained' color='primary'
                                style={{ textAlign: 'center' }}
                                onClick={this.loginValidationHandler}
                                id="loginButton">
                                Login
                            </Button>

                        </CardContent>
                    </Card>
                </div>

            </div>
        )
    }
}
export default withStyles(styles)(Login);