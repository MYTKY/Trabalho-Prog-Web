Para acessar rodar:
1) mvn spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"

2) Acesse http://localhost:8081/login
cpf: 123456789
senha: 1234

# Requisitos e Implementações:

Uso do Banco de dados Supabase devido a facilidade de suas APIs e familiaridade.
- Tabela do Supabase:
- usuarios: id, nome, cpf, senha, tenant_id.
- produtos: id, nome, categoria, preco (numeric), estoque (int), imagem_url, tenant_id.

Implementação da ferramenta Evolution API para envio de pedidos ao vendedor.

Implementação de técnica Multi-Tenant, controle de usuários e seus produtos respectivos.
