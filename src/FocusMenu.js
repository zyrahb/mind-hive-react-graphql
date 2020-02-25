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


class FocusMenu extends Component {
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
//         alert(JSON.stringify(this.props.topic));
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
                <UpdateTopic topic={this.props.topic}/>
                <AddTopicLink topic={this.props.topic}/>
                <div>
                    {
                        this.state.hasResults
                            ? <AddLink allTopics={this.state.allTopicNamesIds}/>
                            : <div/>
                    }
                </div>
                <AddTag/>
                <DeleteTopic topic={this.props.topic} links={this.props.links}/>
            </div>
        )
    }
}

class AddTopicLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ' ',
            color: 'white',
            link_description: '',
            direction: 'to',
            to: '',
            from: ''
        };
    }


    handleChange = (event) => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
//        alert(JSON.stringify(this.state));

//        if (this.state.direction == 'to') {
//                    alert('to');
//        } else {
//                    alert('from');
//        }
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

        const result_topic = await API.graphql(graphqlOperation(NewTopic,
            {
                name: this.state.name,
                description: this.state.description,
                color: this.state.color
            }));
        // console.info(result);
//        alert(JSON.stringify(result_topic));

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

        if (this.state.direction == 'to') {
            this.state.from = result_topic.data.createTopic.id;
            this.state.to = this.props.topic.key;
//            alert(JSON.stringify(this.state));
        } else {
//            alert("from");
            this.state.from = this.props.topic.key;
            this.state.to = result_topic.data.createTopic.id;
//            alert(JSON.stringify(this.state));
        }

        const result = await API.graphql(graphqlOperation(NewLink,
            {
                title: this.state.link_description,
                toTopic: this.state.to,
                toTopicId: this.state.to,
                fromTopic: this.state.from,
                fromTopicId: this.state.from
            }));

//        alert(JSON.stringify(result));

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
                        <div className="field">
                            <label>Direction of arrow</label>
                            <select name={"direction"} className="ui dropdown" onChange={this.handleChange}>
                                <option value="to">&#61;&#62; {this.props.topic.text}</option>
                                <option value="from">{this.props.topic.text} &#61;&#62;</option>
                            </select>
                        </div>
                        <div className="field">
                            <label>Link Description</label>
                            <input type="text" name={"link_description"} placeholder="Relationship"
                                   onChange={this.handleChange}/>
                        </div>
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

        const DeleteLink = `mutation DeleteLink($id: ID!)  {
            deleteLink(input: {
                id: $id
            }) {
                id
            }
        }`;

        // console.info(this.state);

        const result = await API.graphql(graphqlOperation(DeleteTopic,
            {
                id: this.props.topic.key
            }));
        console.log(JSON.stringify(result));

        // console.info(this.props);
        this.props.links.forEach(async link => {
            console.log(link.linkid);
            const result = await API.graphql(graphqlOperation(DeleteLink,
                {
                    id: link.linkid
                }));
            console.log(JSON.stringify(result));
        });

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


export default FocusMenu;
