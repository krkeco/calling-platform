import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import {HAND} from './constants.js'

import { Button } from '@material-ui/core';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['red','blue','green','yellow'])
  const [cards, setCards] = useState([]);

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
  const startGame = () =>{
    fetch('http://localhost:8080/game')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('result' + result.id); //gameid
          setId(result.id);
          getGame(result.id);
        },
        (error) => {
          console.log('error' + error);
        },
      );
  }
  //async await
  const getGame = async (id) => {
    try {
      console.log('trying getgame');
      let res = await fetch('http://localhost:8080/game/' + id);
      let response = await res.json();
      setLocationInfo(response.locations);
      setPlayerInfo(response.players)      
    } catch (e) {
      console.log('error getting game:' + e);
    }
  };

  const playCard = async(name, location)=>{
    let data = {"cardname":name, "player":players[currentPlayer].name,"location":location,}
    let res = await fetch('http://localhost:8080/game/' + gameId+'/play',{
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

  const nextPlayer = () => {
    console.log(players[currentPlayer].name +'is current turn')
    console.log(players[currentPlayer].hand)
    // setCards(players[currentPlayer].hand)
    // setCurrentPlayer()
    let newPlayer = currentPlayer+1;
    if(newPlayer >= players.length){
      newPlayer = 0;
    }
    // setHand(newPlayer)
    setCurrentPlayer(newPlayer)
  };

  // const setHand = (mPLayer) => {
  //    let playerHand = []
  //   // cards.map((oldcard,index)=>{
  //   //   if (oldcard.location != HAND){
  //   //     playerHand.push(oldcard)
  //   //   }
  //   // })
  //   players[mPLayer].hand.map((card,index)=>{
  //     let displayCard = {...card}
  //     displayCard.player = mPLayer
  //     // displayCard.id = index
  //     // displayCard.draggable= true
  //     displayCard.location = HAND
  //     displayCard.backgroundColor = playerBGs[mPLayer]
  //     playerHand.push(displayCard)
  //   })
  //   setCards(playerHand)
  // }


  // let displayCards = [] 
  // {
  //   hand: [],
  // };
  // Object.keys(locations).map((location,index)=>{
  //   // console.log
  //   displayCards[locations[location].name]=[]
  // })

  // cards.forEach((card) => {
  //   // console.log('card forweach'+JSON.stringify(card))
  //   displayCards.push(
  //     <PlayingCard draggable={card.draggable} onDragStart={onDragStart} card={card} />,
  //   );
  // });

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
          <Button onClick={startGame} variant="contained" color="secondary">
            Start Game
          </Button>
        </div>
        : 
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
        }
    </div>
  );
};

export default App;
