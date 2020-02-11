/* eslint-disable */

import React, {Component} from "react";
import {Header} from 'semantic-ui-react';
import {NavLink, Route} from 'react-router-dom';
import {API, graphqlOperation} from 'aws-amplify';

const GetAllTopics = `query GetAllTopics {
    listTopics {
        items{
          name
          id
        }
    }
}`;

const topicColourOptions = [
    {
        key: 'red',
        text: 'red',
        value: 'tomato',
    },
    {
        key: 'orange',
        text: 'orange',
        value: 'orange',
    },
    {
        key: 'yellow',
        text: 'yellow',
        value: 'yellow',
    },
    {
        key: 'green',
        text: 'green',
        value: 'greenyellow',
    },
    {
        key: 'blue',
        text: 'blue',
        value: 'deepskyblue',
    },
    {
        key: 'purple',
        text: 'purple',
        value: 'violet',
    },
];


class ActionMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasResults: false,
            searched: false
        }
    }

    async componentDidMount() {
        const resultAllTopics = await API.graphql(graphqlOperation(GetAllTopics));
        // alert(JSON.stringify(resultAllTopics.data.listTopics.items));
        let hasResults = false;
        if (resultAllTopics.data.listTopics.items.length !== 0) {
            hasResults = true;
        }
        this.setState({
            allTopicNamesIds: resultAllTopics.data.listTopics.items,
            hasResults, searched: true
        });
    }

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
                                    <UpdateTopic topic={this.props.topic}/>
                                    {/*<UpdateLink link={this.props.link}/>*/}
                                </div>
                        }
                    />
                </div>
                <AddTopic/>
                <div>
                    {
                        this.state.hasResults
                            ? <AddLink allTopics={this.state.allTopicNamesIds}/>
                            : <div/>
                    }
                </div>
                <Route
                    path="/topic/:topicId" exact
                    render={
                        props =>
                            <div>
                                <DeleteTopic topic={this.props.topic}/>
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
            color: ''
        };
    }


    handleChange = (event) => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    };

    handleSubmit = async (event) => {
        event.preventDefault();
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
                description: this.state.description,
                color: this.state.color
            }));
        // console.info(result);
        // alert(JSON.stringify(result));
        this.setState({name: '', description: ''})
        window.location.reload();
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
                        <select name={"color"} className="ui dropdown" onChange={this.handleChange}>
                            <option value="">Colour</option>
                            {topicColourOptions.map(({text, value}) => <option value={value}>{text}</option>)}
                        </select>
                        <button className="ui button" type="submit">Add</button>
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
            to: '',
            from: '',
            name: '',
            description: ''
        };
    }


    handleChange = (event) => {
        // console.log(event.target);
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        // console.log(this.state);
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(this.state);
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
        // console.info(result);
        // alert(JSON.stringify(result));
        this.setState({name: '', description: ''})
        window.location.reload();
    };

    render() {
        return (
            <div>
                <div className={"action-component"}>
                    <Header as='h3'>Add a Link</Header>
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <select name={"from"} className="ui dropdown" onChange={this.handleChange}>
                            <option value="">Topic From</option>
                            {this.props.allTopics.map(({name, id}) => <option value={id}>{name}</option>)}
                        </select>
                        <p/>
                        <div className="field">
                            <label>Link Description</label>
                            <input type="text" name={"title"} placeholder="Relationship"
                                   onChange={this.handleChange}/>
                        </div>
                        <select name={"to"} className="ui dropdown" onChange={this.handleChange}>
                            <option value="">Topic To</option>
                            {this.props.allTopics.map(({name, id}) => <option value={id}>{name}</option>)}
                        </select>
                        <p/>
                        <button className="ui button" type="submit">Add</button>
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
        window.location.reload();
    };

    render() {
        return (
            <div>
                <div className={"action-component"}>
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="field">
                            <Header as='h3'>{this.props.topic.text}</Header>
                            <input type="text" name={"name"} defaultValue={this.props.topic.text}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="field">
                            <label>Description</label>
                            <input type="text" name={"description"} defaultValue={this.props.topic.description}
                                   onChange={this.handleChange}/>
                        </div>
                        <select name={"color"} className="ui dropdown" onChange={this.handleChange}>
                            <option value={this.props.topic.color}>Colour</option>
                            {topicColourOptions.map(({text, value}) => <option value={value}>{text}</option>)}
                        </select>
                        <button className="ui button" type="submit">Update</button>
                    </form>
                </div>
            </div>
        )
    }
}


class DeleteTopic extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event);
        const DeleteTopic = `mutation DeleteTopic($id: ID!)  {
            deleteTopic(input: {
                id: $id
            }) {
                id
            }
        }`;

        console.info(this.state);
        console.info(this.props);
        const result = await API.graphql(graphqlOperation(DeleteTopic,
            {
                id: this.props.topic.key
            }));
        // alert(JSON.stringify(result));
        this.setState({name: '', description: ''});
        // alert(JSON.stringify(window.location));
        window.location.replace("/");
    };

    render() {
        return (
            <div>
                <div className={"action-component"}>
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <button className="ui button" type="submit">Delete Topic</button>
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
