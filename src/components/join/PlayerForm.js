import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { URL, playerTypeEnum } from '../../constants';
import PlayingCard from '../../PlayingCard';
import esther from './../../imgs/esther/esther.jpg';
import paul from './../../imgs/paul/paul.jpg';
import jonah from './../../imgs/jonah/jonah.jpg';
import joshua from './../../imgs/joshua/joshua.jpg';

import { IconButton, Tooltip } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';


import babylon from '../../imgs/esther/babylon.jpg';
import jerusalem from '../../imgs/jerusalem.jpg';
import canaan from '../../imgs/sample/seaskull.jpg';
import nineveh from '../../imgs/jonah/nineveh.jpg';
import rome from '../../imgs/sample/fishflower.jpg';


const cardImg = {
  Jonah: jonah,
  Esther: esther,
  Joshua: joshua,
  Paul: paul,
  Babylon: babylon,
  Jerusalem: jerusalem,
  Canaan: canaan,
  Nineveh: nineveh,
  Rome: rome,
};
const storyKey = {
  Jonah: 'Nineveh',
  Esther: 'Babylon',
  Joshua: 'Canaan',
  Paul: 'Rome',
};
const PlayerForm = ({
  stories,
  playerType,
  players,
  props,
  gameId,
  playerCharacters,
  characterChange,
  playerCharacterType,
  characterTypeChange,
}) => {
  let playerForm = [];

  const [titleBar, setTitleBar] = useState('storyHidden');
  const [storyId, setStoryId] = useState(playerCharacters[0]);
  const [icon, setIcon] = useState(faQuestion);
  const toggleTitleBar = (id) => {
    if (titleBar == 'storyHidden') {
      setTitleBar('');
      setIcon(faTimes);
    } else {
      setTitleBar('storyHidden');
      setIcon(faQuestion);
    }
  };

  for (let x = 0; x < players; x++) {
    let bgColor = props.playerBGs[x];
    playerForm.push(
      <div
        className="flexCol center userFormContainer"
        style={{
          minWidth: 150,
          backgroundColor: bgColor,
        }}
      >
        <div>Player {x + 1}:</div>
        <InputLabel id="player-count">Players</InputLabel>
        <div className="flexRow">
          {x == 0 ? (
            <Tooltip arrow title="Character Info">
            <IconButton
              onClick={() => {
                toggleTitleBar(playerCharacters[x]);
                setStoryId(playerCharacters[x]);
              }}
            >
              <FontAwesomeIcon className="infoBtn" icon={icon} />
            </IconButton>
            </Tooltip>
          ) : (
            <span />
          )}
          <Select
            className="dropdownBox"
            disabled={gameId > -1 ? true : false}
            labelId="story-select"
            id="story-select"
            value={playerCharacters[x]}
            onChange={(e) => {
              characterChange(x, e);
            }}
          >
            <MenuItem value={'Jonah'}>Jonah</MenuItem>
            <MenuItem value={'Esther'}>Esther</MenuItem>
            <MenuItem value={'Joshua'}>Joshua</MenuItem>
            <MenuItem value={'Paul'}>Paul</MenuItem>
          </Select>
        </div>

        <img
          draggable={false}
          className="starterImg"
          src={cardImg[playerCharacters[x]]}
        />
        <Select
          className="dropdownBox"
          disabled={gameId > -1 ? true : false}
          labelId="story-select"
          id="story-select"
          value={playerCharacterType[x]}
          onChange={(e) => characterTypeChange(x, e)}
        >
          <MenuItem value={'player'}>Human</MenuItem>
          {playerTypeEnum.HOST == playerType ? (
            <MenuItem value={'AI'}>AI</MenuItem>
          ) : null}
          {/**
           **/}
        </Select>
      </div>,
    );
  }

  let storyInfo = <div className={titleBar}></div>;

  let story, storyDeck = null;
  
  if (stories != null && players > 0) {
    story = stories.find(a => a.name == storyKey[playerCharacters[0]])
    storyDeck = [...story.infoDeck]
    storyDeck.sort((a,b)=> {return a.chrono - b.chrono});
    storyInfo = (
      <div className={titleBar}>
        <div className="flexRow">
                <div className="storyActive storyMargin" >
                  Story Cards:
                  <div
                    className="flexCol"
                    style={{
                      alignItems: 'center',
                      overflow: 'scroll',
                      height: 350,
                    }}
                  >
                    <div className="zoom">
                      <PlayingCard
                        id={-1}
                        draggable={false}
                        onDragStart={null}
                        card={story.character}
                        player={-1}
                      />
                    </div>
                    {storyDeck.map((card, ind) => {
                      return (
                        <div className="zoom">
                          <PlayingCard
                            id={ind}
                            draggable={false}
                            onDragStart={null}
                            card={card}
                            player={-1}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="storyActive" >
                  {story.name}

                  <div style={{
                    alignItems: 'center',
                    overflow: 'scroll',
                    height: 350,
                  }}>
                  <img
                    draggable={false}
                    style={{width:'100%',height:'auto'}}
                    src={cardImg[story.name]}
                  />
                  {story.info.map((info, ind) => {
                    return <div style={{ margin: 5,marginBottom:15 }}>{info}</div>;
                  })}
                </div>
                </div>
              </div>
      </div>
    );
  }

  return (
    <div className="flexRow" style={{overflow:'scroll', width:'100%' }} >
      {storyInfo}
      <div className="flexRow storyMargin">
      {playerForm}
      </div>
    </div>
  );
};

export default PlayerForm;
