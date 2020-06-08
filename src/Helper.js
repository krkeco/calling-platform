import React, { useEffect, useState, Component } from 'react';

import { IconButton, Tooltip } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const Helper = ({ useCookie }) => {
  const [titleBar, setTitleBar] = useState(
    !useCookie['tcoTutorial'] ? 'helperActive' : 'helper',
  );
  const [icon, setIcon] = useState(
    !useCookie['tcoTutorial'] ? faTimes : faQuestion,
  );
  const toggleTitleBar = () => {
    if (titleBar == 'helper') {
      setTitleBar('helperActive');
      setIcon(faTimes);
    } else {
      setTitleBar('helper');
      setIcon(faQuestion);
    }
  };
  return (
    <div>
      <Tooltip arrow title="Help">
        <IconButton onClick={() => toggleTitleBar()}>
          <FontAwesomeIcon className="infoBtn" icon={icon} />
        </IconButton>
      </Tooltip>
      <div className={titleBar}>
        <div className="flexRow">
          <div className="flexCol helperText">
            <p>Game Play:</p>
            <div className="hintText">
              ->Win by completing your calling, or influencing 3 locations
            </div>
            <div className="hintText">
              ->Your deck starts with 10 cards: 6 gold, 3 influence, 1 character
            </div>

            <div className="hintText">
              ->Every turn you draw 5 cards from your deck. At the end of the
              turn, discard all cards. Shuffle your discard into your deck when
              you run out of cards to draw
            </div>

            <div className="hintText">
              ->You can view the current player's hand below. To view the
              current player's deck or discard pile, click on the buttons on the
              right.
            </div>
            <div className="hintText">
              ->Drag cards onto locations to play them there
            </div>
            <div className="hintText">
              ->Check your gold and influence under your character's name on a
              battlefield
            </div>
            <div className="hintText">
              ->Once a turn you can play a card on the scrap pile to remove it
              from your deck
            </div>
            <div className="hintText">
              ->There are many special rules: Click on a location's (?) button
              to see story specific special rules
            </div>
          </div>

          <div className="flexCol helperText">
            <p>Gold and Markets:</p>
            <div className="hintText">
              ->Play cards with gold to acquire cards from the market
            </div>
            <div className="hintText">
              ->Click on the zoom icon to zoom in on the market cards- The $cost and name are on
              the first line, what the card does is below that
            </div>
            <div className="hintText">
              ->You can also zoom in on the battlefield by clicking inside it, or click a card in your hand to zoom in on it.
            </div>
            <div className="hintText">
              ->If you have enough gold on a location you may click on a card to
              acquire it- it goes into your discard pile for now
            </div>
            <div className="hintText">
              ->It's a good idea to acquire cards with 2+ gold early on so you
              can acquire more powerful cards
            </div>
            <div className="hintText">
              ->After the first turn, you can spend 1 gold to refresh the market
              to remove the old market cards and get 3 random cards from the
              market deck
            </div>

            <div className="hintText">
              ->A market has 18 cards, so if there are only a couple cards left,
              it means almost everything has been acquired
            </div>
          </div>
          <div className="flexCol helperText">
            <p>Influence and locations:</p>
            <div className="hintText">
              ->Play cards with Influence to contest locations
            </div>
            <div className="hintText">
              ->At the end of the turn the highest and second highest players influence are subtracted
              if the remaining total influence is greater than the locations influence (usually 4) then the highest player is now influencing
            </div>
            
          <div className="hintText">
            -> You will always need at least 5 influence to capture a location
          </div>
        
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
