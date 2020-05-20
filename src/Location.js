import React, { useState } from 'react';
import { HAND } from './constants.js';

import PlayingCard from './PlayingCard';
import Titlebar from './components/location/TitleBar';
import Market from './components/location/Market';
import Battlefield from './components/location/Battlefield';

import babylon from './imgs/esther/babylon.png';
import jerusalem from './imgs/sample/sandyshore.png';
import canaan from './imgs/sample/seaskull.png';
import nineveh from './imgs/sample/dessertketchup.png';
import rome from './imgs/sample/fishflower.png';

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

  return (
    <div>
      <div
        className="location"
        style={{
          backgroundImage: `url("${bgGrid[props.location.name]}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {Titlebar(props)}
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
            onDrop={(event) => props.onDrop(event, -1)}
            onDragOver={(event) => props.onDragOver(event)}
          >
            Scrap Pile
          </div>
        )}
        <div
          className="bfWrapper"
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
