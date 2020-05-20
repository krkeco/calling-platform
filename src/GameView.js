import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import { HAND, URL } from './constants.js';
import { Button } from '@material-ui/core';

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
      <div  >
        <div className={titleBar}>
          <div onClick={() => toggleTitleBar()}>
            <Button variant="outlined"
              size="small"
              color="secondary">
              ( ? )
              </Button>
          </div>
          <div className="flexRow">
            <div style={{flex:1}} className="flexCol helperText">
            <p>Game Play:</p>
            <p>Play cards on locations</p>
            <p>Use cards with Gold to acquire more cards</p>
            <p>Use cards with Influence to gain influence over locations</p>
            <p>Use the scrap pile to remove cards from your deck</p>
            <p>Win by completing your calling, or influencing 3 locations</p>

          </div>
          <div style={{flex:1}} className="flexCol helperText">
            <p>Strategy</p>
            <p>It's a good idea to buy some cards with gold early on so you can buy more expensive cards</p>
            <p>Influencing locations takes at least 4 influence (if no one else is contesting it), but gives you a powerful influence card!</p>
            <p>Keep an eye on who influences what, you don't want to lose by a surprise influence victory</p>
            </div>
          <div style={{flex:1}} className="flexCol helperText">
            <p>GamePlayer:</p>
            Each player takes turns playing cards on locations
            You can acquire new cards with gold on a location
            after all players have played this turn each location will check influence1
            if you have more influence than any other player plus the location's influnece you become the influencer!
            </div>
          </div>
        </div>
      </div>
              )
}

const GameView = (props) => {
  let currentPlayer = props.currentPlayer;
  let players = props.players;
  let playerIndex = props.playerIndex;
  let locations = props.locations;
  let locCards = [];
  let gameLog = props.gameLog;
  let playerBGs = props.playerBGs;

  if (locations) {
    locations.map((location, index) => {
      locCards.push(
        <Location
          refreshMarket={props.refreshMarket}
          player={currentPlayer}
          players={players}
          buyCard={props.buyCard}
          location={location}
          name={location.name}
          playerBGs={playerBGs}
          onDragOver={props.onDragOver}
          onDrop={props.onDrop}
        />,
      );
    });
  }
  let nextButton = (
    <div>
      player of {currentPlayer}/{playerIndex}
    </div>
  );
  if (currentPlayer == playerIndex || playerIndex == -1) {
    nextButton = (
      <Button
        style={{ width: '100%', height: 75 }}
        onClick={props.nextPlayer}
        variant="contained"
        color="secondary"
      >
        Next Player {currentPlayer}/{playerIndex}
      </Button>
    );
  }

  let scrapPile = (
    <div
      className="scrapPile flexCol center"
      onDrop={(event) => props.onDrop(event, -1)}
      onDragOver={(event) => props.onDragOver(event)}
    >
      Scrap Pile
    </div>
  );

  return (
    <div>
    <Helper/>
      <div className="flexRow flexStart padded locContainer">{locCards}</div>
      <div className="flexRow spaceBetween" style={{ width: '100%' }}>
        <div className="flexCol" style={{ width: 275 }}>
          <div className="titlePlayer">
            {props.gameId} CurrentPlayer:{' '}
            <span style={{ color: playerBGs[currentPlayer] }}>
              {players && players[currentPlayer] ? (
                <span>
                  {players[currentPlayer].name} {players[currentPlayer.id]}
                </span>
              ) : (
                ''
              )}
            </span>
          </div>
          <div>Current Turn: {props.turn}</div>
          <div id="gamelog" className="flexCol gamelog">
            GAME LOG:
            {gameLog.map((log, ind) => {
              return <div>{log}</div>;
            })}
          </div>
        </div>
        <div className="flexCol">
          <div className="flexRow flexStart">
            {players && players[currentPlayer] ? (
              players[currentPlayer].hand.map((card, index) => {
                return (
                  <div
                    key={index}
                    onDragStart={(event) => props.onDragStart(event, index)}
                    draggable
                    style={{
                      margin: 5,
                      backgroundColor: `${playerBGs[currentPlayer]}`,
                      opacity: 1,
                      borderRadius: 5,
                    }}
                  >
                    <PlayingCard
                      id={index}
                      card={card}
                      backgroundColor={playerBGs[currentPlayer]}
                      player={currentPlayer}
                    />
                  </div>
                );
              })
            ) : (
              <span />
            )}
          </div>
        </div>
        <div className="flexCol" style={{ width: 200 }}>
          <div className="flexRow">
            <Button
              style={{ width: '50%', margin: 5 }}
              variant="contained"
              color="primary"
              onClick={() => {
                alert(
                  'Deck:\n' +
                    players[currentPlayer].deck.map(
                      (card, ind) => '\n' + card.name,
                    ),
                );
              }}
            >
              Deck
            </Button>
            <Button
              style={{ width: '50%', margin: 5 }}
              variant="contained"
              color="primary"
              onClick={() => {
                alert(
                  'Discard:\n' +
                    players[currentPlayer].discard.map(
                      (card, ind) => '\n' + card.name,
                    ),
                );
              }}
            >
              Discard
            </Button>
          </div>
          {scrapPile}
          {nextButton}
        </div>
      </div>
    </div>
  );
};
export default GameView;
