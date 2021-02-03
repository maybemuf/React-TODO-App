import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import moon from './images/icon-moon.svg'
import sun from './images/icon-sun.svg'

const TaskList = [
    {
        task: "Create a new TODO!",
        done: false
    },
]

if(!localStorage.getItem('TaskList')){
    localStorage.setItem("TaskList", TaskList.map((item) => JSON.stringify(item)).join(";"));
}
let root = document.getElementById('root');
document.body.classList.add("light_theme");

class TODOApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            taskList: localStorage.getItem("TaskList").split(";").map((item) => JSON.parse(item)),
            inputValue: '',
            showList: 'all',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputSumbit = this.handleInputSumbit.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRemoveButton = this.handleRemoveButton.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
    }

    checkForCompleted(){
        setTimeout(() =>{
            for(let item of document.querySelectorAll(".todo_list_item")) {
                item.classList.remove("task_done");
                if(item.querySelector(".todo_list_checkbox").checked) item.classList.add("task_done");
            }
        },0)
    }

    componentDidMount() {
        this.checkForCompleted()
        let themeBtn = document.querySelector(".switch_btn");
        if(localStorage.getItem("theme") === "sun") {
            themeBtn.src = sun;
            themeBtn.alt = "sun";
            document.body.classList.remove("light_theme")
            document.body.classList.add("dark_theme");
        }
        else if(localStorage.getItem("theme") === "moon") {
            themeBtn.src = moon;
            themeBtn.alt = "moon";
            document.body.classList.remove("dark_theme")
            document.body.classList.add("light_theme");
        }
    }

    calculateActive(list) {
        let i = 0;
        for(let item of list) {
            if(!item.done) i += 1;
        }
        return i;
    }

    createTask(list, taskItem) {
        list.push({
            task: taskItem,
            done: false,
        });
    }

    handleButtonClick(event) {
        for(let btn of document.getElementsByClassName("nav_btn")) btn.classList.remove('selected')
        this.setState({
            showList: event.target.value
        });
        event.target.classList.add("selected");
        this.checkForCompleted()
    }

    handleInputChange(event) {
        this.setState({
            inputValue: event.target.value
        });
    }

    handleInputSumbit(event){
        let check = true;
        for(let task of this.state.taskList) {
            if(task.task === this.state.inputValue) check = false;
        }

        if(this.state.inputValue.trim() === '') event.preventDefault();
        else if (check) {
            let newTaskList = this.state.taskList;
            if(newTaskList[0].task === "Create a new TODO!" && newTaskList[0].done === false) {
                newTaskList[0].done = true;
                this.checkForCompleted();
            }
            this.createTask(newTaskList, this.state.inputValue);
            localStorage.setItem("TaskList", newTaskList.map((item) => JSON.stringify(item)).join(";"));
            this.setState({
                taskList: localStorage.getItem("TaskList").split(";").map((item) => JSON.parse(item)),
                inputValue: '',
            });
            event.preventDefault();
        }
        
        else {
            this.setState({
                inputValue: '',
            });
            event.preventDefault();
        }
    }

    handleCheckboxChange(event) {
        let newTaskList = this.state.taskList;
        for(let item of newTaskList) {
            if(event.target.value === item.task) item.done = !item.done;
        }
        localStorage.setItem("TaskList", newTaskList.map((item) => JSON.stringify(item)).join(";"));
        this.setState({
            taskList: newTaskList,
        })
    }

    handleRemoveButton(event) {
        let newTaskList = this.state.taskList;
        let filltered = newTaskList.filter((item) => item.task !== event.target.value);
        if(filltered === undefined) {
            filltered = [];
        }
        localStorage.setItem("TaskList", filltered.map((item) => JSON.stringify(item)).join(";"));
        this.setState({
            taskList: filltered,
        })
        this.checkForCompleted();
    }

    clearCompleted() {
        let newTaskList = this.state.taskList;
        let filltered = newTaskList.filter((item) => !item.done);
        localStorage.setItem("TaskList", filltered.map((item) => JSON.stringify(item)).join(";"));
        this.setState({
            taskList: filltered,
        })
        this.checkForCompleted();
    }

    chanegeTheme(event){
        if(localStorage.getItem("theme") === "moon") {
            event.target.src = sun;
            event.target.alt = "sun";
            document.body.classList.remove("light_theme")
            document.body.classList.add("dark_theme");
        }
        else if(localStorage.getItem("theme") === "sun") {
            event.target.src = moon;
            event.target.alt = "moon";
            document.body.classList.remove("dark_theme")
            document.body.classList.add("light_theme");
        } 
        localStorage.setItem("theme", event.target.alt)
    }
    render() {
        if(this.state.taskList.length === 0) {
            return(
                <div className="container">
                    <div className="todo_header">
                        <h1>TODO</h1>
                        <img className="switch_btn" onClick={this.chanegeTheme} src={moon} alt="moon"/>
                    </div>
                    <TODOInput value={this.state.inputValue} handleInputChange={this.handleInputChange} handleInputSumbit={this.handleInputSumbit} />
                     
                    <div className="todo_listbox">
                        <TODOListPlaceholder />
                    </div>
    
                    <TODONavigation handleButtonClick={this.handleButtonClick} />
                </div>
            )
        }
        else {
            return(
                <div className="container">
                    <div className="todo_header">
                        <h1>TODO</h1>
                        <img className="switch_btn" onClick={this.chanegeTheme} src={moon} alt="moon"/>
                    </div>
                    <TODOInput value={this.state.inputValue} handleInputChange={this.handleInputChange} handleInputSumbit={this.handleInputSumbit} />
                    <div className="todo_listbox">
                        <TODOList taskList={this.state.taskList} showList={this.state.showList} handleCheckboxChange={this.handleCheckboxChange} handleRemoveButton={this.handleRemoveButton}/>
                        <TODOStatus  activeTasks={this.calculateActive(this.state.taskList)} clearCompleted={this.clearCompleted}/>
                    </div>
    
                    <TODONavigation handleButtonClick={this.handleButtonClick} />
                </div>
            )
        }
    }
}

class TODOInput extends React.Component {
    constructor(props){
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextChange(event) {
        this.props.handleInputChange(event);
    }

    handleSubmit(event) {
        this.props.handleInputSumbit(event);
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="todo_form">
                <input type="text" className="todo_input" placeholder="Create a new todo..." value={this.props.value} onChange={this.handleTextChange} />
            </form>
        )
    }
}


class TODOListPlaceholder extends React.Component {
    render() {
        return(
            <div className="list_placeholder">
                <h2>Wow! you've done everyhing you want.<br/>Good job, keep working!</h2>
            </div>
        )
    }
}

class TODOList extends React.Component {
    constructor(props) {
        super(props);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRemoveButton = this.handleRemoveButton.bind(this);
    }

    handleCheckboxChange(event) {
        this.props.handleCheckboxChange(event);
        setTimeout(() => {
            if(event.target.checked) event.target.closest("li").classList.add("task_done");
        else event.target.closest("li").classList.remove("task_done");
        }, 0);
    }
    
    handleRemoveButton(event) {
        this.props.handleRemoveButton(event);
    }

    handleBigText(event) {
        let item = event.target;
        if(item.tagName !== "LI" ) item = item.closest("li");
        let textBox = item.querySelector(".todo_list_item_text")
        if(textBox.offsetWidth > item.offsetWidth) {
            textBox.style.marginLeft = -(textBox.offsetWidth - item.offsetWidth + 70) + "px";
        }
    }

    handleBigTextReset(event) {
        let item = event.target;
        if(item.tagName !== "LI" ) item = item.closest("li");
        let textBox = item.querySelector(".todo_list_item_text")
        textBox.style.marginLeft = "30px";
    }

    render(){
        if(this.props.showList === "all") {
            return (
                <ul className="todo_list">
                    {this.props.taskList.map((item, index) => <li key={index} className="todo_list_item">
                        <div className="wrapper_div">
                            <form className="checkbox_form">
                                <label className="checkbox_label">
                                    <input id={index} className="todo_list_checkbox" type="checkbox" value={item.task} checked={item.done} onChange={this.handleCheckboxChange}></input>
                                </label>
                            </form>
                            <p className="todo_list_item_text" onMouseEnter={this.handleBigText} onMouseLeave={this.handleBigTextReset}>{item.task}</p>
                            <button value={item.task} className="remove_btn" onClick={this.handleRemoveButton}>X</button>
                        </div>
                    </li>)}
                </ul>
            )
        }
        else if(this.props.showList === "active"){
            return (
                <ul className="todo_list">
                    {this.props.taskList.filter((item) => !item.done).map((item, index) => <li key={index} className="todo_list_item" >
                        <div className="wrapper_div">
                            <form className="checkbox_form">
                                <label className="checkbox_label">
                                    <input id={index} className="todo_list_checkbox" type="checkbox" value={item.task} checked={item.done} onChange={this.handleCheckboxChange}></input>
                                </label>
                            </form>
                            <p className="todo_list_item_text" onMouseEnter={this.handleBigText} onMouseLeave={this.handleBigTextReset}>{item.task}</p>
                            <button value={item.task} className="remove_btn" onClick={this.handleRemoveButton}>X</button>
                        </div>
                    </li>)}
                </ul>
            )
        }
        else if(this.props.showList === "completed"){
            return (
                <ul className="todo_list">
                    {this.props.taskList.filter((item) => item.done).map((item, index) => <li key={index} className="todo_list_item" >
                        <div className="wrapper_div">
                            <form className="checkbox_form">
                                <label className="checkbox_label">
                                    <input id={index} className="todo_list_checkbox" type="checkbox" value={item.task} checked={item.done} onChange={this.handleCheckboxChange}></input>
                                </label>
                            </form>
                            <p className="todo_list_item_text" onMouseEnter={this.handleBigText} onMouseLeave={this.handleBigTextReset}>{item.task}</p>
                            <button value={item.task} className="remove_btn" onClick={this.handleRemoveButton}>X</button>
                        </div>
                    </li>)}
                </ul>
            )
        }
    }
}



class TODOStatus extends React.Component {
    constructor(props) {
        super(props);
        this.clearCompleted = this.clearCompleted.bind(this);
    }
    
    clearCompleted() {
        this.props.clearCompleted()
    }

    render() {
        return (
            <div className="todo_status">
                <span>{this.props.activeTasks} items left</span>
                <button onClick={this.clearCompleted}>Clear Completed</button>
            </div>
        )
    }
}

class TODONavigation extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    
    handleButtonClick(event) {
        this.props.handleButtonClick(event);
    }

    render() {
        return(
            <div className="todo_navigation">
                <button className="nav_btn selected" value="all" onClick={this.handleButtonClick}>All</button>
                <button className="nav_btn" value="active" onClick={this.handleButtonClick}>Active</button>
                <button className="nav_btn" value="completed" onClick={this.handleButtonClick}>Completed</button>
            </div>
        )
    }
}

 ReactDOM.render(<TODOApp />, root);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
