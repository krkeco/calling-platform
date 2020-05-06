import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import {HAND,URL} from './constants.js'
import { Button } from '@material-ui/core';
import CreateGame from './CreateGame'
import GameView from './GameView'

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['red','blue','green','yellow'])
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0)
  const [playerCount, setPlayerCount] = useState(2)
  const [gameLog, appendLog] = useState([])
  const [playerIndex, setPlayerIndex] = useState(-1)
  const [isQuerying, setQuerying] = useState(false)

  const onDragStart = (event, cardId) => {
    if(currentPlayer == playerIndex || playerIndex == -1){
      let triggerCard = cards.find((card) => card.id == cardId);
      console.log('dragstart on div: ', cardId);
      event.dataTransfer.setData('cardId', cardId);
    }else{
      alert("You can't play someone else's cards!"+currentPlayer+"/"+playerIndex)
      event.preventDefault();
      
    }
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDrop = (event, loc) => {
    let cardId = event.dataTransfer.getData('cardId');
    console.log('drop on' + loc);
    playCard(cardId,loc)
  };


  if(turn == 0){
    setTurn(1)
    let log = "Starting first Turn: 1"
    appendLog([...gameLog,log])
  }

  const startGame = async(result, playerIndex) =>{
    // console.log('getting game '+result)
    setId(result);
      
    getGame(result);
    setPlayerIndex(playerIndex);
    setInterval(async()=>getGame(result),2000)
  }


  //async await
  const getGame = async (id) => {
    if(isQuerying){
      setTimeout(()=>getGame(id),1000)
    }else{
      setQuerying(true)
    try{
      let theId = parseInt(id);
      console.log('getting game from '+theId)
      let query = `query Game($theId: Int) {
          players(gameId: $theId){
            name, type, firstPlayer,
            deck{name},
            discard{name},
            hand{cost, draw, gold, influence, name, vitality, weary, reinforce,abilities}
          },
          locations(gameId: $theId){
            name, influence,influencer, weariness, info,proselytized,hardened,
            market{cost,draw, gold, influence, name, vitality, weary, reinforce, abilities},
            battlefield{name,influence, gold, cards{name,draw, influence, gold, vitality, weary,reinforce,abilities}}
          },
          currentPlayer(gameId: $theId)
      }`;
      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {theId}
        })
      })

      let response = await res.json()
      console.log('response for game info: currentplayer is '+JSON.stringify(response.data))
      
      let newLog = [...gameLog]
      locations.map((location, index)=>{
        if(location.influencer != response.data.locations[index].influencer){
          console.log('new influencer!!!')
          let log = response.data.locations[index].influencer +" took " +locations[index].name + " from "+location.influencer+ "!"
          newLog.push(log)
        }
      })

      setLocationInfo(response.data.locations);
      
      setPlayerInfo(response.data.players);

      console.log('currnetplayer:'+response.data.currentPlayer)
      setCurrentPlayer(response.data.currentPlayer)
      setQuerying(false)
    }catch(e){
      console.log(e)
      setQuerying(false)
    }
  }
  
  };

 const refreshMarket = async(locationName) => {
  if(isQuerying){
    alert('Server busy, try again')
      // setTimeout(()=>refreshMarket(locationName),500)
    }else{
      setQuerying(true)
  try{
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
    let query = `query RefreshMarket($theGame: Int, $playerName: String, $locationName: String){
      refreshMarket(gameId: $theGame, playerName: $playerName, locationName: $locationName)
    }`
    let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {playerName, locationName, theGame}
        })
      })

      let response = await res.json()
      setQuerying(false)
  }catch(e){
    console.log('error refreshing market:'+e)
    setQuerying(false)
  }
}
 }
// play(gameId:0, playerName:"Jonah", locationName:"nineveh", cardIndex:0)
  const playCard = async(name, location)=>{
    if(isQuerying){
      setTimeout(()=>playCard(name,location),100)
    }else{
      setQuerying(true)
    let cardIndex = parseInt(name);
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
       try{
      let query = `query Play($playerName: String, $cardIndex: Int, $location: String, $theGame: Int) {
        play(gameId: $theGame, playerName: $playerName, locationName: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {playerName, cardIndex, location, theGame}
        })
      })

      let response = await res.json()
      console.log('response to playcard:'+JSON.stringify(response))
      let log = players[currentPlayer].name + " " + response.data.play
      appendLog([...gameLog, log])
      getGame(gameId);
      setQuerying(false)
    }catch(e){
      console.log(e)
      setQuerying(false)
    }
  }
  }

  const buyCard = async (index, location, card) => {
    if(isQuerying){
      setTimeout(()=>buyCard(index,location,card),100)
    }else{
      setQuerying(true)
    let cardIndex = parseInt(index);
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
    // let data = {"cardname":index, "player":players[currentPlayer].name, "location":location}
    console.log(`trying to play card with index${cardIndex} player${playerName} loc${location} game${gameId}`)
        try{
      let query = `query Buy($playerName: String, $cardIndex: Int, $location: String, $theGame: Int) {
        buy(gameId: $theGame, playerName: $playerName, locationName: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {playerName, cardIndex, location, theGame}
        })
      })

      let response = await res.json()
      console.log('response to playcard:'+JSON.stringify(response))

      let log = players[currentPlayer].name + " " + response.data.buy
      appendLog([...gameLog, log])

      setQuerying(false)
      getGame(gameId);
    }catch(e){
      console.log(e)
      setQuerying(false)
    }
  }
  }

  const nextPlayer = async() => {
    if(isQuerying){
      setTimeout(()=>nextPlayer(),100)
    }else{
      setQuerying(true)
  try{
    let theGame = parseInt(gameId);
    let thePlayer = parseInt(currentPlayer);
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
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {theGame, thePlayer}
        })
      })

      let response = await res.json()
      console.log('response to nextturn newfirst is:'+JSON.stringify(response.data))
      let newLog = [...gameLog]

      if(response.data.nextPlayer.winner){
        alert(response.data.nextPlayer.winner+' is the winner!!')
        newLog.push(response.data.nextPlayer.winner+ " won the game!")
        setId(-1)
        setLocationInfo([]);
        setPlayerInfo([])    
        setCurrentPlayer(0)
        setTurn(1)
        appendLog([])
      
      }else{
        
        setCurrentPlayer(response.data.nextPlayer.nextPlayer)
        
        if(turn != response.data.nextPlayer.turn){
          setTurn(response.data.nextPlayer.turn)
          let log = "Starting new Turn:"+response.data.nextPlayer.turn
          let log2 = players[currentPlayer].name + " is now First Player"
          newLog.push("",log,log2)
        }

        getGame(gameId);

      }
        appendLog([...newLog])
   
    }catch(e){
      console.log(e)
    }
  }
      setQuerying(false)

  };



let view = <CreateGame playerBGs={playerBGs} startGame={startGame}/>
if(gameId > -1){
  view = <GameView
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
    locations={locations}/>
}

  return (
    <div className="flexCol">

      {view}

    </div>
  );
};

export default App;
