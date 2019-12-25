const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const bucketname= process.env.GCLOUD_STORAGE_BUCKET;

var stream = require('stream');



exports.saveObject= function(objname, obj) {
    var bufferStream = new stream.PassThrough();
    bufferStream.end(JSON.stringify(obj));

let file= storage.bucket(bucketname).file(objname);
bufferStream.pipe(file.createWriteStream({
    metadata: {
      contentType: 'application/json',
      metadata: {
        custom: 'metadata'
      }
    },
    public: false,
    validation: "md5"
  }))
  .on('error', function(err) { console.log("Error: "+JSON.stringify(err))})
  .on('finish', function() {
    console.log("Upload of object done.");
  })};

exports.loadObject = function(objname, callback) {
    let a = storage.bucket(bucketname).file(objname).createReadStream();
    let  buf = '';
    a.on('data', function(d) {
      buf += d;
    }).on('end', function() {
        callback(buf);
    });     
};
