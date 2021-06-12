import React, { Component } from 'react';
import "./drumMachine.css";
import DRUMKEYS from './drumKeys'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



class Drum extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentKey: {text: 'HELLO'}
        }
        this.handlePressedButton = this.handlePressedButton.bind(this);
      }
      
    handlePressedButton(drumKey) {
        this.setState({
            currentKey: drumKey
        });
      }
      
    
    render() {
        return (
            <div className="box" id="drum-machine">
                <div className="container border border-3 border-dark">
                    <div className="row">
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[0]} handler={this.handlePressedButton}/>
                        </div>
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[1]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[2]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col-6 col-test1">
                            <Logo />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[3]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[4]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[5]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col-6 col-test1">
                            <Textplaybutton text={this.state.currentKey.text} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[6]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[7]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col col-test1">
                            <Playbutton letter={DRUMKEYS[8]} handler={this.handlePressedButton} />
                        </div>
                        <div className="col-6 col-test1">
                            {/*<Powerbutton /> */}
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
};


class Playbutton extends Component {
  
    constructor(props) {
        super(props);
        this.buttonPressed = this.buttonPressed.bind(this);
        this.keyboardPressed = this.keyboardPressed.bind(this);
    }
    
    componentDidMount() {
        document.addEventListener('keydown', this.keyboardPressed);
    }
    
    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyboardPressed);
    }
    
    keyboardPressed(event) {
        if (event.keyCode === this.props.letter.keyCode)
            document.getElementById(this.props.letter.text).click();
        //this.buttonPressed();
    }
    
    buttonPressed() {
        this.props.handler(this.props.letter);
        let sound = document.getElementById(this.props.letter.pressedKey);
        sound.play();
    }
    
    render() {
        return (
            <div className="button-box d-flex justify-content-center align-items-center button-letter">
                <button id={this.props.letter.text} onClick={this.buttonPressed} type="button" className="btn btn-secondary btn-play border border-1 border-dark drum-pad">{this.props.letter.pressedKey}<audio className="clip" id={this.props.letter.pressedKey} src={this.props.letter.linktosound}></audio></button>
            </div>
      );
    }
  };


const Logo = () => {
    return (
        <div className="monitor logo d-flex justify-content-center align-items-center">
            Drum Machine &nbsp; <FontAwesomeIcon icon="music" />
        </div>
    )
}

const Powerbutton = () => {
    return (
        <div className="monitor d-flex justify-content-center align-items-center">
            <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
            </label>
        </div>
    )
}
  
  
const Textplaybutton = (props) => {
    return (
        <div className="monitor d-flex justify-content-center align-items-center">
             <div id="display" className="textbox d-flex justify-content-center align-items-center border border-1 border-dark">
                {props.text}
            </div>
        </div>
    )
}



  export default Drum;