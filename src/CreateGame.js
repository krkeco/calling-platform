import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { URL, playerTypeEnum } from './constants';
import packageJson from '../package.json';

import './App.css';
import PlayerForm from './components/join/PlayerForm';
import GameTypeSelector from './components/join/GameTypeSelector';
import ActionButton from './components/join/JoinButton';


const dev =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'dev' : 'v';

const PlayerDataForm = (props) => {
  const [awake, setWoke] = useState(false);

  const [scrap, setScrap] = useState(true);
  const [bane, setBane] = useState(true);
  const [gameplayType, setGameplayType] = useState('all');
  const [refresh, setRefresh] = useState(false);
  const [doubleBlind, setBlinds] = useState(false);

  const [players, setPlayers] = useState(2);
  const [localPlayers, setLocalPlayers] = useState(2);
  const [gameId, setGameId] = useState(-1);
  const [joinGameId, setJoinId] = useState('');
  const [playerType, setType] = useState(playerTypeEnum.HOST);
  const [playerCharacters, setCharacter] = useState(['Jonah', 'Esther']);
  const [playerCharacterType, setCharacterType] = useState(['player', 'AI']);
  const [waitingPlayers, setWaitRoom] = useState([]);
  const [stories, setStories] = useState(null);

  const wakeServer = async () => {
    console.log('waking server')
    if (!awake) {
      try {
        let query = `query {
            wakeup {
              name,
              info
              infoDeck{chrono,name,quote, cost, gold, influence, abilities, politics, fear, faith, provision, img},
              character{name,quote, cost, gold, influence, abilities, politics, fear, faith, provision, img},
            }
          }`;

        let res = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query,
          }),
        });

        let response = await res.json();
        console.log('response to gamestatus:' + JSON.stringify(response));
        if (response.data.wakeup != null) {
          setWoke(true);
          setStories(response.data.wakeup);
          // console.log(awake.toString())
        }
      } catch (e) {
        console.log('wake server e:'+e);
        setTimeout(()=>wakeServer(),5000);
      }
    }
  };
  
  useEffect(() => {
    wakeServer();
  })

  const setGameType = (eNum) => {
    setType(eNum);
    if (eNum == playerTypeEnum.HOST) {
    } else if (eNum == playerTypeEnum.SPEC){
      console.log('setting type to nothing')
      setCharacter([]);
      setCharacterType([]);
      setLocalPlayers(0);
      setPlayers(0);
    } else {
      setCharacter([...playerCharacters[0]]);
      setCharacterType([...playerCharacterType[0]]);
      setLocalPlayers(1);
    }
  };

  const handleChange = (value) => {
    if(value == 0){
      // setPlayers(value);
      // let newCharacters = [];
      // let reducedChars = newCharacters.slice(0, value);
      // setCharacter([]);

      // let newTypes = [...playerCharacterType];
      // let reducedTypes = newTypes.slice(0, value);
      // console.log('newchar:' + reducedTypes);
      // setCharacterType([]);
    }else{
      setPlayers(value);
      let newCharacters = [...playerCharacters];
      let reducedChars = newCharacters.slice(0, value);
      setCharacter([...reducedChars]);

      let newTypes = [...playerCharacterType];
      let reducedTypes = newTypes.slice(0, value);
      console.log('newchar:' + reducedTypes);
      setCharacterType([...reducedTypes]);
    }
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
        waitingRoom(gameId: $theGame){room, started, scrapCard, refreshMarket}
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
      // setScrap(response.data.waitingRoom.scrapCard)
      // setRefresh(response.data.waitingRoom.refreshMarket)
      // setGameId(response.data.newGame)
      // setWaitRoom([...playerCharacters])
      if (response.data.waitingRoom.started) {
        console.log('starting game' + theId);
        
        props.startGame(theId, myIndex, response.data.waitingRoom.scrapCard, response.data.waitingRoom.refreshMarket, false);
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
      let query = `query NewGame($playerCharacters: [String], $playerCharacterType: [String], $refresh: Boolean,$scrap: Boolean,$bane: Boolean, $gameplayType: String) {
        newGame(players: $playerCharacters, types: $playerCharacterType, refreshMarket: $refresh, scrapCard: $scrap, banes: $bane, gameType: $gameplayType)
      }`;

      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { playerCharacters, playerCharacterType, refresh, scrap, bane, gameplayType },
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

      // props.startGame(response.data.startGame, localPlayers)
    } catch (e) {
      console.log(e);
    }
  };

  const spectateGame = async () => {
    try {
      let playType = [];
      let playChar = [];
      let theGame = parseInt(joinGameId);
      let query = `query JoinGame($playChar: [String],$playType: [String], $theGame: Int) {
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
          variables: { theGame, playChar, playType },
        }),
      });

      let response = await res.json();
      let specId = 5;
      if(props.useCookie['tcoGameCookie'] == theGame){
        specId = props.useCookie['tcoPlayerCookie'];
      }
      // let count = response.data.joinGame.length - 1;
      setGameId(theGame);
      // console.log('my index should be ' + count);
      // setLocalPlayers(count);
      // setWaitRoom([...response.data.joinGame]);
      console.log('response to newgame:' + JSON.stringify(response));
      // props.startGame(response.data.game)
      queryGameStatus(5000, theGame, specId);
    } catch (e) {
      console.log(e);
    }
  };
  const joinGame = async () => {
    try {
      let theGame = parseInt(joinGameId);
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
      setGameId(theGame);
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
  let actionButton = <div className="dot-pulse" />;
  if (awake) {
    actionButton = (
      <div>
        {' '}
        <div className="flexCol" style={{ width: 200 }}>
          <ActionButton
            gameId={gameId}
            startGame={startGame}
            awake={awake}
            joinGame={joinGame}
            spectateGame={spectateGame}
            playerType={playerType}
            createGame={createGame}
          />
        </div>
        {waitingPlayers.length > 0 ? (
          <div className="flexCol center">
            players in game:
            {waitingPlayers.map((player, ind) => {
              return (
                <div style={{ color: props.playerBGs[ind] }}>{player}</div>
              );
            })}
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }

  return (
    <div className="flexCol center ">
      <div>
        {' '}
        The Calling Online Deck Building Game {dev}
        {packageJson.version}
      </div>

      {props.gameLog.length > 1 ? (<div id="gamelog" className="flexCol postGamelog">
                    GAME LOG:
                    {props.gameLog.map((log, ind) => {
                      return <div className="logText">{log}</div>;
                    })}
                  </div>):(<span/>)}
      <GameTypeSelector
        gameplayType={gameplayType}
        setGameplayType={setGameplayType}
        doubleBlind={doubleBlind}
        setBlinds={setBlinds}
        setScrap={setScrap}
        scrap={scrap}
        setBane={setBane}
        bane={bane}
        setRefresh={setRefresh}
        refresh={refresh}
        playerType={playerType}
        handleChange={handleChange}
        gameId={gameId}
        joinGameId={joinGameId}
        setType={setGameType}
        setJoinId={setJoinId}
        players={players}
        setPlayers={setPlayers}
      />

      {actionButton}

      <PlayerForm
        stories={stories}
        gameId={gameId}
        playerType={playerType}
        players={players}
        props={props}
        playerCharacters={playerCharacters}
        characterChange={characterChange}
        playerCharacterType={playerCharacterType}
        characterTypeChange={characterTypeChange}
      />
    </div>
  );
};

export default PlayerDataForm;
