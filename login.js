import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-137697306-1');
ReactGA.pageview('/login-page');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: false};
		this.onSignIn = this.onSignIn.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onSignIn(googleUser) {
		let profile = googleUser.getBasicProfile();
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open("POST", "http://battleforcharity.com/create-user", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
			name: profile.getName(),
			email: profile.getEmail(),
			profile_id: profile.getId(),
			hd: googleUser.getHostedDomain()
		}));

		let self = this
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status == 403) {
					self.setState({open: true});
				}
				else {
					window.location.reload(true);
				}
			}
		}

		var auth2 = window.gapi.auth2.getAuthInstance();
		auth2.disconnect();
	}

	onFailedSignIn(args) {
		console.log("Google login failed.");
	}

	onClose() {
		this.setState({open: false});
	}

	render() {
		return (
			<div className="everything">
				<div className="loginTitle" style={{paddingTop: "30px"}}>Battle For Charity</div>
				<div className="description">Sign in to make your bracket</div>
				<div className="googleButton">
					<GoogleLogin classname="googleButton" clientId="360968735809-85smlnpttakq9ql1ij9mmijibc3q24dq.apps.googleusercontent.com" onSuccess={this.onSignIn} onFailure={this.onFailedSignIn} theme="dark"/>
				<Dialog
          open={this.state.open}
					onClose={this.onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Please sign in using your school email ending with "@students.d211.org" or "@d211.org"</DialogTitle>
				<DialogActions>
            <Button onClick={this.onClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));
