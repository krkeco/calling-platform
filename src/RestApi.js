//basic promise
//todo: add player select page
const startGame = () => {
  fetch('http://localhost:8080/game')
    .then((res) => res.json())
    .then(
      (result) => {
        console.log('result' + result.id); //gameid
        // getGame(result.id);
        return result.id;
      },
      (error) => {
        console.log('error' + error);
      },
    );
};

//async await
const getGame = async (id) => {
  try {
    console.log('trying getgame');
    let res = await fetch('http://localhost:8080/game/' + id);
    let response = await res.json();
    return response;
  } catch (e) {
    console.log('error getting game:' + e);
  }
};

const playCard = async (gameId, name, players, currentPlayer, location) => {
  let data = {
    cardname: name,
    player: players[currentPlayer].name,
    location: location,
  };
  let res = await fetch('http://localhost:8080/game/' + gameId + '/play', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  let response = await res.json();
  console.log('playcard result' + response.locations);
  return response;
};

const buyCard = async (
  gameId,
  players,
  currentPlayer,
  index,
  location,
  card,
) => {
  let data = {
    index: index,
    player: players[currentPlayer].name,
    location: location,
  };
  let res = await fetch('http://localhost:8080/game/' + gameId + '/buy', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log(res);
  let response = await res.json();
  console.log('buycard result' + response.locations);
  return response;
};

const nextPlayer = async () => {
  console.log('next current' + currentPlayer);
  // let data = {"index":index, "player":players[currentPlayer].name,"location":location,}
  let res = await fetch(
    'http://localhost:8080/game/' + gameId + '/next/' + currentPlayer,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // body: JSON.stringify(data)
    },
  );

  console.log(res);
  let response = await res.json();

  if (response.winner) {
    alert('Good Game! ' + response.winner + ' wins!!');
  }
  console.log('nextplayer result' + JSON.stringify(response.locations));
  setLocationInfo(response.locations);
  setPlayerInfo(response.players);
  setCurrentPlayer(response.newPlayer);
  setTurn(response.turn);
};

module.exports = {
  startGame,
  getGame,
  playCard,
  response,
  buyCard,
  nextPlayer,
};
