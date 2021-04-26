import {withCookies} from "react-cookie";
import {NavLink, withRouter} from "react-router-dom";
import React from "react";
import {AppBar, Button, IconButton, Link, Toolbar, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';
import AuthService from "../Services/AuthService";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1,
    },
    other: {
        marginLeft: theme.spacing(2),
        fontSize: "large"
    },
});

class TopBarComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: ""
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    logout = (event) => {
        const {cookies} = this.props;
        cookies.remove('JWT-TOKEN');
        this.props.history.push('/game/login')
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.button} color="inherit" aria-label="logo">
                            <CasinoOutlinedIcon style={{fontSize: 40}}/>
                        </IconButton>
                        <NavLink to={"/game/welcome"} style={{textDecoration: 'none', color: "inherit"}}
                                 className={classes.title}>
                            <Link color="inherit" variant="h6">
                                Deceiver's Dice
                            </Link>
                        </NavLink>
                        <p color="inherit" className={classes.other}>
                            Logged in as: {this.state.username}
                        </p>
                        <Button variant={"contained"} color="secondary" className={classes.other}
                                onClick={this.logout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(withCookies(withRouter(TopBarComponent)))