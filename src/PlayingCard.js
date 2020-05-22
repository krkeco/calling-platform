import React, { useState, useEffect } from 'react';

// import bg from  './imgs/esther/babylon.jpg';
import king from './imgs/esther/king.jpg';
import mordecai from './imgs/esther/mordecai.jpg';
import haman from './imgs/esther/haman.jpg';
import taxes from './imgs/esther/taxes.jpg';
import annihilation from './imgs/esther/annihilation.jpg';
import eunich from './imgs/esther/eunich.jpg';
import esther from './imgs/esther/esther.jpg';

import jonah from './imgs/jonah/jonah.jpg';

import joshua from './imgs/joshua/joshua.jpg';
import spies from './imgs/joshua/spies.jpg';

import bedazzlejewel from './imgs/sample/bedazzlejewel.jpg';
import blossomgrove from './imgs/sample/blossomgrove.jpg';
import blunes from './imgs/sample/blunes.jpg';
import corridor from './imgs/sample/corridor.jpg';
import crackplaster from './imgs/sample/crackplaster.jpg';
import firetree from './imgs/sample/firetree.jpg';
import floralite from './imgs/sample/floralite.jpg';
import gemlightning from './imgs/sample/gemlightning.jpg';
import greenbiz from './imgs/sample/greenbiz.jpg';
import jellyfishcarn from './imgs/sample/jellyfishcarn.jpg';
import leavestreak from './imgs/sample/leavestreak.jpg';
import seacave from './imgs/sample/seacave.jpg';
import verdentfire from './imgs/sample/verdentfire.jpg';

import gold from './imgs/gold.jpg';
import influence from './imgs/influence.jpg';

const cardImg = {
  esther: esther,
  king: king,
  mordecai: mordecai,
  haman: haman,
  taxes: taxes,
  annihilation: annihilation,
  eunich: eunich,

  jonah: jonah,

  joshua: joshua,
  spies: spies,

  gold: gold,
  influence: influence,

  bedazzlejewel: bedazzlejewel,
  blossomgrove: blossomgrove,
  blunes: blunes,
  corridor: corridor,
  crackplaster: crackplaster,
  firetree: firetree,
  floralite: floralite,
  gemlightning: gemlightning,
  greenbiz: greenbiz,
  jellyfishcarn: jellyfishcarn,
  leavestreak: leavestreak,
  seacave: seacave,
  verdentfire: verdentfire,
};
// if(props.card.img){
//   bg = "./imgs/"+props.card.img+".jpg";
// }

const PlayingCard = (props) => {
  // const [isDragging, setDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const dragStart = (event) => {
    props.onDragStart(event, props.id);
  };

  const handleTouchMove = (e) => {
    console.log('touch started');
    // grab the loaction of the touch
    var touchLocation = e.targetTouches[0];
    dragStart(e)
    // this.setState({
    //   left: touchLocation.pageX + 'px',
    //   top: touchLocation.pageY + 'px'
    // })
  }

  const handleTouchEnd = (e) => {
    // var dragElement = this.dragElementRef.current;
    // var x = parseInt(dragElement.style.left, 10);
    // var y = parseInt(dragElement.style.top, 10);

    // console.log('Drop position x, y: ', x, y)
  }
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

  return (
    <div
      style={{
        backgroundColor: bgColor,
        opacity: opacity,
        borderRadius: 5,
      }}
    >
      <div
        key={props.id}
        onDragStart={(event) => dragStart(event)}
        draggable={props.draggable}
        className={size(props.size)}
      >
        {/** 
        G I PE F! R A 

        <img
          draggable={false}
          className="cardImg"
          src={cardImg[props.card.img]}
        />
        **/}
        <p className="text titleCard">
          {props.card.cost > 0 ? `$${props.card.cost}` : ''} {props.card.name}
        </p>
        {props.card.gold > 0 ? (
          <div className="text stat">
            {props.card.gold} <span className="stat"> Gold($)</span>
          </div>
        ) : (
          <span />
        )}
        {props.card.influence > 0 ? (
          <div className="text stat">
            {props.card.influence} I<span className="stat">nfluence</span>
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
