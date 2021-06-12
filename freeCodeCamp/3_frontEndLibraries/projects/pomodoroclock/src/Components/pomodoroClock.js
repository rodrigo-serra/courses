import React, { Component } from 'react';
import "./pomodoroClock.scss";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// Link to alarm
const ALARM = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";



class Clock extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            // There a are four states: idle, session, break and pause
            current: "idle",
            previous: "beginning",
            display_text: "Session",
            clock: [25, 0],
            session: 25,
            break: 5
            //timer: null
        }
        this.increment_var = this.increment_var.bind(this);
        this.decrement_var = this.decrement_var.bind(this);
        this.update_clock = this.update_clock.bind(this);
        this.restart_clock = this.restart_clock.bind(this);
        this.decrement_clock = this.decrement_clock.bind(this);
        this.start_clock = this.start_clock.bind(this);
        this.play_alarm = this.play_alarm.bind(this);
        this.pause_clock = this.pause_clock.bind(this);
        this.start_stop_clock = this.start_stop_clock.bind(this);

        this.timer = null;
    }
    
    // Increments the session and break variables according to aux
    increment_var(aux) {
        if(this.state.current === "idle") {
            if(aux === 'break') {
                if(this.state.break < 60) {
                    this.setState((state) => ({break: state.break + 1}));
                }
            } else {
                if(this.state.session < 60) {
                    this.setState((state) => ({session: state.session + 1}));
                    this.update_clock("session");
                }
            }
        }
    }

    // Decrements the session and break variables according to aux
    decrement_var(aux) {
        if(this.state.current === "idle") {
            if(aux === 'break') {
                if(this.state.break > 1) {
                    this.setState((state) => ({break: state.break - 1}));
                }
            } else {
                if(this.state.session > 1) {
                    this.setState((state) => ({session: state.session - 1}));
                    this.update_clock("session");
                }
            }
        }
    }


    // Updates clock depending on aux: break or session
    update_clock(aux) {
        if(aux === "break") {
            this.setState((state) => ({clock: [state.break, 0]}));
        } else {
            this.setState((state) => ({clock: [state.session, 0]}));
        }
    }


    // Restarts clock when the restart button is pressed
    restart_clock() {
        // Stop the alarm if restart button is pressed
        let sound = document.getElementById("beep");
        sound.pause();
        sound.currentTime = 0;
        //The timer needs to be stopped and the clock restarted
        this.setState((state) => ({
            current: "idle",
            previous: "beginning",
            display_text: "Session",
            clock: [25, 0],
            session: 25,
            break: 5
            //timer: clearInterval(state.timer)
        }));
        clearInterval(this.timer);
    }

    // Decrements the clock. If the seconds are at zero, then should be initialized to 59
    // When reaches 0, should swicth state from session to break, and vice-versa.
    // Must use this.update_clock
    decrement_clock() {
        // When the clock reaches zero
        if(this.state.clock[0] == 0 && this.state.clock[1] == 0) {
            this.play_alarm("beep");
            if(this.state.current === "break") {
                this.setState((state) => ({current: "session", previous: state.current, display_text: "Session"}));
                this.update_clock("session");
            } else {
                this.setState((state) => ({current: "break", previous: state.current, display_text: "Break"}));
                this.update_clock("break");
            }
        } else {
            if(this.state.clock[1] == 0) {
                this.setState((state) => ({clock: [state.clock[0] - 1, 59]}));  
            } else {
                this.setState((state) => ({clock: [state.clock[0], state.clock[1] - 1]}));
            }
        }
    }

    // When play is pressed, it starts the clock
    // Not right needs to update the current with the previous state, like the start_stop_clock() function
    // (not used)
    start_clock() {
        if (this.state.current === "idle") {
            //this.setState({current: "session", timer: setInterval(this.decrement_clock, 1000)});
            this.setState({current: "session"});
            this.timer = setInterval(this.decrement_clock, 1000);
        }
    }

    // When play is pressed, it starts the clock
    play_alarm(id) {
        let sound = document.getElementById(id);
        sound.play();
    }


    // Pause the clock (not used)
    pause_clock() {
        if (this.state.current === "session" || this.state.current === "break") {
            //this.setState((state) => ({current: "idle", previous: state.current, timer: clearInterval(state.timer)}));
            this.setState((state) => ({current: "idle", previous: state.current}));
            clearInterval(this.timer);
        }
    }


    start_stop_clock() {
        if (this.state.current === "idle" && this.state.previous === "beginning") {
            // The first time the button is pressed
            //this.setState((state) => ({current: "session", previous: state.current, timer: setInterval(this.decrement_clock, 1000)}));
            this.setState((state) => ({current: "session", previous: state.current}));
            this.timer = setInterval(this.decrement_clock, 1000);
        } else if (this.state.current === "session" && this.state.previous === "idle") {
            // When session is running and the play/stop is pressed
            //this.setState((state) => ({current: "idle", previous: state.current, timer: clearInterval(state.timer)}));
            this.setState((state) => ({current: "idle", previous: state.current}));
            clearInterval(this.timer);
        } else if (this.state.current === "break" && this.state.previous === "idle") {
            // When break is running and the play/stop is pressed
            //this.setState((state) => ({current: "idle", previous: state.current, timer: clearInterval(state.timer)}));
            this.setState((state) => ({current: "idle", previous: state.current}));
            clearInterval(this.timer);
        } else if (this.state.current === "idle" && this.state.previous === "session") {
            // Go back to session
            //this.setState((state) => ({current: "session", previous: state.current, timer: setInterval(this.decrement_clock, 1000)}));
            this.setState((state) => ({current: "session", previous: state.current}));
            this.timer = setInterval(this.decrement_clock, 1000);
        } else {
            // Go back to break
            //this.setState((state) => ({current: "break", previous: state.current, timer: setInterval(this.decrement_clock, 1000)}));
            this.setState((state) => ({current: "break", previous: state.current}));
            this.timer = setInterval(this.decrement_clock, 1000);
        }
    }


    render() {
        
        // Looks at the clock (state) and displays depending on the number of digits in both minutes and seconds.
        // Adds an extra zero if the digits have size one, i.e., 5 seconds equals "05"
        let clock_display;
        let minutes = (this.state.clock[0]).toString();
        let seconds = (this.state.clock[1]).toString();
        if (minutes.length == 2) {
            clock_display = seconds.length == 2 ? minutes + ":" + seconds : minutes + ":0" + seconds;
        } else {
            clock_display = seconds.length == 2 ? "0" + minutes + ":" + seconds : "0" + minutes + ":0" + seconds;
        }


        return (
            <div className="container">
                <div className="box">
                
                    <div className="state_container" id="timer-label">{this.state.display_text}</div>
                    
                    <div className="display" id="time-left">{clock_display}</div>
                    <audio className="clip" id="beep" src={ALARM}></audio>
                    
                    <div className="text_container_break" id="break-label">Break Length</div>
                    <div className="text_container_session" id="session-label">Session Length</div>
                    
                    <div className="display_break" id="break-length">{this.state.break}</div>
                    <div className="display_session" id="session-length">{this.state.session}</div>
                    
                    <div className="break_add_container">
                        <div className="my_button break_add" id="break-increment" onClick={() => this.increment_var('break')}>
                            {/*<i className="fas fa-plus fa-2x"></i>*/}
                            <FontAwesomeIcon icon="plus" size="2x"/>
                        </div>
                    </div>
                    <div className="break_minus_container">
                        <div className="my_button break_minus" id="break-decrement" onClick={() => this.decrement_var('break')}>
                            {/*<i className="fas fa-minus fa-2x"></i>*/}
                            <FontAwesomeIcon icon="minus" size="2x"/>
                        </div>
                    </div>
                    
                    <div className="session_add_container">
                        <div className="my_button session_add" id="session-increment" onClick={() => this.increment_var('session')}>
                            {/*<i className="fas fa-plus fa-2x"></i>*/}
                            <FontAwesomeIcon icon="plus" size="2x"/>
                        </div>
                    </div>
                    <div className="session_minus_container">
                        <div className="my_button session_minus" id="session-decrement" onClick={() => this.decrement_var('session')}>
                            {/*<i className="fas fa-minus fa-2x"></i>*/}
                            <FontAwesomeIcon icon="minus" size="2x"/>
                        </div>
                    </div>
                    
                    <div className="start_stop_container">
                        <div className="my_button_2" id="start_stop" onClick={this.start_stop_clock}>
                            {/*<i className="fas fa-play fa-2x"></i>*/}
                            <FontAwesomeIcon icon="play" size="2x"/>
                            {/*<i className="fas fa-pause fa-2x"></i>*/}
                            <FontAwesomeIcon icon="pause" size="2x"/>
                        </div>
                    </div>
                    <div className="restart_container_v2">
                        <div className="my_button_2" id="reset" onClick={this.restart_clock}>
                            {/*<i className="fas fa-sync-alt fa-2x"></i>*/}
                            <FontAwesomeIcon icon="sync-alt" size="2x"/>
                        </div>
                    </div> 
                </div>
            </div>  
        );
    }
};



export default Clock;