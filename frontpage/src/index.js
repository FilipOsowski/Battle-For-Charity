class Page extends React.Component {
    render() {
        return(
            <div className = "mainpage">
                <div className = "tournamentBracket">

                </div>
                <div className="leaderboardList">
                    <h1>Leaderboard</h1>
                    <ul>
                        <li>First</li>
                        <li>Second</li>
                        <li>Third</li>
                        <li>Fourth</li>
                        <li>Fifth</li>
                    </ul>
                </div>
            </div>
        )
    }
}

//These are the buttons people will click to set the winner of the fight
class RadioButton extends React.Component {
    setWinner(event) {
        console.log(event.target.value);
    }

    render() {
        return(
            <div onChange={this.setWinner.bind(this)}>
                Person1 <input type="radio" value="Person1" name="winner"/>
            </div>
        )
    }
}

ReactDOM.render(<Page />, document.getElementById("root"));
// serviceWorker.unregister();
