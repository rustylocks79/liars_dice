import React from "react";
import {withRouter} from "react-router-dom";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";

function PromotionalSupportComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <h1>PromotionalSupportComponent</h1>
        </div>
    )
}

export default withRouter(PromotionalSupportComponent)