import React, { useState } from 'react';
import PlayingCard from '../../PlayingCard';
const Market = (props, buyCard) => {
  let market = [];
  if (props.location) {
    props.location.market.map((card, index) => {
      market.push(
        <div style={{ margin: 3 }} onClick={() => buyCard(card, index)}>
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
  return market;
};
export default Market;