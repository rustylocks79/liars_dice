import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import AuthService from "../Services/AuthService";

const styles = theme => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
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
        this.props.history.push('/login')
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            News
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(withCookies(withRouter(TopBarComponent)))