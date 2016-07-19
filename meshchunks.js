var mesher = require('./mesher');

/**
 * @function meshChunks
 * @param  {Chunks} chunks chunks to mesh
 * @param  {THREE.Object3D} parent parent object to mesh in
 * @param  {THREE.Material} material material to use
 * @param  {Object} cached an object with key origin hash and value cached geometry, 
 * if an empty object is passed, it will be populated for next use
 */
module.exports = function(chunks, parent, material, cached) {
  for (var id in chunks.map) {
    var chunk = chunks.map[id];
    var data = chunk.chunk;
    if (chunk.dirty) {

      if (chunk.mesh != null) {
        chunk.mesh.parent.remove(chunk.mesh);
        chunk.mesh.geometry.dispose();
      }

      var origin = chunk.origin;

      var cachedGeometry = cached == null ? null : cached[id];
      var geometry = cachedGeometry || mesher(chunk.chunk);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.fromArray(chunk.origin);
      parent.add(mesh);

      if (cached != null) {
        cached[id] = geometry;
      }

      chunk.dirty = false;
      chunk.mesh = mesh;
    }
  }
}