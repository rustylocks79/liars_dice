import React from "react";
import {withRouter} from "react-router-dom";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";

function PromotionalDocumentationComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <h1>PromotionalDocumentationComponent</h1>
        </div>
    )
}

export default withRouter(PromotionalDocumentationComponent)