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
  setGameId,
  players,
  setPlayers,
}) => {
  let gameTypeSelector = (
    <FormControl className="formControl">
      <InputLabel id="player-type-label">Player Type</InputLabel>
      <Select
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
          id="game-number"
          className="dropdownBox"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          label="GameId:"
        />
      ) : playerType == playerTypeEnum.HOST ? (
        <PlayerCountToggle players={players} handleChange={handleChange} />
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

const PlayerCountToggle = ({ players, handleChange }) => {
  let playerCountToggle = (
    <FormControl className="formControl">
      <InputLabel id="player-count-label">Players</InputLabel>
      <Select
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
