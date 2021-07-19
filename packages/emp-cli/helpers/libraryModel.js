const path = require('path')
class LibraryModel {
  constructor(wpchain, library, paths) {
    this.config = wpchain
    this.library = library
    this.paths = paths
    this.createLib()
  }
  createLib() {
    this.config
      .entry('library_index')
      .add(path.join(this.paths.appRoot, 'src/library/index.ts'))
      .end()
      .output.path(path.join(this.paths.appRoot, 'dist'))
      .filename('[name].bundle.js')
  }
}
module.exports = LibraryModel
