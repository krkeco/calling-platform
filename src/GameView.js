import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import { HAND, URL } from './constants.js';
import { Button } from '@material-ui/core';
import Helper from './Helper';

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
        style={{ width: '100%', height: 75, margin: 5 }}
        onClick={props.nextPlayer}
        variant="contained"
        color="secondary"
      >
        Next Player {currentPlayer}/{playerIndex}
      </Button>
    );
  }

  let Hand = [];
  if (players && players[currentPlayer]) {
    players[currentPlayer].hand.map((card, index) => {
      console.log('hand:' + index);
      Hand.push(
        <div
          key={index}
          onDragStart={(event) => props.onDragStart(event, index + '')}
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
        </div>,
      );
    });
  }

  const logView = (
    <div className="flexRow">
      <div className="flexRow spaceBetween" style={{ width: 150 }}>
        <div className="flexCol" style={{ width: 150 }}>
          <div className="titlePlayer">
            {props.gameId} CurrentPlayer:{' '}
            <span style={{ color: playerBGs[currentPlayer] }}>
              {players && players[currentPlayer] ? (
                <span>
                  {players[currentPlayer].name}-{players[currentPlayer].id}
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
      </div>
    </div>
  );
  const guiView = (
    <div className="flexCol" style={{ width: 100, margin:5 }}>
      <Button
        style={{ width: '100%', margin: 5 }}
        variant="contained"
        color="primary"
        onClick={() => {
          alert(
            'Deck:\n' +
              players[currentPlayer].deck.map((card, ind) => '\n' + card.name),
          );
        }}
      >
        Deck
      </Button>
      <Button
        style={{ width: '100%', margin: 5 }}
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

      {nextButton}
    </div>
  );

  return (
    <div>
      <Helper />
      <div className="flexRow flexStart padded locContainer">{locCards}</div>

      <div className="flexRow spaceBetween guiContainer">
        {logView}
        <div className="flexRow handContainer" >
          {Hand}
        </div>
        {guiView}
      </div>
    </div>
  );
};
export default GameView;
