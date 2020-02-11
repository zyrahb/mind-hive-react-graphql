/* eslint-disable */

import * as go from "gojs";
import {ReactDiagram} from "gojs-react";
import React, {Component} from "react";
import {API, graphqlOperation} from 'aws-amplify';
import {Header} from 'semantic-ui-react';
import ActionMenu from './ActionMenu';
import 'gojs/extensions/HyperlinkText.js';

function ContinuousForceDirectedLayout() {
    go.ForceDirectedLayout.call(this);
}

go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

function initDiagram() {
    const $ = go.GraphObject.make;
    const diagram =
        $(go.Diagram,
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
        );

    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            $(go.Shape,  // the link shape
                {stroke: "black"})
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
    listTopics(limit:1000){
        items {
            key: id
            text: name
            color
        }
    }
}`;

const ListLinks = `query ListLinks{
    listLinks(limit: 2000) {
        items {
            to
            from
        }
    }
}`;

class Vista extends Component {

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
        // alert(JSON.stringify(resultListTopics.data.listTopics.items));
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

export default Vista;
