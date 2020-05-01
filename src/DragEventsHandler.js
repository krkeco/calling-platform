import React, { useEffect, useState, Component } from 'react';

  const onDragStart = (event, cardId) => {
    let triggerCard = cards.find((card) => card.id == cardId);
      console.log('dragstart on div: ', cardId);
      event.dataTransfer.setData('cardId', cardId);
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDrop = (event, loc) => {
    let cardId = event.dataTransfer.getData('cardId');
    console.log('drop on' + loc);
    playCard(cardId,loc)
  };

module.exports = {onDragStart, onDragOver, onDrop}