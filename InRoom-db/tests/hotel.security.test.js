// inroom-backend/tests/security/hotelSearch.security.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api'; // Verifique novamente seu IP e porta

test('Testes de Segurança para Pesquisa de Hotéis', async (t) => {

    await t.test('Deve impedir injeção SQL via filtro de cidade', async () => {
        // Tentar injetar SQL na query string
        const maliciousCity = "' OR 1=1; --"; // Comentário SQL
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis?cidade=${maliciousCity}`);
            // Esperamos que o banco de dados trate isso como uma string literal de cidade,
            // e não execute a injeção. Portanto, a resposta deve ser vazia ou erro controlado.
            assert.strictEqual(response.status, 200, 'Status code deve ser 200');
            assert.ok(Array.isArray(response.data), 'A resposta deve ser um array');
            assert.strictEqual(response.data.length, 0, 'Não deve retornar resultados para cidade maliciosa, indicando que não houve injeção.');
            // Se seu DB *tivesse* uma cidade com esse nome literal, este teste falharia.
            // O ponto é que ele NÃO deve retornar TODOS os hotéis devido à injeção.
        } catch (error) {
            console.error('Erro no teste de injeção SQL (cidade):', error.response ? error.response.data : error.message);
            // Se o servidor retornar 500 por um erro de SQL malformado (mas controlado), isso ainda seria aceitável para segurança.
            // O importante é NÃO vazar dados ou ter a query comprometida.
            assert.fail('A injeção SQL deveria ter sido impedida ou resultou em erro controlado, não em dados vazados.');
        }
    });

    await t.test('Deve impedir injeção SQL via filtro de preço (não-numérico)', async () => {
        // Tentar injetar SQL em um campo numérico
        const maliciousPrice = "100 OR 1=1; DROP TABLE users; --"; // Exemplo extremo
        try {
            // Se seu backend parsear para float, isso deve virar NaN ou um número,
            // e a query parametrizada não será afetada.
            await axios.get(`${API_BASE_URL}/hoteis?minPrice=${maliciousPrice}`);
            assert.fail('Requisição com preço malicioso deveria ter retornado erro 400 ou 500.');
        } catch (error) {
            // Esperamos um erro 400 (Bad Request) por validação de input, ou 500 (Internal Server Error)
            // se o parseFloat falhar e o DB rejeitar o tipo de dado.
            assert.ok([400, 500].includes(error.response.status), 'Status code deve ser 400 ou 500 para input malicioso.');
            assert.ok(error.response.data.error, 'Deve retornar uma mensagem de erro.');
        }
    });

    await t.test('Deve lidar com caracteres especiais nos filtros de forma segura', async () => {
        // Caracteres que poderiam ser problemáticos sem sanitização/parametrização
        const specialCharCity = "São Carlos '\"&<>%!()";
        try {
            const response = await axios.get(`${API_BASE_URL}/hoteis?cidade=${encodeURIComponent(specialCharCity)}`);
            assert.strictEqual(response.status, 200, 'Status code deve ser 200');
            assert.ok(Array.isArray(response.data), 'A resposta deve ser um array');
            // Se você tiver um hotel com esse nome literal, ele seria retornado.
            // O ponto é que a query NÃO deve falhar ou ser injetada.
            // Para este teste, esperaremos que não encontre nada ou que o sistema lide sem erro.
        } catch (error) {
            console.error('Erro ao testar caracteres especiais:', error.response ? error.response.data : error.message);
            assert.fail('Requisição com caracteres especiais não deveria ter falhado por injeção.');
        }
    });
});