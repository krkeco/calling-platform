import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import { HAND, URL } from './constants.js';
import { Button } from '@material-ui/core';
import CreateGame from './CreateGame';
import GameView from './GameView';
import bg from './imgs/sample/comix.png';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['#e53935', '#5e35b1', '#43a047', '#eeff41']);
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameLog, appendLog] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(-1);
  const [isQuerying, setQuerying] = useState(false);
  const [loser, setLoser] = useState(false);

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
            name, id,type, firstPlayer,
            deck{name},
            discard{name},
            hand{cost,img, draw, gold, influence, name, politics, faith, fear, reinforce,abilities}
          },
          locations(gameId: $theId){
            name, id,influence,influencer, weariness, info,proselytized,wounds,hardened,abilities,
            market{cost,img,draw, gold, influence, name, politics, faith, fear, reinforce, abilities},
            battlefield{name,poliBonus, influence, gold, cards{name,img,draw, influence, gold, politics, faith, fear,reinforce,abilities}}
          },
          currentPlayer(gameId: $theId){turn,nextPlayer,winner,loser, log}
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
        console.log(
          'response for game info: currentplayer is ' +
            JSON.stringify(response.data),
        );

        appendLog([...response.data.currentPlayer.log]);
        let element = document.getElementById('gamelog');
        element.scrollTop = element.scrollHeight;

        setLocationInfo(response.data.locations);

        setPlayerInfo(response.data.players);

        console.log('currnetplayer:' + response.data);
        // setCurrentPlayer(0);
        setCurrentPlayer(response.data.currentPlayer.nextPlayer);
        if (response.data.currentPlayer.winner != '') {
          let winner = response.data.currentPlayer.winner;
          setWinner(winner);
        }
        if (response.data.currentPlayer.loser != '') {
          if(!loser){
            let loser = response.data.currentPlayer.loser;
            alert("uh-oh: "+loser+" fell for their bane :(")
            setLoser(true)
          }
        }
        // setQuerying(false)
      } catch (e) {
        console.log(e);
        // setQuerying(false)
      }
    }
  };

  const refreshMarket = async (locId) => {
    try {
      let theGame = parseInt(gameId);
      let playerId = parseInt(players[currentPlayer].id);
      let locationId = parseInt(locId);
      // console.log('refreshing:' + playerName + theGame + '/' + locationName);
      let query = `query RefreshMarket($theGame: Int, $playerId: Int, $locationId: Int){
      refreshMarket(gameId: $theGame, playerId: $playerId, locationId: $locationId)
    }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerId, locationId, theGame },
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
    let playerId = parseInt(players[currentPlayer].id);
    try {
      let query = `query Play($playerId: Int, $cardIndex: Int, $location: Int, $theGame: Int) {
        play(gameId: $theGame, playerId: $playerId, locationId: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerId, cardIndex, location, theGame },
        }),
      });

      let response = await res.json();
      // console.log('response to playcard:' + JSON.stringify(response));
      // let log = players[currentPlayer].name + ' ' + response.data.play;
      // appendLog([...gameLog, log]);
      getGame(gameId);
    } catch (e) {
      console.log(e);
    }
  };

  const buyCard = async (index, location, card) => {
    let cardIndex = parseInt(index);
    let theGame = parseInt(gameId);
    let LocationId = parseInt(location);
    let playerName = players[currentPlayer].id;
    // let data = {"cardname":index, "player":players[currentPlayer].name, "location":location}
    console.log(
      `trying to play card with index${cardIndex} player${playerName} loc${location} game${gameId}`,
    );
    try {
      let query = `query Buy($playerName: Int, $cardIndex: Int, $LocationId: Int, $theGame: Int) {
        buy(gameId: $theGame, playerId: $playerName, locationId: $LocationId, cardIndex: $cardIndex)
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerName, cardIndex, LocationId, theGame },
        }),
      });

      let response = await res.json();
      console.log('response to playcard:' + JSON.stringify(response));

      // let log = players[currentPlayer].name + ' ' + response.data.buy;
      // appendLog([...gameLog, log]);

      getGame(gameId);
    } catch (e) {
      console.log(e);
    }
  };
  const setWinner = (winner) => {
    // let newLog = [...gameLog];
    alert(winner + ' is the winner!!');
    // newLog.push(winner + ' won the game!');
    setId(-1);
    setLocationInfo([]);
    setPlayerInfo([]);
    setCurrentPlayer(0);
    setTurn(1);
    // appendLog([]);
  };

  const nextPlayer = async () => {
    try {
      let theGame = parseInt(gameId);
      let thePlayer = parseInt(currentPlayer);
      console.log('getting next player with ' + theGame + '/' + thePlayer);
      // console.log('next current'+currentPlayer)
      let query = `query NextPlayer($theGame: Int, $thePlayer: Int ) {
        nextPlayer(gameId: $theGame, currentPlayer: $thePlayer){
          turn, nextPlayer, winner, loser, log
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

  // <img className="createGameContainer"
  //    draggable={false}
  //    src={bg}
  //     />
  return <div className="flexCol appContainer">{view}</div>;
};

export default App;
