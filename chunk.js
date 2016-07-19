/**
 * Block of voxel data with a fixed size
 * @constructor
 * @param {Array} shape optional shape, 
 * querying data outside of shape will give unexpected results
 */
var Chunk = function(shape) {
  this.volume = [];
  this.shape = shape || [16, 16, 16];
  this.dimX = this.shape[0];
  this.dimXY = this.shape[0] * this.shape[1];
};

/**
 * Get data at coord
 * @param  {Int} i i
 * @param  {Int} j j
 * @param  {Int} k k
 * @return {Object}
 */
Chunk.prototype.get = function(i, j, k) {
  return this.volume[i * this.dimXY + j * this.dimX + k];
};

/**
 * Set data at coord
 * @param {i} i i
 * @param {j} j j
 * @param {k} k k
 * @param {v} data to store
 */
Chunk.prototype.set = function(i, j, k, v) {
  this.volume[i * this.dimXY + j * this.dimX + k] = v;
};

module.exports = Chunk;
