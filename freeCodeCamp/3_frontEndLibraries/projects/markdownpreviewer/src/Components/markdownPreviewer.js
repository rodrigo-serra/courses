import React, { Component } from 'react';
import "./markdownPreviewer.css";
import marked from 'marked';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const renderer = new marked.Renderer();

marked.setOptions({
  breaks: true,
});

const initialText = 
`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`



class Element extends Component{
    constructor(props) {
        super(props);
        this.state = {
            input: initialText
        };
        this.handleChange = this.handleChange.bind(this);
    }
      
    handleChange(event) {
        this.setState({
            input: event.target.value
        });
    }
      
    
    render() {
        return (
            <div className="container">
                <form className="formclass1">
                    <div className="form-group">
                        <div className="row row1">
                            <label for="exampleFormControlTextarea1" className="align-top"><FontAwesomeIcon icon={['fab', 'free-code-camp']}/> Editor</label>
                        </div>
                        <div className="row">
                            <textarea id="editor" className="form-control border border-dark rounded align-self" rows="6" value={this.state.input} onChange={this.handleChange}></textarea>
                        </div>
                    </div>
                </form>
                <form className="formclass2">
                    <div className="form-group">
                        <div className="row row1">
                            <label for="exampleFormControlTextarea1"><FontAwesomeIcon icon={['fab', 'free-code-camp']}/> Previewer</label>
                        </div>
                        <div className="row row2 border border-dark rounded">
                            <div id='preview' dangerouslySetInnerHTML={{__html: marked(this.state.input, { renderer: renderer })}} />
                        </div>
                    </div>
                </form>
            </div>
      );
    }
  };

  export default Element;

