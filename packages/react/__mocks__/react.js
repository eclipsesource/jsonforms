const React = require('react');
module.exports = Object.assign({}, React, { useEffect: React.useLayoutEffect });
