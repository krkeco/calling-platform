import React, { useState } from 'react';
import { HAND } from './constants.js';
import { IconButton, Button, Fab, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faSearchPlus,
  faSearchMinus,
  faRecycle,
} from '@fortawesome/free-solid-svg-icons';

import PlayingCard from './PlayingCard';
import LocationInfo from './components/location/LocationInfo';
import Market from './components/location/Market';
import Battlefield from './components/location/Battlefield';

import babylon from './imgs/esther/babylon.jpg';
import jerusalem from './imgs/jerusalem.jpg';
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
  const [dragOver, setDrag] = useState('none');
  const [titleBar, setTitleBar] = useState('titlebar');
  const [scrapBg, setScrapBg] = useState({});
  const [zoom, setZoom] = useState('');
  const [zoomIcon, setIcon] = useState(
    zoom != 'zoom' ? faSearchPlus : faSearchMinus,
  );
  const toggleTitleBar = () => {
    if (titleBar == 'titlebar') {
      setTitleBar('titlebar active');
    } else {
      setTitleBar('titlebar');
    }
  };
  const checkZoom = () => {
    if (zoom == 'zoom') {
      setZoom('');
      setIcon(faSearchPlus);
    } else {
      setZoom('zoom');
      setIcon(faSearchMinus);
    }
  };
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
        {LocationInfo(props, toggleTitleBar)}
      </div>
      <div
        className="location"
        onDragEnter={(e) => e.preventDefault()}
        onDragOver={(event) => props.onDragOver(event)}
        onDrop={(event) =>
          dragOver != 'scrap' ? props.onDrop(event, props.location.id) : null
        }
        style={{
          backgroundImage: `url("${bgGrid[props.location.name]}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flexRow">
          <div className="locationTitle">
            <IconButton
              onClick={() => toggleTitleBar()}
              variant="contained"
              color="secondary"
            >
              <FontAwesomeIcon className="infoBtn" icon={faQuestion} />
            </IconButton>
            {props.location.name}
            <Tooltip arrow title="Current Influencer"><span>({props.location.influencer})</span></Tooltip>
             <Tooltip arrow title="Location Influence"><span>Inf:(
            {props.location.influence})
            </span></Tooltip>
            {props.location.weariness > 0
              ? <Tooltip arrow title="Fear"><span> F!:{props.location.weariness}</span></Tooltip>
              : ''}
            {props.location.hardened > 0 ? <Tooltip arrow title="Hardened"><span> H:{props.location.hardened}</span></Tooltip> : ''}
            
            {props.location.abilities[0] > 0
              ? <Tooltip arrow title="Canaan Tier (of 3)"><span> T:{props.location.abilities[0]}</span></Tooltip>
              : ''}
            {props.location.edicts > 0 ? <Tooltip arrow title="Edicts"><span> E:{props.location.edicts}</span></Tooltip> : ''}
            {props.location.proselytized.map((p, i) =>
              p > 0 ? <Tooltip arrow title="Player#:Churches"><span> C{i}:{p}</span></Tooltip> : '',
            )}
            {props.location.wounds.map((p, i) => (p > 0 ? <Tooltip arrow title="Player#:Wounds"><span> W{i}:{p}</span></Tooltip> : ''))}
          </div>
        </div>

        {props.location.name != 'Jerusalem' ? (
          <div className="flexRow flexStart marketContainer">
            <div className="infoBtnBig flexCol">
              <Tooltip arrow title="Refresh Market">
                <Button
                size="large"
                  color="primary"
                  variant="contained"
                  aria-label="Refresh Market"
                  onClick={() => refreshMarket()}
                >
                  <FontAwesomeIcon icon={faRecycle} />
                </Button>
              </Tooltip>

              <div className="infoBtnBig" />

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
            </div>

            {Market(props, buyCard, zoom)}
          </div>
        ) : (
          <div
            className="scrapPile flexCol center"
            style={scrapBg}
            onDragEnter={(e) => {
              e.preventDefault()
              setScrapBg({backgroundColor:'maroon'})
            }}
            onDragLeave={(e) => {
              setDrag('none')
              setScrapBg({})
            }}
            onDrop={(event) => {
              setDrag('none');
              setScrapBg({})
              props.onDrop(event, -1);
            }}
            onDragOver={(event) => {
              setDrag('scrap');

              setScrapBg({backgroundColor:'maroon'})
              props.onDragOver(event);
            }}
          >
            Scrap Pile
          </div>
        )}
        <div className="bfWrapper">{Battlefield(props)}</div>
      </div>
    </div>
  );
};

export default Location;
