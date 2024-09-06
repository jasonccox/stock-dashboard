import express from 'express';
import * as path from 'path';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';

const port = process.env['PORT'] || 3000;

const app = express();
app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(morgan('tiny')); // logs requests to console
app.use(express.json());

// serve bundled frontend assets from the "dist" directory, with the webpack-
// generated index.html at the root
const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');
app.use(express.static(distDir));
app.get('/', (_req, res) => {
  res.sendFile(indexHtml, (err) => {
    if (err) {
      console.error('error sending index.html', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server error');
    }
  });
});
