import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';

import { Button } from '@material-ui/core';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(-1);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['red','blue','green','yellow'])
  const [cards, setCards] = useState([]);

  // useEffect(() => {
  // });

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
      console.log('getting game' + id + ':' + response.locations);
      let locationInfo = response.locations;
      console.log(response);
      setLocationInfo(locationInfo);
      setPlayerInfo(response.players)
      
    } catch (e) {
      console.log('error getting game:' + e);
    }
  };

  const onDragStart = (event, cardId) => {
    let triggerCard = cards.find((card) => card.id == cardId);
    // if (triggerCard.player == currentPlayer) {
      console.log('dragstart on div: ', cardId);
      // console.log('tx'+origin)
      // event.dataTransfer.setData('origin', origin);
      event.dataTransfer.setData('cardId', cardId);
    // } else {
      // alert(`you can't play someone else's card!`)
      // console.log(`you can't play someone else's card!`);
    // }
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, loc) => {
    let cardId = event.dataTransfer.getData('cardId');
    let og = event.dataTransfer.getData('origin');
    console.log('drop from' + og);
    console.log('drop on' + loc);
    // let oldLocation, oldCard;
    let newCards = cards.map((card) => {

      if (card.id == cardId && card.player == currentPlayer) {

        let newLocations = [...locations]
        card.location = loc;
        card.draggable = false;
        let local = newLocations.find((el)=>el.name ==loc)
        if(local && local.name != "hand"){
          local.currentGold += card.gold;
          local.currentInfluence += card.influence;
          setLocationInfo([...newLocations])
        }
      }
      return card;
    });
    // console.log('is this:'+oldLocation)


    setCards(newCards);

  };
  const buyCard = async (index, location) => {
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
  // return response.json(); // parses JSON response into native JavaScript objects
  }

  const nextPlayer = async () => {
    console.log(players[currentPlayer].name +'is current turn')
    console.log(players[currentPlayer].hand)
    // setCards(players[currentPlayer].hand)
    // setCurrentPlayer()
    let newPlayer = currentPlayer+1;
    if(newPlayer >= players.length){
      newPlayer = 0;
    }
    let playerHand = []
    cards.map((oldcard,index)=>{
      if (oldcard.location != "hand"){
        playerHand.push(oldcard)
      }
    })
    players[newPlayer].hand.map((card,index)=>{
      let displayCard = {...card}
      displayCard.player = newPlayer
      displayCard.id = index
      displayCard.draggable= true
      displayCard.location = "hand"
      displayCard.backgroundColor = playerBGs[newPlayer]
      playerHand.push(displayCard)
    })
    setCards(playerHand)
    setCurrentPlayer(newPlayer)
    // {player: "2",id: "1", influence:0,gold:0, cardName:"Read book",location:"babylon", backgroundColor: "red"},
    
    
    // console.log(
    //   'submitting cards and getting next player: ' + JSON.stringify(cards),
    // );
    // let res = await fetch('http://localhost:8080/game/'+gameId+"/"+currentPlayer);
    // console.log(res)
  };


  let displayCards = {
    hand: [],
  };
  Object.keys(locations).map((location,index)=>{
    // console.log
    displayCards[locations[location].name]=[]
  })

  cards.forEach((card) => {
    // console.log('card forweach'+JSON.stringify(card))
    displayCards[card.location].push(
      <PlayingCard draggable={card.draggable} onDragStart={onDragStart} card={card} />,
    );
  });

  let locCards = [];
  if (locations) {
    locations.map((location, index) => {
      locCards.push(
        <Location
          buyCard={buyCard}
          location={location}
          name={location.name}
          cards={displayCards[location.name]}
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
        <Location
          name="hand"
          cards={displayCards["hand"]}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      <Button onClick={nextPlayer} variant="contained" color="secondary">
        Next Player
      </Button>
      </div>
        }
    </div>
  );
};

export default App;
