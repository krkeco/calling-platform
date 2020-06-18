import React, { useState } from 'react';
import PlayingCard from '../../PlayingCard';
import { IconButton, Button, Fab, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faSearchPlus,
  faSearchMinus,
  faRecycle,
} from '@fortawesome/free-solid-svg-icons';

const Battlefield = (props) => {
  const [zoom, setZoom] = useState('');
  const [zoomIcon, setIcon] = useState(
    zoom != 'zoom' ? faSearchPlus : faSearchMinus,
  );
  const checkZoom = (card, index) => {
    if (zoom == 'zoom') {
      setZoom('');
      setIcon(faSearchPlus);
    } else {
      setZoom('zoom');
      setIcon(faSearchMinus);
    }
  };
  // <Tooltip arrow  title="Zoom in">
  //   <Button style={{margin:5,width:50}} size="small" color="primary" variant="contained"   onClick={checkZoom}>
  //     <FontAwesomeIcon  icon={zoomIcon} />
  //   </Button>
  // </Tooltip>
  return (
    <div style={{ position: 'relative' }}>
      <span className="bfZoom">
        <Tooltip arrow title="Zoom in">
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={checkZoom}
          >
            <FontAwesomeIcon icon={zoomIcon} />
          </Button>
        </Tooltip>
      </span>
      {props.location.battlefield.length > 0 ? (
        props.location.battlefield.map((bf, index) => {
          let playerBF = props.location.battlefield[index];
          let bgColor = props.playerBGs[index];

          return playerBF ? (
            <div className="flexRow">
              <div className="flexRow bfPlayerInfo">
                <div className="flexCol">
                  <div>{playerBF.name}</div>

                  <Tooltip arrow title="Gold">
                    <div>$ {playerBF.gold}</div>
                  </Tooltip>
                  <Tooltip arrow title="Total Influence">
                    <div>
                      Inf:
                      {playerBF.influence + playerBF.poliBonus}
                    </div>
                  </Tooltip>
                </div>
                <div className="flexCol">
                  <div>.</div>
                  <Tooltip
                    arrow
                    title="Fear- this will reduce other player's influence"
                  >
                    <div>{playerBF.fear > 0 ? `F!:${playerBF.fear}` : ``}</div>
                  </Tooltip>

                  <Tooltip
                    arrow
                    title="Faith- this will replace influence if player has 0 influence"
                  >
                    <div>{playerBF.faith > 0 ? `F:${playerBF.faith}` : ``}</div>
                  </Tooltip>
                </div>
              </div>

              <div className="flexRow">
                {playerBF.cards.map((card, ind) => {
                  return (
                    <div className={zoom} style={{ margin: 3 }}>
                      <PlayingCard
                        size="small"
                        id={ind}
                        backgroundColor={bgColor}
                        draggable={false}
                        onDragStart={null}
                        card={card}
                        player={props.player}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null;
        })
      ) : (
        <div>
          <span style={{ padding: 0, margin: 0 }}> Battlefield:</span>
        </div>
      )}
    </div>
  );
};
export default Battlefield;
