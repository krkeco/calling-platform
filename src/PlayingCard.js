import React, { useState, useEffect } from 'react';

const PlayingCard = (props) => {
  // const [isDragging, setDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const dragStart = (event) => {
    props.onDragStart(event, props.id);
  };
  const size = (size) => {
    if (size == 'small') {
      return 'playcard small';
    } else {
      return 'playcard';
    }
  };

  let bgColor = props.backgroundColor
  if(props.card.abilities.indexOf("scrap") >-1){
    bgColor = 'teal'
  }

  return (
    <div
      key={props.id}
      onDragStart={(event) => dragStart(event)}
      draggable={props.draggable}
      className={size(props.size)}
      style={{
        backgroundColor: bgColor,
        opacity: opacity,
        borderRadius: 5,
      }}
    >
      {/** G I PE WV R A **/}
      <div className="title">
        {props.card.cost > 0 ?  <span>$:{props.card.cost}</span> : <span />}{' '}
        {props.card.name}{' '}
      </div>
      {props.card.gold > 0 ? (
        <div className="text">
          {props.card.gold} $<span className="stat"> Gold</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.influence > 0 ? (
        <div className="text">
          {props.card.influence} I<span className="stat">nfluence</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.draw > 0 ? (
        <div className="text">
          {props.card.draw} D<span className="stat">raw</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.reinforce > 0 ? (
        <div className="text">
          {props.card.reinforce} R<span className="stat">einforce</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.faith > 0 ? (
        <div className="text">
          {props.card.faith} F<span className="stat">aith</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.fear > 0 ? (
        <div className="text">
          {props.card.fear} !F<span className="stat">ear</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.politics ? (
        <div className="text">
          {props.card.politics} P<span className="stat">olitics</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.abilities && props.card.abilities.length > 0 ? (
        <div className="text">
          A:{' '}
          <span className="stat">
            {props.card.abilities.map((a, i) => {
              return <span>{a} </span>;
            })}
          </span>
        </div>
      ) : (
        <span />
      )}
    </div>
  );
};

export default PlayingCard;
