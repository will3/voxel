var Chunk = require('./chunk');

/**
 * A dynamically sized block of voxel data
 * @constructor
 * @param {Int} chunkSize chunk size
 */
var Chunks = function(chunkSize) {
  this.map = {};
  this.chunkSize = chunkSize || 16;
};

/**
 * Set data at coord
 * @param {Int} i i
 * @param {Int} j j
 * @param {Int} k k
 * @param {Object} data to store
 */
Chunks.prototype.set = function(i, j, k, v) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.join(',');
  if (this.map[hash] == null) {
    this.map[hash] = {
      chunk: new Chunk([this.chunkSize, this.chunkSize, this.chunkSize]),
      origin: origin
    }
  }

  this.map[hash].dirty = true;
  this.map[hash].chunk.set(i - origin[0], j - origin[1], k - origin[2], v);
};

/**
 * Get data at coord
 * @param  {Int} i i
 * @param  {Int} j j
 * @param  {Int} k k
 * @return {Object} data stored at coord
 */
Chunks.prototype.get = function(i, j, k) {
  var origin = this.getOrigin(i, j, k);
  var hash = origin.join(',');
  if (this.map[hash] == null) {
    return null;
  }
  var origin = this.map[hash].origin;
  return this.map[hash].chunk.get(i - origin[0], j - origin[1], k - origin[2]);
};

/**
 * Get origin of chunk for coord
 * @param  {Int} i i
 * @param  {Int} j j
 * @param  {Int} k k
 * @return {Array} origin coord
 */
Chunks.prototype.getOrigin = function(i, j, k) {
  return [
    Math.floor(i / this.chunkSize) * this.chunkSize,
    Math.floor(j / this.chunkSize) * this.chunkSize,
    Math.floor(k / this.chunkSize) * this.chunkSize
  ];
};

/**
 * Visit coords
 * @param  {visitCallback} callback @callback 
 */
Chunks.prototype.visit = function(callback) {
  for (var id in this.map) {
    var chunk = this.map[id].chunk;
    var origin = this.map[id].origin;
    var shape = chunk.shape;

    for (var i = 0; i < shape[0]; i++) {
      for (var j = 0; j < shape[0]; j++) {
        for (var k = 0; k < shape[0]; k++) {
          var v = chunk.get(i, j, k);
          if (!v) {
            continue;
          }
          callback(i + origin[0], j + origin[1], k + origin[2], v);
        }
      }
    }
  }
};

/**
 * Remove all meshes and dispose all geometries
 * @return {Chunks} self for chainability
 */
Chunks.prototype.clear = function() {
  for (var id in this.map) {
    var chunk = this.map[id];
    if (chunk.mesh != null) {
      chunk.mesh.parent.remove(chunk.mesh);
      chunk.mesh.geometry.dispose();
    }
  }
  this.map = {};

  return this;
};

/**
 * Deserialize json
 * @param {JSON} data data to deserialize
 * @param {Array} offset optional offset to apply
 * @return {Chunks} self for chainability
 */
Chunks.prototype.deserialize = function(data, offset) {
  offset = offset || [0, 0, 0];
  var self = this;
  data.forEach(function(v) {
    self.set(v[0] + offset[0], v[1] + offset[1], v[2] + offset[2], v[3]);
  });

  return this;
};

module.exports = Chunks;
