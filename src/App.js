import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import { HAND, URL } from './constants.js';
import { Button } from '@material-ui/core';
import CreateGame from './CreateGame';
import GameView from './GameView';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['red', 'blue', 'green', 'yellow']);
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameLog, appendLog] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(-1);
  const [isQuerying, setQuerying] = useState(false);

  const onDragStart = (event, cardId) => {
    if (currentPlayer == playerIndex || playerIndex == -1) {
      let triggerCard = cards.find((card) => card.id == cardId);
      console.log('dragstart on div: ', cardId);
      event.dataTransfer.setData('cardId', cardId);
    } else {
      alert(
        "You can't play someone else's cards!" +
          currentPlayer +
          '/' +
          playerIndex,
      );
      event.preventDefault();
    }
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDrop = (event, loc) => {
    let cardId = event.dataTransfer.getData('cardId');
    console.log('drop on' + loc);
    playCard(cardId, loc);
  };

  if (turn == 0) {
    setTurn(1);
    let log = 'Starting first Turn: 1';
    appendLog([...gameLog, log]);
  }

  const startGame = async (result, playerIndex) => {
    // console.log('getting game '+result)
    setId(result);

    getGame(result);
    setPlayerIndex(playerIndex);
    if (playerIndex > -1) {
      setInterval(async () => getGame(result, true), 2000);
    }
  };

  //async await
  const getGame = async (id, online) => {
    // if(currentPlayer == playerIndex ){
    if (online && playerIndex != currentPlayer + 1 && turn != 1) {
      console.log(
        'no need to get game data on locals turn' +
          playerIndex +
          (currentPlayer + 1),
      );
    } else {
      console.log('getting game data');
      try {
        let theId = parseInt(id);
        console.log('getting game from ' + theId);
        let query = `query Game($theId: Int) {
          players(gameId: $theId){
            name, type, firstPlayer,
            deck{name},
            discard{name},
            hand{cost, draw, gold, influence, name, politics, faith, fear, reinforce,abilities}
          },
          locations(gameId: $theId){
            name, influence,influencer, weariness, info,proselytized,hardened,abilities,
            market{cost,draw, gold, influence, name, politics, faith, fear, reinforce, abilities},
            battlefield{name,influence, gold, cards{name,draw, influence, gold, politics, faith, fear,reinforce,abilities}}
          },
          currentPlayer(gameId: $theId){turn,nextPlayer,winner}
      }`;
        let res = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { theId },
          }),
        });

        let response = await res.json();
        // console.log('response for game info: currentplayer is '+JSON.stringify(response.data))

        let newLog = [...gameLog];
        locations.map((location, index) => {
          if (
            location.influencer != response.data.locations[index].influencer
          ) {
            console.log('new influencer!!!');
            let log =
              response.data.locations[index].influencer +
              ' took ' +
              locations[index].name +
              ' from ' +
              location.influencer +
              '!';
            newLog.push(log);
          }
        });

        setLocationInfo(response.data.locations);

        setPlayerInfo(response.data.players);

        console.log('currnetplayer:' + response.data);
        // setCurrentPlayer(0);
        setCurrentPlayer(response.data.currentPlayer.nextPlayer);
        if (response.data.currentPlayer.winner != '') {
          let winner = response.data.currentPlayer.winner;
          setWinner(winner);
        }
        // setQuerying(false)
      } catch (e) {
        console.log(e);
        // setQuerying(false)
      }
    }
  };

  const refreshMarket = async (locationName) => {
    try {
      let theGame = parseInt(gameId);
      let playerName = players[currentPlayer].name;
      console.log('refreshing:' + playerName + theGame + '/' + locationName);
      let query = `query RefreshMarket($theGame: Int, $playerName: String, $locationName: String){
      refreshMarket(gameId: $theGame, playerName: $playerName, locationName: $locationName)
    }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerName, locationName, theGame },
        }),
      });

      let response = await res.json();
      console.log('refresh?' + JSON.stringify(response));
      getGame(gameId);
      // setQuerying(false)
    } catch (e) {
      console.log('error refreshing market:' + e);
      // setQuerying(false)
    }
  };
  // play(gameId:0, playerName:"Jonah", locationName:"nineveh", cardIndex:0)
  const playCard = async (name, location) => {
    let cardIndex = parseInt(name);
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
    try {
      let query = `query Play($playerName: String, $cardIndex: Int, $location: String, $theGame: Int) {
        play(gameId: $theGame, playerName: $playerName, locationName: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerName, cardIndex, location, theGame },
        }),
      });

      let response = await res.json();
      console.log('response to playcard:' + JSON.stringify(response));
      let log = players[currentPlayer].name + ' ' + response.data.play;
      appendLog([...gameLog, log]);
      getGame(gameId);
    } catch (e) {
      console.log(e);
    }
  };

  const buyCard = async (index, location, card) => {
    let cardIndex = parseInt(index);
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
    // let data = {"cardname":index, "player":players[currentPlayer].name, "location":location}
    console.log(
      `trying to play card with index${cardIndex} player${playerName} loc${location} game${gameId}`,
    );
    try {
      let query = `query Buy($playerName: String, $cardIndex: Int, $location: String, $theGame: Int) {
        buy(gameId: $theGame, playerName: $playerName, locationName: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerName, cardIndex, location, theGame },
        }),
      });

      let response = await res.json();
      console.log('response to playcard:' + JSON.stringify(response));

      let log = players[currentPlayer].name + ' ' + response.data.buy;
      appendLog([...gameLog, log]);

      getGame(gameId);
    } catch (e) {
      console.log(e);
    }
  };
  const setWinner = (winner) => {
    let newLog = [...gameLog];
    alert(winner + ' is the winner!!');
    newLog.push(winner + ' won the game!');
    setId(-1);
    setLocationInfo([]);
    setPlayerInfo([]);
    setCurrentPlayer(0);
    setTurn(1);
    appendLog([]);
  };

  const nextPlayer = async () => {
    try {
      let theGame = parseInt(gameId);
      let thePlayer = parseInt(currentPlayer);
      console.log('getting next player with ' + theGame + '/' + thePlayer);
      // console.log('next current'+currentPlayer)
      let query = `query NextPlayer($theGame: Int, $thePlayer: Int ) {
        nextPlayer(gameId: $theGame, currentPlayer: $thePlayer){
          turn, nextPlayer, winner
        }
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { theGame, thePlayer },
        }),
      });

      let response = await res.json();
      console.log(
        'response to nextturn newfirst is:' + JSON.stringify(response.data),
      );
      let newLog = [...gameLog];

      if (response.data.nextPlayer.winner) {
        let winner = response.data.nextPlayer.winner;
        setWinner(winner);
      } else {
        setCurrentPlayer(response.data.nextPlayer.nextPlayer);

        if (turn != response.data.nextPlayer.turn) {
          setTurn(response.data.nextPlayer.turn);
          let log = 'Starting new Turn:' + response.data.nextPlayer.turn;
          let log2 = players[currentPlayer].name + ' is now First Player';
          newLog.push('', log, log2);
        }

        getGame(gameId);
      }
      appendLog([...newLog]);
    } catch (e) {
      console.log(e);
    }
  };

  let view = <CreateGame playerBGs={playerBGs} startGame={startGame} />;
  if (gameId > -1) {
    view = (
      <GameView
        gameId={gameId}
        gameLog={gameLog}
        players={players}
        turn={turn}
        refreshMarket={refreshMarket}
        buyCard={buyCard}
        playerBGs={playerBGs}
        nextPlayer={nextPlayer}
        playerIndex={playerIndex}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        currentPlayer={currentPlayer}
        locations={locations}
      />
    );
  }

  return <div className="flexCol appContainer">{view}</div>;
};

export default App;
