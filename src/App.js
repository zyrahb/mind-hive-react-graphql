// src/App.js for Step 3

import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import './App.css';

Amplify.configure(aws_exports);

/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */
function initDiagram() {
    const $ = go.GraphObject.make;
    // const diagram =
    //     $(go.Diagram,
    //         {
    //             'undoManager.isEnabled': true,  // must be set to allow for model change listening
    //             // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
    //             'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
    //             model: $(go.GraphLinksModel,
    //                 {
    //                     linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
    //                 })
    //         });

    const diagram =
        $(go.Diagram,
            {
                initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
                contentAlignment: go.Spot.Center,  // align document to the center of the viewport
                layout:
                    $(go.ForceDirectedLayout,  // automatically spread nodes apart
                        { maxIterations: 200, defaultSpringLength: 30, defaultElectricalCharge: 100 })
            });

    // define a simple Node template
    // diagram.nodeTemplate =
    //     $(go.Node, 'Auto',  // the Shape will go around the TextBlock
    //         new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    //         $(go.Shape, 'RoundedRectangle',
    //             { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
    //             // Shape.fill is bound to Node.data.color
    //             new go.Binding('fill', 'color')),
    //         $(go.TextBlock,
    //             { margin: 8, editable: true },  // some room around the text
    //             new go.Binding('text').makeTwoWay()
    //         )
    //     );


    diagram.nodeTemplate =
        $(go.Node, "Auto",  // the whole node panel
            { locationSpot: go.Spot.Center },
            // define the node's outer shape, which will surround the TextBlock
            $(go.Shape, "Rectangle",
                { fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }), stroke: "black" }),
            $(go.TextBlock,
                { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 },
                new go.Binding("text", "text"))
        );


    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            $(go.Shape,  // the link shape
                { stroke: "black" }),
            $(go.Shape,  // the arrowhead
                { toArrow: "standard", stroke: null }),
            $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
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

class App extends Component {
    render() {
        return (
            <div>
                <div>
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName='diagram-component'
                    nodeDataArray={[
                        { key: 1, text: "Concept Maps" },
                        { key: 2, text: "Organized Knowledge" },
                        { key: 3, text: "Context Dependent" },
                        { key: 4, text: "Concepts" },
                        { key: 5, text: "Propositions" },
                        { key: 6, text: "Associated Feelings or Affect" },
                        { key: 7, text: "Perceived Regularities" },
                        { key: 8, text: "Labeled" },
                        { key: 9, text: "Hierarchically Structured" },
                        { key: 10, text: "Effective Teaching" },
                        { key: 11, text: "Crosslinks" },
                        { key: 12, text: "Effective Learning" },
                        { key: 13, text: "Events (Happenings)" },
                        { key: 14, text: "Objects (Things)" },
                        { key: 15, text: "Symbols" },
                        { key: 16, text: "Words" },
                        { key: 17, text: "Creativity" },
                        { key: 18, text: "Interrelationships" },
                        { key: 19, text: "HELLO" },
                        { key: 20, text: "Different Map Segments" }
                    ]}
                    linkDataArray={[
                        { from: 1, to: 2, text: "represent" },
                        { from: 2, to: 3, text: "is" },
                        { from: 2, to: 4, text: "is" },
                        { from: 2, to: 5, text: "is" },
                        { from: 2, to: 6, text: "includes" },
                        { from: 2, to: 10, text: "necessary\nfor" },
                        { from: 2, to: 12, text: "necessary\nfor" },
                        { from: 4, to: 5, text: "combine\nto form" },
                        { from: 4, to: 6, text: "include" },
                        { from: 4, to: 7, text: "are" },
                        { from: 4, to: 8, text: "are" },
                        { from: 4, to: 9, text: "are" },
                        { from: 5, to: 9, text: "are" },
                        { from: 5, to: 11, text: "may be" },
                        { from: 7, to: 13, text: "in" },
                        { from: 7, to: 14, text: "in" },
                        { from: 7, to: 19, text: "begin\nwith" },
                        { from: 8, to: 15, text: "with" },
                        { from: 8, to: 16, text: "with" },
                        { from: 9, to: 17, text: "aids" },
                        { from: 11, to: 18, text: "show" },
                        { from: 12, to: 19, text: "begins\nwith" },
                        { from: 17, to: 18, text: "needed\nto see" },
                        { from: 18, to: 20, text: "between" }
                    ]}
                    onModelChange={handleModelChange}
                />
                </div>
                <div><Header>This is where the options go</Header></div>
            </div>

        );
    }
}

export default withAuthenticator(App, {includeGreetings: true});
