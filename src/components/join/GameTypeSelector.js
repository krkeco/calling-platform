import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import './../../App.css';
import { URL, playerTypeEnum } from '../../constants';

const GameTypeSelector = ({
  playerType,
  gameplayType,
  setGameplayType,
  setType,
  handleChange,
  gameId,
  joinGameId,
  setJoinId,
  players,
  setPlayers,
  setScrap,
  scrap,
  bane,
  setBane,
  refresh,
  setRefresh,
  setBlinds,
  doubleBlind
}) => {
  let scrapForm =  <FormControl style={{width:150}}>
        <InputLabel id="scrap-label">Scrapping</InputLabel>
        <Select
          disabled={gameId > -1 ? true : false}
          labelId="scrap-label"
          id="scrap-select"
          value={scrap}
          onChange={(e) => {
            setScrap(e.target.value);
          }}
          className="dropdownBox"
        >
          <MenuItem value={true}>Scrapping</MenuItem>
          <MenuItem value={false}>No Scrapping</MenuItem>
        </Select>
        
        </FormControl>

  let refreshMarketForm = <FormControl style={{width:150}}>
      <InputLabel id="refresh-label">Refresh</InputLabel>
        <Select
          disabled={gameId > -1 ? true : false}
          labelId="refresh-label"
          value={refresh}
          onChange={(e) => {
            setRefresh(e.target.value);
          }}
          className="dropdownBox"
        >
          <MenuItem value={true}>Market Refresh</MenuItem>
          <MenuItem value={false}>No Market Refresh</MenuItem>
        </Select>
        </FormControl>        

        let doubleBlindForm =  <FormControl style={{width:150}}>
      <InputLabel id="refresh-label">DoubleBlind</InputLabel>
        <Select
          disabled={gameId > -1 ? true : false}
          labelId="refresh-label"
          value={doubleBlind}
          onChange={(e) => {
            setBlinds(e.target.value);
          }}
          className="dropdownBox"
        >
          <MenuItem value={false}>OpenHand</MenuItem>
          <MenuItem value={true}>DoubleBlind</MenuItem>
        </Select>
        </FormControl> 

    let baneForm = <FormControl style={{width:150}}>
          <InputLabel id="bane-label">Banes</InputLabel>
            <Select
              disabled={gameId > -1 ? true : false}
              labelId="refresh-label"
              value={bane}
              onChange={(e) => {
                setBane(e.target.value);
              }}
              className="dropdownBox"
            >
              <MenuItem value={true}>Banes!</MenuItem>
              <MenuItem value={false}>No Banes</MenuItem>
        </Select>
        </FormControl>

        let gamePlayForm = <FormControl style={{width:150}}>
          <InputLabel id="bane-label">PVP/CoOp</InputLabel>
            <Select
              disabled={gameId > -1 ? true : false}
              labelId="refresh-label"
              value={gameplayType}
              onChange={(e) => {
                setGameplayType(e.target.value);
              }}
              className="dropdownBox"
            >
              <MenuItem value={'all'}>PVP!</MenuItem>
              <MenuItem value={'coop'}>Co-operative!</MenuItem>
        </Select>
        </FormControl>


  let gameTypeSelector = (
    <div className="formControl">
      <InputLabel id="player-type-label">Browser Type</InputLabel>
      <Select
        disabled={gameId > -1 ? true : false}
        labelId="player-type-label"
        id="player-type"
        value={playerType}
        onChange={(e) => {
          setType(e.target.value);
            handleChange(1);
          
        }}
        className="dropdownBox"
      >
        <MenuItem value={playerTypeEnum.HOST}>Host Local Game</MenuItem>
        <MenuItem value={playerTypeEnum.LAN}>Host Net Game</MenuItem>
        <MenuItem value={playerTypeEnum.GUEST}>Join Net Game</MenuItem>
        <MenuItem value={playerTypeEnum.SPEC}>Spectate Net Game</MenuItem>
      </Select>      

{playerTypeEnum.GUEST != playerType && playerType != playerTypeEnum.SPEC ? (
      <div className="flexCol">
      <div className="flexRow" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',width:500 }}>
      <PlayerCountToggle
          gameId={gameId}
          players={players}
          handleChange={handleChange}
        />     
      {gamePlayForm}
      {scrapForm}
      </div>
      {gameplayType == 'all' ? <div className="flexRow" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',width:500 }}>
      {refreshMarketForm}
      {doubleBlindForm}
      {baneForm}
        </div> : <></>}
     
      </div>
      ):(<span/>)}

      {playerType == playerTypeEnum.GUEST || playerType == playerTypeEnum.SPEC  ? (
        <TextField
          disabled={gameId > -1 ? true : false}
          id="game-number"
          className="dropdownBox"
          value={joinGameId}
          onChange={(e) => setJoinId(e.target.value)}
          label="GameId:"
        />
      ) : (
        <div />
      )}
      {playerType != playerTypeEnum.HOST && playerType != playerTypeEnum.SPEC && players != 1 ? (
        setPlayers(1)
      ) : (
        <div />
      )}
    </div>
  );
  return gameTypeSelector;
};



const PlayerCountToggle = ({ players, gameId, handleChange }) => {
  let playerCountToggle = (
    <FormControl className="formControl" style={{width:150}}>
      <InputLabel id="player-count-label">Local Players</InputLabel>
      <Select
        disabled={gameId > -1 ? true : false}
        className="dropdownBox"
        labelId="player-count-label"
        id="player-count"
        value={players}
        onChange={(e) => handleChange(e.target.value)}
      >
        <MenuItem value={1}>One</MenuItem>
        <MenuItem value={2}>Two</MenuItem>
        <MenuItem value={3}>Three</MenuItem>
        <MenuItem value={4}>Four</MenuItem>
        <MenuItem value={5}>Five</MenuItem>
        <MenuItem value={6}>Six</MenuItem>
      </Select>
    </FormControl>
  );
  return playerCountToggle;
};


export default GameTypeSelector;
