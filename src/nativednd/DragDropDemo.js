import React, { Component } from 'react';
import '../App.css';

export default class ToDoDragDropDemo extends Component {
  state = {
    tasks: [
      { id: '1', taskName: 'Read book', type: 'hand', backgroundColor: 'red' },
      {
        id: '2',
        taskName: 'Pay bills',
        type: 'hand',
        backgroundColor: 'green',
      },
      {
        id: '3',
        taskName: 'Go to the gym',
        type: 'hand',
        backgroundColor: 'blue',
      },
      {
        id: '4',
        taskName: 'Play baseball',
        type: 'hand',
        backgroundColor: 'green',
      },
    ],
  };
  onDragStart = (event, taskName) => {
    console.log('dragstart on div: ', taskName);
    event.dataTransfer.setData('taskName', taskName);
  };
  onDragOver = (event) => {
    event.preventDefault();
  };

  onDrop = (event, cat) => {
    let taskName = event.dataTransfer.getData('taskName');
    console.log('drop on' + cat);
    let tasks = this.state.tasks.filter((task) => {
      if (task.taskName == taskName) {
        task.type = cat;
      }
      return task;
    });

    this.setState({
      ...this.state,
      tasks,
    });
  };
  render() {
    var tasks = {
      hand: [],
      nineveh: [],
      babylon: [],
      jerusalem: [],
    };

    this.state.tasks.forEach((task) => {
      tasks[task.type].push(
        <PlayingCard onDragStart={this.onDragStart} task={task} />,
      );
    });

    return (
      <div className="flexRow">
        <Location
          name="hand"
          tasks={tasks}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        />
        <Location
          name="jerusalem"
          tasks={tasks}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        />
        <Location
          name="babylon"
          tasks={tasks}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        />
        <Location
          name="nineveh"
          tasks={tasks}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        />
      </div>
    );
  }
}

const Location = (props) => {
  return (
    <div
      className="droppable"
      onDragOver={(event) => props.onDragOver(event)}
      onDrop={(event) => props.onDrop(event, props.name)}
    >
      <span className="group-header">{props.name}</span>
      {props.tasks[props.name]}
    </div>
  );
};

const PlayingCard = (props) => {
  return (
    <div
      key={props.task.id}
      onDragStart={(event) => props.onDragStart(event, props.task.taskName)}
      draggable
      className="draggable"
      style={{ backgroundColor: props.task.bgcolor }}
    >
      {props.task.taskName}
    </div>
  );
};
