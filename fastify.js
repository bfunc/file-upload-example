const fs = require('fs');
const path = require('path');
const createFastify = require('fastify');
const fileUpload = require('fastify-file-upload');

const fastify = createFastify();
fastify.register(fileUpload);
fastify.register(require('fastify-static'), {
  root: getPath('public'),
});

fastify.post('/upload', function (req, reply) {
  // contains text field together with files
  // console.log(req.raw.body);

  // containes only files
  console.log(req.raw.files);

  // TODO - do something file file
  // send it to AWS S3 or Cloudinary service for example

  // return response to client
  reply.header('Location', 'success.html').code(303).send();

  // [!] stream file to disk just for example, use it only if needed
  const imageBuffer = req.raw.files['myImage'].data;
  const fileName = getPath('uploads', getRandomFileName());
  const stream = fs.createWriteStream(fileName);
  stream.once('open', function (fd) {
    stream.write(imageBuffer);
    stream.end();
  });
});

fastify.listen(3000, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});

function getRandomFileName() {
  return 'file' + String(parseInt(Math.random() * 10000)) + '.png';
}

function getPath(...parts) {
  return path.join(__dirname, ...parts);
}
