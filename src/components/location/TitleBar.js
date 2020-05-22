import React, { useState } from 'react';
import { Button } from '@material-ui/core';
const Titlebar = (props) => {
  const [titleBar, setTitleBar] = useState('titlebar');
  const toggleTitleBar = () => {
    if (titleBar == 'titlebar') {
      setTitleBar('titlebar active');
    } else {
      setTitleBar('titlebar');
    }
  };
  return (
    <div>
      <div className={titleBar}>
        <div onClick={() => toggleTitleBar()}>
          <Button variant="contained" color="secondary">
            ( ? )
          </Button>
          <span className="locationTitle">
            {props.location.name}:{props.location.id}(
            {props.location.influencer})
          </span>
        </div>
        <div className="flexRow">
          <div className="titlebarInfo">
            Inf:({props.location.influence}){' '}
            {props.location.weariness > 0 ? (
              <span>
                I+F!:({props.location.weariness * 2 + props.location.influence})
              </span>
            ) : (
              <span />
            )}{' '}
          </div>
        </div>
        {props.location.name == 'Canaan' ? (
          <div className="titlebarInfo">Tier:{props.location.abilities[0]}</div>
        ) : (
          <span />
        )}
        {props.location.weariness > 0 ? (
          <div className="titlebarInfo">Fear:{props.location.weariness}</div>
        ) : (
          <span />
        )}
        {props.location.wounds && props.location.wounds.length > 0 ? (
          <div className="titlebarInfo">
          Wounds: {props.location.wounds.map((w,i)=> w > 0 ? "P"+i+":("+w+")"+ " " : "")}
          </div>
        ) : (
          <span />
        )}

        {props.location.proselytized && props.location.proselytized.length > 0 ? (
          <div className="titlebarInfo">
            Churches: {props.location.proselytized.map((w,i)=> w > 0 ? "P"+i+":("+w+")"+ " " : "")}
          </div>
        ) : (
          <span />
        )}
        {props.location.hardened > 0 ? (
          <div className="titlebarInfo">Hardened:{props.location.hardened}</div>
        ) : (
          <span />
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
    </div>
  );
};

export default Titlebar;
