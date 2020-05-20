import React, { useEffect, useState, Component } from 'react';

import { Button } from '@material-ui/core';
import './App.css';

const Helper = () => {
   const [titleBar, setTitleBar] = useState('helper');
    const toggleTitleBar = () => {
      if (titleBar == 'helper') {
        setTitleBar('helper active');
      } else {
        setTitleBar('helper');
      }
    };
    return (
        <div className={titleBar}>
          <div onClick={() => toggleTitleBar()}>
            <button className="helpBtn">( ? )</button>
          </div>
          <div className="flexRow">
            <div style={{flex:1,padding:5}} className="flexCol helperText">
            <p>Game Play:</p>
            <div className="hintText">->You win the game by completing your calling, or influencing 3 locations at once</div>
            <div className="hintText">->You have a 10 card deck: 6 gold, 3 influence, 1 character</div>
            <div className="hintText">->Every turn you draw 5 cards</div>
            <div className="hintText">->Drag cards on location battlefields to play them</div>
            <div className="hintText">->You can see how much gold and influence you have on a location under your name in the location's battlefield</div>
            <div className="hintText">->To see a card, hover your mouse over the card- The cost is on top, then the name, and then what it does</div>
            <div className="hintText">->Play a card on the scrap pile to remove it from your deck (once a turn)</div>
            <div className="hintText">->There are many special rules on cards: Click on a locations (?) button to see more special rules</div>
            
          </div>
          <div style={{flex:1,padding:5}} className="flexCol helperText">
            <p>Gold and Markets:</p>
            <div className="hintText">->Playing cards with gold to get cards from the market</div>
            <div className="hintText">->If you have enough gold, click on a card to buy it, it will go in your discard</div>
            <div className="hintText">->It's a good idea to buy some cards with gold early on so you can buy more expensive cards</div>
            <div className="hintText">->After the first turn, you can spend 1 gold to refresh the market (remove the old market and get 3 random new cards)</div>
            </div>
          <div style={{flex:1,padding:5}} className="flexCol helperText">
            <p>Influence and locations:</p>
            <div className="hintText">->Play cards with Influence to contest locations</div>
           <div className="hintText">->At the end of a round if you have more influence than any other player on the location plus the locations influence you become influencer!</div>
           <div className="hintText">->If no one else is on the location, you still need to have more than the location's influence</div>
            <div className="hintText">->Influencing locations also gives you a powerful influence card next turn!</div>
            <div className="hintText">->Keep an eye on who influences what, you don't want to lose by a surprise influence victory</div>
           
            </div>
          </div>
        </div>
              )
}
export default Helper;