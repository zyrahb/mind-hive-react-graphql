/* eslint-disable */

import * as go from "gojs";
import {ReactDiagram} from "gojs-react";
import React, {Component} from "react";
import {API, graphqlOperation} from 'aws-amplify';
import {Header} from 'semantic-ui-react';
import FocusMenu from './FocusMenu'
import 'gojs/extensions/HyperlinkText.js';

var toFocus = '';
var linkNode ='';

function ContinuousForceDirectedLayout() {
    go.ForceDirectedLayout.call(this);
}

go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

function handleModelChange(changes) {
    alert('GoJS model changed!');
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
    listLinks(limit: 2000
              filter: {
                to: {
                    eq: $topicId
                }
    }) {
        items {
            linkid: id
            text: title
            from: fromTopic {
                id
                name
                color
            }
        }
    }
}`;


const GetFocusTopicsLinksFrom = `query GetFocusTopicsLinksFrom($topicId: String!){
    listLinks(limit: 2000
              filter: {
                from: {
                    eq: $topicId
                }
    }) {
        items {
            linkid: id
            text: title
            to: toTopic {
                id
                name
                color
            }
        }
    }
}`;

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

    function linkClick(e, obj) {
        linkNode = obj.hb;
        // alert(JSON.stringify(linkNode));
    };

    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {click: linkClick},
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
            ),

        );

    return diagram;
}


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
        // alert(JSON.stringify(resultFocusTo.data.listLinks.items));
        // alert(JSON.stringify(resultFocusFrom.data.listLinks.items));
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
                        ? <div className="ui grid container">
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
                                <FocusMenu topic={this.state.topic} link={linkNode} links={this.state.links}/>
                            </div>
                        </div>
                        : this.noResults()
                }

            </div>
        )
    }
}

export default Focus;
