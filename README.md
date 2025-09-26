# 📂 Frontend → README.md

# ✅ SimpleCheck - Frontend

Frontend em **HTML, CSS e JavaScript puro** que consome a API do projeto **SimpleCheck**.

---

## 🚀 Tecnologias

* [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
* [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
* [JavaScript (fetch API)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)

---

## 📂 Estrutura do projeto

```
frontend/
│ index.html   # página principal
│ styles.css   # estilos do app
│ app.js       # lógica SPA + integração com backend
│ README.md    # este arquivo
```

---

## ▶️ Como usar

### 1. Pré-requisito

Certifique-se que o **backend** está rodando em:
👉 [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 2. Abrir aplicação

Basta abrir o arquivo `index.html` no navegador (não precisa servidor extra).

---

## 📖 Funcionalidades

* Criar novas tarefas (com título e data limite).
* Listar tarefas pendentes e concluídas.
* Marcar como concluída (checkbox).
* Editar conteúdo e data da tarefa.
* Excluir tarefa.
* Separação visual entre **pendentes** e **concluídas**.
* Destaque de **tarefas atrasadas** e **entregues hoje**.

---

## 📸 Demonstração

![Demonstração do SimpleCheck]([frontend/assets/print.png](https://github.com/Renanarauujo/simplecheck-frontend/blob/main/assets/print.png?raw=true))

---

## 🔗 Integração com Backend

O arquivo `app.js` usa a constante `API_URL` para se conectar à API:

```js
const API_URL = "http://127.0.0.1:5000/api/todos";
```

Se a API estiver em outro endereço, basta alterar esse valor.

---

👉 Agora você já tem os dois **README.md** prontos e organizados.
