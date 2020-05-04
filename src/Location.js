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

  let market = []
  if(props.location){
    props.location.market.map((card,index)=>{
      market.push(
        <Button className="marketcard" style={{margin:5}} onClick={()=>buyCard(card,index)} variant="contained" color="primary">
          <div className="marketcard flexCol flexStart paddded" >
            <div className="market-title">{card.name}({card.cost})</div>

            <div className="market-stat">
              <div>Gold:{card.gold}</div>
              <div>Influence: {card.influence} </div>
              {card.draw ? (<div>Draw: {card.draw}</div>) :(<span/>)}
              {card.weary ? (<div>Draw: {card.weary}</div>) :(<span/>)}
              {card.vitality ? (<div>Draw: {card.vitality}</div>) :(<span/>)}
            </div>
            
          </div>
        </Button>
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
    return(<div><div className="flexRow" >
    <div>{props.location.name}</div>
    <div>({props.location.influence})--</div>
    <div>influencer:{props.location.influencer}</div>
    </div>
    <div className="flexRow" >
      <div>weariness:{props.location.weariness}</div>
    </div>
    </div>
    )
  }

  return (<div>
    <div
      className="location"
      onDragOver={(event) => props.onDragOver(event)}
      onDrop={(event) => props.onDrop(event, props.name)}
    >
      {titlebar(props)}
      {market}
      {battlefield(props)}
    </div>
    </div>
  );
};
export default Location;
