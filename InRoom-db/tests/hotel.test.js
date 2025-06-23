// inroom-backend/tests/hotel.test.js
const test = require('node:test');
const assert = require('node:assert/strict'); // Para asserções mais rigorosas
const axios = require('axios');

// Configure a URL base da sua API
// VERIFIQUE ESTE IP E PORTA! Deve ser o mesmo que você usa no frontend.
const API_BASE_URL = 'http://localhost:3000/api'; // Supondo que seu backend roda na porta 3000

// ==========================================================
// TESTES PARA BUSCA DE HOTÉIS (GET /api/hoteis)
// ==========================================================

test('GET /api/hoteis deve retornar uma lista de hotéis', async (t) => {
    // Usamos `t.test` para criar sub-testes aninhados para melhor organização
    await t.test('Deve retornar status 200 OK', async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis`);
            assert.strictEqual(response.status, 200, 'Status code deve ser 200');
        } catch (error) {
            console.error('Erro no teste "Deve retornar status 200 OK":', error.message);
            throw error; // Relança o erro para o teste falhar
        }
    });

    await t.test('Deve retornar um array de hotéis', async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis`);
            assert.ok(Array.isArray(response.data), 'A resposta deve ser um array');
            assert.ok(response.data.length > 0, 'O array de hotéis não deve estar vazio');
        } catch (error) {
            console.error('Erro no teste "Deve retornar um array de hotéis":', error.message);
            throw error;
        }
    });

    await t.test('Cada hotel deve ter as propriedades básicas', async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis`);
            const firstHotel = response.data[0];

            assert.ok(firstHotel.id !== undefined, 'Hotel deve ter um ID');
            assert.ok(typeof firstHotel.nome === 'string', 'Hotel deve ter um nome string');
            assert.ok(typeof firstHotel.cidade === 'string', 'Hotel deve ter uma cidade string');
            assert.ok(typeof firstHotel.estado === 'string', 'Hotel deve ter um estado string');
            // Nota: Se 'preco' for armazenado como texto no DB, ajuste o typeof esperado
            assert.ok(typeof firstHotel.preco === 'number' || typeof firstHotel.preco === 'string', 'Hotel deve ter um preco (number ou string)');
            assert.ok(typeof firstHotel.avaliacao === 'number' || typeof firstHotel.avaliacao === 'string' || firstHotel.avaliacao === null, 'Hotel deve ter uma avaliacao (number, string ou null)');
            assert.ok(typeof firstHotel.descricao === 'string', 'Hotel deve ter uma descricao string');
            assert.ok(typeof firstHotel.imagem_url === 'string' || firstHotel.imagem_url === null, 'Hotel deve ter uma imagem_url (string ou null)');

        } catch (error) {
            console.error('Erro no teste "Cada hotel deve ter as propriedades básicas":', error.message);
            throw error;
        }
    });
});

// ==========================================================
// TESTES PARA BUSCA DE HOTÉIS POR ID (GET /api/hoteis/:id)
// ==========================================================

test('GET /api/hoteis/:id deve retornar um único hotel', async (t) => {
    // Primeiro, vamos tentar obter um ID de hotel válido para usar no teste
    let testHotelId;
    try {
        const response = await axios.get(`${API_BASE_URL}/hoteis`);
        assert.ok(response.data.length > 0, 'Deve haver hotéis no banco de dados para testar por ID');
        testHotelId = response.data[0].id;
    } catch (error) {
        console.error('Erro ao obter um ID de hotel para teste:', error.message);
        // Se não conseguir obter um ID, falha o teste principal para não continuar
        assert.fail('Não foi possível obter um ID de hotel para testar por ID.');
    }

    await t.test('Deve retornar status 200 OK para um ID válido', async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis/${testHotelId}`);
            assert.strictEqual(response.status, 200, 'Status code deve ser 200 para ID válido');
            assert.ok(response.data.id === testHotelId, `O ID do hotel retornado (${response.data.id}) deve ser igual ao solicitado (${testHotelId})`);
        } catch (error) {
            console.error(`Erro no teste "GET /api/hoteis/:id com ID válido ${testHotelId}":`, error.message);
            throw error;
        }
    });

    await t.test('Deve retornar status 404 Not Found para um ID inexistente', async () => {
        try {
            // Use um ID que você sabe que não existe no seu DB
            const nonExistentId = 999999;
            await axios.get(`${API_BASE_URL}/hoteis/${nonExistentId}`);
            // Se a linha acima não lançar um erro, o teste falha
            assert.fail('Requisição com ID inexistente deveria ter falhado com 404');
        } catch (error) {
            // Verifica se o erro é uma resposta HTTP com status 404
            assert.strictEqual(error.response.status, 404, 'Status code deve ser 404 para ID inexistente');
            assert.strictEqual(error.response.data.error, 'Hotel não encontrado.', 'Mensagem de erro deve ser "Hotel não encontrado."');
        }
    });
});


// ==========================================================
// TESTES PARA BUSCA DE HOTÉIS COM FILTROS (GET /api/hoteis com query params)
// ==========================================================

test('GET /api/hoteis com filtros deve retornar resultados corretos', async (t) => {
    await t.test('Deve filtrar por cidade', async () => {
        const cidadeFiltro = 'São Paulo'; // Use uma cidade que exista no seu DB
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis?cidade=${cidadeFiltro}`);
            assert.strictEqual(response.status, 200, 'Status code deve ser 200');
            assert.ok(Array.isArray(response.data) && response.data.length > 0, 'Deve retornar hotéis para a cidade filtrada');
            response.data.forEach(hotel => {
                assert.strictEqual(hotel.cidade, cidadeFiltro, `Hotel ${hotel.nome} deve ser de ${cidadeFiltro}`);
            });
        } catch (error) {
            console.error(`Erro no teste "filtrar por cidade ${cidadeFiltro}":`, error.message);
            throw error;
        }
    });

    await t.test('Deve filtrar por preço mínimo e máximo', async () => {
        const minPrice = 100;
        const maxPrice = 300;
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis?minPrice=${minPrice}&maxPrice=${maxPrice}`);
            assert.strictEqual(response.status, 200, 'Status code deve ser 200');
            assert.ok(Array.isArray(response.data), 'Deve retornar um array');
            response.data.forEach(hotel => {
                const preco = typeof hotel.preco === 'string' ? parseFloat(hotel.preco) : hotel.preco;
                assert.ok(preco >= minPrice && preco <= maxPrice, `Preço do hotel ${hotel.nome} (${preco}) deve estar entre ${minPrice} e ${maxPrice}`);
            });
        } catch (error) {
            console.error(`Erro no teste "filtrar por preço min/max (${minPrice}-${maxPrice})":`, error.message);
            throw error;
        }
    });

    await t.test('Deve retornar array vazio para filtros sem resultados', async () => {
        const nonExistentCity = 'CidadeInexistenteXYZ';
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis?cidade=${nonExistentCity}`);
            assert.strictEqual(response.status, 200, 'Status code deve ser 200');
            assert.ok(Array.isArray(response.data) && response.data.length === 0, 'Deve retornar um array vazio para cidade inexistente');
        } catch (error) {
            console.error(`Erro no teste "retornar array vazio para cidade inexistente ${nonExistentCity}":`, error.message);
            throw error;
        }
    });
});

// Nota: Para testes mais avançados (POST, PUT, DELETE), você pode querer limpar o DB antes/depois dos testes (usando hooks beforeEach/afterEach do test runner)
// e ter dados de teste específicos para cada cenário.
