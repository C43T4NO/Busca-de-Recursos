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

                // Obtém a permissão do usuário
                let permissao = user.Permissao;

                // Consulta a tabela recursos para verificar a permissão do usuário
                connection.query('SELECT Permissao FROM usuarios WHERE id = ?', [user.id], (err, result) => {
                    if (err) {
                        console.error('Erro ao buscar permissão do usuário:', err);
                        res.writeHead(500);
                        res.end();
                        return;
                    }

                    // Se houver registros na tabela recursos para o usuário, atualize a permissão
                    if (result.length > 0) {
                        permissao = result[0].Permissao;
                    }

                    // Se chegou até aqui, o login foi bem-sucedido
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ message: 'Login bem-sucedido.', permissao: permissao, usuarioId: user.id }));
                });
            });
        });
    } else if (req.url === '/empresas' && req.method === 'GET') {
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
    } else if (req.url === '/recursos' && req.method === 'GET') {
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
    } else if (req.url.startsWith('/recursos-por-empresa') && req.method === 'GET') {
        // Lógica para buscar recursos associados à empresa
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const empresaId = urlParams.get('empresa');

        // Verifica se o ID da empresa foi fornecido na URL
        if (!empresaId) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'O ID da empresa é obrigatório.' }));
            return;
        }

        // Consulta o banco de dados para buscar os recursos associados à empresa
        connection.query('SELECT * FROM recursos WHERE empresa_id = ?', [empresaId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar recursos associados à empresa:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        });
    } else if (req.url.startsWith('/empresa-por-id') && req.method === 'GET') {
        // Lógica para buscar o nome da empresa pelo ID
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const empresaId = urlParams.get('id');

        // Verifica se o ID da empresa foi fornecido na URL
        if (!empresaId) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'O ID da empresa é obrigatório.' }));
            return;
        }

        // Consulta o banco de dados para buscar o nome da empresa pelo ID
        connection.query('SELECT nome FROM empresas WHERE id = ?', [empresaId], (err, results) => {
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
        // Lógica para incluir ou remover empresa/recurso...
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const requestData = JSON.parse(body);
            const { acao, tipo, id } = requestData;

            // Verifica se a ação, tipo e ID foram fornecidos
            if (!acao || !tipo || !id) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Ação, tipo e ID são obrigatórios.' }));
                return;
            }
            // Consulta o banco de dados para verificar a permissão do usuário
            connection.query('SELECT Permissão FROM usuarios WHERE id = ?', [user.id], (err, permResults) => {
                if (err) {
                    console.error('Erro ao buscar permissão do usuário:', err);
                    res.writeHead(500);
                    res.end();
                    return;
                }
                const permissao = permResults[0] ? permResults[0].Permissão : 'Não'; // Assumindo que 'Permissão' é um campo na tabela de usuários

                // Verifica se o usuário tem permissão de administrador
                if (permissao !== 'Sim') {
                    res.writeHead(403);
                    res.end(JSON.stringify({ message: 'Permissão insuficiente.' }));
                    return;
                }
                // Lógica para incluir uma nova empresa no banco de dados
                if (tipo === 'empresa') {
                    const { id, nome } = requestData;
                    
                    // Verifique se os campos obrigatórios estão presentes
                    if (!id || !nome) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ message: 'ID e nome da empresa são obrigatórios.' }));
                        return;
                    }
                    
                    // Insira os dados da empresa no banco de dados
                    connection.query('INSERT INTO empresas (id, nome) VALUES (?, ?)', [id, nome], (err, results) => {
                        if (err) {
                            console.error('Erro ao incluir empresa:', err);
                            res.writeHead(500);
                            res.end();
                            return;
                        }
                        // Retorna uma mensagem de sucesso
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Empresa incluída com sucesso.' }));
                    });
                } else if (tipo === 'recurso') {
                    const { id } = requestData;
                    
                    // Verifique se os campos obrigatórios estão presentes
                    if (!id) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ message: 'ID do recurso é obrigatório.' }));
                        return;
                    }
                    
                    // Remove o recurso do banco de dados
                    connection.query('DELETE FROM recursos WHERE id = ?', [id], (err, result) => {
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
    } else if (req.url.startsWith('/empresas/') && req.method === 'DELETE') {
        // Lógica para excluir uma empresa
        const empresaId = req.url.split('/')[2]; // Obtém o ID da empresa da URL
        connection.query('DELETE FROM empresas WHERE id = ?', [empresaId], (err, result) => {
            if (err) {
                console.error('Erro ao excluir empresa:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Empresa excluída com sucesso.' }));
        });
    } else if (req.url.startsWith('/recursos/') && req.method === 'DELETE') {
        // Lógica para excluir um recurso
        const recursoId = req.url.split('/')[2]; // Obtém o ID do recurso da URL
        connection.query('DELETE FROM recursos WHERE id = ?', [recursoId], (err, result) => {
            if (err) {
                console.error('Erro ao excluir recurso:', err);
                res.writeHead(500);
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Recurso excluído com sucesso.' }));
        });
    } else {
        // Rota não encontrada
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Rota não encontrada.' }));
    }
});

// Inicie o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
