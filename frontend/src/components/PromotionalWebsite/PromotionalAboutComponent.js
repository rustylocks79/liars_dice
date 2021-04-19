import React from "react";
import {withRouter} from "react-router-dom";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";
import {Button, Card, CardContent} from "@material-ui/core";

function PromotionalAboutComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <div style={{textAlign: "left", width: "80%", margin: "auto", paddingTop: "50px", paddingBottom: "50px"}}>
                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Jeremy Dellock</h2>
                        <h3>Backend Developer</h3>
                        <h4>jeremydellock570@gmail.com</h4>
                        <p>Jeremy is a senior Computer Science major at Penn State Harrisburg. His role in the project was developing the API needed to support synchronized game play across multiple devices.  </p>
                        <Button variant={'outlined'} href={'https://github.com/rustylocks79'}>Github</Button>
                    </CardContent>
                </Card>
                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Nathaniel Netznik</h2>
                        <h3>Testing Engineer</h3>
                        <h4>nhnetz@gmail.com</h4>
                        <p>Nate is a senior Computer Science and Math major at Penn State Harrisburg University. His role in the project consisted of testing each aspect of the web application to ensure that our users receive a stable and bug free product.   </p>
                        <Button variant={'outlined'} href={'https://github.com/nhNetz'}>Github</Button>
                    </CardContent>
                </Card>
                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Long Nguyen</h2>
                        <h3>Front End Developer</h3>
                        <h4>lnguyen.programmer@gmail.com</h4>
                        <p>Long is a senior Computer Science major at Penn State Harrisburg perusing his masters degree. His role in the project was to handle communication from our users to our servers. </p>
                        <Button variant={'outlined'} href={'https://github.com/EmbodyTheLogos'}>Github</Button>
                    </CardContent>
                </Card>
                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Ben Warner</h2>
                        <h3>Front End Developer</h3>
                        <h4>bdwarner99@gmail.com</h4>
                        <p>Ben is a senior Computer Science major at Penn State Harrisburg University. His role in the project was to ensure that users of the liar's dice web application were meet with a visual appealing and intuitive user interface. </p>
                        <Button variant={'outlined'} href={'https://github.com/bdwarner99'}>Github</Button>
                    </CardContent>
                </Card>

                <p style={{textAlign: "center", fontSize: "xx-large"}}>Check out the <a href={'https://github.com/rustylocks79/liars_dice'}> Project Github!</a></p>
            </div>
        </div>
    )
}

export default withRouter(PromotionalAboutComponent)