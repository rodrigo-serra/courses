import './randomQuoteMachine.css';
import React, {Component} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// PHRASES AND AUTHORS
const listOfPhrases = [
    {
      phrase: 'The two most important days in your life are the day you are born and the day you find out why',
      author: 'Mark Twain'
    },
    {
      phrase: 'Dream big and dare to fail.',
      author: 'Norman Vaughan'
    },
    {
      phrase: 'It is your place in the world; it is your life. Go on and do all you can with it, and make it the life you want to live.',
      author: 'Mae Jemison'
    },
    {
      phrase: 'The only person you are destined to become is the person you decide to be.',
      author: 'Ralph Waldo Emerson'
    },
    {
      phrase: 'What’s money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.',
      author: 'Bob Dylan'
    },
    {
      phrase: 'Fall seven times and stand up eight.',
      author: 'Japanese Proverb'
    },
    {
      phrase: 'You may be disappointed if you fail, but you are doomed if you don’t try.',
      author: 'Beverly Sills'
    },
    {
      phrase: 'If the wind will not serve, take to the oars.',
      author: 'Latin Proverb'
    }
  ];
  
  
  class Element extends Component{
    constructor(props) {
      super(props);
      this.state = {
        number: Math.floor(Math.random() * listOfPhrases.length)
      }
      this.changePhrase = this.changePhrase.bind(this);
    }
    
    changePhrase() {
      this.setState({
        number: Math.floor(Math.random() * listOfPhrases.length)
      });
    }
    
    render() {
      return (
        <div className="center-element" id="quote-box">
          <div className="card">
            <div className="card-body">
              <blockquote className="blockquote mb-0">
                <p id="text" className="h2">"{listOfPhrases[this.state.number].phrase}"</p>
                <br />
                <footer className="blockquote-footer" id="author">{listOfPhrases[this.state.number].author}</footer>
              </blockquote>
              <br />
              <br />
              <button id="new-quote" type="button" className="btn btn-primary" onClick={this.changePhrase}>New Quote</button>
              <a id="tweet-quote"className="btn btn-primary" href="twitter.com/intent/tweet" role="button" target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']}/></a>
            </div>
          </div>
        </div>
      );
    }
  };

  export default Element;