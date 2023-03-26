const db = openDatabase("usuarios", "1.0", "Test DB", 2 * 1024 * 1024);

async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (nome TEXT, rg TEXT, cpf TEXT, cep TEXT, endereco TEXT, numero INTEGER, bairro TEXT, cidade TEXT, estado TEXT, complemento TEXT, sexo TEXT, datanascimento DATE, estadocivil TEXT)",
        [],
        resolve,
        (error) => reject(error)
      );
    });
  });
}

async function saveDate() {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const rg = document.getElementById("rg").value;
  const cpf = document.getElementById("cpf").value;
  const cep = document.getElementById("cep").value;
  const endereco = document.getElementById("endereco").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const complemento = document.getElementById("complemento").value;
  const sexo = document.getElementById("sexo").value;
  const datanascimento = document.getElementById("data-nascimento").value;
  const estadocivil = document.getElementById("estado-civil").value;

  await createTable();

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO users (nome, rg, cpf, cep, endereco, numero, bairro, cidade, estado, complemento, sexo, datanascimento, estadocivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
          [
            nome,
            rg,
            cpf,
            cep,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            complemento,
            sexo,
            datanascimento,
            estadocivil,
          ],
          resolve,
          (error) => reject(error)
        );
      },
      (error) => reject(error)
    );
    clearData();
  });
}


//função para limpar os campos dos input
function clearData() {
  const elements = [
    "nome",
    "rg",
    "cpf",
    "cep",
    "endereco",
    "data-nascimento",
    "bairro",
    "complemento",
    "numero",
    "estado",
    "cidade",
  ];

  elements.forEach((element) => {
    document.getElementById(element).value = "";
  });

  document.getElementById("sexo").value = "masculino";
  document.getElementById("estado-civil").value = "solteiro";
}

//função para formatar CPF
function formatCPF(cpfInput) {
  let cpf = cpfInput.value.replace(/\D/g, "");

  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  cpfInput.value = cpf;
}

//função para formatar RG
function formatRG(rgInput) {
  let rg = rgInput.value.replace(/\D/g, "");

  rg = rg.replace(/(\d{3})(\d)/, "$1.$2");
  rg = rg.replace(/(\d{3})(\d)/, "$1.$2");
  rg = rg.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  rgInput.value = rg;
}

//função simples para validar formulario...
function validateForm() {
  let nome = document.getElementById("nome").value;
  let rg = document.getElementById("rg").value;
  let cpf = document.getElementById("cpf").value;
  let cep = document.getElementById("cep").value;
  let endereco = document.getElementById("endereco").value;
  let datanascimento = document.getElementById("data-nascimento").value;
  let cidade = document.getElementById("cidade").value;
  let numero = document.getElementById("numero").value;
  let bairro = document.getElementById("bairro").value;
  let estado = document.getElementById("estado").value;

  if (
    nome === "" ||
    rg === "" ||
    cpf === "" ||
    cep === "" ||
    endereco === "" ||
    datanascimento === "" ||
    cidade === "" ||
    numero === "" ||
    bairro === "" ||
    estado === ""
  ) {
    alert("por favor, preencha todos os campos obrigatorios.");
    return false;
  }
  return true;
}

//função para consultar endereco via cep
function consultAdress() {
  event.preventDefault();
  let cep = document.getElementById("cep").value;

  if (cep.length !== 8) {
    alert("CEP invalido");
    return;
  }

  let url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url).then(function (resp) {
    resp.json().then(function (data) {
      let resultCity = document.getElementById("cidade");
      let resultState = document.getElementById("estado");

      resultState.value = `${data.uf}`;
      resultCity.value = `${data.localidade}`;
    });
  });
}

//função para consultar usuario pode ID
function consultUser() {
  event.preventDefault();
  const id = document.getElementById("id_usuario").value;
  const campos = [
    "nome",
    "rg",
    "cpf",
    "cep",
    "endereco",
    "complemento",
    "data-nascimento",
    "cidade",
    "numero",
    "bairro",
    "estado",
  ];

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE rowid = ?",
      [id],
      function (tx, result) {
        let pessoa = result.rows.item(0);
        campos.forEach((field) => {
          document.getElementById(field).value = pessoa[field];
        });
      }
    );
  });
}

//obtém o modal
const modal = document.getElementById("myModal");

//obtém o botão que abre o modal
const openModalBtn = document.getElementById("openModalBtn");

//obtém o botão de fechar
const closeBtn = document.getElementsByClassName("close")[0];

//obtém o botão de consultar usuário
const consultUserBtn = document.getElementById("consultUserBtn");

//quando o usuário clicar no botão, abre o modal
openModalBtn.addEventListener("click", function () {
  event.preventDefault();
  modal.style.display = "block";
});

//quando o usuário clicar no botão de fechar ou fora do modal, fecha o modal
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

//quando o usuario clicar no botão de consultar usuario, chama a função consultUser()
consultUserBtn.addEventListener("click", consultUser);

//função para consultar todos os usuários no banco de dados,,,
function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users",
        [],
        (result) => {
          const users = [];
          for (let i = 0; i < result.rows.length; i++) {
            users.push(result.rows.item(i));
          }
          resolve(users);
          console.log(users);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}

//modal de consultar todos os Usuarios.
const openModalBtn1 = document.querySelector("#openModalBtn1");
const modalContent = document.querySelector(".modal-content1");

//adiciona um eventlistener para o evento click no botão openModalBtn1
openModalBtn1.addEventListener("click", async () => {
  event.preventDefault();

  //remove a lista de usuários (se ela já existir)...
  const existingUserList = modalContent.querySelector("ul");
  if (existingUserList) {
    modalContent.removeChild(existingUserList);
  }

  // Busca todos os usuários e exibe em uma lista...
  const users = await getAllUsers();
  const userList = document.createElement("ul");
  users.forEach((user) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Nome: ${user.nome} - RG: ${user.rg} - CPF: ${user.cpf}`;
    userList.appendChild(listItem);
  });

  modalContent.appendChild(userList);

  //exibe o modal...
  const modal = document.querySelector("#myModal1");
  modal.style.display = "block";
});

//fecha o modal quando o botão de fechar é clicado...
const closeModalBtn = document.querySelector(".close1");
closeModalBtn.addEventListener("click", () => {
  const modal = document.querySelector("#myModal1");
  modal.style.display = "none";
});

function updateUser() {
  const id = document.getElementById("id_usuario").value;
  const campos = [
    "nome",
    "rg",
    "cpf",
    "cep",
    "endereco",
    "complemento",
    "data-nascimento",
    "cidade",
    "numero",
    "bairro",
    "estado",
  ];
  const valores = campos.map((campo) => document.getElementById(campo).value);

  db.transaction(function (tx) {
    tx.executeSql(
      "UPDATE users SET nome=?, rg=?, cpf=?, cep=?, endereco=?, complemento=?, datanascimento=?, cidade=?, numero=?, bairro=?, estado=? WHERE rowid=?",
      [...valores, id],
      function () {
        console.log("Usuário atualizado com sucesso!");
        clearData();
      },
      function (tx, error) {
        console.log("Erro ao atualizar usuário: ");
      }
    );
  });
}

// Adiciona o evento de click no botão de edição
const btnEdit = document.getElementById("btn-edit");
btnEdit.addEventListener("click", function () {
  consultUser();
  updateUser();
});

function deleteUser() {
  event.preventDefault();
  const id = document.getElementById("id_usuario").value;

  db.transaction(function (tx) {
    tx.executeSql(
      "DELETE FROM users WHERE rowid = ?",
      [id],
      function (tx, resultado) {
        alert("Usuário excluído com sucesso!");
        clearData();
      },
      function (tx, error) {
        alert("Erro ao excluir usuário!");
        console.log(error);
      }
    );
  });
}
