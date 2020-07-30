import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import { HAND, URL } from './constants.js';
import { IconButton, Button } from '@material-ui/core';
import Helper from './Helper';

  const LogView = ({props})=>{
    return (<div className="flexRow spaceBetween" style={{ width: 150 }}>
          <div className="flexCol" style={{ width: 150 }}>
            <div className="titlePlayer flexCol" style={{ width: 150 }}>
              <div className="flexRow">Game: {props.gameId}</div>
              <div className="flexRow">
                Player:{' '}
                <span style={{ color: props.playerBGs[props.currentPlayer] }}>
                  {props.players && props.players[props.currentPlayer] ? (
                    <span>
                      {props.players[props.currentPlayer].name}-{props.players[props.currentPlayer].id}
                    </span>
                  ) : (
                    ''
                  )}
                </span>
              </div>
            </div>
            <div>Current Turn: {props.turn}</div>
            <div id="gamelog" className="flexCol gamelog">
              GAME LOG:
              {props.gameLog.map((log, ind) => {
                return <div className="logText">{log}</div>;
              })}
            </div>
          </div>
        </div>)
  };
const GameView = (props) => {
  let currentPlayer = props.currentPlayer;
  let players = props.players;
  let playerIndex = props.playerIndex;
  let locations = props.locations;
  let locCards = [];
  let gameLog = props.gameLog;
  let playerBGs = props.playerBGs;
  let doubleBlind = props.doubleBlind;
  const [zoom, setZoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const checkZoom = (index) => {
    let newZoo = [];
    if (zoom[index] != 'zoom') {
      newZoo[index] = 'zoom';
      setZoom([...newZoo]);
    } else {
      setZoom([]);
    }
    // if(zoom == 'zoom'){
    //   setZoom('')
    //   buyCard(card, index)
    // }else{
    //   setZoom('zoom')
    // }
  };

  const nextButtonFunk = async() =>{

    if(!loading ){
      if(doubleBlind){
        await props.nextPlayer();
        setLoading(true);
      }else{
        setLoading(true);
        await props.nextPlayer();
        setTimeout(()=>setLoading(false),500);
      }
    }
  }

  if (locations) {
    locations.map((location, index) => {
      locCards.push(
        <Location
          scrap={props.scrap}
          refresh={props.refresh}
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
        disabled={loading}
        style={{ width: '100%', height: 75, margin: 5 }}
        onClick={nextButtonFunk}
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
      // console.log('hand:' + index);

      Hand.push(
        <div
          className={zoom[index]}
          onClick={() => checkZoom(index)}
          key={index}
          onDragStart={(event) => {
            let newZoo = [];
            newZoo[index] = 'zoom';
            setZoom([...newZoo]);
            props.onDragStart(event, index + '');
          }}
          draggable
          style={{
            margin: 5,
            backgroundColor: `${playerBGs[playerIndex]}`,
            opacity: 1,
            borderRadius: 5,
          }}
        >
          <PlayingCard
            id={index}
            card={card}
            backgroundColor={playerBGs[playerIndex]}
            player={playerIndex}
          />
        </div>,
      );
    });
  }

  const guiView = (
    <div className="flexCol" style={{ width: 100, margin: 5 }}>
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
      <div className="flexRow flexStart locContainer">
        <Helper useCookie={props.useCookie} />
        {locCards}
      </div>

      <div className="flexRow spaceBetween guiContainer">
        <LogView props={props}/>
        <div className="flexRow handContainer">{Hand}</div>
        {guiView}
      </div>
    </div>
  );
};
export default GameView;
