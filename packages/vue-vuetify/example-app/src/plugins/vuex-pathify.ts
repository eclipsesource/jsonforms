import pathify from 'vuex-pathify';

// options
pathify.options.mapping = 'standard'; // map states to store members using the "standard" scheme [standard, simple, custom]
pathify.options.strict = true; // throw an error if the store member cannot be found
pathify.options.cache = true; // cache generated functions for faster re-use
pathify.options.deep = 2; // allow sub-property access to Vuex stores

export default pathify;
