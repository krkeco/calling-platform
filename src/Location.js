import React, { useState } from 'react';
import { HAND } from './constants.js';
import { IconButton, Button, Fab,Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faSearchPlus,faSearchMinus, faRecycle } from '@fortawesome/free-solid-svg-icons'

import PlayingCard from './PlayingCard';
import LocationInfo from './components/location/LocationInfo';
import Market from './components/location/Market';
import Battlefield from './components/location/Battlefield';

import babylon from './imgs/esther/babylon.jpg';
import jerusalem from './imgs/sample/sandyshore.jpg';
import canaan from './imgs/sample/seaskull.jpg';
import nineveh from './imgs/sample/dessertketchup.jpg';
import rome from './imgs/sample/fishflower.jpg';

const bgGrid = {
  Nineveh: nineveh,
  Canaan: canaan,
  Jerusalem: jerusalem,
  Rome: rome,
  Babylon: babylon,
};

const Location = (props) => {
  const [dragOver, setDrag] = useState('none')
 const [titleBar, setTitleBar] = useState('titlebar');
  const [zoom,setZoom] = useState('')
 const[zoomIcon,setIcon] = useState(zoom != 'zoom' ? faSearchPlus : faSearchMinus )
  const toggleTitleBar = () => {
    if (titleBar == 'titlebar') {
      setTitleBar('titlebar active');

    } else {
      setTitleBar('titlebar');
    }
  };
  const checkZoom = () =>{
    if(zoom == 'zoom'){
      setZoom('')
      setIcon(faSearchPlus)
    }else{
      setZoom('zoom')
      setIcon(faSearchMinus)
    }
  }
  const buyCard = (card, index) => {
    if (
      props.location.battlefield &&
      props.location.battlefield[props.player]
    ) {
      let playerField = props.location.battlefield[props.player];
      console.log(
        props.players[props.player] +
          ' could buy something with ' +
          playerField.gold,
      );
      props.buyCard(index, props.location.id, card);
    } else {
      console.log(
        'you cannot afford this!' + card.cost + props.location.currentGold,
      );
    }
  };
  const refreshMarket = () => {
    if (
      props.location.battlefield &&
      props.location.battlefield[props.player]
    ) {
      let playerField = props.location.battlefield[props.player];
      console.log(
        props.players[props.player].name +
          ' could buy something with ' +
          playerField.gold,
      );
      if (playerField.gold > 0) {
        props.refreshMarket(props.location.id, props.player);
      }
    } else {
      console.log('you cannot afford this!' + props.location.currentGold);
    }
  };
  return (
    <div className="flexRow">
        <div className={titleBar}>
          {LocationInfo(props,toggleTitleBar)}
        </div>
      <div
        className="location"

        onDragEnter={(e) => e.preventDefault()}
        onDragOver={(event) => props.onDragOver(event)}
        onDrop={(event) => dragOver != 'scrap' ? props.onDrop(event, props.location.id) : null}
        style={{
          backgroundImage: `url("${bgGrid[props.location.name]}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <div className="flexRow">
           <div className="locationTitle">
          <IconButton  onClick={() => toggleTitleBar()} variant="contained" color="secondary">
            <FontAwesomeIcon  className="infoBtn" icon={faQuestion} />
          </IconButton>
            {props.location.name}({props.location.influencer})
            Inf:({props.location.influence})
            {props.location.weariness > 0 ? ` F!:${props.location.weariness}`:''}
            
            {props.location.hardened > 0 ? ` H:${props.location.hardened}`:''}
            {props.location.abilities[0] > 0 ? ` T:${props.location.abilities[0]}`:''}
            {props.location.edicts > 0 ? ` E:${props.location.edicts}`:''}
            {props.location.proselytized.map((p,i) => p > 0 ? ` C${i}:${p}`:'')}
            {props.location.wounds.map((p,i) => p > 0 ? ` W${i}:${p}`:'')}
          </div>
      </div>

        {props.location.name != 'Jerusalem' ? (
          <div  className="flexRow flexStart marketContainer">
            
              <div  className="infoBtnBig flexCol">
              <Tooltip arrow  title="Refresh Market">
              <Button color="primary" variant="contained"  aria-label="Refresh Market" onClick={() => refreshMarket()}>
                <FontAwesomeIcon  icon={faRecycle} />
              </Button>
              </Tooltip>
              <div  className="infoBtnBig"/>
              
              <Tooltip arrow  title="Zoom in">
                <Button color="primary" variant="contained"   onClick={checkZoom}>
                  <FontAwesomeIcon  icon={zoomIcon} />
                </Button>
              </Tooltip>
              </div>
            
            {Market(props, buyCard, zoom)}

          </div>
        ) : (
          <div
            className="scrapPile flexCol center"
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e)=> setDrag('none')}
            onDrop={(event) => {
              setDrag('none')
              props.onDrop(event, -1)
            }}
            onDragOver={(event) => {
              setDrag('scrap')
              props.onDragOver(event)
            }}
          >
            Scrap Pile
          </div>
        )}
        <div
          className="bfWrapper"
        >
          
          {Battlefield(props)}
        </div>
      </div>
    </div>
  );
};

export default Location;
