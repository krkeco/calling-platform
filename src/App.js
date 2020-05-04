import React, { useEffect, useState, Component } from 'react';
import './App.css';

import Location from './Location';
import PlayingCard from './PlayingCard';
import {HAND,URL} from './constants.js'
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
  const [gameLog, appendLog] = useState([])
  const [playerIndex, setPlayerIndex] = useState(-1)

  const onDragStart = (event, cardId) => {
    if(currentPlayer == playerIndex-1 || playerIndex == -1){
      let triggerCard = cards.find((card) => card.id == cardId);
      console.log('dragstart on div: ', cardId);
      event.dataTransfer.setData('cardId', cardId);
    }else{
      alert("You can't playe someone else's cards!"+currentPlayer+"/"+playerIndex)
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

  const startGame = async(result, playerIndex) =>{
    // console.log('getting game '+result)
    setId(result);
    getGame(result, true);
    setPlayerIndex(playerIndex);
  }


  //async await
  const getGame = async (id, repeat=false) => {
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
            name, influence,influencer, weariness,
            market{cost,draw, gold, influence, name},
            battlefield{name,influence, gold, cards{name,draw, influence, gold}}
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
      
      setLocationInfo(response.data.locations);
      
      setPlayerInfo(response.data.players);

      if(turn == 0 && !repeat){
        setTurn(1)
        let log = "Starting first Turn: 1"
        let log2 = response.data.players[currentPlayer].name + " is now First Player"
        appendLog([...gameLog,log,log2])
      }
      // if(repeat){
      //   setTimeout(async()=>getGame(id, repeat),1000)
      // }
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
            name, influence,influencer,weariness,
            market{cost, gold, influence, name},
            battlefield{name,influence, gold, cards{name,draw, influence, gold}}
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
        appendLog([])
      
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

  let scrapPile =  <div
              className="scrapPile flexCol center"
              onDrop={(event) => onDrop(event, 'mill')}
              onDragOver={(event) => onDragOver(event)}>
            Scrap Pile
            </div> 
  

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

let view = <PlayerDataForm playerBGs={playerBGs} startGame={startGame}/>
if(gameId > -1){
  view = <div>
      <div className="flexRow spaceAround padded">
        {locCards}
      </div>
      <div className="flexRow spaceBetween" style={{width:'100%'}} >

    <div className="flexCol" style={{width:250}}>
        <div className="flexCol gamelog" >
        GAME LOG:
          {gameLog.map((log, ind)=>{
            return (<div>
            {log}
            </div>)
          })}
        </div>
      </div>
      <div className="flexCol">
        <div>Current Turn: {turn}; You are Player {playerIndex}</div>
        <div className="title">CurrentPlayer: {playerIndex} { players && players[currentPlayer] ? players[currentPlayer].name : ''}</div>
      <div className="flexRow center">
        {players[currentPlayer] ? players[currentPlayer].hand.map((card, index)=>{return(
            <div
              key={index}
              onDragStart={(event) => onDragStart(event, index)}
              draggable
              style={{margin:5, backgroundColor: `${playerBGs[currentPlayer]}`, opacity: 1, borderRadius: 5 }}
            >
          <PlayingCard id={index}
          card={card}
          backgroundColor = {playerBGs[currentPlayer]}
          player={currentPlayer}
           /></div>)}) : <span/>}
      </div>
      </div>
<div className="flexCol" style={{width:250}}>
      {scrapPile}
    {currentPlayer == (playerIndex-1) || playerIndex == -1 ? 
      <Button style={{width:150, height:75}} onClick={nextPlayer} variant="contained" color="secondary">
        Next Player
      </Button>
      :
      <div/>
    }

      </div>
      </div>

    </div>
}

  return (
    <div className="flexCol">

      {view}

    </div>
  );
};

export default App;
