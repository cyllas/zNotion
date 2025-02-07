import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import notionRoutes from './routes/notionRoutes';
import { errorHandler } from './middleware/errorHandler';
import { validationErrorHandler } from './middleware/validator';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/v1', notionRoutes);

// Rota básica de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middlewares de erro
app.use(validationErrorHandler);
app.use(errorHandler);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
