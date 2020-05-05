import React, { useState } from 'react';
import {HAND} from './constants.js'

import { Button } from '@material-ui/core';
import PlayingCard from './PlayingCard'

const Location = (props) => {

  const buyCard = (card,index) => {
    if(props.location.battlefield 
      && props.location.battlefield[props.player]){
      let playerField = props.location.battlefield[props.player]
      console.log(props.players[props.player]+' could buy something with ' + playerField.gold)
      props.buyCard(index, props.location.name, card)
    }else{
      console.log('you cannot afford this!'+card.cost + props.location.currentGold)
    }

  };
  const refreshMarket = () => {
    if(props.location.battlefield 
      && props.location.battlefield[props.player]){
      let playerField = props.location.battlefield[props.player]
      console.log(props.players[props.player]+' could buy something with ' + playerField.gold)
      if(playerField.gold > 0){
            props.refreshMarket(props.location.name, props.player)
          }
    }else{
      console.log('you cannot afford this!' + props.location.currentGold)
    }

  };

  let market = []
  if(props.location){
    props.location.market.map((card,index)=>{
      market.push(
        
          <div onClick={()=>buyCard(card,index)}>
             <PlayingCard id={index}
              size="small"
              card={card}
              backgroundColor = "blue"
              player={null}
               />
            
          </div>
      )
    }) 
  }
  
  
    
  const battlefield = (props) => {
    return (<div className="flexCol padded">
      {props.location.battlefield.length > 0 ? 
        (props.location.battlefield.map((bf, index)=>{
          let playerBF = props.location.battlefield[index]
          let bgColor = props.playerBGs[index]
          return playerBF ? (
           (<div className="flexRow" >
            <div className="flexCol" >
              <div>{playerBF.name}</div>
              <div className="flexRow" >
                <div>G:{playerBF.gold}</div>
                <div>--Inf:{playerBF.influence}</div>
              </div>
            </div>
            {playerBF.cards.map((card,ind)=>{
              return ( <PlayingCard 
              size="small"
              id={ind} 
              backgroundColor={bgColor}
              draggable={false} 
              onDragStart={null} 
              card={card}
              player={props.player}
             />)
            })}
            </div>)
          ) : (null)
        })
          ) : (<div></div>)
      }
    </div>)
  }

  const titlebar = (props) => {
    return(<div>
    <div className="flexCol titlebar" >
        <div>( ? ) {props.location.name}</div>
        <div className="flexRow">
        <div className="titlebarInfo">Inf:({props.location.influence}) - Influencer:{props.location.influencer}</div>
        </div>
        {props.location.info.map((info,ind)=>{
          return <div className="titlebarInfo smallText">{info}</div>
        })}
        {props.location.weariness > 0 ? <div className="titlebarInfo">Weariness:{props.location.weariness}</div> : <span/>}
        {props.location.wounds > 0 ? <div className="titlebarInfo">Wounds:{props.location.wounds}</div> : <span/>}

        {props.location.proselytized ? <div className="titlebarInfo">Proselytized by Paul</div> : <span/>}
        {props.location.weariness > 0 ? <div className="titlebarInfo">Weariness:{props.location.weariness}</div> : <span/>}
        
      
      </div>
    </div>)
  }

  return (<div>
    <div
      className="location"
      onDragOver={(event) => props.onDragOver(event)}
      onDrop={(event) => props.onDrop(event, props.name)}
    >
      {titlebar(props)}
     <div className="flexRow flexStart">
     
     <div className="flexCol flexStart">
     Market:
     <div className="refreshMarketBtn"
      onClick={()=>refreshMarket()}>
      Refresh Market
      </div>
    </div>
  {market}</div>
      {battlefield(props)}
    </div>
    </div>
  );
};
export default Location;
