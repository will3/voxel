var Voxel = {
  Chunk: require('./chunk'),
  Chunks: require('./chunks'),
  meshChunks: require('./meshchunks'),
  mesher: require('./mesher')
};

/**
 * Visit coordinates in a shape
 * @param  {Array} shape shape to visit
 * @param  {Function} callback callback function
 */
function visitShape(shape, callback) {
  for (var i = 0; i < shape[0]; i++) {
    for (var j = 0; j < shape[1]; j++) {
      for (var k = 0; k < shape[2]; k++) {
        callback(i, j, k);
      }
    }
  }
};

/**
 * Copy a chunk, optional, an offset can be applied
 * @param  {Chunks} from chunks to copy from
 * @param  {Chunks} to chunks to copy to
 * @param  {Vector3} offset optional offset to apply when copying
 */
function copyChunks(from, to, offset) {
  offset = offset || [0, 0, 0];
  from.visit(function(i, j, k, v) {
    to.set(i + offset[0], j + offset[1], k + offset[2], v);
  });
};

/**
 * Remove floating bits from a chunk
 * @param  {Chunks} chunks: chunks to process
 * @param  {Vector3} startCoord: coord to start search from, 
 * any coords not connected to startCoord will be removed
 */
function removeFloating(chunks, startCoord) {
  var map = {};
  chunks.visit(function(i, j, k, v) {
    var hash = [i, j, k].join(',');
    map[hash] = {
      visited: false,
      coord: [i, j, k]
    };
  });

  var leads = [startCoord];

  while (leads.length > 0) {
    var result = visit([1, 0, 0]) ||
      visit([0, 1, 0]) ||
      visit([0, 0, 1]) ||
      visit([-1, 0, 0]) ||
      visit([0, -1, 0]) ||
      visit([0, 0, -1]);

    if (!result) {
      leads.pop();
    }
  }

  var count = 0;
  for (var id in map) {
    if (!map[id].visited) {
      var coord = map[id].coord;
      chunks.set(coord[0], coord[1], coord[2], null);
    }
  }

  function visit(dis) {
    var current = leads[leads.length - 1];

    var next = [current[0] + dis[0],
      current[1] + dis[1],
      current[2] + dis[2]
    ];

    var hash = next.join(',');

    if (map[hash] == null) {
      return false;
    }

    if (map[hash].visited) {
      return false;
    }

    var v = chunks.get(next[0], next[1], next[2]);
    if (!!v) {
      map[hash].visited = true;
      leads.push(next);
      return true;
    }
  };
};

Voxel.visitShape = visitShape;
Voxel.copyChunks = copyChunks;
Voxel.removeFloating = removeFloating;

module.exports = Voxel;

/**
 * Callback for reading voxel data
 * @callback visitCallback
 * @param {Int} i i
 * @param {Int} j j
 * @param {Int} j j
 * @param {Object} value value at coord
 */

/**
 * Callback for getting voxel data
 * @callback queryFunction
 * @param {Int} i i
 * @param {Int} j j
 * @param {Int} k k
 * @return {Object} value stored at coord
 */