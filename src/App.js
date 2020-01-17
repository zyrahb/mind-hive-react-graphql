/* eslint-disable */

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import * as go from 'gojs';
import {ReactDiagram} from 'gojs-react';
import 'gojs/extensions/HyperlinkText.js';
import React, {Component} from 'react';
import {BrowserRouter as Router, NavLink, Route} from 'react-router-dom';
import {Header} from 'semantic-ui-react';
import './App.css';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

var toFocus = '';


// This variation on ForceDirectedLayout does not move any selected Nodes
// but does move all other nodes (vertexes).
function ContinuousForceDirectedLayout() {
    go.ForceDirectedLayout.call(this);
    this._isObserving = false;
}

go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

ContinuousForceDirectedLayout.prototype.isFixed = function (v) {
    return v.node.isSelected;
}

// optimization: reuse the ForceDirectedNetwork rather than re-create it each time
ContinuousForceDirectedLayout.prototype.doLayout = function (coll) {
    if (!this._isObserving) {
        this._isObserving = true;
        // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
        // so we need to track structural model changes to discard the saved network.
        var lay = this;
        this.diagram.addModelChangedListener(function (e) {
            // modelChanges include a few cases that we don't actually care about, such as
            // "nodeCategory" or "linkToPortId", but we'll go ahead and recreate the network anyway.
            // Also clear the network when replacing the model.
            if (e.modelChange !== "" ||
                (e.change === go.ChangedEvent.Transaction && e.propertyName === "StartingFirstTransaction")) {
                lay.network = null;
            }
        });
    }
    var net = this.network;
    if (net === null) {  // the first time, just create the network as normal
        this.network = net = this.makeNetwork(coll);
    } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
        this.diagram.nodes.each(function (n) {
            var v = net.findVertex(n);
            if (v !== null) v.bounds = n.actualBounds;
        });
    }
    // now perform the normal layout
    go.ForceDirectedLayout.prototype.doLayout.call(this, coll);
    // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
    // here we remember it for next time
    this.network = net;
}

// end ContinuousForceDirectedLayout


/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */
function initDiagram() {
    const $ = go.GraphObject.make;
    const diagram =
        $(go.Diagram,  // must name or refer to the DIV HTML element
            {
                initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
                contentAlignment: go.Spot.Center,  // align document to the center of the viewport
                layout:
                    $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
                        {defaultSpringLength: 30, defaultElectricalCharge: 100}),
                // do an extra layout at the end of a move
                "SelectionMoved": function (e) {
                    e.diagram.layout.invalidateLayout();
                }
            });

    // dragging a node invalidates the Diagram.layout, causing a layout during the drag
    diagram.toolManager.draggingTool.doMouseMove = function () {
        go.DraggingTool.prototype.doMouseMove.call(this);
        if (this.isActive) {
            this.diagram.layout.invalidateLayout();
        }
    }

    diagram.nodeTemplate =
        $(go.Node, "Auto",  // the whole node panel
            // define the node's outer shape, which will surround the TextBlock
            $(go.Shape, "RoundedRectangle",
                {
                    fill: "white",
                    stroke: "black",
                    spot1: new go.Spot(0, 0, 5, 5),
                    spot2: new go.Spot(1, 1, -5, -5)
                },
                new go.Binding('fill', 'color')),
            $("HyperlinkText",
                function (node) {
                    return window.location.origin + "/topic/" + node.data.key;
                },
                function (node) {
                    return node.data.text;
                },
                {margin: 10}
            )
            // $(go.TextBlock,
            //     {
            //         font: "bold 10pt helvetica, bold arial, sans-serif",
            //         textAlign: "center",
            //         maxSize: new go.Size(100, NaN)
            //     },
            //     new go.Binding("text", "text"))
        );

    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            $(go.Shape,  // the link shape
                {stroke: "black"})
        );

    return diagram;
}


function initFocusDiagram() {
    const $ = go.GraphObject.make;
    const diagram =
        $(go.Diagram,  // must name or refer to the DIV HTML element
            {
                initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
                contentAlignment: go.Spot.Center,  // align document to the center of the viewport
                layout:
                    $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
                        {defaultSpringLength: 30, defaultElectricalCharge: 100}),
                // do an extra layout at the end of a move
                "SelectionMoved": function (e) {
                    e.diagram.layout.invalidateLayout();
                }
            });

    // dragging a node invalidates the Diagram.layout, causing a layout during the drag
    diagram.toolManager.draggingTool.doMouseMove = function () {
        go.DraggingTool.prototype.doMouseMove.call(this);
        if (this.isActive) {
            this.diagram.layout.invalidateLayout();
        }
    };

    //to do don't know how to do this better
    function nodeClick(e, obj) {
        console.log(obj.key);
        toFocus = obj.key;
    };

    diagram.nodeTemplate =
        $(go.Node, "Auto",  // the whole node panel
            // define the node's outer shape, which will surround the TextBlock
            {click: nodeClick},
            $(go.Shape, "RoundedRectangle",
                {
                    fill: "white",
                    stroke: "black",
                    spot1: new go.Spot(0, 0, 5, 5),
                    spot2: new go.Spot(1, 1, -5, -5)
                },
                new go.Binding('fill', 'color')),
            // $(go.TextBlock,
            //     {
            //         font: "bold 10pt helvetica, bold arial, sans-serif",
            //         textAlign: "center",
            //         maxSize: new go.Size(100, NaN)
            //     },
            //     new go.Binding("text", "text")),
            $("HyperlinkText",
                function (node) {
                    return window.location.origin + "/topic/" + node.data.key;
                },
                function (node) {
                    return node.data.text;
                },
                {margin: 10}
            )
        );

    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            $(go.Shape,  // the link shape
                {stroke: "black"}),
            $(go.Shape,  // the arrowhead
                {toArrow: "standard", stroke: null}),
            $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: $(go.Brush, "Radial", {
                            0: "rgb(240, 240, 240)",
                            0.3: "rgb(240, 240, 240)",
                            1: "rgba(240, 240, 240, 0)"
                        }),
                        stroke: null
                    }),
                $(go.TextBlock,  // the label text
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#555555",
                        margin: 4
                    },
                    new go.Binding("text", "text"))
            )
        );

    return diagram;
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes) {
    alert('GoJS model changed!');
}

const ListTopics = `query ListTopics{
    listTopics{
        items {
            key: id
            text: name
            color
        }
    }
}`;

const ListLinks = `query ListLinks{
    listLinks {
        items {
            to
            from
        }
    }
}`;

class OverviewDiagram extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasResults: false,
            searched: false
        }
    }

    updateLabel = (e) => {
        this.setState({label: e.target.value, searched: false});
    }

    async componentDidMount() {
        const resultListTopics = await API.graphql(graphqlOperation(ListTopics));
        const resultListLinks = await API.graphql(graphqlOperation(ListLinks));
        // alert(JSON.stringify(resultListLinks.data.listLinks.items));
        let hasResults = false;
        if (resultListTopics.data.listTopics.items.length !== 0 && resultListLinks.data.listLinks.items.length !== 0) {
            hasResults = true;
        }
        const topicResults = resultListTopics.data.listTopics.items;
        const linkResults = resultListLinks.data.listLinks.items;
        this.setState({topics: topicResults, links: linkResults, hasResults, searched: true});
    }

    noResults() {
        return !this.state.searched
            ? ''
            : <Header as='h4' color='grey'>Please add a Topic...</Header>
    }


    render() {
        return (
            <div>
                <div className="ui grid container padded">
                    <div className="twelve wide column">
                        {
                            this.state.hasResults
                                ? <ReactDiagram
                                    initDiagram={initDiagram}
                                    divClassName='diagram-component'
                                    nodeDataArray={this.state.topics}
                                    linkDataArray={this.state.links}
                                    onModelChange={handleModelChange}
                                />
                                : this.noResults()
                        }
                    </div>
                    <div className="four wide column">
                        <ActionMenu/>
                    </div>
                </div>
            </div>
        )
    }
}


const GetFocusTopic = `query GetFocusTopic($topicId: ID!) {
  getTopic(id: $topicId) {
    key: id
    text: name
    description
    color
  }
}`;


const GetFocusTopicsLinksTo = `query GetFocusTopicsLinksTo($topicId: String!){
    listLinks(filter: {
                to: {
                    eq: $topicId
                }
    }) {
        items {
            text: title
            from: fromTopic {
                id
                name
            }
        }
    }
}`;


const GetFocusTopicsLinksFrom = `query GetFocusTopicsLinksFrom($topicId: String!){
    listLinks(filter: {
                from: {
                    eq: $topicId
                }
    }) {
        items {
            text: title
            to: toTopic {
                id
                name
                color
            }
        }
    }
}`;

class Focus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasResults: false,
            searched: false
        }
    }

    updateLabel = (e) => {
        this.setState({label: e.target.value, searched: false});
    }

    async componentDidMount() {
        const resultFocusNode = await API.graphql(graphqlOperation(GetFocusTopic, {topicId: this.props.id}));
        const resultFocusTo = await API.graphql(graphqlOperation(GetFocusTopicsLinksTo, {topicId: this.props.id}));
        const resultFocusFrom = await API.graphql(graphqlOperation(GetFocusTopicsLinksFrom, {topicId: this.props.id}));
        // alert(JSON.stringify(resultAllFocus.data.listLinks.items));
        let hasResults = false;


        const focusTopicResultsTo = resultFocusTo.data.listLinks.items.map(el => (Object.assign({},
            {key: el.from.id},
            {text: el.from.name},
            {color: el.from.color})));

        const focusTopicResultsFrom = resultFocusFrom.data.listLinks.items.map(el => (Object.assign({},
            {key: el.to.id},
            {text: el.to.name},
            {color: el.to.color})));

        const focusTopicsResults = [resultFocusNode.data.getTopic, ...focusTopicResultsTo, ...focusTopicResultsFrom];
        const focusLinksResultsTo = resultFocusTo.data.listLinks.items.map(el => (Object.assign(el,
            {from: el.from.id},
            {to: this.props.id})));

        const focusLinksResultsFrom = resultFocusFrom.data.listLinks.items.map(el => (Object.assign(el,
            {to: el.to.id},
            {from: this.props.id})));
        const focusLinksResults = [...focusLinksResultsTo, ...focusLinksResultsFrom];

        // alert(JSON.stringify(focusTopicsResults.length));

        if (focusTopicsResults.length !== 0 || focusLinksResults.length !== 0) {
            hasResults = true;
        }
        // alert(JSON.stringify(focusTopicsResults));
        // alert(JSON.stringify(focusLinksResults));
        this.setState({
            topic: resultFocusNode.data.getTopic, topics: focusTopicsResults,
            links: focusLinksResults, hasResults, searched: true
        });
    }

    noResults() {
        return !this.state.searched
            ? ''
            : <Header as='h4' color='grey'>Please add a Topic...</Header>
    }


    render() {
        return (
            <div>
                {
                    this.state.hasResults
                        ? <div className="ui grid container padded">
                            <div className="twelve wide column">
                                <ReactDiagram
                                    initDiagram={initFocusDiagram}
                                    divClassName='diagram-component'
                                    nodeDataArray={this.state.topics}
                                    linkDataArray={this.state.links}
                                    onModelChange={handleModelChange}
                                />
                            </div>
                            <div className="four wide column">
                                <ActionMenu topic={this.state.topic}/>
                            </div>
                        </div>
                        : this.noResults()
                }

            </div>
        )
    }
}

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

class App extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Route path="/" exact component={OverviewDiagram}/>
                    <Route
                        path="/topic/:topicId" exact
                        render={
                            props =>
                                <div>
                                    <Focus id={props.match.params.topicId}/>
                                </div>
                        }
                    />
                </div>
            </Router>

        );
    }
}

export default withAuthenticator(App, {includeGreetings: true});
