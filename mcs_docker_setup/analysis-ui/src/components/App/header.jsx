import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import _ from "lodash";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const GET_FIELD_AGG = gql`
    query getFieldAggregation($fieldName: String!){
        getFieldAggregation(fieldName: $fieldName) {
            key
        }
  }`;

const GET_SUBMISSION_AGG = gql`
    query getSubmissionFieldAggregation{
        getSubmissionFieldAggregation {
            key {
                performer
                submission
            }
        }
  }`;

class ListItem extends React.Component {
    render() {
        if(this.props.item.includes('/')) {
            let perfSubm = this.props.item.split('/');
            this.props.state["perf"] = perfSubm[0];
            this.props.state['subm'] = perfSubm[1];
        } else {
            this.props.state[this.props.stateName] = this.props.item;
        }
        
        const urlBasePath = window.location.href.split('?')[0];
        const params = "?perf=" + this.props.state["perf"] + "&subm=" + this.props.state["subm"] + "&block=" + this.props.state["block"] + "&test=" + this.props.state["test"];

        const newLocation = urlBasePath + params;

        return (
            <NavDropdown.Item id={this.props.stateName + "_" + this.props.itemKey} href={newLocation}>{this.props.item}</NavDropdown.Item>
        )
    }
}

class DropListItems extends React.Component {
    render() {
        let queryName = GET_FIELD_AGG;
        let variablesToQuery = {"fieldName": this.props.fieldName};
        let dataName = "getFieldAggregation";

        if(this.props.fieldName === "submission") {
            queryName = GET_SUBMISSION_AGG;
            variablesToQuery = {};
            dataName = "getSubmissionFieldAggregation";
        }

        return(
            <Query query={queryName} variables={variablesToQuery}>
            {
                ({ loading, error, data }) => {
                    let dropdownOptions = [];
                    
                    if(data !== undefined && dataName !== "getSubmissionFieldAggregation") {
                        dropdownOptions = _.map(data[dataName], 'key');
                    } else if (data !== undefined ) {
                        for(let i=0; i < data[dataName].length; i++) {
                            dropdownOptions.push(data[dataName][i].key.performer + "/" + data[dataName][i].key.submission);
                        }
                    }

                    return (
                        dropdownOptions.map((item,key) =>
                            <ListItem stateName={this.props.stateName} state={this.props.state} item={item} itemKey={key} key={this.props.stateName + "_" + key}/>
                        )
                    )
                }
            }
            </Query>
        );
    }
}

class EvalHeader extends React.Component {
    render() {
        return (
            <Navbar variant="dark" expand="lg">
                <Navbar.Brand href="#home">MCS Analysis</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title={"Performer/Submission: " + this.props.state.perf + "/" + this.props.state.subm} id="basic-nav-dropdown">
                            <DropListItems fieldName={"submission"} stateName={"subm"} state={this.props.state}/>
                        </NavDropdown>
                        <NavDropdown title={"Block: " + this.props.state.block} id="basic-nav-dropdown">
                            <DropListItems fieldName={"block"} stateName={"block"} state={this.props.state}/>
                        </NavDropdown>
                        <NavDropdown title={"Test: " + this.props.state.test} id="basic-nav-dropdown">
                            <DropListItems fieldName={"test"} stateName={"test"} state={this.props.state}/>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default EvalHeader;
