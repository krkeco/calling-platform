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
  setType,
  handleChange,
  gameId,
  joinGameId,
  setJoinId,
  players,
  setPlayers,
}) => {
  let gameTypeSelector = (
    <FormControl className="formControl">
      <InputLabel id="player-type-label">Game Type</InputLabel>
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
      </Select>

      {playerType == playerTypeEnum.GUEST ? (
        <TextField
          disabled={gameId > -1 ? true : false}
          id="game-number"
          className="dropdownBox"
          value={joinGameId}
          onChange={(e) => setJoinId(e.target.value)}
          label="GameId:"
        />
      ) : playerType == playerTypeEnum.HOST ? (
        <PlayerCountToggle gameId={gameId} players={players} handleChange={handleChange} />
      ) : (
        <div />
      )}
      {(playerType == playerTypeEnum.GUEST ||
        playerType == playerTypeEnum.LAN) &&
      players > 1 ? (
        setPlayers(1)
      ) : (
        <div />
      )}
    </FormControl>
  );
  return gameTypeSelector;
};

const PlayerCountToggle = ({ players,gameId, handleChange }) => {
  let playerCountToggle = (
    <FormControl className="formControl">
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
      </Select>
    </FormControl>
  );
  return playerCountToggle;
};
export default GameTypeSelector;
