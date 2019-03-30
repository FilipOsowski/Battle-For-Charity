import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';





var names = [[], ["Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null"],
    ["Null", "Null", "Null", "Null", "Null", "Null", "Null", "Null"], ["Null", "Null", "Null", "Null"], ["Null", "Null"]];



var starting_names = {male: ["A", "B", "C", "D", "E", "F", "G", "BYE", "H", "BYE", "I", "J", "K", "L", "BYE", "M", "N", "O", "P", "BYE", "Q", "R", "S", "T", "U", "BYE", "V", "W", "X", "Y", "BYE", "Z"], female: ["A", "B", "C", "D", "E", "F", "G", "BYE", "H", "BYE", "I", "J", "K", "L", "BYE", "M", "N", "O", "P", "BYE", "Q", "R", "S", "T", "U", "BYE", "V", "W", "X", "Y", "BYE", "Z"]};
var arrayOfRadioGroups = [[], [], [], [], [], [], [], []];
names[0] = starting_names.male;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

class MainPage extends React.Component {
    render() {
        return(
            <div>
                <FormLabel component="legend">Male Bracket</FormLabel>
                <div className={"roundOne"}>{arrayOfRadioGroups[0]}</div>
                <p>Round 2</p>
                <div>{arrayOfRadioGroups[1]}</div>
                <p>Round 3</p>
                <div>{arrayOfRadioGroups[2]}</div>
                <p>Round 4</p>
                <div>{arrayOfRadioGroups[3]}</div>
            </div>
        );
    }
}

class RadioButtonsGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ""};
    }


    handleChange = event => {
        this.setState({ value: event.target.value});
        names[this.props.a+1][this.props.b] = event.target.value;
        // for (var i=this.props.a+2; i < names.length; i++) {
        //     names[i][this.props.b/(Math.pow(2, i-this.props.a-1))] = "null";
        // }
        updateBrackets();
    };

    render() {
        return (

            <div>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="winner"
                        name="winner"
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <FormControlLabel
                            value={names[this.props.a][this.props.b*2]}
                            control={<Radio color="primary" />}
                            label={names[this.props.a][this.props.b*2]}
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value={names[this.props.a][this.props.b*2+1]}
                            // disabled
                            control={<Radio />}
                            label={names[this.props.a][this.props.b*2+1]}
                            labelPlacement="start"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }
}

function updateBrackets() {

    for (var j = 0; j < names.length-1; j++) {
        for (var i= 0; i < names[j].length/2; i++) {
            arrayOfRadioGroups[j][i] = (<RadioButtonsGroup a={j} b={i}></RadioButtonsGroup>)
        }
    }
    ReactDOM.render(<MainPage />, document.getElementById('root'));
}

updateBrackets();




