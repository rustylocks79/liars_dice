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
    }

    submitHandler = (event) => {
        event.preventDefault();
        const {cookies} = this.props;
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
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(LoginComponent))