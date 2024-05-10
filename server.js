const http = require('http');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '01022001',
    database: 'ideia2000'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

const handleRequest = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
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
            const { usuario, senha } = JSON.parse(body);

            if (!usuario || !senha) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Usuário e senha são obrigatórios.' }));
                return;
            }

            const query = `SELECT * FROM usuarios WHERE usuario = ? OR email = ?`;
            connection.query(query, [usuario, usuario], (err, results) => {
                if (err) {
                    console.error('Erro ao buscar usuário:', err);
                    res.writeHead(500);
                    res.end();
                    return;
                }

                if (results.length === 0 || results[0].senha !== senha) {
                    res.writeHead(401);
                    res.end(JSON.stringify({ message: 'Usuário ou senha incorretos.' }));
                    return;
                }

                const user = results[0];
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Login bem-sucedido.', permissao: user.Permissão, usuarioId: user.id }));
            });
        });
    } else if (req.url === '/empresas' && req.method === 'GET') {
        // Lógica para buscar empresas
        const query = 'SELECT * FROM empresas';
        executeQuery(query, res);
    } else if (req.url === '/recursos' && req.method === 'GET') {
        // Lógica para buscar recursos
        const query = 'SELECT * FROM recursos';
        executeQuery(query, res);
    }
    else if (req.url.startsWith('/recursos-por-empresa') && req.method === 'GET') {
        // Lógica para buscar recursos associados à empresa
        const empresaId = new URLSearchParams(req.url.split('?')[1]).get('empresa');
        if (!empresaId) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'O ID da empresa é obrigatório.' }));
            return;
        }
        const query = 'SELECT * FROM recursos WHERE empresa_id = ?';
        connection.query(query, [empresaId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos associados à empresa:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        });
    } else if (req.url.startsWith('/empresas-por-recurso') && req.method === 'GET') {
        const recursoId = new URLSearchParams(req.url.split('?')[1]).get('recurso');
        if (!recursoId) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'O ID do recurso é obrigatório.' }));
            return;
        }
        const query = `
            SELECT e.nome AS nome_empresa, r.nome AS nome_recurso 
            FROM empresas e 
            INNER JOIN recursos r ON e.id = r.empresa_id 
            WHERE r.id = ?
        `;
        connection.query(query, [recursoId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar empresas por recurso:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        });  
    }
     else if (req.url.startsWith('/empresa-por-id') && req.method === 'GET') {
        // Lógica para buscar o nome da empresa pelo ID
        const empresaId = new URLSearchParams(req.url.split('?')[1]).get('id');
        if (!empresaId) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'O ID da empresa é obrigatório.' }));
            return;
        }
        const query = 'SELECT nome FROM empresas WHERE id = ?';
        connection.query(query, [empresaId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar nome da empresa:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            if (results.length === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Empresa não encontrada.' }));
                return;
            }
            const empresa = results[0];
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(empresa));
        });
    } else if (req.url === '/incluir-remover' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { acao, tipo, id } = JSON.parse(body);
            if (!acao || !tipo) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Ação e tipo são obrigatórios.' }));
                return;
            }
            // Consulta o banco de dados para verificar a permissão do usuário
            const query = 'SELECT Permissão FROM usuarios WHERE id = ?';
            connection.query(query, [user.id], (err, permResults) => {
                if (err) {
                    console.error('Erro ao buscar permissão do usuário:', err);
                    res.writeHead(500);
                    res.end();
                    return;
                }
                const permissao = permResults[0] ? permResults[0].Permissao : 'Não';
                if (permissao !== 'Sim') {
                    res.writeHead(403);
                    res.end(JSON.stringify({ message: 'Permissão insuficiente.' }));
                    return;
                }
                if (tipo === 'empresa') {
                    if (!acao || !id) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ message: 'ID e nome da empresa são obrigatórios.' }));
                        return;
                    }
                    const query = 'INSERT INTO empresas (nome) VALUES (?)';
                    connection.query(query, [acao], (err, results) => {
                        if (err) {
                            console.error('Erro ao incluir empresa:', err);
                            res.writeHead(500);
                            res.end();
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Empresa incluída com sucesso.' }));
                    });
                } else if (tipo === 'recurso') {
                    if (!id) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ message: 'ID do recurso é obrigatório.' }));
                        return;
                    }
                    const query = 'DELETE FROM recursos WHERE id = ?';
                    connection.query(query, [id], (err, result) => {
                        if (err) {
                            console.error('Erro ao excluir recurso:', err);
                            res.writeHead(500);
                            res.end();
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Recurso excluído com sucesso.' }));
                    });
                }
            });
        });
    }
    else if (req.url === '/incluir-empresa' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Dados recebidos para inclusão da empresa:', body); // Mensagem de log para verificar os dados recebidos
            const { id, nome } = JSON.parse(body);
            if (!id || !nome) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'ID e nome da empresa são obrigatórios.' }));
                return;
            }
            const query = 'INSERT INTO empresas (id, nome) VALUES (?, ?)';
            connection.query(query, [id, nome], (err, results) => {
                if (err) {
                    console.error('Erro ao incluir empresa:', err);
                    res.writeHead(500);
                    res.end();
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Empresa incluída com sucesso.' }));
            });
        });
    } else if (req.url === '/incluir-recurso' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Dados recebidos para inclusão do recurso:', body); // Mensagem de log para verificar os dados recebidos
            const { id, nome, empresa_id } = JSON.parse(body);
            if (!id || !nome || !empresa_id) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'ID, nome do recurso e ID da empresa são obrigatórios.' }));
                return;
            }
            const query = 'INSERT INTO recursos (id, nome, empresa_id) VALUES (?, ?, ?)';
            connection.query(query, [id, nome, empresa_id], (err, results) => {
                if (err) {
                    console.error('Erro ao incluir recurso:', err);
                    res.writeHead(500);
                    res.end();
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Recurso incluído com sucesso.' }));
            });            
        });    
    } else if (req.url.startsWith('/empresas/') && req.method === 'DELETE') {
        const empresaId = req.url.split('/')[2];
        const query = 'DELETE FROM empresas WHERE id = ?';
        executeQuery(query, res, empresaId);
    } else if (req.url.startsWith('/recursos/') && req.method === 'DELETE') {
        const recursoId = req.url.split('/')[2];
        const query = 'DELETE FROM recursos WHERE id = ?';
        executeQuery(query, res, recursoId);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Rota não encontrada.' }));
    }
};      
const executeQuery = (query, res, param = null) => {
    connection.query(query, param, (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta:', err);
            res.writeHead(500);
            res.end();
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(results));
    });
};

const server = http.createServer(handleRequest);

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
