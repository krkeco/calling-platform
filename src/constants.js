module.exports.HAND = 'hand';

//nginx
// module.exports.URL = 'http://10.42.0.1:4000/graphql'; //192.168.0.248
//local/heroku
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  module.exports.URL = 'http://localhost:4000/graphql'; //192.168.0.248
} else {
  module.exports.URL = 'https://still-island-58139.herokuapp.com/graphql';
}

module.exports.playerTypeEnum = {
  HOST: 'host',
  GUEST: 'guest',
  LAN: 'lan',
  SPEC: 'spectator',
};
