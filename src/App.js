import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';

import { Button } from '@material-ui/core';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameId, setId] = useState(0);
  const [locations, setLocationInfo] = useState([]);
  const [players, setPlayerInfo] = useState([]);
  const [playerBGs, setBGs] = useState(['red','blue','green','yellow'])
  const [cards, setCards] = useState([
    // {player: "2",id: "1", influence:0,gold:0, name:"Read book",location:"babylon", backgroundColor: "red"},
    // {player: "1",id: "2", influence:0,gold:0, name:"Pay bills", location:"hand", backgroundColor:"green"},
    // {player: "1",id: "3", influence:0,gold:0, name:"Go to the gym", location:"hand", backgroundColor:"blue"},
    // {player: "1",id: "5", influence:0,gold:0, name:"Go to the gym", location:"hand", backgroundColor:"blue"},
    // {player: "1",id: "4", influence:0,gold:0, name:"Play baseball", location:"hand", backgroundColor:"green"}
  ]);

  // useEffect(() => {
    // Update the document title using the browser API
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
    let playerId = cards.find((card) => card.id == cardId);
    if (playerId.player == currentPlayer) {
      console.log('dragstart on div: ', cardId);
      event.dataTransfer.setData('cardId', cardId);
    } else {
      // alert(`you can't play someone else's card!`)
      console.log(`you can't play someone else's card!`);
    }
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, loc) => {
    let cardId = event.dataTransfer.getData('cardId');
    console.log('drop on' + loc);
    let newCards = cards.filter((card) => {
      if (card.id == cardId) {
        card.location = loc;
        let newLocations = [...locations]
        let local = newLocations.find((el)=>el.name ==loc)
        local.currentGold += card.gold;
        local.currentInfluence += card.influence;
        setLocationInfo([...newLocations])
      }
      return card;
    });
    setCards(newCards);

  };

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
    console.log('card forweach'+JSON.stringify(card))
    displayCards[card.location].push(
      <PlayingCard draggable onDragStart={onDragStart} card={card} />,
    );
  });

  let locCards = [];
  if (locations) {
    locations.map((location, index) => {
      locCards.push(
        <Location
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
      <Button onClick={nextPlayer} variant="contained" color="secondary">
        Next Player
      </Button>
      </div>
      <div className="flexRow center">
        
        <Location
          name="hand"
          cards={displayCards["hand"]}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />

        <div className="flexCol">
          <Button onClick={startGame} variant="contained" color="secondary">
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
