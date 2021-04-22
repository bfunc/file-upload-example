const fs = require('fs');
const express = require('express');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/', // omit to keep keep files in memory
});

const port = 3000;
const app = express();
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post('/upload', upload.single('myImage'), function (req, res) {
  res.append('Location', 'success.html');
  res.status(303).send();
});
