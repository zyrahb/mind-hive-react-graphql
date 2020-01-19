/* eslint-disable */

import React, {Component} from "react";
import {Header} from 'semantic-ui-react';
import {NavLink, Route} from 'react-router-dom';
import {API, graphqlOperation} from 'aws-amplify';


class ActionMenu extends Component {
    render() {
        return (
            <div>
                <Header size={'large'}>Welcome to Brain Map!</Header>
                <Route
                    path="/topic/:topicId" exact
                    render={
                        props =>
                            <div>
                                <NavLink to={"/"}>Zoom out</NavLink>
                                <Header size={"medium"}>{this.props.topic.text}</Header>
                                <Header size={"small"}>{this.props.topic.description}</Header>
                            </div>
                    }
                />
                <AddTopic/>
                <AddLink/>
            </div>
        )
    }
}

class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
    }


    handleChange = (event) => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event);
        const NewTopic = `mutation NewTopic($name: String!, $description: String)  {
            createTopic(input:{
                name: $name
                description: $description
                color: "orange"
            }) {
                id
            }
        }`;

        const result = await API.graphql(graphqlOperation(NewTopic,
            {
                name: this.state.name,
                description: this.state.description
            }));
        console.info(result);
        this.setState({name: '', description: ''})
    };

    render() {
        return (
            <div>
                <Header as='h3'>Add a Topic</Header>
                <form className="ui form" onSubmit={this.handleSubmit}>
                    <div className="field">
                        <label>Topic</label>
                        <input type="text" name={"name"} placeholder="Topic"
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Description</label>
                        <input type="text" name={"description"} placeholder="Description"
                               onChange={this.handleChange}/>
                    </div>
                    <button className="ui button" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

class AddLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
    }


    handleChange = (event) => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event);
        const NewLink = `mutation NewLink($title: String!, $toTopic: String!, $fromTopic: String!, $toTopicId: ID!, $fromTopicId: ID!)  {
            createLink(input:{
                title: $title,
                to: $toTopic,
                linkToTopicId:$toTopicId,
                from: $fromTopic,
                linkFromTopicId: $fromTopicId
            }) {
                id
            }
        }`;

        const result = await API.graphql(graphqlOperation(NewLink,
            {
                title: this.state.title,
                toTopic: this.state.to,
                toTopicId: this.state.to,
                fromTopic: this.state.from,
                fromTopicId: this.state.from
            }));
        console.info(result);
        this.setState({name: '', description: ''})
    };

    render() {
        return (
            <div>
                <Header as='h3'>Add a Link</Header>
                <form className="ui form" onSubmit={this.handleSubmit}>
                    <div className="field">
                        <label>To</label>
                        <input type="text" name={"to"} placeholder="To"
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>Link Description</label>
                        <input type="text" name={"title"} placeholder="Relationship"
                               onChange={this.handleChange}/>
                    </div>
                    <div className="field">
                        <label>From</label>
                        <input type="text" name={"from"} placeholder="From"
                               onChange={this.handleChange}/>
                    </div>
                    <button className="ui button" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default ActionMenu;
