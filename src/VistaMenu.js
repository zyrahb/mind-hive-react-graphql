/* eslint-disable */

import React, {Component} from "react";
import {Header, TextArea} from 'semantic-ui-react';
import {Route} from 'react-router-dom';
import {API, graphqlOperation} from 'aws-amplify';

const GetAllTopics = `query GetAllTopics {
    listTopics (limit: 2000) {
        items{
          name
          id
        }
    }
}`;

function compare(a, b) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
}

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
                                <div>
                                    <Header size={'large'}>Welcome to Mindhive!</Header>
                                </div>
                </div>
                <AddTopic/>
                <div>
                    {
                        this.state.hasResults
                            ? <AddLink allTopics={this.state.allTopicNamesIds}/>
                            : <div/>
                    }
                </div>
                <AddTag/>
            </div>
        )
    }
}

class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ' ',
            color: 'white'
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
                            <TextArea rows={3} type="text" name={"description"} placeholder="Description"
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
                            {this.props.allTopics.sort((a, b) => a.name > b.name ? 1 : -1).map(({name, id}) => <option value={id}>{name}</option>)}
                        </select>
                        <p/>
                        <div className="field">
                            <label>Link Description</label>
                            <input type="text" name={"title"} placeholder="Relationship"
                                   onChange={this.handleChange}/>
                        </div>
                        <select name={"to"} className="ui dropdown" onChange={this.handleChange}>
                            <option value="">Topic To</option>
                            {this.props.allTopics.sort((a, b) => a.name > b.name ? 1 : -1).map(({name, id}) => <option value={id}>{name}</option>)}
                        </select>
                        <p/>
                        <button className="ui button" type="submit">Add</button>
                    </form>
                </div>
            </div>
        )
    }
}


class AddTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
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
        const NewTag = `mutation AddTag($name: String!)  {
            createTag(input: { 
                name: $name
                }) 
            {
                id
            }  
        }`;

        const result = await API.graphql(graphqlOperation(NewTag,
            {
                name: this.state.name
            }));
        console.info(result);
        // alert(JSON.stringify(result));
        this.setState({name: '', description: ''})
        window.location.reload();
    };

    render() {
        return (
            <div>
                <div className={"action-component"}>
                    <Header as='h3'>Add a Tag</Header>
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        <div className="field">
                            <input type="text" name={"name"} placeholder="Enter Tag"
                                   onChange={this.handleChange}/>
                        </div>
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
                            <TextArea rows={5} type="text" name={"description"} defaultValue={this.props.topic.description}
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

export default ActionMenu;
