import {withCookies} from "react-cookie";
import {Link, withRouter} from "react-router-dom";
import React from "react";
import AuthService from "../Services/AuthService";
import {Button, Container, Grid, TextField} from "@material-ui/core";


class SignupComponent extends React.Component {
    state = {
        username: "",
        password: "",
        checkPassword: "",
        errorMessage: ""
    }

    changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    }

    submitHandler = (event) => {
        event.preventDefault();

        if (this.state.password === this.state.checkPassword) {

            AuthService.signup(this.state.username, this.state.password).then(res => {
                this.props.history.push('/game/login')
            }).catch(res => {
                if (res.response) {
                    if (res.response.status === 400) {
                        this.setState({errorMessage: res.response.data.error})
                    } else {
                        this.setState({errorMessage: "unknown error"})
                    }

                } else {
                    this.setState({errorMessage: res.message});
                }
            })
        } else {
            this.setState({errorMessage: "Passwords Don't Match"});
        }
    }

    render() {
        return (
            <div>
                {this.state.errorMessage && <h1>{this.state.errorMessage}</h1>}

                <Container fixed>
                    <Grid container spacing={2} justify={"center"} alignItems={"center"}>
                        <Grid item xs={12}>
                            <h2 align={"center"}>Sign Up</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>Username</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <form noValidate autoComplete="off" onSubmit={this.submitHandler}>
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
                            <form noValidate autoComplete="off" onSubmit={this.submitHandler}>
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
                        <Grid item xs={6}>
                            <h3 align={"right"}>Confirm Password</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <form noValidate autoComplete="off" onSubmit={this.submitHandler}>
                                <TextField
                                    id="check-password-input"
                                    label="checkPassword"
                                    type="password"
                                    variant="outlined"
                                    name={"checkPassword"}
                                    onChange={this.changeHandler}
                                />
                            </form>
                        </Grid>
                        <Grid item>
                            <div style={{
                                width: "200px",
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type={"submit"}
                                    onClick={this.submitHandler}
                                >
                                    Signup
                                </Button>

                                <Link to={"/game/login"} style={{textDecoration: 'none'}}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(SignupComponent))