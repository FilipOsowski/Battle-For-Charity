// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// class Bracket extends React.Component {
//     render() {
//         return(
//
//         )
//     }
// }

class Page extends React.Component {
    render() {
        return(
            <div className="leaderboard list">
                <h1>Leaderboard</h1>
                <ul>
                    <li>First</li>
                    <li>Second</li>
                    <li>Third</li>
                    <li>Fourth</li>
                    <li>Fifth</li>
                </ul>
            </div>
        )
    }
}

ReactDOM.render(<Page />, document.getElementById("root"));
serviceWorker.unregister();
