const path = require('path');

const multer = require('fastify-multer');
const upload = multer({ dest: 'uploads/' });

const createFastify = require('fastify');
const fastify = createFastify();
fastify.register(multer.contentParser);
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
});

fastify.route({
  method: 'POST',
  url: '/upload',
  preHandler: upload.single('myImage'),
  handler: function (request, reply) {
    // log formData
    console.log(request.file);

    // TODO - do something file file
    // send it to AWS S3 or Cloudinary service for example

    // return response to client
    reply.header('Location', 'success.html').code(303).send();
  },
});

fastify.listen(3000, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
