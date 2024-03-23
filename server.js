const http = require('http');
const mysql = require('mysql');

// Configurações do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '01022001',
    database: 'ideia2000'
});

// Conecta ao banco de dados
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

// Crie o servidor HTTP
const server = http.createServer((req, res) => {
    // Permitindo CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        // Responde a solicitações OPTIONS
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const requestData = JSON.parse(body);
            const { usuario, senha } = requestData;

            // Verifica se o usuário e a senha foram fornecidos
            if (!usuario || !senha) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Usuário e senha são obrigatórios.' }));
                return;
            }

            // Consulta o banco de dados para verificar as credenciais
            connection.query('SELECT * FROM usuarios WHERE usuario = ? OR email = ?', [usuario, usuario], (err, results) => {
                if (err) {
                    console.error('Erro ao buscar usuário:', err);
                    res.writeHead(500);
                    res.end();
                    return;
                }

                // Verifica se o usuário foi encontrado
                if (results.length === 0) {
                    res.writeHead(401);
                    res.end(JSON.stringify({ message: 'Usuário não encontrado.' }));
                    return;
                }

                const user = results[0];

                // Verifica se a senha está correta
                if (user.senha !== senha) {
                    res.writeHead(401);
                    res.end(JSON.stringify({ message: 'Senha incorreta.' }));
                    return;
                }

                // Se chegou até aqui, o login foi bem-sucedido
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Login bem-sucedido.' }));
            });
        });
    } else if (req.url === '/empresas') {
        // Lógica para buscar empresas
        connection.query('SELECT * FROM empresas', (err, results) => {
            if (err) {
                console.error('Erro ao buscar empresas:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        });
    } else if (req.url === '/recursos') {
        // Lógica para buscar recursos
        connection.query('SELECT * FROM recursos', (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

// Inicie o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});