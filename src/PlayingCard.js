import React, { useState, useEffect } from 'react';


  import bg from  './imgs/babylon.png';
  import esther from './imgs/esther.png'
  import king from './imgs/king.png'
  import mordecai from './imgs/mordecai.png'
  import haman from './imgs/haman.png'
  import taxes from './imgs/taxes.png'
  import annihilation from './imgs/annihilation.png'
  import eunich from './imgs/eunich.png'
  import gold from './imgs/gold.png'
  import influence from './imgs/influence.png'



  const cardImg = {
    'esther':esther,
    'king':king,
    'mordecai':mordecai,
    'haman':haman,
    'taxes':taxes,
    'annihilation':annihilation,
    'eunich':eunich,
    'gold':gold,    
    'influence':influence,
  }
  // if(props.card.img){
  //   bg = "./imgs/"+props.card.img+".png";
  // }


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

  let bgColor = props.backgroundColor;
  if (props.card.abilities.indexOf('scrap') > -1) {
    bgColor = 'teal';
  }

  return (<div style={{
        backgroundColor: bgColor,
        opacity: opacity,
        borderRadius: 5,}}>
    <div
      key={props.id}
      onDragStart={(event) => dragStart(event)}
      draggable={props.draggable}
      className={size(props.size)}
    >
      {/** G I PE F! R A **/}
      <p className="title">
        {props.card.cost > 0 ? props.card.cost : (0)}{' '}{props.card.name}{' '}
      </p>
     <img
     className="cardImg"
     src={cardImg[props.card.img]}
      />
               
      {props.card.gold > 0 ? (
        <div className="text stat">
          {props.card.gold} $<span className="stat"> Gold</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.influence > 0 ? (
        <div className="text stat">
          {props.card.influence} I <span className="stat">nfluence</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.draw > 0 ? (
        <div className="text stat">
          {props.card.draw} D<span className="stat">raw</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.reinforce > 0 ? (
        <div className="text stat">
          {props.card.reinforce} R<span className="stat">einforce</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.faith > 0 ? (
        <div className="text stat">
          {props.card.faith} F<span className="stat">aith</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.fear > 0 ? (
        <div className="text stat">
          {props.card.fear} !F<span className="stat">ear</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.politics ? (
        <div className="text stat">
          {props.card.politics} P<span className="stat">olitics</span>
        </div>
      ) : (
        <span />
      )}
      {props.card.abilities && props.card.abilities.length > 0 ? (
        <div className="text stat">
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
    </div>
  );
};

export default PlayingCard;
