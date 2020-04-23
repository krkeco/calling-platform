import React, {useState} from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from './ItemTypes'
const style = {margin: 25, width:250, height: 150,outline:'1px solid black'}
const Location = (props) => {
  
  const [items, setItems] = useState([])
  
  const [{ item, canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ name: props.name }),
    collect: (monitor) => ({
      item: monitor.getItem(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  const isActive = canDrop && isOver
  let backgroundColor = '#eee'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else 
  if (canDrop) {
    backgroundColor = 'darkkhaki'
  }
  if(item && isOver && items.indexOf(item.name) < 0 ){
    let newItems = [...items]
    let itemView = <div>item.name</div>
    newItems.push(itemView)
    setItems([...newItems])
  }
  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {isActive ? 'Release to drop' : `Play on ${props.name}`}
      <div className="flexCol center">
        {items}
      </div>


    </div>
  )
}
export default Location
