import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Servidor iniciado correctamente');
  console.log(`Puerto: ${PORT}`);
  console.log(`Entorno: ${config.nodeEnv}`);
  console.log(`URL: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});