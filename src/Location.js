import React, { useState } from 'react';
import {HAND} from './constants.js'

import { Button } from '@material-ui/core';
import PlayingCard from './PlayingCard'

const Location = (props) => {

  const buyCard = (card,index) => {
    if(props.location.battlefield 
      // props.location.battlefield[bf]
      && props.location.battlefield[props.players[props.player].name]){
      let playerField = props.location.battlefield[props.players[props.player].name]
      console.log(props.players[props.player].name+' could buy something with ' + playerField.gold)
      props.buyCard(index, props.location, card)
    
    // console.log('buying something');
    
    // if(card.cost <= props.location.currentGold){
      // console.log('this is affordable!'+card.cost + props.location.currentGold)
    }else{
      console.log('you cannot afford this!'+card.cost + props.location.currentGold)
    }

  };

  // if(props.cards && props.cards.length > 0){
    // props.cards[props.name].map((card,index)=>{
      // console.log("maping card"+JSON.stringify(props.cards))
      // totalGold+=card.gold
      // totalInfluence += card.influence
    // })
  // }

  let market = []
  if(props.location){
    props.location.market.map((card,index)=>{
      market.push(
        <Button style={{margin:5}} onClick={()=>buyCard(card,index)} variant="contained" color="primary">
          <div className="flexCol marketcard center" >
            <div className="market-title">{card.name}({card.cost})</div>

            <div className="market-stat">
              <span>Gold:{card.gold}</span>
              <span>Influence: {card.influence} </span>
              <span>Draw: {card.draw}</span>
            </div>
            
          </div>
        </Button>
      )
    }) 
  }
  
  const battlefield = (props) => {
    
  return (<div className="flexCol padded">
        
        {Object.keys(props.location.battlefield).map((bf,index)=>{
          return(<div className="flexRow padded">
          <div>{bf}:</div>
          <div>G:{props.location.battlefield[bf].gold}</div>
          <div>I:{props.location.battlefield[bf].influence}</div>
            {props.location.battlefield[bf].cards.map((card,ind)=>{
              return(
              <PlayingCard 
              size="small"
              id={ind} 
              backgroundColor={props.playerBGs[props.player]}
              draggable={false} 
              onDragStart={null} 
              card={card}
              player={props.player}
            
             />
              )
            })}
          </div>
          )
        })}
        
        </div>)
  }

  const titlebar = (props) => {
    return(<div>
    <div>{props.location.name}</div>
    <div>{props.location.influencer}</div>
    <div>{props.location.influence}</div>
    </div>
    )
  }

  return (
    <div
      className="location"
      onDragOver={(event) => props.onDragOver(event)}
      onDrop={(event) => props.onDrop(event, props.name)}
    >
      {titlebar(props)}
      {market}
      {battlefield(props)}
    </div>
  );
};
export default Location;
