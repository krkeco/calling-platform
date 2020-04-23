import React, {useEffect, useState, Component} from 'react';
import logo from './logo.svg';
import './App.css';

// import Game from './rge/play.js'

// import Location from './Location'
// import PlayingCard from './PlayingCard'

import DragDropDemo from './nativednd/DragDropDemo'

const App = () => {

    useEffect(() => {    
    // Update the document title using the browser API    
    
    fetch("http://localhost:8080/")
      .then(res => res.json())
      .then(
        (result) => {
          console.log('result'+result)
        },
        (error) => {
        console.log('error'+error)
        }
      )

  });

    const [tasks, setTasks] = useState(
  // state = {
  // tasks: 
  [
      {id: "1", taskName:"Read book",type:"hand", backgroundColor: "red"},
      {id: "2", taskName:"Pay bills", type:"hand", backgroundColor:"green"},
      {id: "3", taskName:"Go to the gym", type:"hand", backgroundColor:"blue"},
      {id: "4", taskName:"Play baseball", type:"hand", backgroundColor:"green"}
  ]
  )
// }
  const onDragStart = (event, taskName) => {
      console.log('dragstart on div: ', taskName);
      event.dataTransfer.setData("taskName", taskName);
  }
  const onDragOver = (event) => {
      event.preventDefault();
  }

  const onDrop = (event, cat) => {
      let taskName = event.dataTransfer.getData("taskName");
      console.log('drop on'+cat)
      let newTasks = tasks.filter((task) => {
          if (task.taskName == taskName) {
              task.type = cat;
          }
          return task;
      });
      setTasks(newTasks)
      // this.setState({
      //     ...this.state,
      //     tasks
      // });
  }
  // render() {
    let displayTasks = {
        hand: [],
        nineveh: [],
        babylon: [],
        jerusalem:[],

      }

    tasks.forEach ((task) => {
      displayTasks[task.type].push(
        <PlayingCard onDragStart={onDragStart} task={task}/>
      );
    });

      return (
        <div className="flexRow">

          <Location name="hand" tasks={displayTasks} onDragOver={onDragOver} onDrop={onDrop} />
          <Location name="jerusalem" tasks={displayTasks} onDragOver={onDragOver} onDrop={onDrop} />
          <Location name="babylon" tasks={displayTasks} onDragOver={onDragOver} onDrop={onDrop} />
          <Location name="nineveh" tasks={displayTasks} onDragOver={onDragOver} onDrop={onDrop} />

        </div>
      );
    // }
}

const Location  = (props) => {
  return (
    <div className="droppable"
      onDragOver={(event)=>props.onDragOver(event)}
      onDrop={(event)=>props.onDrop(event, props.name)}>
      
      <span className="group-header">{props.name}</span>
      {props.tasks[props.name]}
    </div>
  )
}

const PlayingCard = (props) => {
  return (
    <div key={props.task.id} 
      onDragStart = {(event) => props.onDragStart(event, props.task.taskName)}
      draggable
      className="draggable"
      style = {{backgroundColor: props.task.bgcolor}}>
      {props.task.taskName}
    </div>
          )
}

export default App;