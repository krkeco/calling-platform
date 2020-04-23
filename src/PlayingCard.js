import React, { useState, useEffect } from 'react';

import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'

const style = {margin: 5,width:50,height:75,backgroundColor:'#ddd', outline:'1px solid black'}

const Box = ({ name, id, removeFromHand }) => {
  const [isClicked, setClicked] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    item: { name, type: ItemTypes.BOX },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        removeFromHand(id)
        // alert(`You dropped ${item.name} into ${dropResult.name}!`)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const handleEvent = (event) => {
   if (event.type === "mousedown") {
          setClicked(true)
      } else {
          setClicked(false)
      }
  }

  const opacity = isDragging ? .9 : 1
  
  if(isDragging && isClicked){ setClicked(false) } 
  const width = isClicked ? 200 : 50
  const height = isClicked ? 300 : 75

  return (
    <div ref={drag} 
    style={{ ...style, opacity, width, height }}
    onMouseDown={ handleEvent } onMouseUp={ handleEvent }>
      {name}
      {isClicked.toString()}
    </div>
  )
}
export default Box
