import React, {useState} from 'react';
import './App.css'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';

const PlayerDataForm = (props) => {
  
  const [players, setPlayers] = useState(2);
  const [playerCharacters, setCharacter] = useState(["Jonah","Esther"])

  const handleChange = (event) => {
    setPlayers(event.target.value);
  };

  const characterChange = (index, event) => {
    let newCharacters = [...playerCharacters]
    newCharacters[index] = event.target.value
    setCharacter(newCharacters)
  }

  let playerForm = []
  for(let x = 0; x < players; x++){
    let bgColor = props.playerBGs[x]
    playerForm.push(
      <div style={{backgroundColor: bgColor, margin:10}} >
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
          <MenuItem value={"Paul"}>Paul</MenuItem>
          <MenuItem value={"Joshua"}>Joshua</MenuItem>
        </Select>
      </div>
      )
  }
  const startGame = async() =>{
    try{

      let query = `query Game($playerCharacters: [String]) {
        game(players: $playerCharacters)
      }`;
      let res = await fetch('http://localhost:4000/graphql', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body:JSON.stringify({
          query,
          variables: {playerCharacters}
        })
      })

      let response = await res.json()
      console.log('response to newgame:'+JSON.stringify(response))
      props.startGame(response.data.game)
    }catch(e){
      console.log(e)
    }
  }


  return (
    <div>
      <FormControl className="formControl">
        <InputLabel id="player-count">Players</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={players}
          onChange={handleChange}
        >
          <MenuItem value={2}>Two</MenuItem>
          <MenuItem value={3}>Three</MenuItem>
          <MenuItem value={4}>Four</MenuItem>
        </Select>
        {playerForm}
      </FormControl>
      
          <Button onClick={startGame} variant="contained" color="secondary">
            Start Game
          </Button>
    </div>
  );
}
export default PlayerDataForm;