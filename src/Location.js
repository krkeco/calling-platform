import React, { useState } from 'react';
import { HAND } from './constants.js';

import { Button } from '@material-ui/core';
import PlayingCard from './PlayingCard';
import bg from  './imgs/babylon.png';

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

  let market = [];
  if (props.location) {
    props.location.market.map((card, index) => {
      market.push(
        <div onClick={() => buyCard(card, index)}>
          <PlayingCard
            id={index}
            size="small"
            card={card}
            backgroundColor="teal"
            player={null}
          />
        </div>,
      );
    });
  }

  const battlefield = (props) => {
    return (
      <div className="flexCol padded battlefield">
        {props.location.battlefield.length > 0 ? (
          props.location.battlefield.map((bf, index) => {
            let playerBF = props.location.battlefield[index];
            let bgColor = props.playerBGs[index];
            return playerBF ? (
              <div className="flexRow">
                <div className="flexCol">
                  <div>{playerBF.name}</div>
                  <div className="flexRow">
                    <div>G:{playerBF.gold}</div>
                    <div>--Inf:{playerBF.influence}</div>
                  </div>
                </div>
                {playerBF.cards.map((card, ind) => {
                  return (
                    <PlayingCard
                      size="small"
                      id={ind}
                      backgroundColor={bgColor}
                      draggable={false}
                      onDragStart={null}
                      card={card}
                      player={props.player}
                    />
                  );
                })}
              </div>
            ) : null;
          })
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const Titlebar = (props) => {
    const [titleBar, setTitleBar] = useState('titlebar');
    const toggleTitleBar = () => {
      if (titleBar == 'titlebar') {
        setTitleBar('titlebarBig');
      } else {
        setTitleBar('titlebar');
      }
    };
    return (
      <div  >
        <div className={titleBar}>
          <div onClick={() => toggleTitleBar()}>
            <Button>( ? )</Button>
            {props.location.name}:{props.location.id} (
            {props.location.influencer})
          </div>
          <div className="flexRow">
            <div className="titlebarInfo">
              Inf:({props.location.influence}){' '}
              {props.location.weariness > 0 ? (
                <span>
                  I+W:({props.location.weariness * 2 + props.location.influence}
                  )
                </span>
              ) : (
                <span />
              )}{' '}
            </div>
          </div>
          {props.location.name == 'Canaan' ? (
            <div className="titlebarInfo">
              Tier:{props.location.abilities[0]}
            </div>
          ) : (
            <span />
          )}
          {props.location.weariness > 0 ? (
            <div className="titlebarInfo">
              Weariness:{props.location.weariness}
            </div>
          ) : (
            <span />
          )}
          {props.location.wounds > 0 ? (
            <div className="titlebarInfo">Wounds:{props.location.wounds}</div>
          ) : (
            <span />
          )}

          {props.location.proselytized > 0 ? (
            <div className="titlebarInfo">
              Churches: {props.location.proselytized}
            </div>
          ) : (
            <span />
          )}
          {props.location.hardened > 0 ? (
            <div className="titlebarInfo">
              Hardened:{props.location.hardened}
            </div>
          ) : (
            <span />
          )}

          {props.location.info.map((info, ind) => {
            return (
              <div className="titlebarInfo smallText">
                {info}
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div >
      <div
        className="location"
      style={{
        backgroundImage: `url("${bg}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',}}
        onDragOver={(event) => props.onDragOver(event)}
        onDrop={(event) => props.onDrop(event, props.location.id)}
      >
        {Titlebar(props)}
        <div className="flexRow flexStart ">
          <div className="flexCol flexStart">
            Market:
            <div className="refreshMarketBtn" onClick={() => refreshMarket()}>
              Refresh Market
            </div>
          </div>
          {market}
        </div>
        {battlefield(props)}
      </div>
    </div>
  );
};
export default Location;
