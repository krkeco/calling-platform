import React, { useState } from 'react';
import PlayingCard from '../../PlayingCard';
import { IconButton, Button, Fab,Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faSearchPlus,faSearchMinus, faRecycle } from '@fortawesome/free-solid-svg-icons'

const Battlefield = (props) => {
  const [zoom,setZoom] = useState('')
  const[zoomIcon,setIcon] = useState(zoom != 'zoom' ? faSearchPlus : faSearchMinus )
  const checkZoom = (card, index) =>{
    if(zoom == 'zoom'){
      setZoom('')
    }else{
      setZoom('zoom')
    }
  }
      // <Tooltip arrow  title="Zoom in">
      //   <Button style={{margin:5,width:50}} size="small" color="primary" variant="contained"   onClick={checkZoom}>
      //     <FontAwesomeIcon  icon={zoomIcon} />
      //   </Button>
      // </Tooltip>
  return (
    <div onClick={checkZoom} className="flexCol">
              
      {props.location.battlefield.length > 0 ? (
        props.location.battlefield.map((bf, index) => {
          let playerBF = props.location.battlefield[index];
          let bgColor = props.playerBGs[index];

          return playerBF ? (
            <div className="flexRow">
              <div className="flexCol bfContainer">
                <div>{playerBF.name}</div>

                <div>$ {playerBF.gold}</div>
                <div>Inf:{playerBF.influence + playerBF.poliBonus < 0 ? 0 : playerBF.influence + playerBF.poliBonus }</div>
              </div>
              {playerBF.cards.map((card, ind) => {
                return (
                  <div className={zoom} style={{ margin:3 }}>
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
          ) : null;
        })
      ) : (
        <div><span style={{ padding: 0, margin: 0 }}> Battlefield:</span></div>
      )}
    </div>
  );
};
export default Battlefield;
