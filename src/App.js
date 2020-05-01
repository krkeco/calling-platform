import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import {HAND} from './constants.js'
import PlayerDataForm from './PlayerDataForm'
import { Button } from '@material-ui/core';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['red','blue','green','yellow'])
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(1)
  const [playerCount, setPlayerCount] = useState(2)
  const [gameLog, appendLog] = useState([])


// //graphql query
// const getData = async() => {
//   try{
//     let res = await fetch('http://localhost:4000/graphql', {
//       method: 'POST',
//       // mode: 'cors', 
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body:JSON.stringify({'query':`{
//         players(gameId:0){
//           name, type, firstPlayer,
//           deck{cost, gold, influence, name},
//           discard{cost, gold, influence, name},
//           hand{cost, gold, influence, name}
//         }
      
//       }`})
//     })

//  // let res = await fetch('http://localhost:4001/graphql?query={hello}')
//  let response = await res.json();
//  console.log('got response:'+JSON.stringify(response))
//   // .then(r => r.json())
//   // .then(data => console.log('data returned:', data));
//   }catch(e){
//     console.log('error:'+e)
//   }

// }
  const onDragStart = (event, cardId) => {
    let triggerCard = cards.find((card) => card.id == cardId);
      console.log('dragstart on div: ', cardId);
      event.dataTransfer.setData('cardId', cardId);
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDrop = (event, loc) => {
    let cardId = event.dataTransfer.getData('cardId');
    console.log('drop on' + loc);
    playCard(cardId,loc)
  };

  const startGame = async(result) =>{
    // console.log('getting game '+result)
    setId(result);
    getGame(result);
  }


  //async await
  const getGame = async (id) => {
    try{
      let theId = parseInt(id);
      console.log('getting game from '+theId)
      let query = `query Game($theId: Int) {
          players(gameId: $theId){
            name, type, firstPlayer,
            deck{cost, draw, gold, influence, name},
            discard{cost, draw, gold, influence, name},
            hand{cost, draw, gold, influence, name}
          },
          locations(gameId: $theId){
            name, influence,influencer,
            market{cost, gold, influence, name},
            battlefield{name,influence, gold, cards{name,draw, influence, gold}}
          }
      }`;
      let res = await fetch('http://localhost:4000/graphql', {
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
      console.log('response for game info:'+JSON.stringify(response.data.players))
      
      setLocationInfo(response.data.locations);
      setPlayerInfo(response.data.players)    
      
      let log = "Starting first Turn: 1"
      let log2 = response.data.players[currentPlayer].name + " is now First Player"
      appendLog([...gameLog,log,log2])
    }catch(e){
      console.log(e)
    }
  };


// play(gameId:0, playerName:"Jonah", locationName:"nineveh", cardIndex:0)
  const playCard = async(name, location)=>{
    let cardIndex = parseInt(name);
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
    // let data = {"cardname":name, "player":players[currentPlayer].name, "location":location}
    // console.log(`trying to play card with index${cardIndex} player${playerName} loc${location} game${gameId}`)
       try{
//{gameId, playerName, buyLocation}
      let query = `query Play($playerName: String, $cardIndex: Int, $location: String, $theGame: Int) {
        play(gameId: $theGame, playerName: $playerName, locationName: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch('http://localhost:4000/graphql', {
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
    }catch(e){
      console.log(e)
    }
  }

  const buyCard = async (index, location, card) => {
    let cardIndex = parseInt(index);
    let theGame = parseInt(gameId);
    let playerName = players[currentPlayer].name;
    // let data = {"cardname":index, "player":players[currentPlayer].name, "location":location}
    console.log(`trying to play card with index${cardIndex} player${playerName} loc${location} game${gameId}`)
        try{
      let query = `query Buy($playerName: String, $cardIndex: Int, $location: String, $theGame: Int) {
        buy(gameId: $theGame, playerName: $playerName, locationName: $location, cardIndex: $cardIndex)
      }`;
      let res = await fetch('http://localhost:4000/graphql', {
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

      getGame(gameId);
    }catch(e){
      console.log(e)
    }
  
  }

  const nextPlayer = async() => {
    let theGame = parseInt(gameId);
    let thePlayer = parseInt(currentPlayer);
    // console.log('next current'+currentPlayer)
  try{
      let query = `query NextPlayer($theGame: Int, $thePlayer: Int ) {
        nextPlayer(gameId: $theGame, currentPlayer: $thePlayer){
          turn, nextPlayer, winner
        },
        players(gameId: $theGame){
            name, type, firstPlayer,
            deck{cost, draw, gold, influence, name},
            discard{cost, draw, gold, influence, name},
            hand{cost, draw, gold, influence, name}
          },
        locations(gameId: $theGame){
            name, influence,influencer,
            market{cost, gold, influence, name},
            battlefield{name,influence, gold, cards{name,draw, influence, gold}}
          }
      }`;
      let res = await fetch('http://localhost:4000/graphql', {
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
      locations.map((location, index)=>{
        if(location.influencer != response.data.locations[index].influencer){
          console.log('new influencer!!!')
          let log = response.data.locations[index].influencer +" took " +locations[index].name + " from "+location.influencer+ "!"
          newLog.push(log)
        }
      })

      if(response.data.nextPlayer.winner){
        alert(response.data.nextPlayer.winner+' is the winner!!')
        newLog.push(response.data.nextPlayer.winner+ " won the game!")
        setId(-1)
        setLocationInfo([]);
        setPlayerInfo([])    
        setCurrentPlayer(0)
        setTurn(1)
      
      }else{
        
        setCurrentPlayer(response.data.nextPlayer.nextPlayer)
        
        if(turn != response.data.nextPlayer.turn){
          setTurn(response.data.nextPlayer.turn)
          let log = "Starting new Turn:"+response.data.nextPlayer.turn
          let log2 = players[currentPlayer].name + " is now First Player"
          newLog.push("",log,log2)
        }

        // getGame(gameId);

        setLocationInfo(response.data.locations);
        setPlayerInfo(response.data.players)    
      }
        appendLog([...newLog])

    }catch(e){
      console.log(e)
    }
  };

  let locCards = [];
  if (locations) {
    locations.map((location, index) => {
      locCards.push(
        <Location
          player={currentPlayer}
          players={players}
          buyCard={buyCard}
          location={location}
          name={location.name}
          playerBGs={playerBGs}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />,
      );
    });
  }
  return (
    <div className="flexCol">
      <div className="flexRow spaceAround padded">
      {locCards}
      </div>
        
      {gameId == -1 ?  <div className="flexCol">
        <PlayerDataForm playerBGs={playerBGs} startGame={startGame}/>
        
        </div>
        : 
        <div className="flexCol">
        <div>Current Turn: {turn}</div>
        <div className="title">CurrentPlayer: {players[currentPlayer] ? players[currentPlayer].name : ''}</div>
      <div className="flexRow center">
        {players[currentPlayer] ? players[currentPlayer].hand.map((card, index)=>{return(
          <PlayingCard id={index} 
          draggable 
          onDragStart={onDragStart} 
          card={card}
          player={currentPlayer}
          backgroundColor = {playerBGs[currentPlayer]}
           />)}) : <span/>}
      <Button onClick={nextPlayer} variant="contained" color="secondary">
        Next Player
      </Button>
      </div>
      </div>
        }
        <div className="flexCol" >
        GAME LOG:
          {gameLog.map((log, ind)=>{
            return (<div>
            {log}
            </div>)
          })}
        </div>
    </div>
  );
};

export default App;
