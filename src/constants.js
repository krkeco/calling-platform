module.exports.HAND = 'hand';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  module.exports.URL = 'http://192.168.0.248:4000/graphql';//localhost
} else {
  module.exports.URL = 'https://still-island-58139.herokuapp.com/graphql';
}

module.exports.playerTypeEnum = {
  HOST: 'host',
  GUEST: 'guest',
  LAN: 'lan',
};
