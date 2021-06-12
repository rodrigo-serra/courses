import React, { Component } from 'react';
import "./calculator.scss";


class Calculator extends Component{
    constructor(props) {
        super(props);
        this.state = {
            screen_computation: [],
            compCtr: 0,
            floatCtr: 0,
            count: 0,
            screen_result: '0'
        };
        this.check_push_numbers = this.check_push_numbers.bind(this);
        this.push_numbers = this.push_numbers.bind(this);
        this.clear_screen = this.clear_screen.bind(this);
        this.get_result = this.get_result.bind(this);
        
    }
      
    
    check_push_numbers(num) {
        let vector = this.state.screen_computation;
        let reg2 = /[\+\/\-\*]/;
        
        if(vector.length == 0 && num === "=") {
        } else if (vector.length == 0 && num === ".") {
            this.push_numbers(0);
            this.push_numbers(num);
        } else if (vector[vector.length - 1] === "." && num === ".") {
        } else if (this.state.screen_computation.join("") === "0" && num === 0) {
        } else if (reg2.test(vector[vector.length - 1]) && num === ".") {
            this.push_numbers(0);
            this.push_numbers(num);
        } else if (vector[vector.length - 1] === "-" && num === "-") {
        } else if (this.state.floatCtr == 1 && num === ".") {
        } else {
            this.push_numbers(num);
        }
    }
      
      
    push_numbers(num) {
        if (this.state.compCtr == 0) {
            let aux = this.state.screen_computation;
            let reg = /[\+\/\-\*]/;
            let reg2 = /[\+\/\*]/;
          
            if(reg.test(aux[aux.length - 1]) && reg.test(num)) {
                
                if(reg.test(aux[aux.length - 1]) && num === "-") {
                    this.setState(state => ({
                        screen_computation: state.screen_computation.concat(num),
                    }));
                } else if (reg.test(aux[aux.length - 2]) && aux[aux.length - 1] === "-" && reg2.test(num)) {
                    this.setState(state => ({
                        screen_computation: (state.screen_computation.slice(0, state.screen_computation.length - 2)).concat(num)
                    }));  
                } else {
                    this.setState(state => ({
                        screen_computation: (state.screen_computation.slice(0, state.screen_computation.length - 1)).concat(num)
                    })); 
                }

            } else {
            
                this.setState(state => ({
                screen_computation: state.screen_computation.concat(num),
                }));
            }
          
        
            if(num == "+" || num == "-" || num == "*" || num == "/"){

                this.setState(state => ({
                    screen_result: num.toString(),
                    count: state.screen_computation.length,
                    floatCtr: 0
                }));
            
            } else {
                
                if(num === "=") {
                    this.get_result();
                } else {
                    if(num === ".") {
                        this.setState({
                            floatCtr: 1
                        });
                    }
                    this.setState(state => ({
                        screen_result: (state.screen_computation.slice(state.count, state.screen_computation.length)).join("")
                    }));
                }
            }

        } else {
          
            if(num == "+" || num == "-" || num == "*" || num == "/") {
                this.setState({
                    screen_computation: [parseFloat(this.state.screen_result), num],
                    compCtr: 0,
                    count: 2,
                    floatCtr: 0,
                    screen_result: num.toString()
                });
            
            } else if (Number.isInteger(num)) {
                this.setState({
                screen_computation: [num],
                compCtr: 0,
                count: 0,
                floatCtr: 0,
                screen_result: num.toString()
                });
            }
        }
    }
      

    clear_screen() {
        this.setState({
            screen_computation: [],
            compCtr: 0,
            count: 0,
            floatCtr: 0,
            screen_result: '0'
        });
    }
      
    get_result() {
        let computation = this.state.screen_computation;
        //this.state.screen_result = eval(computation.join(""));
        this.setState({
          compCtr: 1,
          screen_result: (eval(computation.join(""))).toString()
        });
    }
      
    
    render() {
        return (
            <div className="container">
                <div className="box">
                    <div className="flexscreen">
                        <div className="screen">
                            <div className="computation">{this.state.screen_computation.length == 0 ? 0: this.state.screen_computation.join("")}</div>
                            <div id="display" className="result">{this.state.screen_result}</div>
                        </div>
                    </div>
          
                    <div className="flexline a">
                        <div id="clear" className="ac" onClick={this.clear_screen}>AC</div>
                        <div id="divide" className="operators" onClick={() => this.check_push_numbers('/')}>/</div>
                    </div>
          
                    <div className="flexcolumn b">
                        <div id="multiply" className="operators" onClick={() => this.check_push_numbers('*')}>X</div>
                        <div id="subtract" className="operators" onClick={() => this.check_push_numbers('-')}>-</div>
                        <div id="add" className="operators" onClick={() => this.check_push_numbers('+')}>+</div>
                        <div id="equals" className="equalsign" onClick={() => this.check_push_numbers('=')}>=</div>
                    </div>
          
                    <div className="flexline c">
                        <div id="one" className="digit" onClick={() => this.check_push_numbers(1)}>1</div>
                        <div id="two" className="digit" onClick={() => this.check_push_numbers(2)}>2</div>
                        <div id="three" className="digit" onClick={() => this.check_push_numbers(3)}>3</div>
                    </div>
                    
                    <div className="flexline d">
                        <div id="four" className="digit" onClick={() => this.check_push_numbers(4)}>4</div>
                        <div id="five" className="digit" onClick={() => this.check_push_numbers(5)}>5</div>
                        <div id="six" className="digit" onClick={() => this.check_push_numbers(6)}>6</div>
                    </div>
          
                    <div className="flexline e">
                        <div id="seven" className="digit" onClick={() => this.check_push_numbers(7)}>7</div>
                        <div id="eight" className="digit" onClick={() => this.check_push_numbers(8)}>8</div>
                        <div id="nine" className="digit" onClick={() => this.check_push_numbers(9)}>9</div>
                    </div>
                    
                    <div className="flexline f">
                        <div id="zero" className="thezero" onClick={() => this.check_push_numbers(0)}>0</div>
                        <div id="decimal" className="digit" onClick={() => this.check_push_numbers('.')}>.</div>
                    </div>
                </div>
            </div>    
        );
    }
};

export default Calculator;