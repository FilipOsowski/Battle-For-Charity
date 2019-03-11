class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radiobuttons: Array(31).fill(null),
            round: 0
        };
    }
    render() {
        return(
            <div className = "mainpage">
                <div className = "tournamentBracket">
                    <Bracket>


                    </Bracket>
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
        console.log(event.target.name);
    }

    render() {
        return(
            <div onChange={this.setWinner.bind(this)}>
                Person1 <input type="radio" value = "value1" name = "name1"/*value=this.props.valueone name=this.props.name1*//>
                Person2 <input type="radio" value = "value2" name = "name2"/*value=this.props.valuetwo name=this.props.name2*//>
            </div>
        )
    }
}

//This will set up the radio buttons so that it's in the shape of a leaderboard
class Bracket extends React.Component {
    renderRadioButton() {
        return (
            <RadioButton/>
        )
    }

    render() {
        return(
            //Leaderboard design is set up here
            <div>
                <div className = "fightrow">
                    {this.renderRadioButton()}
                </div>
            </div>
        )
    }

}

ReactDOM.render(<Page />, document.getElementById("root"));
// serviceWorker.unregister();