import React from "react";
import {NavLink, withRouter} from "react-router-dom";
import {AppBar, IconButton, Link, Toolbar} from "@material-ui/core";
import CasinoOutlinedIcon from "@material-ui/icons/CasinoOutlined";

function PromotionalTopBarComponent() {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="logo">
                        <CasinoOutlinedIcon style={{fontSize: 40}}/>
                    </IconButton>
                    <Link color="inherit" variant="h5" underline={"none"}>
                        Deceiver's Dice
                    </Link>

                    <NavLink to={"/"} style={{textDecoration: 'none', color: "inherit", marginLeft: "20px"}}>
                        <Link color="inherit" variant="h6" style={{}}>Home</Link>
                    </NavLink>

                    <NavLink to={"/documentation"}
                             style={{textDecoration: 'none', color: "inherit", marginLeft: "20px"}}>
                        <Link color="inherit" variant="h6">Documentation</Link>
                    </NavLink>

                    <NavLink to={"/support"} style={{textDecoration: 'none', color: "inherit", marginLeft: "20px"}}>
                        <Link color="inherit" variant="h6">Support</Link>
                    </NavLink>

                    <NavLink to={"/about"} style={{textDecoration: 'none', color: "inherit", marginLeft: "20px"}}>
                        <Link color="inherit" variant="h6">About Us</Link>
                    </NavLink>
                </Toolbar>
            </AppBar>
        </div>

    )
}

export default withRouter(PromotionalTopBarComponent)