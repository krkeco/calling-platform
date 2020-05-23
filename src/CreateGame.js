import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { URL, playerTypeEnum } from './constants';
import packageJson from '../package.json';

import './App.css';
import PlayerForm from './components/join/PlayerForm';
import GameTypeSelector from './components/join/GameTypeSelector';

const dev =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'dev'
    : 'prod';

const PlayerDataForm = (props) => {
  const [players, setPlayers] = useState(2);
  const [localPlayers, setLocalPlayers] = useState(2);
  const [gameId, setGameId] = useState(-1);
  const [playerType, setType] = useState(playerTypeEnum.HOST);
  const [playerCharacters, setCharacter] = useState(['Jonah', 'Esther']);
  const [playerCharacterType, setCharacterType] = useState(['player', 'AI']);
  const [waitingPlayers, setWaitRoom] = useState([]);

  const setGameType = (eNum) => {
    setType(eNum);
    if (eNum == playerTypeEnum.HOST) {
    } else {
      setCharacter([...playerCharacters[0]]);
      setCharacterType([...playerCharacterType[0]]);
      setLocalPlayers(1);
    }
  };

  const handleChange = (value) => {
    setPlayers(value);
    let newCharacters = [...playerCharacters];
    let reducedChars = newCharacters.slice(0, value);
    setCharacter([...reducedChars]);

    let newTypes = [...playerCharacterType];
    let reducedTypes = newTypes.slice(0, value);
    console.log('newchar:' + reducedTypes);
    setCharacterType([...reducedTypes]);
  };

  const characterChange = (index, event) => {
    let newCharacters = [...playerCharacters];
    newCharacters[index] = event.target.value;
    setCharacter(newCharacters);
  };
  const characterTypeChange = (index, event) => {
    let newCharacters = [...playerCharacterType];
    newCharacters[index] = event.target.value;
    setCharacterType(newCharacters);
  };

  const queryGameStatus = async (theTimeOut, theId, myIndex) => {
    try {
      let theGame = parseInt(theId);
      // let index = localPlayers
      console.log('index is ' + myIndex);
      let query = `query Game($theGame: Int) {
        waitingRoom(gameId: $theGame){room, started}
      }`;

      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { theGame },
        }),
      });

      let response = await res.json();
      console.log('response to gamestatus:' + JSON.stringify(response));
      // setGameId(response.data.newGame)
      // setWaitRoom([...playerCharacters])
      if (response.data.waitingRoom.started) {
        console.log('starting game' + theId);
        props.startGame(theId, myIndex);
      } else {
        setWaitRoom([...response.data.waitingRoom.room]);
        setTimeout(() => {
          queryGameStatus(theTimeOut, theId, myIndex);
        }, theTimeOut);
      }
    } catch (e) {
      console.log(e);
      // setTimeout(()=>queryGameStatus(), timeout)
    }
  };

  const createGame = async () => {
    try {
      let query = `query NewGame($playerCharacters: [String], $playerCharacterType: [String]) {
        newGame(players: $playerCharacters, types: $playerCharacterType)
      }`;

      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerCharacters, playerCharacterType },
        }),
      });

      let response = await res.json();
      console.log('response to newgame:' + JSON.stringify(response));
      let id = response.data.newGame;
      setGameId(id);
      setWaitRoom([...playerCharacters]);
      console.log('setting local player to ' + playerCharacters.length);
      let count = -1;
      if (playerType == playerTypeEnum.LAN) {
        count = 0;
      }
      // props.startGame(response.data.game)
      queryGameStatus(2000, id, count);
    } catch (e) {
      console.log(e);
    }
  };
  const startGame = async () => {
    try {
      let theGame = parseInt(gameId);

      let query = `query StartGame($theGame: Int!) {
        startGame(gameId: $theGame)
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { theGame },
        }),
      });

      let response = await res.json();
      console.log('response to newgame:' + JSON.stringify(response));
      // setGameId(response.data.newGame)
      // props.startGame(response.data.startGame, localPlayers)
    } catch (e) {
      console.log(e);
    }
  };
  const joinGame = async () => {
    try {
      let theGame = parseInt(gameId);
      let query = `query JoinGame($playerCharacters: [String],$playerCharacterType: [String], $theGame: Int) {
        joinGame(players: $playerCharacters,types: $playerCharacterType, gameId: $theGame)
      }`;
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { theGame, playerCharacters, playerCharacterType },
        }),
      });

      let response = await res.json();
      let count = response.data.joinGame.length - 1;
      console.log('my index should be ' + count);
      setLocalPlayers(count);

      setWaitRoom([...response.data.joinGame]);
      console.log('response to newgame:' + JSON.stringify(response));
      // props.startGame(response.data.game)
      queryGameStatus(5000, theGame, count);
    } catch (e) {
      console.log(e);
    }
  };

  let joinButton = (
    <Button
      style={{ margin: 5 }}
      onClick={createGame}
      variant="contained"
      color="secondary"
    >
      Create Game
    </Button>
  );

  if (playerType == playerTypeEnum.GUEST) {
    joinButton = (
      <Button
        style={{ margin: 5 }}
        onClick={joinGame}
        variant="contained"
        color="secondary"
      >
        Join Game
      </Button>
    );
  }

  return (
    <div className="flexCol center ">
      <div>
        {' '}
        The Calling Online Deck Building Game {dev}:{packageJson.version}
      </div>
      <GameTypeSelector
        playerType={playerType}
        handleChange={handleChange}
        gameId={gameId}
        setType={setGameType}
        setGameId={setGameId}
        players={players}
        setPlayers={setPlayers}
      />

      <div className="flexRow center scroll">
        <PlayerForm
          playerType={playerType}
          players={players}
          props={props}
          playerCharacters={playerCharacters}
          characterChange={characterChange}
          playerCharacterType={playerCharacterType}
          characterTypeChange={characterTypeChange}
        />
      </div>

      <div className="flexCol" style={{ width: 200 }}>
        {joinButton}

        {(playerType == playerTypeEnum.HOST ||
          playerType == playerTypeEnum.LAN) &&
        gameId >= 0 ? (
          <Button
            style={{ margin: 5 }}
            onClick={startGame}
            variant="contained"
            color="secondary"
          >
            Start Game {gameId}
          </Button>
        ) : (
          <div />
        )}
      </div>
      <div>
        players in game:{' '}
        {waitingPlayers.map((player, ind) => {
          return <div style={{ color: props.playerBGs[ind] }}>{player}</div>;
        })}{' '}
      </div>
      <div>players on this local: {localPlayers}</div>
    </div>
  );
};

export default PlayerDataForm;
