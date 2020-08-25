import React, { useEffect, useState, Component } from 'react';
import './App.css';
import { useCookies } from 'react-cookie';
import Location from './Location';
import PlayingCard from './PlayingCard';
import { HAND, URL } from './constants.js';
import { Button } from '@material-ui/core';
import CreateGame from './CreateGame';
import GameView from './GameView';
import bg from './imgs/sample/comix.jpg';

const App = () => {
 console.log('url:'+URL)
  const [scrap, setScrap] = useState(true);
  const [doubleBlind, setBlinds] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  let theGameId = gameId;//for some incredibly smart reason this works in setintervals while state does not
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState([
    '#e53935',
    '#5e35b1',
    '#43a047',
    '#eeff41',
    '#ff751a',
    '#ff33ff',
  ]);
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(1);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameLog, appendLog] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(-1);
  // const [isQuerying, setQuerying] = useState(false);
  const [loser, setLoser] = useState(false);
  const [gameUpdateIntervalId, setGameUpdateIntervalId] = useState([]);
  const [useCookie, setCookie] = useCookies(['tcoTutorial','tcoPlayerCookie','tcoGameCookie']);

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
    // alert('dropped card '+cardId+" on"+loc)
    console.log('drop on' + loc);
    playCard(cardId, loc);
  };

  const startGame = async (result, playerIndex, mScrap, mRefresh, mBlinds) => {
    // console.log('getting game '+result)
    setCookie('tcoPlayerCookie', playerIndex, { path: '/' });
    setCookie('tcoGameCookie', result, { path: '/' });
    setId(result);
    theGameId = result;
    setScrap(mScrap);
    setRefresh(mRefresh);
    appendLog([])
    getGame(result, true);
    setPlayerIndex(playerIndex);
    setBlinds(mBlinds);

    //RANDOM
    if(mBlinds){
      setCurrentPlayer(playerIndex);

    }
     
  };

  //async await
  const getGame = async (id, recurse) => {
    // if(currentPlayer == playerIndex ){
    if (id == -1){//&& playerIndex != currentPlayer + 1 && turn != 1) {
      console.log(
        'no need to get game data on locals turn' +
          playerIndex +
          (currentPlayer + 1),
      );
      // clearInterval(intervalId)
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
            hand{cost,quote,img, draw, gold, influence, name, politics, faith, fear, provision,abilities}
          },
          locations(gameId: $theId){
            coopCount { totalGold,totalInfluence,totalFaith,totalCourage,totalProvision},
            name, id,influence,influencer,edicts, weariness, info,proselytized,wounds,hardened,abilities,
            market{cost,quote,img,draw, gold, influence, name, politics, faith, fear, provision, abilities},
            coopDisplay{cost,quote,img,draw, gold, influence, name, politics, faith, fear, provision, abilities},
            battlefield{name,poliBonus,faith, fear, influence, gold, cards{name,quote,img,draw, influence, gold, politics, faith, fear,provision,abilities}}
          },
          currentPlayer(gameId: $theId){turn,nextPlayer,winner,winning,loser, log}
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
        // console.log(
        //   'response for game info: currentplayer is ' +
        //     JSON.stringify(response.data.locations),
        // );

        // if(!recurse){
          appendLog([...response.data.currentPlayer.log.reverse()]);
          // let element = document.getElementById('gamelog');
          // element.scrollTop = element.scrollHeight;
        // }

        setLocationInfo(response.data.locations);

        setPlayerInfo(response.data.players);

        console.log('currnetplayer:' + JSON.stringify(response.data.currentPlayer));
        // setCurrentPlayer(0);

        //RANDOM
        if(doubleBlind){

        }else{

        setCurrentPlayer(response.data.currentPlayer.nextPlayer);
        }
        
        if (response.data.currentPlayer.loser != '') {
          appendLog([...response.data.currentPlayer.log]);
          let loser = response.data.currentPlayer.loser;
          setWinner(loser);
        }else if (response.data.currentPlayer.winning) {
          appendLog([...response.data.currentPlayer.log]);
          let winner = response.data.currentPlayer.winner;
          setWinner(winner);
        }else if(recurse){
          setTimeout(()=>getGame(id,recurse),2000);
        }
      } catch (e) {
        console.log(e);
        // setQuerying(false)
      }
    }
  };

  const refreshMarket = async (locId) => {
    if (currentPlayer == playerIndex || playerIndex == -1) {
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
    } else {
      alert("you can't refresh when it isn't your turn!");
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
    if (currentPlayer == playerIndex || playerIndex == -1) {
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
    } else {
      alert("you can't buy when it isn't your turn!");
    }
  };

  const removeEffect = async (index, location, card) => {
    // if (currentPlayer == playerIndex || playerIndex == -1) {
      let cardIndex = parseInt(index);
      let theGame = parseInt(gameId);
      let LocationId = parseInt(location);
      let playerName = players[currentPlayer].id;
      // let data = {"cardname":index, "player":players[currentPlayer].name, "location":location}
      console.log(
        `trying to remove effect card with index${cardIndex} player${playerName} loc${location} game${gameId}`,
      );
      try {
        let query = `query RemoveEffect($playerName: Int, $cardIndex: Int, $LocationId: Int, $theGame: Int) {
          removeEffect(gameId: $theGame, playerId: $playerName, locationId: $LocationId, cardIndex: $cardIndex)
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
    // } else {
    //   alert("you can't buy when it isn't your turn!");
    // }
  };
  const setWinner = (winner) => {
    setCookie('tcoTutorial', true, { path: '/' });

    setId(-1);
    theGameId=-1;
    setCards([])
    setPlayerIndex(-1)
    setLoser(false);
    setLocationInfo([]);
    setPlayerInfo([]);
    setCurrentPlayer(-1);
    setTurn(0);
    alert(winner + ' is the winner!!');
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
        // setWinner(winner);
      } else {
        //RANDOM
        if(doubleBlind){

        }else{
          
        setCurrentPlayer(response.data.nextPlayer.nextPlayer);
        }

        if (turn != response.data.nextPlayer.turn) {
          setTurn(response.data.nextPlayer.turn);
          let log = 'Starting new Turn:' + response.data.nextPlayer.turn;
          let log2 = players[currentPlayer].name + ' is now First Player';
          newLog.push('', log, log2);
        }

        getGame(gameId);
      }
      appendLog([...newLog]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  let view = <CreateGame useCookie={useCookie} gameLog={gameLog} playerBGs={playerBGs} startGame={startGame} />;
  if (gameId > -1) {
    view = (
      <GameView
        doubleBlind={doubleBlind}
        scrap={scrap}
        refresh={refresh}
        useCookie={useCookie}
        gameId={gameId}
        gameLog={gameLog}
        players={players}
        turn={turn}
        refreshMarket={refreshMarket}
        buyCard={buyCard}
        removeEffect={removeEffect}
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
  return <div className="flexCol appContainer">

        <span className="cookie-info"> player{useCookie['tcoPlayerCookie']}--game{useCookie['tcoGameCookie']}</span>
      {view}
    </div>;
};

export default App;
