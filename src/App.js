// src/App.js for Step 3

import React, {Component} from 'react';
import {Header, Grid} from 'semantic-ui-react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';


import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import {withAuthenticator} from 'aws-amplify-react';
import * as go from 'gojs';
import {ReactDiagram} from 'gojs-react';
import './App.css';
import 'gojs/extensions/HyperlinkText.js';

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
                function(node) { return "http://localhost:3000/test"; },
                function(node) { return node.data.text; },
                { margin: 10 }
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
            { click: nodeClick },
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
                function(node) { return "http://localhost:3000/test"; },
                function(node) { return node.data.text; },
                { margin: 10 }
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

class OverviewDiagram extends Component {
    render() {
        return (
            <div>
                <div>
                    <ReactDiagram
                        initDiagram={initDiagram}
                        divClassName='diagram-component'
                        nodeDataArray={[
                            {key: 1, text: "Concept Maps", color: "lightblue"},
                            {key: 2, text: "Organized Knowledge", color: "lightblue"},
                            {key: 3, text: "Context Dependent", color: "lightblue"},
                            {key: 4, text: "Concepts", color: "lightblue"},
                            {key: 5, text: "Propositions", color: "lightblue"},
                            {key: 6, text: "Associated Feelings or Affect", color: "lightblue"},
                            {key: 7, text: "Perceived Regularities", color: "lightblue"},
                            {key: 8, text: "Labeled", color: "lightblue"},
                            {key: 9, text: "Hierarchically Structured", color: "lightblue"},
                            {key: 10, text: "Effective Teaching", color: "lightblue"},
                            {key: 11, text: "Crosslinks", color: "lightblue"},
                            {key: 12, text: "Effective Learning", color: "lightblue"},
                            {key: 13, text: "Events (Happenings)", color: "lightblue"},
                            {key: 14, text: "Objects (Things)", color: "lightblue"},
                            {key: 15, text: "Symbols", color: "lightblue"},
                            {key: 16, text: "Words", color: "lightblue"},
                            {key: 17, text: "Creativity", color: "lightblue"},
                            {key: 18, text: "Interrelationships", color: "lightblue"},
                            {key: 19, text: "HELLO", color: "lightblue"},
                            {key: 20, text: "Different Map Segments", color: "lightblue"}
                        ]}
                        linkDataArray={[
                            {from: 1, to: 2, text: "represent"},
                            {from: 2, to: 3, text: "is"},
                            {from: 2, to: 4, text: "is"},
                            {from: 2, to: 5, text: "is"},
                            {from: 2, to: 6, text: "includes"},
                            {from: 2, to: 10, text: "necessary\nfor"},
                            {from: 2, to: 12, text: "necessary\nfor"},
                            {from: 4, to: 5, text: "combine\nto form"},
                            {from: 4, to: 6, text: "include"},
                            {from: 4, to: 7, text: "are"},
                            {from: 4, to: 8, text: "are"},
                            {from: 4, to: 9, text: "are"},
                            {from: 5, to: 9, text: "are"},
                            {from: 5, to: 11, text: "may be"},
                            {from: 7, to: 13, text: "in"},
                            {from: 7, to: 14, text: "in"},
                            {from: 7, to: 19, text: "begin\nwith"},
                            {from: 8, to: 15, text: "with"},
                            {from: 8, to: 16, text: "with"},
                            {from: 9, to: 17, text: "aids"},
                            {from: 11, to: 18, text: "show"},
                            {from: 12, to: 19, text: "begins\nwith"},
                            {from: 17, to: 18, text: "needed\nto see"},
                            {from: 18, to: 20, text: "between"}
                        ]}
                        onModelChange={handleModelChange}
                    />
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
                            {key: 1, text: "Concept Maps", color: "orange"},
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
                            {from: 1, to: 2, text: "represent"},
                            {from: 2, to: 3, text: "is"},
                            {from: 2, to: 4, text: "is"},
                            {from: 2, to: 5, text: "is"},
                            {from: 2, to: 6, text: "includes"},
                            {from: 2, to: 10, text: "necessary\nfor"},
                            {from: 2, to: 12, text: "necessary\nfor"},
                            {from: 4, to: 5, text: "combine\nto form"},
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
                            path="/" exact
                            render={() => <div><NavLink to='/test'>Go to highlighted topic</NavLink></div>}
                        />
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
