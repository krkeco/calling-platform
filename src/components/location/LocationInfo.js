import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const LocationInfo = (props, toggleTitleBar) => {
  return (
    <div>
      <div className="flexRow">
        <div className="titlebarInfo">
          <div className="locationTitle">
            <IconButton
              onClick={() => toggleTitleBar()}
              variant="contained"
              color="secondary"
            >
              <FontAwesomeIcon className="infoBtn" icon={faTimes} />
            </IconButton>
            {props.location.name}:{props.location.id}(
            {props.location.influencer}) Inf:({props.location.influence}){' '}
          </div>
        </div>
      </div>
      {props.location.weariness > 0 ? (
        <div className="titlebarInfo">
          I+F!:({props.location.weariness + props.location.influence}) , Fear:
          {props.location.weariness}
          {props.location.name == 'Canaan' ? (
            <span>, Tier:{props.location.abilities[0]}</span>
          ) : (
            <span />
          )}
        </div>
      ) : (
        <span />
      )}{' '}
      {props.location.wounds[0] > 0 ||
      props.location.wounds[1] > 0 ||
      props.location.wounds[2] > 0 ||
      props.location.wounds[3] > 0 ? (
        <div className="titlebarInfo">
          Wounds:{' '}
          {props.location.wounds.map((w, i) =>
            w > 0 ? 'Player' + i + ':(' + w + ')' + ' ' : '',
          )}
        </div>
      ) : (
        <div />
      )}
      {props.location.proselytized[0] > 0 ||
      props.location.proselytized[1] > 0 ||
      props.location.proselytized[2] > 0 ||
      props.location.proselytized[3] > 0 ? (
        <div className="titlebarInfo">
          Churches:{' '}
          {props.location.proselytized.map((w, i) =>
            w > 0 ? 'Player' + i + ':(' + w + ')' + ' ' : '',
          )}
        </div>
      ) : (
        <div />
      )}
      {props.location.hardened > 0 ? (
        <div className="titlebarInfo">Hardened:{props.location.hardened}</div>
      ) : (
        <div />
      )}
      {props.location.edicts > 0 ? (
        <div className="titlebarInfo">Edicts:{props.location.edicts}</div>
      ) : (
        <div />
      )}
      {props.location.info.map((info, ind) => {
        return (
          <div className="titlebarInfo smallText">
            {info}
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default LocationInfo;
