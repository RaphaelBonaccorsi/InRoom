CREATE TABLE IF NOT EXISTS hoteis (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    avaliacao DECIMAL(2, 1),
    -- Adicione mais campos que você possa precisar, como imageUrl, quartos_disponiveis, etc.
    imagem_url VARCHAR(255)
);