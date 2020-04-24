import React, { useState } from 'react';

import { Button } from '@material-ui/core';

const Location = (props) => {

  const buyCard = (card) => {
    console.log('buying something');
    if(card.cost <= props.location.currentGold){
      console.log('this is affordable!'+card.cost + props.location.currentGold)
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
        <Button style={{margin:5}} onClick={()=>buyCard(card)} variant="contained" color="primary">
          <div className="flexCol marketcard center" >
            <div className="market-title">{card.name}({card.cost})</div>

            <div className="market-stat">
              <span>Gold:{card.gold}</span>
              <span>Influence: {card.influence} </span>
              <span>Draw: {card.draw}</span>
            </div>
            
          </div>
        </Button>)
      }) 
    }

    const details = (props) => {
      if(props.name != "hand"){
            return( <div className="flexCol center">
                          <div className="flexRow spaceAround" style={{width:'100%'}} >
                  
                            <div className="flexCol center">
                              <div>Gold</div>
                              <div>- {props.location.currentGold} -</div>
                            </div>
                  
                            <div className="group-header">{props.name}</div>
                  
                            <div className="flexCol center">
                              <div>Influence</div>
                              <div>- {props.location.currentInfluence} -</div>
                            </div>
                  
                          </div>
                            
                        </div>)
          }else{
            return (<div className="flexCol center">
            <div className="group-header">{props.name}</div>
            </div>
            )
          }
    }

  return (
    <div
      className="location"
      onDragOver={(event) => props.onDragOver(event)}
      onDrop={(event) => props.onDrop(event, props.name)}
    >
     {details(props)}
      {market}
      <div className="flexRow center">{props.cards}</div>
    </div>
  );
};
export default Location;
