module.exports.HAND = 'hand';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  module.exports.URL = 'http://localhost:4000/graphql';
} else {
  module.exports.URL = 'https://still-island-58139.herokuapp.com/graphql';
}

module.exports.playerTypeEnum = {
  HOST: 'host',
  GUEST: 'guest',
  LAN: 'lan',
};
