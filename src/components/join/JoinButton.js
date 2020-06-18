import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { URL, playerTypeEnum } from '../../constants';
import loader from '../../imgs/loading.gif';

const JoinButton = ({
  awake,
  createGame,
  playerType,
  joinGame,
  startGame,
  gameId,
}) => {
  // if (!awake) {
  //   return <img src={loader} alt="loading..." />
  // }
  // <div className="loader"> </div>;

  if (playerType == playerTypeEnum.GUEST) {
    return (
      <Button
        disabled={gameId > -1 ? true : false}
        style={{ margin: 5 }}
        onClick={joinGame}
        variant="contained"
        color="secondary"
      >
        Join Game
      </Button>
    );
  }

  if (
    (playerType == playerTypeEnum.HOST || playerType == playerTypeEnum.LAN) &&
    gameId >= 0
  ) {
    return (
      <Button
        style={{ margin: 5 }}
        onClick={startGame}
        variant="contained"
        color="primary"
      >
        Start Game {gameId}
      </Button>
    );
  }

  return (
    <Button
      style={{ margin: 5 }}
      onClick={createGame}
      variant="contained"
      color="secondary"
    >
      Create Game
    </Button>
  );
};

export default JoinButton;
