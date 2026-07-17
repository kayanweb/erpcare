process.env.NODE_ENV = 'production';
import pkg from '../dist/server.cjs';
const { startServer } = pkg;

let appPromise = startServer();

export default async function(req, res) {
  const app = await appPromise;
  app(req, res);
}
