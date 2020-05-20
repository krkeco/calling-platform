import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { URL, playerTypeEnum } from '../../constants';

import esther from './../../imgs/esther/esther.png';
import paul from './../../imgs/jonah/jonah.png';
import jonah from './../../imgs/jonah/jonah.png';
import joshua from './../../imgs/joshua/joshua.png';

const cardImg = {
  Jonah: jonah,
  Esther: esther,
  Joshua: joshua,
  Paul: paul,
};
const PlayerForm = ({
  playerType,
  players,
  props,
  playerCharacters,
  characterChange,
  playerCharacterType,
  characterTypeChange,
}) => {
  let playerForm = [];

  for (let x = 0; x < players; x++) {
    let bgColor = props.playerBGs[x];
    playerForm.push(
      <div
        className="flexCol center userFormContainer"
        style={{
          backgroundColor: bgColor,
        }}
      >
        <div>Player {x + 1}:</div>
        <InputLabel id="player-count">Players</InputLabel>
        <Select
          labelId="story-select"
          id="story-select"
          value={playerCharacters[x]}
          onChange={(e) => characterChange(x, e)}
        >
          <MenuItem value={'Jonah'}>Jonah</MenuItem>
          <MenuItem value={'Esther'}>Esther</MenuItem>
          <MenuItem value={'Joshua'}>Joshua</MenuItem>
          <MenuItem value={'Paul'}>Paul</MenuItem>
          {/**
           **/}
        </Select>

        <img
          draggable={false}
          className="starterImg"
          src={cardImg[playerCharacters[x]]}
        />
        <Select
          labelId="story-select"
          id="story-select"
          value={playerCharacterType[x]}
          onChange={(e) => characterTypeChange(x, e)}
        >
          <MenuItem value={'player'}>Human</MenuItem>
          { playerTypeEnum.HOST == playerType ? (<MenuItem value={'AI'}>AI</MenuItem>) : (null)}
          {/**
           **/}
        </Select>
      </div>,
    );
  }
  return playerForm;
};

export default PlayerForm;
