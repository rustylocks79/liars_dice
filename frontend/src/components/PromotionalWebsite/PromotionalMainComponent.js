import React from "react";
import {withRouter} from "react-router-dom";

// class PromotionalMainComponent extends React.Component {
//
//     render() {
//         return(
//             <h1>PromotionalMainComponent</h1>
//         )
//     }
//
// }
//
// export default withRouter(PromotionalMainComponent)

export default withRouter(function (PromotionalMainComponent) {
    return (
        <h1>PromotionalMainComponent</h1>
    )
})