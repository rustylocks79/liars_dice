import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, Container, Grid, TextField} from "@material-ui/core";
import AuthService from "../Services/AuthService";

class LoginComponent extends React.Component {
    state = {
        username: "",
        password: "",
        errorMessage: ""
    }

    changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
        console.log(name + " " + value)
    }

    submitHandler = (event) => {
        event.preventDefault();
        const {cookies} = this.props;
        console.log(this.state.password)
        AuthService.login(this.state.username, this.state.password).then(res => {
            cookies.set('JWT-TOKEN', res.data.accessToken)
            AuthService.user(res.data.accessToken).then(() => {
                this.props.history.push('/welcome')
            })
        }).catch(res => {
            if (res.response) {
                console.log(res.response)
                if (res.response.status === 401) {
                    this.setState({errorMessage: 'Invalid Username or Password'});
                } else {
                    this.setState({errorMessage: "unknown error"})
                }

            } else {
                this.setState({errorMessage: res.message});
            }
        })
    }

    loginBen = (event) => {
        const {cookies} = this.props;
        AuthService.login('ben', 'password').then((response) => {
            cookies.set('JWT-TOKEN', response.data.accessToken)
        })
    }

    loginLong = (event) => {
        const {cookies} = this.props;
        AuthService.login('long', 'password').then((response) => {
            cookies.set('JWT-TOKEN', response.data.accessToken)
        })
    }

    loginNate = (event) => {
        const {cookies} = this.props;
        AuthService.login('nate', 'password').then((response) => {
            cookies.set('JWT-TOKEN', response.data.accessToken)
        })
    }

    loginJeremy = (event) => {
        const {cookies} = this.props;
        AuthService.login('jeremy', 'password').then((response) => {
            cookies.set('JWT-TOKEN', response.data.accessToken)
        })
    }

    render() {
        return (
            <div>
                {this.state.errorMessage && <h1>{this.state.errorMessage}</h1>}

                <Container fixed>
                    <Grid container spacing={2} justify={"center"} alignItems={"center"}>
                        <Grid item xs={12}>
                            <h2 align={"center"}>Login</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>Username</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <form noValidate autoComplete="off">
                                <TextField
                                    id="username-input"
                                    label="Username"
                                    variant="outlined"
                                    name={"username"}
                                    onChange={this.changeHandler}
                                />
                            </form>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>Password</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <form noValidate autoComplete="off">
                                <TextField
                                    id="password-input"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    name={"password"}
                                    onChange={this.changeHandler}
                                />
                            </form>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                type={"submit"}
                                onClick={this.submitHandler}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>

                    <br/> <br/> <br/>

                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item>
                            <Button
                                style={{alignSelf: "center"}}
                                href={"/welcome"}
                                variant="contained"
                                color="primary"
                                onClick={this.loginBen}
                            >
                                Login as Ben
                            </Button> </Grid>
                        <Grid item>
                            <Button
                                href={"/welcome"}
                                variant="contained"
                                color="primary"
                                onClick={this.loginLong}
                            >
                                Login as Long
                            </Button> </Grid>
                        <Grid item>
                            <Button
                                href={"/welcome"}
                                variant="contained"
                                color="primary"
                                onClick={this.loginNate()}
                            >
                                Login as Nate
                            </Button> </Grid>
                        <Grid item>
                            <Button
                                href={"/welcome"}
                                variant="contained"
                                color="primary"
                                onClick={this.loginJeremy}
                            >
                                Login as Jeremy
                            </Button> </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(LoginComponent))