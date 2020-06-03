import React, { useEffect, useState, Component } from 'react';

import { IconButton } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons'
import './App.css';

const Helper = ({useCookie}) => {
  const [titleBar, setTitleBar] = useState(!useCookie['tcoTutorial'] ? 'helperActive' : 'helper');
  const [icon, setIcon] = useState(faTimes)
  const toggleTitleBar = () => {
    if (titleBar == 'helper') {
      setTitleBar('helperActive');
      setIcon(faTimes)
    } else {
      setTitleBar('helper');
      setIcon(faQuestion)
    }
  };
  return (<div>
        <IconButton onClick={() => toggleTitleBar()}>
        <FontAwesomeIcon  className="infoBtn" icon={icon} />
        </IconButton>
    <div className={titleBar}>
      <div className="flexRow">
        <div className="flexCol helperText">
        <p>Game Play:</p>
          <div className="hintText">
            ->Win by completing your calling, or influencing 3 locations
          </div>
          <div className="hintText">
            ->Your deck has 10 cards: 6 gold, 3 influence, 1 character
          </div>
        {/*
          <div className="hintText">->Every turn you draw 5 cards</div>
        */}
          <div className="hintText">
            ->Drag cards onto locations to play them there
          </div>
          <div className="hintText">
            ->Check your gold and influence under your character's name on a battlefield
          </div>
          <div className="hintText">
            ->Play a card on the scrap pile to remove it from your deck once a
            turn
          </div>
          <div className="hintText">
            ->There are many special rules: Click on a location's (?)
            button to see story specific special rules
          </div>
        </div>

        <div className="flexCol helperText">
          <p>Gold and Markets:</p>
          <div className="hintText">
            ->Play cards with gold to acquire cards from the market
          </div>
          <div className="hintText">
            ->hover over a card to zoom in- The cost is on top,
            then the name, and then what it does
          </div>
          <div className="hintText">
            ->Click on a card to acquire it, it goes into your discard and you will draw it later
          </div>
          <div className="hintText">
            ->It's a good idea to acquire cards with 2+ gold early on so you can
            acquire more powerful cards
          </div>
          <div className="hintText">
            ->After the first turn, you can spend 1 gold to refresh the market
            (remove the old market cards and get 3 random cards from the market deck)
          </div>
        </div>
        <div className="flexCol helperText">
          <p>Influence and locations:</p>
          <div className="hintText">
            ->Play cards with Influence to contest locations
          </div>
          <div className="hintText">
            ->At the end of the turn, if your influence on a location is greater than any other player PLUS the location's influence (usually 3), you become influencer
          </div>
        {/*
          <div className="hintText">
            ->If no one else is on the location, you still need to have more
            than the location's influence
          </div>
        */}
          <div className="hintText">
            ->By Influencing locations you acquire powerful influence cards            
          </div>
          <div className="hintText">
            ->Keep an eye on who influences what, you don't want to lose by a
            surprise influence victory
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
export default Helper;
