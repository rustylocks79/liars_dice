import React from "react";
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
                    <Link href={"/"} color="inherit" variant="h6" style={{marginLeft:"20px"}}>
                            Home
                    </Link>
                    <Link href={"/documentation"} color="inherit" variant="h6" style={{marginLeft:"20px"}}>
                            Documentation
                    </Link>
                    <Link href={"/support"} color="inherit" variant="h6" style={{marginLeft:"20px"}}>
                            Support
                    </Link>
                    <Link href={"/about"} color="inherit" variant="h6" style={{marginLeft:"20px"}}>
                            About Us
                    </Link>
                </Toolbar>
            </AppBar>
        </div>

    )
}

export default PromotionalTopBarComponent