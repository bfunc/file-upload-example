const fs = require('fs');
const path = require('path');
const inspect = require('util').inspect;
const fastify = require('fastify')();
const Busboy = require('busboy');

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
});

fastify.addContentTypeParser(
  'multipart/form-data',
  function (request, payload, done) {
    done(null, payload);
  }
);

fastify.post('/upload', function (request, reply) {
  const req = request.raw;
  const res = reply.raw;

  try {
    console.log(req.headers);
    let busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      console.log(
        'File [' +
          fieldname +
          ']: filename: ' +
          filename +
          ', encoding: ' +
          encoding +
          ', mimetype: ' +
          mimetype
      );

      // Optionaly stream file to disk
      // [!] Never use original filename
      let saveTo = path.join(__dirname, 'uploads', path.basename(filename));

      file.pipe(fs.createWriteStream(saveTo));

      file.on('data', function (data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });

      file.on('end', function () {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on(
      'field',
      function (
        fieldname,
        val,
        fieldnameTruncated,
        valTruncated,
        encoding,
        mimetype
      ) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      }
    );
    busboy.on('finish', function () {
      reply.sent = true;
      reply.raw.end('hello world');
    });
    req.pipe(busboy);
  } catch (err) {
    console.log(err);
    reply.raw.end(err.message);
  }
});

fastify.listen(3000, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
