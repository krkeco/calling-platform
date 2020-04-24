import React, { useState, useEffect } from 'react';

const PlayingCard = (props) => {
  // const [isDragging, setDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const dragStart = (event) => {
    props.onDragStart(event, props.card.id);
  };

  return (
    <div
      key={props.card.id}
      onDragStart={(event) => dragStart(event)}
      draggable={props.draggable}
      className="playcard"
      style={{ backgroundColor: props.card.backgroundColor, opacity: opacity }}
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
