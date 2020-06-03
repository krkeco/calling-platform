import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'



const Titlebar = (props, toggleTitleBar) => {
 
  return (
    <div  >
        <div className="flexRow">
          <div className="titlebarInfo">
            <div className="flexRow titleBtnBar" >
              <IconButton  onClick={() => toggleTitleBar()} variant="contained" color="secondary">
                <FontAwesomeIcon className="infoBtn" icon={faTimes} />
              </IconButton>
               <div className="locationTitle">
                {props.location.name}:{props.location.id}(
                {props.location.influencer})
                Inf:({props.location.influence}){' '}
              </div>
            </div>
      
            {props.location.weariness > 0 ? (
              <div>
                I+F!:({props.location.weariness + props.location.influence})
              </div>
            ) : (
              <div />
            )}{' '}
          </div>
        </div>
        {props.location.name == 'Canaan' ? (
          <div className="titlebarInfo">Tier:{props.location.abilities[0]}</div>
        ) : (
          <div />
        )}
        {props.location.weariness > 0 ? (
          <div className="titlebarInfo">Fear:{props.location.weariness}</div>
        ) : (
          <div />
        )}
        {props.location.wounds[0] > 0 
        ||props.location.wounds[1] > 0
        ||props.location.wounds[2] > 0
        ||props.location.wounds[3] > 0 ? (
          <div className="titlebarInfo">
            Wounds:{' '}
            {props.location.wounds.map((w, i) =>
              w > 0 ? 'P' + i + ':(' + w + ')' + ' ' : '',
            )}
          </div>
        ) : (
          <div />
        )}

        {props.location.proselytized[0] > 0
        ||props.location.proselytized[1] > 0
        ||props.location.proselytized[2] > 0
        ||props.location.proselytized[3] > 0 ? (
          <div className="titlebarInfo">
            Churches:{' '}
            {props.location.proselytized.map((w, i) =>
              w > 0 ? 'P' + i + ':(' + w + ')' + ' ' : '',
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

export default Titlebar;
