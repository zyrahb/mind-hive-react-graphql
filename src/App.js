/* eslint-disable */

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import * as go from 'gojs';
import {ReactDiagram} from 'gojs-react';
import 'gojs/extensions/HyperlinkText.js';
import React, {Component} from 'react';
import {BrowserRouter as Router, NavLink, Route} from 'react-router-dom';
import {Grid, Header} from 'semantic-ui-react';
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
                    return "http://localhost:3000/test";
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
                    return "http://localhost:3000/test";
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
        alert(JSON.stringify(resultListLinks.data.listLinks.items));
        let hasResults = false;
        if (resultListTopics.data.listTopics.items.length !== 0 && resultListLinks.data.listLinks.items.length !== 0) {
            hasResults = true;
        }
        const topicResults =  resultListTopics.data.listTopics.items;
        const linkResults =  resultListLinks.data.listLinks.items;
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
                <div>
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
            </div>
        )
    }
}

class Focus extends Component {
    render() {
        return (
            <div>
                <div>
                    <ReactDiagram
                        initDiagram={initFocusDiagram}
                        divClassName='diagram-component'
                        nodeDataArray={[
                            {key: "1a", text: "Concept Maps", color: "orange"},
                            {key: 2, text: "Organized Knowledge", color: "orange"},
                            {key: 3, text: "Context Dependent", color: "orange"},
                            {key: 4, text: "Concepts", color: "orange"},
                            {key: 5, text: "Propositions", color: "orange"},
                            {key: 6, text: "Associated Feelings or Affect", color: "orange"},
                            {key: 7, text: "Perceived Regularities", color: "orange"},
                            {key: 8, text: "Labeled", color: "orange"},
                            {key: 9, text: "Hierarchically Structured", color: "orange"}
                        ]}
                        linkDataArray={[
                            {from: "1a", to: 2, text: "represent"},
                            {from: 2, to: 3, text: "is"},
                            {from: 2, to: 4, text: "is"},
                            {from: 2, to: 5, text: "is"},
                            {from: 2, to: 6, text: "includes"},
                            {from: 2, to: 10, text: "necessary\nfor"},
                            {from: 2, to: 12, text: "necessary\nfor"},
                            {from: 4, to: 5, text: "combine\nto form"},
                            {from: 4, to: 5, text: "test combine\nto form"},
                            {from: 4, to: 6, text: "include"}
                        ]}
                        onModelChange={handleModelChange}
                    />
                </div>
            </div>
        )
    }
}

class App extends Component {

    render() {
        return (
            <Router>
                <Grid padded>
                    <Grid.Column>
                        <Route path="/" exact component={OverviewDiagram}/>
                        <Route path="/test" exact component={Focus}/>
                        <Route
                            path="/test" exact
                            render={() => <div><NavLink to={"/" + toFocus}>Zoom out</NavLink></div>}
                        />
                        <Header>This is where the options go</Header>
                    </Grid.Column>
                </Grid>
            </Router>

        );
    }
}

export default withAuthenticator(App, {includeGreetings: true});
