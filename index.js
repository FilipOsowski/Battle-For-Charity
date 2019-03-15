import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { AppBar, Tabs, Tab, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@material-ui/core';
import './index.css';

var user_brackets = {male: ["A", "D", "F", "G", "H", "I", "K", "M", "O", "P", "R", "S", "U", "V", "Y", "Z", "D", "F", "H", "M", "O", "S", "U", "Y", "F", "M", "O", "U", "M", "O", "M"], female: ["A", "D", "F", "G", "H", "I", "K", "M", "O", "P", "R", "S", "U", "V", "Y", "Z", "D", "F", "H", "M", "O", "S", "U", "Y", "F", "M", "O", "U", "M", "O", "M"]}

var correct_brackets = {male: ["A", "D", "F", "G", "H", "I", "K", "M", "O", "P", "R", "S", "U", "V", "Y", "Z", "D", "F", "H", "M", "O", "S", "U", "Y", "F", "M", "O", "U", "M", "O", "M"], female: ["A", "D", "F", "G", "H", "I", "K", "M", "O", "P", "R", "S", "U", "V", "Y", "Z", "D", "F", "H", "M", "O", "S", "U", "Y", "F", "M", "O", "U", "M", "O", "M"]}

var starting_names = {male: ["A", "B", "C", "D", "E", "F", "G", "BYE", "H", "BYE", "I", "J", "K", "L", "BYE", "M", "N", "O", "P", "BYE", "Q", "R", "S", "T", "U", "BYE", "V", "W", "X", "Y", "BYE", "Z"], female: ["A", "B", "C", "D", "E", "F", "G", "BYE", "H", "BYE", "I", "J", "K", "L", "BYE", "M", "N", "O", "P", "BYE", "Q", "R", "S", "T", "U", "BYE", "V", "W", "X", "Y", "BYE", "Z"]}

var user_has_posted = {male: false, female: false};
var event_has_started = false;
var profile_id = 99999;
var username = "Test User";
var leaderboard = [["A", 50], ["B", 45], ["C", 40], ["D", 35], ["E", 30], ["F", 25], ["G", 20], ["H", 15], ["I", 10], ["J", 5], ["K", 0]];

//This code is all the navigation bar and the space inside of it

function TabContainer(props) {
	const { children } = props;

	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
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
				<SwipeableViews
					index={this.state.value}
					onChangeIndex={this.handleChangeIndex}
				>
					{/*This is what's inside each tab*/}
					<TabContainer>
						<Tournament starting_names={starting_names["male"]} user_brackets={user_brackets["male"]} disabled={user_has_posted["male"] || event_has_started} gender="male"/>
					</TabContainer>
					<TabContainer>
						<Tournament starting_names={starting_names["female"]} user_brackets={user_brackets["female"]} disabled={user_has_posted["female"] || event_has_started} gender="female"/>
					</TabContainer>
					<TabContainer>
						<Leaderboard leaderboard={leaderboard}/>
						<Tournament starting_names={starting_names["female"]} user_brackets={correct_brackets["female"]} disabled={true}/>
						<Tournament starting_names={starting_names["female"]} user_brackets={correct_brackets["female"]} disabled={true}/>
					</TabContainer>
				</SwipeableViews>
			</div>
		);
	}
}

class Leaderboard extends React.Component {
	// If this.props.leaderboard is null, display a message to the user that the event hasn't finished yet. Otherwise, display the leaderboard.
	render() {
		return (
			<div className="mainpage">
				<div className="tournamentBracket">
				</div>
				<div className="leaderboardList">
					<h1>Leaderboard</h1>
					<li>First</li>
					<li>Second</li>
					<li>Third</li>
					<li>Fourth</li>
					<li>Fifth</li>
				</div>
			</div>
		)
	}
}

class PostButton extends React.Component {
	constructor(props) {
		super(props);
		const { user_bracket, disable_bracket, gender } = props;
		var disabled = false;

		// Disable button if user_has_posted[gender] is true or the last element in user_bracket is not null

		this.onClick = this.onClick.bind(this);
		this.state = { disabled: disabled }
	}

	onClick() {
		// Make POST request to http://18.216.113.73/set-user-bracket
		// Use the keys "profile_id" and whatever gender is for the user's profile id and user_bracket respectively
		// Show a dialog when the server returns
		// set user_has_posted[gender] to true and call disable_bracket
		console.log("Post button was clicked");
	}

	render() {
		return (
			<Button variant="contained" color="secondary" disabled = {this.state.disabled} size = "large" onClick = {this.onClick}>
				Submit Your Bracket
			</Button>
		)
	}
}

class Tournament extends React.Component {
	constructor(props) {
		super(props);
		const { user_bracket, starting_names, disabled, gender } = props;

		this.state = {disabled: disabled};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(name, id) {
		this.props.user_bracket[id] = name;
		this.forceUpdate();
		//this.setState({ user_bracket: this.state.user_bracket });
	}

	disableBracket() {
		this.setState({disabled: true});
	}

	render() {
		let postButton = '';
		if (!(this.state.disabled)) {
			postButton = <PostButton gender={this.props.gender} user_bracket={this.props.user_bracket} disable_bracket={this.disableBracket}/>;
		}

		return (
			// Make 31 matches using starting_names and user_bracket
			// Create matches like this:
			// <Match id={id} names={names} handleChange={this.handleChange} disableDefault={this.state.disabled} user_bracket={this.props.user_bracket}/>
			//const { user_bracket, update, gender } = props;
			<div className="tournament">
				Tournament matches go here. <br/><br/><br/>
				{postButton}
			</div>
		)
	}
}

class Match extends React.Component {
	constructor(props) {
		super(props);
		const { names, id, update, user_bracket, defaultDisable } = props;
		const winner = user_bracket[id];
		var disabled = defaultDisable;
		var value = '';

		// The match is between a contestant and a BYE. The one contestant is selected and the match is disabled.
		if (names.includes("BYE")) { 
			var winner_index = 1;

			if ("BYE" == names[1]) {
				winner_index = 0;
			}

			var winner_by_default = names[winner_index];
			user_bracket[id] = winner_by_default;
			value = winner_by_default;
			disabled = true;
		}
		// The match has lost one of its contestants. The match is deselected and the winner is made null.
		else if (names.includes(null)) {
			user_bracket[id] = null
			value = '';
			disabled = true;
		}
		// The match's winner has been replaced. The match is deselected and the winner is made null.
		else if (!(names.includes(winner))) {
			user_bracket[id] = null
			value = '';
		}
		else {
			value = winner
		}

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
      <div>
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

ReactDOM.render(<NavBar/>, document.getElementById('root'));
