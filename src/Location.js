import React, { useState } from 'react';
import { HAND } from './constants.js';
import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'

import PlayingCard from './PlayingCard';
import Titlebar from './components/location/TitleBar';
import Market from './components/location/Market';
import Battlefield from './components/location/Battlefield';

import babylon from './imgs/esther/babylon.jpg';
import jerusalem from './imgs/sample/sandyshore.jpg';
import canaan from './imgs/sample/seaskull.jpg';
import nineveh from './imgs/sample/dessertketchup.jpg';
import rome from './imgs/sample/fishflower.jpg';

const bgGrid = {
  Nineveh: nineveh,
  Canaan: canaan,
  Jerusalem: jerusalem,
  Rome: rome,
  Babylon: babylon,
};

const Location = (props) => {
  const buyCard = (card, index) => {
    if (
      props.location.battlefield &&
      props.location.battlefield[props.player]
    ) {
      let playerField = props.location.battlefield[props.player];
      console.log(
        props.players[props.player] +
          ' could buy something with ' +
          playerField.gold,
      );
      props.buyCard(index, props.location.id, card);
    } else {
      console.log(
        'you cannot afford this!' + card.cost + props.location.currentGold,
      );
    }
  };
  const refreshMarket = () => {
    if (
      props.location.battlefield &&
      props.location.battlefield[props.player]
    ) {
      let playerField = props.location.battlefield[props.player];
      console.log(
        props.players[props.player].name +
          ' could buy something with ' +
          playerField.gold,
      );
      if (playerField.gold > 0) {
        props.refreshMarket(props.location.id, props.player);
      }
    } else {
      console.log('you cannot afford this!' + props.location.currentGold);
    }
  };
 const [titleBar, setTitleBar] = useState('titlebar');
  const toggleTitleBar = () => {
    if (titleBar == 'titlebar') {
      setTitleBar('titlebar active');
    } else {
      setTitleBar('titlebar');
    }
  };
  return (
    <div className="flexRow">
        <div className={titleBar}>
          {Titlebar(props,toggleTitleBar)}
        </div>
      <div
        className="location"
        style={{
          backgroundImage: `url("${bgGrid[props.location.name]}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <div className="flexRow">
          <IconButton  onClick={() => toggleTitleBar()} variant="contained" color="secondary">
            <FontAwesomeIcon  className="infoBtn" icon={faQuestion} />
          </IconButton>
           <div className="locationTitle">
            {props.location.name}({props.location.influencer})
          </div>
      </div>
        {props.location.name != 'Jerusalem' ? (
          <div className="flexRow flexStart marketContainer">
            <div className="flexCol flexStart">
              Market:
              <div className="refreshMarketBtn" onClick={() => refreshMarket()}>
                Refresh Market
              </div>
            </div>
            {Market(props, buyCard)}
          </div>
        ) : (
          <div
            className="scrapPile flexCol center"
            onDragEnter={(e) => e.preventDefault()}
            onDrop={(event) => props.onDrop(event, -1)}
            onDragOver={(event) => props.onDragOver(event)}
          >
            Scrap Pile
          </div>
        )}
        <div
          className="bfWrapper"
          onDragEnter={(e) => e.preventDefault()}
          onDragOver={(event) => props.onDragOver(event)}
          onDrop={(event) => props.onDrop(event, props.location.id)}
        >
          <span style={{ padding: 0, margin: 0 }}> Battlefield:</span>
          {Battlefield(props)}
        </div>
      </div>
    </div>
  );
};

export default Location;
