import React, {useState} from 'react';
import './App.css'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import {URL, playerTypeEnum} from './constants'

import packageJson from '../package.json';

const PlayerDataForm = (props) => {
  
  const [players, setPlayers] = useState(2);
  const [localPlayers, setLocalPlayers] = useState(2);
  const [gameId, setGameId] = useState(-1);
  const [playerType, setType] = useState(playerTypeEnum.HOST);
  const [playerCharacters, setCharacter] = useState(["Jonah","Esther"])
  const [playerCharacterType, setCharacterType] = useState(["player","AI"])
  const [waitingPlayers, setWaitRoom] = useState([])

  const handleChange = (event) => {
    setPlayers(event.target.value);
  };

  const characterChange = (index, event) => {
    let newCharacters = [...playerCharacters]
    newCharacters[index] = event.target.value
    setCharacter(newCharacters)
  }
  const characterTypeChange = (index, event)=>{
   let newCharacters = [...playerCharacterType]
    newCharacters[index] = event.target.value
    setCharacterType(newCharacters)

  }

  let playerForm = []
  for(let x = 0; x < players; x++){
    let bgColor = props.playerBGs[x]
    playerForm.push(
      <div className="flexCol center" style={{backgroundColor: bgColor, margin:10, width:100, height:100, borderRadius:5}} >
      <div >Player {(x+1)}:</div>
        <InputLabel id="player-count">Players</InputLabel>
        <Select 
          labelId="story-select"
          id="story-select"
          value={playerCharacters[x]}
          onChange={(e)=>characterChange(x,e)}
        >
          <MenuItem value={"Jonah"}>Jonah</MenuItem>
          <MenuItem value={"Esther"}>Esther</MenuItem>
          <MenuItem value={"Joshua"}>Joshua</MenuItem> 
          <MenuItem value={"Paul"}>Paul</MenuItem>
         {/**
        **/}
        </Select>
        <Select 
          labelId="story-select"
          id="story-select"
          value={playerCharacterType[x]}
          onChange={(e)=>characterTypeChange(x,e)}
        >
          <MenuItem value={"player"}>Human</MenuItem>
          <MenuItem value={"AI"}>AI</MenuItem>
         {/**
        **/}
        </Select>
      </div>
      )
  }

  const queryGameStatus = async(theTimeOut, theId, myIndex) => {
    try{
      let theGame = parseInt(theId)
      // let index = localPlayers
      console.log('index is '+myIndex)
      let query = `query Game($theGame: Int) {
        waitingRoom(gameId: $theGame){room, started}
      }`;

      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {theGame}
        })
      })

      let response = await res.json()
      console.log('response to gamestatus:'+JSON.stringify(response))
      // setGameId(response.data.newGame)
      // setWaitRoom([...playerCharacters])
      if(response.data.waitingRoom.started){
        console.log('starting game' +theId)
        props.startGame(theId,myIndex)

      }else{
        setWaitRoom([...response.data.waitingRoom.room])
        setTimeout(()=>{queryGameStatus(theTimeOut, theId, myIndex)}, theTimeOut)
      }

    }catch(e){
      console.log(e)
      // setTimeout(()=>queryGameStatus(), timeout)
    }
  }

  const createGame = async() =>{
    try{

      let query = `query NewGame($playerCharacters: [String], $playerCharacterType: [String]) {
        newGame(players: $playerCharacters, types: $playerCharacterType)
      }`;

      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {playerCharacters, playerCharacterType}
        })
      })

      let response = await res.json()
      console.log('response to newgame:'+JSON.stringify(response))
      let id = response.data.newGame
      setGameId(id)
      setWaitRoom([...playerCharacters])
      console.log('setting local player to '+playerCharacters.length)
      let count = -1
      if(playerType == playerTypeEnum.LAN){
        count  = 0
      }
      // props.startGame(response.data.game)
      queryGameStatus(2000,id, count)

    }catch(e){
      console.log(e)
    }
  }
  const startGame = async() =>{
    try{
      let theGame = parseInt(gameId);

      let query = `query StartGame($theGame: Int!) {
        startGame(gameId: $theGame)
      }`;
      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {theGame}
        })
      })

      let response = await res.json()
      console.log('response to newgame:'+JSON.stringify(response))
      // setGameId(response.data.newGame)
      // props.startGame(response.data.startGame, localPlayers)
    }catch(e){
      console.log(e)
    }
  }
  const joinGame = async() =>{

    try{
      let theGame = parseInt(gameId)
      let query = `query JoinGame($playerCharacters: [String], $theGame: Int) {
        joinGame(players: $playerCharacters, gameId: $theGame)
      }`;
      let res = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {theGame, playerCharacters}
        })
      })

      let response = await res.json()
      let count = response.data.joinGame.length-1
      console.log('my index should be '+count)
      setLocalPlayers(count)

      setWaitRoom([...response.data.joinGame])
      console.log('response to newgame:'+JSON.stringify(response))
      // props.startGame(response.data.game)
      queryGameStatus(5000, theGame, count)
    }catch(e){
      console.log(e)
    }
    
  }

  const playerCountToggle =  <FormControl className="formControl">
        <InputLabel id="player-count-label">Players</InputLabel>
        <Select
          className="dropdownBox"
          labelId="player-count-label"
          id="player-count"
          value={players}
          onChange={handleChange}
        >
          <MenuItem value={1}>One</MenuItem>
          <MenuItem value={2}>Two</MenuItem>
          <MenuItem value={3}>Three</MenuItem>
          <MenuItem value={4}>Four</MenuItem>
        </Select>
        
      </FormControl>

      let joinButton =   <Button 
          style={{margin:5}}
          onClick={createGame} 
          variant="contained" color="secondary">
            Create Game
          </Button>
        if(playerType == playerTypeEnum.GUEST){
          joinButton =   <Button 
          style={{margin:5}}
          onClick={joinGame} 
          variant="contained" color="secondary">
            Join Game
          </Button>
        }
  let dev;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    dev = 'dev'
  } else {
    dev = 'prod'
  }

  return (
    <div className="flexCol center" >
    <div> The Calling Online Deck Building Game {dev}:{packageJson.version}</div>
      <FormControl className="formControl">
        <InputLabel id="player-type-label">Player Type</InputLabel>        
        <Select
          labelId="player-type-label"
          id="player-type"
          value={playerType}
          onChange={(e)=>setType(e.target.value)}
          className="dropdownBox"
        >
          <MenuItem value={playerTypeEnum.HOST}>Host Local Game</MenuItem>
          <MenuItem value={playerTypeEnum.LAN}>Host Net Game</MenuItem>
          <MenuItem value={playerTypeEnum.GUEST}>Join Net Game</MenuItem>
        </Select>
        
        {playerType == playerTypeEnum.GUEST ? <TextField id="game-number" className="dropdownBox" value={gameId} onChange={(e)=>setGameId(e.target.value)} label="GameId:" /> 
        : playerType == playerTypeEnum.HOST ? <div>{playerCountToggle}</div> : <div/>}
      {(playerType == playerTypeEnum.GUEST || playerType == playerTypeEnum.LAN) && players > 1 ? setPlayers(1) : <div/>}
        
      </FormControl>
      
      <div className="flexRow"> {playerForm}</div>
      <div className="flexCol" style={{width:200}} >
        {joinButton}

          {(playerType == playerTypeEnum.HOST || playerType == playerTypeEnum.LAN) && gameId >= 0 ?(
            <Button 
              style={{margin:5}}
              onClick={startGame} variant="contained" color="secondary">
            Start Game {gameId}
          </Button>):(<div/>)}
          </div>
          <div>players in game: {waitingPlayers.map((player,ind)=>{
            return <div style={{color: props.playerBGs[ind]}}>{player}</div>
          })} </div>
          <div>players on this local: {localPlayers}</div>
    </div>
  );
}
export default PlayerDataForm;