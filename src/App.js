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
  const [turn, setTurn] = useState(0)
  const [playerCount, setPlayerCount] = useState(2)



//graphql query
const getData = async() => {
  try{
    let res = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      // mode: 'cors', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body:JSON.stringify({'query':`{
        players(gameId:0){
          name, type, firstPlayer,
          deck{cost, gold, influence, name},
          discard{cost, gold, influence, name},
          hand{cost, gold, influence, name}
        }
      
      }`})
    })

 // let res = await fetch('http://localhost:4001/graphql?query={hello}')
 let response = await res.json();
 console.log('got response:'+JSON.stringify(response))
  // .then(r => r.json())
  // .then(data => console.log('data returned:', data));
  }catch(e){
    console.log('error:'+e)
  }

}
// getData();

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

  //basic promise
  //todo: add player select page
  // const startGame = () =>{
  //   fetch('http://localhost:8080/game')
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         console.log('result' + result.id); //gameid
  //         setId(result.id);
  //         getGame(result.id);
  //       },
  //       (error) => {
  //         console.log('error' + error);
  //       },
  //     );
  // }
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
            deck{cost, gold, influence, name},
            discard{cost, gold, influence, name},
            hand{cost, gold, influence, name}
          },
          locations(gameId: $theId){
            name, influence
            market{cost, gold, influence, name},
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
      console.log('response to newgame:'+JSON.stringify(response))
      
      setLocationInfo(response.data.locations);
      setPlayerInfo(response.data.players)    
      setTurn(response.data.turn)  
    }catch(e){
      console.log(e)
    }
  };

  const playCard = async(name, location)=>{
    let data = {"cardname":name, "player":players[currentPlayer].name, "location":location}
    let res = await fetch('http://localhost:8080/game/' + gameId + '/play',{
    method: 'POST', 
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 

  });
    let response = await res.json();
    console.log('playcard result'+response.locations)
    setLocationInfo(response.locations);
    setPlayerInfo(response.players)
  }

  const buyCard = async (index, location,card) => {

    let data = {"index":index, "player":players[currentPlayer].name,"location":location,}
    let res = await fetch('http://localhost:8080/game/' + gameId+'/buy',{
    method: 'POST', 
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });
    console.log(res)
    let response = await res.json();
    console.log('buycard result'+response.locations)
    setLocationInfo(response.locations);
    setPlayerInfo(response.players)
  
  }

  const nextPlayer = async() => {
    console.log('next current'+currentPlayer)
    // let data = {"index":index, "player":players[currentPlayer].name,"location":location,}
    let res = await fetch('http://localhost:8080/game/' + gameId+'/next/'+currentPlayer,{
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // body: JSON.stringify(data) 
  });

    console.log(res)
    let response = await res.json();
    
    if(response.winner){
      alert('Good Game! ' +response.winner+ " wins!!")
    }
    console.log('nextplayer result'+JSON.stringify(response.locations))
    setLocationInfo(response.locations);
    setPlayerInfo(response.players);
    setCurrentPlayer(response.newPlayer)
    setTurn(response.turn)
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
          // cards={displayCards[location.name]}
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
    </div>
  );
};

export default App;
