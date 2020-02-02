/* eslint-disable */

import React, {Component} from "react";
import {Header} from 'semantic-ui-react';
import {NavLink, Route} from 'react-router-dom';
import {API, graphqlOperation} from 'aws-amplify';

class ActionMenu extends Component {
    render() {
        return (
            <div>
                <div className={"focus-details-component"}>

                    <Route
                        path="/" exact
                        render={
                            props =>
                                <div>
                                    <Header size={'large'}>Welcome to Mind Hive!</Header>
                                </div>
                        }/>
                    <Route
                        path="/topic/:topicId" exact
                        render={
                            props =>
                                <div>
                                    <NavLink to={"/"}>Zoom out</NavLink>
                                    <Header size={"medium"}>{this.props.topic.text}</Header>
                                    <body>{this.props.topic.description}</body>
                                </div>
                        }
                    />
                </div>
                <AddTopic/>
                <AddLink/>
                <Route
                    path="/topic/:topicId" exact
                    render={
                        props =>
                            <div>
                                <UpdateTopic topic={this.props.topic}/>
                                {/*<UpdateLink link={this.props.link}/>*/}
                            </div>
                    }
                />

            </div>
        )
    }
}

class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            color: "orange"
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
        const NewTopic = `mutation NewTopic($name: String!, $description: String, $color: String)  {
            createTopic(input:{
                name: $name
                description: $description
                color: $color
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
                <div className={"action-component"}>
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
                        <div className="field">
                            <label>Colour</label>
                            <input type="text" name={"color"} placeholder="Colour"
                                   onChange={this.handleChange}/>
                        </div>
                        <button className="ui button" type="submit">Submit</button>
                    </form>
                </div>
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
                <div className={"action-component"}>
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
            </div>
        )
    }
}

class UpdateTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.topic.text,
            description: this.props.topic.description,
            color: this.props.topic.color
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
        const UpdateTopic = `mutation UpdateTopic($id: ID!, $name: String, $description: String, $color: String)  {
            updateTopic(input:{
                id: $id
                name: $name
                description: $description
                color: $color
            }) {
                id
            }
        }`;

        console.info(this.state);
        console.info(this.props);
        const result = await API.graphql(graphqlOperation(UpdateTopic,
            {
                id: this.props.topic.key,
                name: this.state.name,
                description: this.state.description,
                color: this.state.color
            }));
        console.info(result);
        this.setState({name: '', description: ''})
    };

    render() {
        return (
            <div>
                <div className={"action-component"}>
                    <Header as='h3'>Update a Topic</Header>
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="field">
                            <label>Topic</label>
                            <input type="text" name={"name"} defaultValue={this.props.topic.text}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="field">
                            <label>Description</label>
                            <input type="text" name={"description"} defaultValue={this.props.topic.description}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="field">
                            <label>Colour</label>
                            <input type="text" name={"color"} defaultValue={this.props.topic.color}
                                   onChange={this.handleChange}/>
                        </div>
                        <button className="ui button" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

//
// class UpdateLink extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             title: ''
//         };
//     }
//
//     handleChange = (event) => {
//         let change = {};
//         change[event.target.name] = event.target.value;
//         this.setState(change);
//     };
//
//     handleSubmit = async (event) => {
//         event.preventDefault();
//         console.log(event);
//         const UpdateLink = `mutation UpdateLink($id: ID!, $title: String)  {
//             updateLink(input:{
//                 id: $id
//                 title: $title
//             }) {
//                 id
//             }
//         }`;
//
//         console.info(this.state);
//         console.info(this.props);
//         const result = await API.graphql(graphqlOperation(UpdateLink,
//             {
//                 id: this.props.link.linkid,
//                 title: this.state.title,
//             }));
//         console.info(result);
//         this.setState({name: '', description: ''})
//     };
//
//     render() {
//         console.info(this.state);
//         console.info(this.props);
//         return (
//             <div>
//                 <Header as='h3'>Update the link</Header>
//                 <form className="ui form" onSubmit={this.handleSubmit}>
//                     <div className="field">
//                         <label>Edit Link</label>
//                         <input type="text" name={"title"}
//                                onChange={this.handleChange}/>
//                     </div>
//                     <button className="ui button" type="submit">Submit</button>
//                 </form>
//             </div>
//         )
//     }
// }


export default ActionMenu;
