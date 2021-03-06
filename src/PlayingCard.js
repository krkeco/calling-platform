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
import wicked from './imgs/jonah/prince.jpg';
import foolish from './imgs/jonah/princess.jpg';
import hugefish from './imgs/jonah/hugefish.jpg';
import vine from './imgs/jonah/vine.jpg';
import scorching from './imgs/jonah/SEW.jpg';
import tarshish from './imgs/jonah/tarshish.jpg';

import paul from './imgs/paul/paul.jpg';
import priscilla from './imgs/paul/priscilla.jpg';

import joshua from './imgs/joshua/joshua.jpg';
import ark from './imgs/joshua/ark.jpg';
import nephilim from './imgs/joshua/nephilim.jpg';
import faithful from './imgs/joshua/faithful.jpg';
import balak from './imgs/joshua/balak.jpg';
import mah from './imgs/joshua/mah.jpg';
import natsot from './imgs/joshua/natsot.jpg';
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
  infCanaan: leavestreak,  
  infJerusalem: leavestreak,
  infRome: leavestreak,
  infNineveh: leavestreak,
  infBabylon: leavestreak,
  esther: esther,
  king: king,
  mordecai: mordecai,
  haman: haman,
  taxes: taxes,
  annihilation: annihilation,
  eunich: eunich,

  jonah: jonah,
  foolish: foolish,
  wicked: wicked,
  vine: vine,
  scorching: scorching,
  ship: tarshish,
  hugefish: hugefish,


  paul: paul,
  exhortation:blossomgrove,
  epistle: crackplaster,
  barbs: gemlightning,
  titus: bedazzlejewel,
  priscilla: priscilla,
  timmy: jellyfishcarn,
  mob:corridor,
  angelic:floralite,
  prison:verdentfire,
  storm:seacave,

  joshua: joshua,
  milkhoney: mah,
  spies: spies,
  faithfulreport: faithful,
  anak: nephilim,
  natsots: natsot,
  gerazim: ark,
  ebal: balak,

  gold: gold,
  influence: influence,

};

const PlayingCard = (props) => {
  // const [isDragging, setDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const dragStart = (event) => {
    // props.onDragStart(event);
  };

  const handleTouchMove = (e) => {
    console.log('touch started');
    // grab the loaction of the touch
    var touchLocation = e.targetTouches[0];
    dragStart(e);
    // this.setState({
    //   left: touchLocation.pageX + 'px',
    //   top: touchLocation.pageY + 'px'
    // })
  };

  const handleTouchEnd = (e) => {
    // var dragElement = this.dragElementRef.current;
    // var x = parseInt(dragElement.style.left, 10);
    // var y = parseInt(dragElement.style.top, 10);
    // console.log('Drop position x, y: ', x, y)
  };
  const size = (size) => {
    if (size == 'small') {
      return 'playcard small'
    } else {
      return 'playcard';
    }
  };

  let bgColor = props.backgroundColor;
  if (props.card.abilities?.indexOf('scrap') > -1) {
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
        style={{
          backgroundImage: `url("${cardImg[props.card.img]}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderRadius: 5,
          margin: 5,
        }}
      >
        {/** 
        G I PE F! R A 
        <img
          draggable={false}
          className="cardImg"
          src={cardImg[props.card.img]}
        />

        **/}
        <div className="cardBox flexCol spaceBetween">
          <div>
            <p className="text titleCard">
            {props.size == 'coop' && props.card.fear > 0 ? <span>
                {props.card.fear} !F
              </span> : props.card.cost > 0 ? `$${props.card.cost}` : ''}
              {' '}
              {props.card.name}
            </p>
            {props.card.gold > 0 ? (
              <div className="text stat">
                {props.card.gold} <span className="stat"> Gold($)</span>
              </div>
            ) : (
              <span />
            )}
            {props.card.influence != 0 ? (
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
            {props.card.provision > 0 ? (
              <div className="text stat">
                {props.card.provision} Pr<span className="stat">ovision</span>
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

          {props.card.quote ? (
            <div style={{textAlign:'center'}} className="stat textQuote">{props.card.quote}</div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;
