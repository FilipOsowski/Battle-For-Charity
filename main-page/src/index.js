import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { AppBar, Tabs, Tab, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import './index.css';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-137697306-1');
ReactGA.pageview('/main-page');

const isMobile = window.innerWidth <= 700;

var starting_names = {male: ["Filippo DeFrenza", "BYE", "Teague Conrad", "Eric Braun", "Nick Mussman", "BYE", "Jake Lydon", "BYE", "Jeffrey Pagels", "BYE", "Mark Frale", "BYE", "Jacob Glorioso", "BYE", "Robert Stanislawski", "BYE", "Anthony Wachal", "BYE", "Brandon Kriepke", "Andrew Bittner", "Jacob Cosentino", "BYE", "Davon Holmes", "BYE", "Raja Mittal", "BYE", "Michael Guskey", "Jake Milewski", "Raj Patel", "BYE", "Jaylen Patel", "BYE"], female: ["Katie O'Brien", "BYE", "Sidra Capriolo", "Niva Patel", "Olivia Olszewski", "Laura Vesco", "Kimmi Nijjar", "Nicole Brashears", "Alyssa Bolbot", "BYE", "Kelly O'Sullivan", "Rachel Pariso", "Delaney Demaret", "Bridget Tobin", "Gianna Catania", "Lyric Childs"]}
var user_brackets = null
var event_has_started = null
var leaderboard = null
var correct_brackets = null;
var user_has_posted = null;
var name = null;
var points = null;
var rank = null;
//var user_brackets = {male: ["Filippo DeFrenza", "Teague Conrad", "Nick Mussman", "Jake Lydon", "Jeffrey Pagels", "Mark Frale", "Jacob Glorioso", "Robert Stanislawski", "Anthony Wachal", "Andrew Bittner", "Jacob Cosentino", "Davon Holmes", "Raja Mittal", "Jake Milewski", "Raj Patel", "Jaylen Patel", "Teague Conrad", "Nick Mussman", "Mark Frale", "Robert Stanislawski", "Anthony Wachal", "Jacob Cosentino", "Jake Milewski", "Jaylen Patel", "Teague Conrad", "Mark Frale", "Anthony Wachal", "Jaylen Patel", "Mark Frale", "Anthony Wachal", "Anthony Wachal"], female: ["Katie O'Brien", "Niva Patel", "Olivia Olszewski", "Nicole Brashears", "Alyssa Bolbot", "Kelly O'Sullivan", "Delaney Demaret", "Gianna Catania", "Katie O'Brien", "Nicole Brashears", "Kelly O'Sullivan", "Gianna Catania", "Katie O'Brien", "Gianna Catania", "Katie O'Brien"]}
//var correct_brackets = {male: ["Filippo DeFrenza", "Teague Conrad", "Nick Mussman", "Jake Lydon", "Jeffrey Pagels", "Mark Frale", "Jacob Glorioso", "Robert Stanislawski", "Anthony Wachal", "Andrew Bittner", "Jacob Cosentino", "Davon Holmes", "Raja Mittal", "Jake Milewski", "Raj Patel", "Jaylen Patel", "Teague Conrad", "Nick Mussman", "Mark Frale", "Robert Stanislawski", "Anthony Wachal", "Jacob Cosentino", "Jake Milewski", "Jaylen Patel", "Teague Conrad", "Mark Frale", "Anthony Wachal", "Jaylen Patel", "Mark Frale", "Anthony Wachal", "Anthony Wachal"], female: ["Katie O'Brien", "Niva Patel", "Olivia Olszewski", "Nicole Brashears", "Alyssa Bolbot", "Kelly O'Sullivan", "Delaney Demaret", "Gianna Catania", "Katie O'Brien", "Nicole Brashears", "Kelly O'Sullivan", "Gianna Catania", "Katie O'Brien", "Gianna Catania", "Katie O'Brien"]};
		//var i = 0
		//for (var key in user_brackets) {
			//if (!user_brackets[key]) {
				//user_brackets[key] = Array((i == 0 ? 31 : 15)).fill(null)
			//}
			//i = i + 1;
		//}

		 //i = 0
		//for (var key in correct_brackets) {
			//if (!correct_brackets[key]) {
				//correct_brackets[key] = Array((i == 0 ? 31 : 15)).fill(null)
			//}
			//i = i + 1;
		//}
//var user_has_posted = {male: false, female: false};
//var event_has_started = true;
//var name = "Filip Osowski";
//var points = 106;
//var rank = 56;
//var leaderboard = [["Gianna Catania", 50], ["Mark Frale", 45], ["Katie O'Brien", 40], ["Anthony Wachal", 35], ["Jaylen Patel", 30], ["Davon Holmes", 25], ["Anthony Wachal", 20], ["Nicole Brashears", 15], ["Kelly O'Sullivan", 10], ["Jake Lyndon", 5], ["Filippo DeFrenza", 0]];
//var leaderboard = null;

//This code is all the navigation bar and the space inside of it

function TabContainer(props) {
	const { children } = props;

	return (
		<Typography component="div" style={{ paddingTop: 100 , paddingLeft: 50, paddingRight: 50, paddingBottom: 50}}>
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
			<div className="ViewsContainer">
				<AppBar position="fixed" color="default">
					<Tabs
						value={this.state.value}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
					>
						<Tab label="Male Bracket" />
						<Tab label="Female Bracket" />
						<Tab label="Profile & Leaderboard" />
					</Tabs>
				</AppBar>
					{/*This is what's inside each tab*/}
				{this.state.value === 0 &&
				<TabContainer>
					<Tournament starting_names={starting_names["male"]} user_bracket={user_brackets["male"]} disabled={user_has_posted["male"] || event_has_started} gender="male" correct_bracket={correct_brackets["male"]} display_only={false}/>
				</TabContainer>}
				{this.state.value === 1 &&
				<TabContainer>
					<Tournament starting_names={starting_names["female"]} user_bracket={user_brackets["female"]} disabled={user_has_posted["female"] || event_has_started} gender="female" correct_bracket={correct_brackets["female"]} display_only={false}/>
				</TabContainer>}
				{this.state.value === 2 &&
				<TabContainer>
					<LeaderboardPage name={name} rank={rank} points={points} leaderboard_data={leaderboard} event_has_started={event_has_started}/>
				</TabContainer>}
				<footer style={{backgroundColor: "lightgrey", color: "grey", height: "60px", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
					<div style={{paddingRight: "25px", fontFamily: "Roboto"}}>Created by Andrew Milas, Viraj Sule, Murat Oguz, Graham Knott, Eddie Federmeyer, and Filip Osowski</div>
				</footer>
			</div>
		);
	}
}

class LeaderboardPage extends React.Component {
	logout() {
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open('POST', 'http://battleforcharity.com/clear-session', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				window.location.reload(true);
			}
		}
		xhr.send();
	}

	render() {
		var content = null;
		if (this.props.leaderboard_data) {
			var profile_data = null;

			let fontSize = (isMobile ? "3em" : "7em")
			if (this.props.rank) {
				profile_data =
						<div style={{display: "flex", flexDirection:"row", justifyContent: "space-evenly", alignItems: "center", top: "50px", backgroundColor: "#ededed", borderRadius: "15px", fontFamily: "Roboto", height: "200px"}}>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", height: "200px"}}>
								<div style={{fontSize: "2em", fontWeight: "400", paddingTop: "25px"}}>Rank</div>
								<div style={{fontSize: fontSize, fontWeight: "900", paddingTop: "55px"}}>#{this.props.rank}</div>
							</div>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", height: "200px"}}>
								<div style={{fontSize: "2em", fontWeight: "400", paddingTop: "25px"}}>Points</div>
								<div style={{fontSize: fontSize, fontWeight: "900", paddingTop: "55px"}}>{this.props.points}</div>
							</div>
						</div>
			}

			content = 
				<div>
					{profile_data}
					<div style={{display: "flex", justifyContent: "center", fontFamily: "Roboto", fontSize: "3em", fontWeight: "900", paddingTop: "75px", paddingBottom: "50px"}}>Leaderboard</div>
					<div style={{backgroundColor: "#ededed", borderRadius: "15px 15px 15px 15px"}}>
						<Leaderboard leaderboard_data={leaderboard}/>
					</div>
				</div>
		}
		else {
			content = 
				<div style={{paddingTop: "50px", display: "flex", justifyContent: "center", fontFamily: "Roboto", fontSize: "3em", fontWeight: "400", minHeight: "1000px", lineHeight: "1.15", textAlign: "center"}}>Come back when the event is over to see the leaderboard!</div>
		}

		var leaderboardPage =
			<div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
				<div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
					<div style={{width: "150px"}}/>
					<div style={{display: "flex", justifyContent: "center", fontFamily: "Roboto", fontSize: (isMobile ? "2em" : "3em"), fontWeight: "900", paddingBottom: "35px", lineHeight: "1.15"}}>Logged in as {this.props.name}</div>
					<Button variant="contained" color="secondary" onClick = {this.logout} style={{height: "50px", width: "150px", marginBottom: "35px"}}>Log Out</Button>
				</div>
				{content}
			</div>

		return (leaderboardPage)
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
			var rows = [];
			for (var i = 0; i < this.props.leaderboard_data.length; i++) {
				rows.push(this.createData(i));
			}

			var width = (isMobile ? "200px" : "500px")
			leaderboard = (
				<div className={"Leaderboard"} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
					{/*The titles at the top of the leaderboard*/}
					<div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: width, fontFamily: "Roboto", fontSize: "2.5em", fontWeight: "900", paddingBottom: "10px", paddingTop: "15px"}}>
						<span>Name</span>
						<span>Points</span>
					</div>
					<div style={{borderBottom: "3px solid grey", width: width}}></div>
					{/*The names and scores of the people in the leaderboard*/}
					{rows.map(row => (
						<div>
							<div key={row.id} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: width, fontFamily: "Roboto", fontSize: "2em", fontWeight: "400", paddingBottom: "15px", paddingTop: "15px", lineHeight: "1.15"}}>
								<span>{row.name}</span>
								<span>{row.score}</span>
							</div>
							<div style={{borderBottom: "1px solid grey", width: width}}></div>
						</div>
					))}
				</div>
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

		ReactGA.event({
			category: 'User',
			action: ('Locked bracket ' + this.props.gender)
		});
		
		this.props.disable_bracket();
	}

	render() {
		const { user_bracket, disable_bracket, gender } = this.props;
		var disabled = true;
		var status = "Lock Bracket";

		if (event_has_started) {
			status = "Event has already started";
		}
		else if (user_has_posted[gender]=== true) {
			status = "Locked";
		}
		else if (user_bracket.includes(null)) {
			status = "Finish Your Bracket To Lock It";
		}
		else {
			disabled = false;
		}

		return (
			<div style={{display: "flex", flexDirection: "row"}}>
				<Button fullWidth={true} variant="contained" color="primary" disabled = {disabled} onClick = {this.onClick} style={{minHeight: "50px", height: "auto", overflow: "hidden", fontFamily: "Roboto", fontSize: (isMobile ? "1em" : "2em"), fontWeight: "400"}}>
					{status}
				</Button>
				<HelpButton/>
			</div>
		)
	}
}

class HelpButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {open: false};
		this.onClick = this.onClick.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onClick() {
		ReactGA.event({
			category: 'User',
			action: 'Clicked the help button'
		});
		this.setState({open: true});
	}

	onClose() {
		this.setState({open: false});
	}

	render() {
		return (
			<div>
				<Button variant="contained" onClick={this.onClick} style={{minHeight: "50px", height: "auto", marginLeft: "25px", fontFamily: "Roboto", fontSize: "2em", fontWeight: "900"}}>
					?
				</Button>
				<Dialog
					open={this.state.open}
					onClose={this.onClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						To complete your brackets:
						<ol>
							<li>Pick the winner of <b>each</b> match.</li>
							<li>Click the "Lock Bracket" button at the top of the page.</li>
							<li>Do the same for <b>both</b> Male and Female brackets.</li>
						</ol>
						Come back after the battle to see how your brackets did!
					</DialogTitle>
				<DialogActions>
						<Button onClick={this.onClose} color="primary">
							OK
						</Button>
					</DialogActions>
				</Dialog>
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
	
	baseLog(x, y) {
		return Math.log(y) / Math.log(x);
	}

	render() {
		var postButton = <PostButton gender={this.props.gender} user_bracket={this.props.user_bracket} disable_bracket={this.disableBracket}/>;
		if (this.props.display_only) {
			postButton = '';
			if (!this.props.user_bracket) {
				return (<div>No bracket data</div>);
			}
		}


		var matchColumns = Array(this.baseLog(2, this.props.starting_names.length)).fill(undefined);
		
		var all_names = this.props.starting_names.concat(this.props.user_bracket)

		var indexOfStartingMatch = 0
		for (var i = 0; i < matchColumns.length; i++) {
			let numOfMatches = Math.pow(2, matchColumns.length - 1 - i);
			var matches = Array(numOfMatches).fill(undefined);

			for (var k = 0; k < numOfMatches; k++) {
				let id = k + indexOfStartingMatch;
				let nameIndex = id * 2;
				let names = [all_names[nameIndex], all_names[nameIndex + 1]];

				var correct_names = [null, null];
				if (correct_brackets["male"][0] && correct_brackets["female"][0]) {
					correct_names = (i > 0) ? [this.props.correct_bracket[nameIndex - this.props.starting_names.length], this.props.correct_bracket[nameIndex - this.props.starting_names.length + 1]] : [null, null];
				}

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
				else if (!(names.includes(winner))) {
					this.props.user_bracket[id] = null;
					value = undefined;
				}
				else {
					value = winner
				}

				if (this.props.user_bracket[id] != all_names[this.props.starting_names.length + id]) {
					all_names = this.props.starting_names.concat(this.props.user_bracket)
				}

				var correct_bracket = this.props.correct_bracket;
				var user_bracket = this.props.user_bracket;
				var tournament_winner = null
				if (i == matchColumns.length - 1) {
					if (correct_bracket[this.props.starting_names.length - 2] && correct_brackets["male"][0] && correct_brackets["female"][0]) {
						var correction = null
						var strikethrough = "none"
						if (correct_bracket[this.props.starting_names.length - 2] == user_bracket[this.props.starting_names.length - 2]) {
							correction = <div style={{borderRadius: "5px", backgroundColor: "#c1fed6", width: "200px", position: "absolute", height: "50px", top: "35px", left: "330px"}}/>;
						}
						else {
							strikethrough = "line-through";
							correction = 
								<div>
									<div style={{borderRadius: "5px", backgroundColor: "#fec1c1", width: "200px", position: "absolute", height: "50px", top: "35px", left: "330px"}}/>
									<div style={{position: "absolute", top: "-10px", left: "330px", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "200px", height: "50px"}}>{this.props.correct_bracket[this.props.starting_names.length - 2]}</div>
								</div>
						}
					}

					tournament_winner = 
						<div>
							{correction}
							<div style={{border: "solid 5px grey", borderRadius: "10px", width: "200px", position: "absolute", height: "50px", top: "30px", left: "325px", textDecoration: strikethrough, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
									<div style={{top: "50px"}}>{this.props.user_bracket[this.props.user_bracket.length-1]}</div>
							</div>
						</div>
				}


				matches[k] = 
					<div style={{width: "300px", height: "200px"}} key={k + indexOfStartingMatch}>
						<div style={{border: "solid 5px grey", borderRadius: "10px", width: "200px", position: "relative"}}>
							<Match names={names} id={k + indexOfStartingMatch} update={this.handleChange} disabled={disabled} value={value} correct_names={correct_names}/>
							{k%2 == 0 && i != matchColumns.length - 1 &&
								<div style={{position: "absolute", width: "280px", top: "57px", borderTop: "solid 2px grey", height: ((200 * (i + 1)) + "px"), borderRight: "solid 2px grey", pointerEvents: "none"}}/>
							}
							{k%2 == 1 &&
									//(-(45 + this - 100))
								<div style={{position: "absolute", width: "280px", top: ((-(43 + (200 * (i + 1)) - 100)) + "px"), borderBottom: "solid 2px grey", height: ((200 * (i + 1)) + "px"), borderRight: "solid 2px grey", pointerEvents: "none"}}/>
							}
							{i>0 &&
								<div style={{position: "absolute", width: ((i==matchColumns.length - 1) ? "350px" : "220px"), left: "-20px", top: "57px", borderBottom: "solid 2px grey", pointerEvents: "none"}}/>
							}
							{tournament_winner}
						</div>
					</div>
			}

			indexOfStartingMatch = indexOfStartingMatch + Math.pow(2, matchColumns.length - 1 - i);

			matchColumns[i] = <div key={i} className="matchColumn" style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>{matches}</div>
		}

		return (
			<div className="tournamentContainer">
				{postButton}
				<div style={{overflowX: "scroll"}}>
					<br/><br/><br/>
					<div className="tournament" style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
						{matchColumns}
					</div>
				</div>
			</div>
		)
	}
}
//1740

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

		var strikethrough = Array(2).fill("none");
		var corrections = Array(2).fill(null);
		if (this.props.correct_names[0]) {
			for (var i = 0; i < 2; i++) {
				if (this.props.correct_names[i] == names[i]) {
					corrections[i] = <div key={i} style={{position: "absolute", backgroundColor: "#c1fed6", height: "58px", width: "200px", top: ((i==0) ? "0px" : "58px"), borderRadius: ((i==0) ? "5px 5px 0px 0px" : "0px 0px 5px 5px")}}></div>
				}
				else {
					strikethrough[i] = "line-through";
					corrections[i] = 
						<div key={i} >
							<div style={{position: "absolute", top: ((i == 0) ? "0px" : "58px"), width: "200px", height: "58px", backgroundColor: "#fec1c1", borderRadius: ((i==0) ? "5px 5px 0px 0px" : "0px 0px 5px 5px")}}></div>
							<div style={{position: "absolute", top: ((i == 0) ? "-35px" : "135px"), left: "50px"}}>{this.props.correct_names[i]}</div>
						</div>
				}
			}
		}

    return (
			<div style={{position: "relative"}}>
				{corrections}
				<FormControl component="fieldset" style={{position: "relative"}}>
						<RadioGroup
							value={value ? value : "deselected"}
							onChange={this.handleChange}
						>
									<FormControlLabel value={names[0] || ''} disabled={disable_forms[0]} control={<Radio />} label={names[0]} style={{margin: "5px", textDecoration: strikethrough[0]}}/>
									<FormControlLabel value={names[1] || ''} disabled={disable_forms[1]} control={<Radio />} label={names[1]} style={{margin: "5px", textDecoration: strikethrough[1]}}/>
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
		name = data["name"];
		points = data["points"];
		rank = data["rank"];

		var i = 0
		for (var key in user_brackets) {
			if (!user_brackets[key]) {
				user_brackets[key] = Array((i == 0 ? 31 : 15)).fill(null)
			}
			i = i + 1;
		}

		i = 0
		for (var key in correct_brackets) {
			if (!correct_brackets[key]) {
				correct_brackets[key] = Array((i == 0 ? 31 : 15)).fill(null)
			}
			i = i + 1;
		}

		ReactDOM.render(<NavBar/>, document.getElementById('root'));
	}
}
xhr.send();
//ReactDOM.render(<NavBar/>, document.getElementById('root'));
