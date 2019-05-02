import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { AppBar, Tabs, Tab, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import './index.css';

var starting_names = {male: ["A", "B", "C", "D", "E", "F", "G", "BYE", "H", "BYE", "I", "J", "K", "L", "BYE", "M", "N", "O", "P", "BYE", "Q", "R", "S", "T", "U", "BYE", "V", "W", "X", "Y", "BYE", "Z"], female: ["A", "B", "C", "D", "E", "F", "G", "BYE", "H", "BYE", "I", "J", "K", "L", "BYE", "M", "N", "O", "P", "BYE", "Q", "R", "S", "T", "U", "BYE", "V", "W", "X", "Y", "BYE", "Z"]}
var user_brackets = null
var event_has_started = null
var leaderboard = null
var correct_brackets = null;
var user_has_posted = null

//This code is all the navigation bar and the space inside of it

function TabContainer(props) {
	const { children } = props;

	return (
		<Typography component="div" style={{ padding: 24 }}>
			{children}
		</Typography>
	);
}

TabContainer.propTypes = {
		children: PropTypes.node.isRequired,
};

class NavBar extends React.Component {
	constructor(props) {
		super(props)
		this.update = this.update.bind(this);
		this.state = {
				value: 0,
		};
	}
	
	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};

	update() {
		this.forceUpdate();
	}

	render() {
		return (
			<div className="SwipeableViewsContainer">
				<AppBar position="static" color="default">
					<Tabs
						value={this.state.value}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
					>
						<Tab label="Male Bracket" />
						<Tab label="Female Bracket" />
						<Tab label="Leaderboard" />
					</Tabs>
				</AppBar>
					{/*This is what's inside each tab*/}
				{this.state.value === 0 &&
				<TabContainer>
					<Tournament starting_names={starting_names["male"]} user_bracket={user_brackets["male"]} disabled={user_has_posted["male"] || event_has_started} gender="male" display_only={false}/>
				</TabContainer>}
				{this.state.value === 1 &&
				<TabContainer>
					<Tournament starting_names={starting_names["female"]} user_bracket={user_brackets["female"]} disabled={user_has_posted["female"] || event_has_started} gender="female" display_only={false}/>
				</TabContainer>}
				{this.state.value === 2 &&
				<TabContainer>
					<Leaderboard leaderboard_data={leaderboard}/>
					<Tournament starting_names={starting_names["male"]} user_bracket={correct_brackets["male"]} disabled={true} display_only={true}/>
					<Tournament starting_names={starting_names["female"]} user_bracket={correct_brackets["female"]} disabled={true} display_only={true}/>
				</TabContainer>}
			</div>
		);
	}
}

class Leaderboard extends React.Component {
	createData(id) {
			let name = this.props.leaderboard_data[id][0];
			let score = this.props.leaderboard_data[id][1];
			return {id, name, score};
	}

	render() {
		let leaderboard = <div>No leaderboard data</div>
		if (this.props.leaderboard_data) {
			const rows = [
				this.createData(0),
				this.createData(1),
				this.createData(2),
				this.createData(3),
				this.createData(4),
				this.createData(5),
				this.createData(6),
				this.createData(7),
				this.createData(8),
				this.createData(9),
			];
			leaderboard = (
				<Table className={"Leaderboard"}>
					{/*The titles at the top of the leaderboard*/}
					<TableHead>
						<TableRow>
							<TableCell align = "center">Name</TableCell>
							<TableCell>Score</TableCell>
						</TableRow>
					</TableHead>
					{/*The names and scores of the people in the leaderboard*/}
					<TableBody>
						{rows.map(row => (
							<TableRow key={row.id}>
								<TableCell component="th" scope = "row" align = "center">
									{row.name}
								</TableCell>
								<TableCell>
									{row.score}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)
		}
		return leaderboard;
	}
}

class PostButton extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		// Display dialog onload, on dialog close change text to "Locked," 
		user_has_posted[this.props.gender]=true;

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open('POST', 'http://battleforcharity.com/set-user-bracket', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify({
			gender: this.props.gender,
			user_bracket: this.props.user_bracket
		}));

		this.props.disable_bracket();
		console.log("Post button was clicked");
	}

	render() {
		const { user_bracket, disable_bracket, gender } = this.props;
		var disabled = true;
		var status = "Lock Bracket";

		if (user_has_posted[gender]=== true) {
			status = "Locked";
		}
		else if (user_bracket.includes(null)) {
			status = "Finish Your Bracket To Lock It";
		}
		else {
			disabled = false;
		}

		return (
			<div>
				<Button variant="contained" color="secondary" disabled = {disabled} size = "large" onClick = {this.onClick}>
					{status}
				</Button>
			</div>
		)
	}
}

class Tournament extends React.Component {
	constructor(props) {
		super(props);
		const { disabled } = props;

		this.state = {disabled: disabled};
		this.handleChange = this.handleChange.bind(this);
		this.disableBracket = this.disableBracket.bind(this);
	}

	handleChange(name, id) {
		this.props.user_bracket[id] = name;
		//this.forceUpdate();
		this.setState({ user_bracket: this.state.user_bracket });
	}

	disableBracket() {
		this.setState({disabled: true});
	}

	render() {
		var postButton = <PostButton gender={this.props.gender} user_bracket={this.props.user_bracket} disable_bracket={this.disableBracket}/>;
		if (this.props.display_only) {
			postButton = '';
			if (!this.props.user_bracket) {
				return (<div>No bracket data</div>);
			}
		}

		var matchColumns = Array(5).fill(undefined);
		var all_names = this.props.starting_names.concat(this.props.user_bracket)

		var indexOfStartingMatch = 0
		for (var i = 0; i < matchColumns.length; i++) {
			let numOfMatches = Math.pow(2, 4 - i);
			var matches = Array(numOfMatches).fill(undefined);

			for (var k = 0; k < numOfMatches; k++) {
				let id = k + indexOfStartingMatch;
				let nameIndex = id * 2;
				let names = [all_names[nameIndex], all_names[nameIndex + 1]];
				let winner = this.props.user_bracket[id];
				var disabled = this.state.disabled;
				var value = undefined;

				if (names.includes("BYE")) {
					var winner_index = 1;

					if ("BYE" == names[1]) {
						winner_index = 0;
					}

					var winner_by_default = names[winner_index];
					this.props.user_bracket[id] = winner_by_default;
					value = winner_by_default;
					disabled = true;
				}
				// The match's winner has been replaced. The match is deselected and the winner is made null.
				else if (!(names.includes(winner))) {
					this.props.user_bracket[id] = null;
					value = undefined;
				}
				else {
					value = winner
				}

				if (this.props.user_bracket[id] != all_names[32 + id]) {
					all_names = this.props.starting_names.concat(this.props.user_bracket)
				}

				matches[k] = 
					<div style={{width: "300px", height: "200px"}}>
						<div style={{border: "solid 5px grey", borderRadius: "10px", width: "200px", position: "relative"}}>
							{k%2 == 0 && i != 4 &&
								<div style={{position: "absolute", width: "280px", top: "55px", borderTop: "solid 2px grey", height: ((200 * (i + 1)) + "px"), borderRight: "solid 2px grey"}}/>
							}
							{k%2 == 1 &&
									//(-(45 + this - 100))
								<div style={{position: "absolute", width: "280px", top: ((-(45 + (200 * (i + 1)) - 100)) + "px"), borderBottom: "solid 2px grey", height: ((200 * (i + 1)) + "px"), borderRight: "solid 2px grey"}}/>
							}
							{i>0 &&
								<div style={{position: "absolute", width: "220px", left: "-20px", top: "55px", borderBottom: "solid 2px grey"}}/>
							}
							<Match names={names} key={k + indexOfStartingMatch} id={k + indexOfStartingMatch} update={this.handleChange} disabled={disabled} value={value}/>
						</div>
					</div>
			}

			indexOfStartingMatch = indexOfStartingMatch + Math.pow(2, 4 - i);

			matchColumns[i] = <div key={i} className="matchColumn" style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>{matches}</div>
		}

		return (
			<div className="tournamentContainer">
				{postButton}
				<br/><br/><br/>
				<div className="tournament" style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
					{matchColumns}
				</div>
			</div>
		)
	}
}

class Match extends React.Component {
  handleChange = event => {
		this.props.update(event.target.value, this.props.id);
  };

  render() {
		const { names, id, update, disabled, value} = this.props;
		var disable_forms = Array(2).fill(disabled);

		for (var i = 0; i < disable_forms.length; i++) {
			if (!disabled && names[i] != null) {
				disable_forms[i] = false;
			}
			else {
				disable_forms[i] = true;
			}
		}

    return (
			<FormControl component="fieldset">
					<RadioGroup
						value={value ? value : "deselected"}
						onChange={this.handleChange}
					>
						<FormControlLabel value={names[0] || ''} disabled={disable_forms[0]} control={<Radio />} label={names[0]} style={{margin: "5px"}}/>
						<FormControlLabel value={names[1] || ''} disabled={disable_forms[1]} control={<Radio />} label={names[1]} style={{margin: "5px"}}/>
					</RadioGroup>
			</FormControl>
    );
  }
}

class DemoMatch extends React.Component {
	constructor(props) {
		super(props);
		const { names, id, update, user_bracket, defaultDisable } = props;
		var disabled = defaultDisable;
		var value = '';

		this.state = {
			value: value,
			disabled: disabled
		};
	}

  handleChange = event => {
		this.props.update(event.target.value, this.props.id);
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div style={this.props.style}>
        <FormControl component="fieldset">
          <RadioGroup
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value={this.props.names[0]} disabled={this.state.disabled} control={<Radio />} label={this.props.names[0]}/>
            <FormControlLabel value={this.props.names[1]}disabled={this.state.disabled} control={<Radio />} label={this.props.names[1]}/>
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.open('POST', 'http://battleforcharity.com/get-data', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.onreadystatechange = function() {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		var data = JSON.parse(xhr.responseText)
		user_brackets = data["user_brackets"];
		event_has_started = data["event_has_started"];
		leaderboard = data["leaderboard"];
		correct_brackets = data["correct_brackets"];
		user_has_posted = data["user_has_posted"];

		for (var key in user_brackets) {
			if (!user_brackets[key]) {
				user_brackets[key] = Array(31).fill(null)
			}
		}

		ReactDOM.render(<NavBar/>, document.getElementById('root'));
	}
}
xhr.send();
