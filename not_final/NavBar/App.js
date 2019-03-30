import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Button from "@material-ui/core/Button";
import green from '@material-ui/core/colors/green';


//This code is all the navigation bar and the space inside of it

function TabContainer(props) {
    const { children, dir } = props;

    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100vw",
        position: 'relative',
        minHeight: "100vh",
    },
    fab: {
        position: 'absolute',
        // bottom: theme.spacing.unit * 2,
        right: "48.5vw",
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[100],
        '&:hover': {
            backgroundColor: green[600],
        },
    },
});

class NavBar extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    handleClick(name) {
        console.log("Fab Name: " + name);
    }

    render() {
        const { classes, theme } = this.props;
        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        };
        // sets the colors for the buttons within the tabs
        const fabs = [
            {
                color: 'primary',
                className: classes.fab,
            },
            {
                color: 'secondary',
                className: classes.fab,
            },
        ];

        return (
            <div className={classes.root}>
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
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                >

                    {/*This is what's the page is inside each bracket*/}
                    {/*MalePage and FemalePage are imported from maleleaderboard.js and femaleleaderboard.js*/}
                    <TabContainer dir={theme.direction}>
                        <MalePage />
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <FemalePage />
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <Leaderboard />
                    </TabContainer>
                </SwipeableViews>

                {/*These are where the buttons are displayed*/}
                {fabs.map((fab, index) => (
                    <Zoom
                        key={fab.color}
                        in={this.state.value === index}
                        timeout={transitionDuration}
                        style={{
                            transitionDelay: `${this.state.value === index ? transitionDuration.exit : 0}ms`,
                        }}
                        unmountOnExit
                    >
                        <Button className={fab.className} color={fab.color} size = "large" onClick = {() => {this.handleClick(index);}}>
                            Submit
                        </Button>
                    </Zoom>
                ))}
            </div>
        );
    }
}

class Leaderboard extends React.Component {
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

class MalePage extends React.Component {
    render() {
        return (
            <div className="mainpage">
                <div className="tournamentBracket"> <p>male bracket</p>
                </div>
            </div>
        )
    }
}

class FemalePage extends React.Component {
    render() {
        return (
            <div className="mainpage">
                <div className="tournamentBracket"><p>female bracket</p>
                </div>
            </div>
        )
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NavBar);
