import {withCookies} from "react-cookie";
import {Link, withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";

class IndexComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {value: ""}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    handleSubmit(event) {
        alert('Content submitted: ' + this.state.value)
        event.preventDefault()
    }

    render() {
        return (
            <div>
                <p>Index Component</p>

                <Link to={"/login"}>Login Screen</Link> <br/>
                <Link to={"/signup"}>Signup Screen</Link> <br/>
                <Link to={"/welcome"}>Welcome Screen</Link> <br/>
                <Link to={"/profile"}>Profile Screen</Link> <br/>
                <Link to={"/joingame"}>Join Game Screen</Link> <br/>
                <Link to={"/lobby"}>Lobby Screen</Link> <br/>
                <Link to={"/game"}>Game Screen</Link> <br/>

                <ul>
                    {this.props.testStrings.map(post => (
                        <li key={post.id}>{post.title}</li>
                    ))}
                    <li>{this.props.lobbyId}</li>
                    {console.log(this.props.lobbyId)}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {testStrings: state.testStrings, lobbyId: state.lobbyId}
}

export default connect(mapStateToProps)(withCookies(withRouter(IndexComponent)))