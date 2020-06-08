import React, { useState } from 'react';
import PlayingCard from '../../PlayingCard';
const Market = (props, buyCard, zoom) => {
  const [buy, setBuy] = useState([])
  let market = [];
  if (props.location) {
    props.location.market.map((card, index) => {
      market.push(
        <div
          className={zoom}
          style={{margin:3}}
          onClick={() => {
            buyCard(card, index)
            let newBuy = []
            newBuy[index]=1
            if(buy[index] > 0){
              setBuy([])
            }else{
              setBuy(newBuy)
            }
          }}
        >
        <div onAnimationEnd={()=>setBuy([])} className={buy[index] > 0 ? 'buyCard' : ''}>
          <PlayingCard
            id={index}
            size="small"
            card={card}
            backgroundColor="teal"
            player={null}
          />
        </div>
        </div>,
      );
    });
  }
  return market;
};
export default Market;
