import React, { useState, useEffect } from 'react';

const PlayingCard = (props) => {
  // const [isDragging, setDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const dragStart = (event) => {
    props.onDragStart(event, props.id);
  };
  const size = (size) =>{
    if(size == "small"){
      return "playcard small"
    }else{
      return "playcard"
    }
  }

  return (
    <div
      key={props.id}
      onDragStart={(event) => dragStart(event)}
      draggable={props.draggable}
      className={size(props.size)}
      style={{ backgroundColor: props.backgroundColor, opacity: opacity }}
    >
      <div className="title">{props.card.name}</div>
      <div className="text">
        {props.card.gold} G<span className="stat">old</span>
      </div>
      <div className="text">
        {props.card.influence} Inf<span className="stat">luence</span>
      </div>
    </div>
  );
};

export default PlayingCard;
