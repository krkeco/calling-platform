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
      style={{ backgroundColor: props.backgroundColor, opacity: opacity, borderRadius: 5 }}
    >{/** G I PE WV R A **/}
      <div className="title">({props.card.cost}) {props.card.name} </div>
      {props.card.gold > 0 ? (
        <div className="text">
          {props.card.gold} G<span className="stat">old</span>
        </div>):(<span/>)
      }
      {props.card.influence > 0 ? (
      <div className="text">
        {props.card.influence} I<span className="stat">nfluence</span>
      </div>):(<span/>)
      }
      {props.card.draw > 0 ? (
      <div className="text">
        {props.card.draw} D<span className="stat">raw</span>
      </div>):(<span/>)
      }
      {props.card.reinforce > 0 ? (
      <div className="text">
        {props.card.reinforce} R<span className="stat">einforce</span>
      </div>):(<span/>)
      }
      {props.card.vitality > 0 ? (
        <div className="text">
        {props.card.vitality} V<span className="stat">itality</span>
      </div>):(<span/>)
      }
      {props.card.weary > 0 ? (<div className="text">
        {props.card.weary} W<span className="stat">eary</span>
      </div>):(<span/>)
      }
      {props.card.politics > 0 ? (<div className="text">
        {props.card.politics} P<span className="stat">olitics</span>
      </div>):(<span/>)
      }
      {props.card.abilities && props.card.abilities.length > 0 ? (<div className="text">
        A: <span className="stat">{props.card.abilities.map((a,i)=>{return <span>{a} </span> })}</span>
      </div>):(<span/>)
      }

    </div>
  );
};

export default PlayingCard;
