// inroom-backend/tests/performance/hotelSearch.k6.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// URL base da sua API
const API_BASE_URL = 'http://localhost:3000/api'; // Verifique novamente seu IP e porta

// Dados para pesquisa (para simular pesquisas reais)
// Você pode carregar isso de um arquivo JSON maior se quiser mais realismo
const searchQueries = new SharedArray('Search Queries', function () {
    return [
        { cidade: 'São Paulo', estado: 'SP' },
        { cidade: 'Rio de Janeiro', estado: 'RJ' },
        { minPrice: 100, maxPrice: 500 },
        { estado: 'MG', minPrice: 80 },
        { cidade: 'Belo Horizonte' },
        {} // Pesquisa vazia
    ];
});

export const options = {
    // Cenários de teste de carga:
    scenarios: {
        // Cenário 1: "Teste de Fumaça" (Smoke Test)
        // Poucos VUs para verificar se o sistema funciona sob carga mínima
        smoke: {
            executor: 'constant-vus',
            vus: 2, // 2 usuários virtuais
            duration: '10s', // Por 10 segundos
            exec: 'searchHotels', // Função a ser executada
            tags: { test_type: 'smoke_test' },
        },
        // Cenário 2: "Teste de Carga" (Load Test)
        // Aumentar gradualmente os VUs
        load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 20 },  // Rampa de 0 a 20 VUs em 1 minuto
                { duration: '3m', target: 20 },  // Mantém 20 VUs por 3 minutos
                { duration: '1m', target: 0 },   // Desce para 0 VUs em 1 minuto
            ],
            exec: 'searchHotels',
            tags: { test_type: 'load_test' },
        },
        // Cenário 3: "Teste de Pico" (Spike Test) - Opcional, para carga abrupta
        spike: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 50 }, // Pico rápido para 50 VUs
                { duration: '20s', target: 0 },  // Cai rapidamente
            ],
            exec: 'searchHotels',
            tags: { test_type: 'spike_test' },
        },
    },
    // Métricas para monitorar
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% das requisições devem ser menores que 500ms
        http_req_failed: ['rate<0.01'],   // Menos de 1% das requisições podem falhar
    },
};

// Função principal que cada "usuário virtual" executa
export function searchHotels() {
    // Escolhe uma query aleatória para simular diferentes buscas
    const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];

    let url = `${API_BASE_URL}/hoteis`;
    if (Object.keys(randomQuery).length > 0) {
        const queryParams = new URLSearchParams();
        for (const key in randomQuery) {
            queryParams.append(key, randomQuery[key]);
        }
        url += `?${queryParams.toString()}`;
    }

    const res = http.get(url);

    // Verifica se a requisição foi bem-sucedida (status 200)
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response body is array': (r) => Array.isArray(r.json()),
    });

    // Pausa para simular tempo de "usuário real" entre as requisições
    sleep(1); // Espera 1 segundo
}