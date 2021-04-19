import React from "react";
import {withRouter} from "react-router-dom";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";
import {Button, Card, CardContent} from "@material-ui/core";

function PromotionalDocumentationComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <div style={{textAlign: "left", width: "80%", margin: "auto", paddingTop: "20px", paddingBottom: "20px"}}>
                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Domain Model</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/Domain%20Model%20Diagram.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>GUI Prototypes</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/GUI%20Prototypes.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>High Level Requirements</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/High%20Level%20Requirements.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Project Glossary</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/Project%20Glossary.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Robustness Diagrams</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/Robustness%20Diagrams.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Use Cases</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/Use%20Cases.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Use Case Diagrams</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase1/Use%20Case%20Diagram.pdf'}>View</Button>
                    </CardContent>
                </Card>

                <Card variant={'outlined'}>
                    <CardContent>
                        <h2>Preliminary Schedule</h2>
                        <Button variant={'outlined'}
                                href={'https://github.com/rustylocks79/liars_dice/blob/master/phase2/Schedule.pdf'}>View</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default withRouter(PromotionalDocumentationComponent)