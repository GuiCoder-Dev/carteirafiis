# carteirafiis
Sistema web para controle e acompanhamento de carteira de Fundos Imobiliários (FIIs)

---

## 🎯 Sobre o Projeto
Aplicação full-stack para investidores de FIIs gerenciarem sua carteira de forma centralizada, registrando transações, acompanhando rendimentos e visualizando o desempenho dos ativos.

- ✅ Cadastro e autenticação de usuários com verificação por e-mail
- ✅ Gerenciamento de FIIs (cadastro, listagem, detalhes)
- ✅ Registro de transações de compra e venda
- ✅ Controle de rendimentos (earnings) por ativo
- ✅ Proteção de rotas com JWT (Spring Security)
- ✅ API REST estruturada com DTOs e tratamento global de exceções

---

## 🧑‍💻 Tecnologias Utilizadas

### Backend (Desenvolvido 100% por mim)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)

### Frontend (Com auxílio de IA)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Ferramentas de Desenvolvimento
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## 🔐 Funcionalidades de Segurança
- ✅ Autenticação com JWT (geração e validação de tokens)
- ✅ Proteção de endpoints via Spring Security
- ✅ Verificação de e-mail no cadastro (integração com Resend SDK)
- ✅ Tratamento global de exceções com respostas padronizadas

---

## ⚙️ Requisitos
Antes de começar, certifique-se de ter instalado:

- **MySQL 8.0+** — [Download](https://www.mysql.com/downloads/)
- **JDK 21+** — [Download](https://www.oracle.com/java/technologies/javase-jdk21-downloads.html)
- **Node.js 22+ e NPM** — [Download](https://nodejs.org/)
- **Maven 3.9+** — incluso no IntelliJ ou [Download](https://maven.apache.org/download.cgi)

---

## ✨ Como Rodar o Projeto

### Backend (Java/Spring Boot)

**1. Clone o repositório:**
```bash
git clone https://github.com/GuiCoder-Dev/carteirafiis.git
cd carteirafiis/backend
```

**2. Configure o banco de dados no `application.properties` (ou `application.yml`):**
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/carteirafiis?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

**3. Configure as variáveis de e-mail (Resend SDK):**
```properties
resend.api.key=sua_chave_resend
```

**4. Rode a aplicação pelo IntelliJ ou via terminal:**
```bash
./mvnw spring-boot:run
```

---

### Frontend (React)

**1. Acesse a pasta do frontend:**
```bash
cd carteirafiis/frontend
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm start
```

---

## 👀 Rodar Localmente

- 🔄️ Backend (porta: **8080**)
- 🔄️ Frontend (porta: **3000**)

---

## 😥 Observações

- É necessário ter um banco MySQL rodando localmente antes de iniciar o backend
- As variáveis sensíveis (chave JWT, chave Resend, credenciais do banco) devem ser configuradas antes de rodar o projeto
- O frontend consome a API do backend em `http://localhost:8080`
