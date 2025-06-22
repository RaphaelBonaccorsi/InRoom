require('dotenv').config(); // Para carregar variáveis de ambiente do .env
const express = require('express');
const { Pool } = require('pg'); // Cliente PostgreSQL
const cors = require('cors'); // Para permitir requisições do frontend (React Native)

const app = express();
const port = process.env.PORT || 3000; // Porta do seu backend

// Configuração do Pool de Conexões do PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HoteisWEB',
  password: '1531',
  port: '5432',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // Usar SSL em produção, dependendo do seu provedor
});

// Middlewares
app.use(cors()); // Permite que seu frontend (rodando em outra porta/domínio) acesse esta API
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Endpoint de Pesquisa de Hotéis
app.get('/api/hoteis', async (req, res) => {
  const { cidade, estado, minPrice, maxPrice } = req.query; // Captura os parâmetros da URL

  let query = 'SELECT id, nome, cidade, estado, preco, descricao, avaliacao, imagem_url FROM hoteis WHERE 1=1';
  const queryParams = [];
  let paramIndex = 1;

  if (cidade) {
    query += ` AND LOWER(cidade) LIKE $${paramIndex++}`;
    queryParams.push(`%${cidade.toLowerCase()}%`);
  }
  if (estado) {
    query += ` AND LOWER(estado) = $${paramIndex++}`;
    queryParams.push(estado.toLowerCase());
  }
  if (minPrice) {
    query += ` AND preco >= $${paramIndex++}`;
    queryParams.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    query += ` AND preco <= $${paramIndex++}`;
    queryParams.push(parseFloat(maxPrice));
  }

  query += ' ORDER BY nome ASC'; 

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows); // Retorna os hotéis encontrados
  } catch (err) {
    console.error('Erro ao buscar hotéis:', err.message);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar hotéis.' });
  }
});

app.get('/', (req, res) => {
  res.send('API InRoom está rodando!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
