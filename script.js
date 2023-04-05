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
  const datanascimento = document.getElementById("datanascimento").value;
  const estadocivil = document.getElementById("estadocivil").value;

  let fields = [
    { name: "nome", label: "Nome" },
    { name: "rg", label: "RG" },
    { name: "cpf", label: "CPF" },
    { name: "cep", label: "CEP" },
    { name: "endereco", label: "Endereço" },
    { name: "numero", label: "Numero" },
    { name: "bairro", label: "Bairro" },
    { name: "cidade", label: "Cidade" },
    { name: "estado", label: "Estado" },
    { name: "complemento", label: "Complemento" },
    { name: "sexo", label: "Sexo" },
    { name: "datanascimento", label: "Data de Nascimento" },
    { name: "estadocivil", label: "Estado Civil" },
  ];

  let field_empty = [];

  fields.forEach(function(field) {
    if (!eval(field.name)) {
      field_empty.push(field.label);
    }
  });

  if (field_empty.length > 0) {
    let msg = "Os seguintes fields estão em branco: ";
    msg += field_empty.join(", ") + ". Por favor preencha eles.";

    Swal.fire({
      icon: "error",
      title: "Error ao enviar...",
      text: msg,
    });
    return;
  }

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
    Swal.fire({
      icon: 'success',
      title: 'Dados salvos com sucesso!',
      showConfirmButton: false,
      timer: 1500
    });
  });
}

// consulta o cpf e o rg no banco de dados, se existir aparece uma msg..
const rgField = document.getElementById("rg");
const cpfField = document.getElementById("cpf");

rgField.addEventListener("blur", checkIfAlreadyExists);
cpfField.addEventListener("blur", checkIfAlreadyExists);

async function checkIfAlreadyExists(event) {
  const fieldValue = event.target.value;
  const fieldName = event.target.id;
  
  if (!fieldValue) {
    return;
  }

  let result = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM users WHERE ${fieldName} = ? LIMIT 1`,
        [fieldValue],
        (tx, result) => {
          resolve(result.rows.length > 0);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });

  if (result) {
    Swal.fire({
      icon: "info",
      title: `O ${fieldName.toUpperCase()} já está cadastrado no sistema!`,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

//função para limpar os campos dos input
function clearData() {
  const elements = [
    "nome",
    "rg",
    "cpf",
    "datanascimento",
    "cep",
    "endereco",
    "complemento",
    "bairro",
    "numero",
    "estado",
    "cidade",
  ];

  let oneFieldClear = false;

  elements.forEach((element) => {
    if (document.getElementById(element).value !== "") {
      document.getElementById(element).value = "";
      oneFieldClear = true;
    }
  });

  if (oneFieldClear) {
    Swal.fire({
      icon: "success",
      title: "Campos limpos com sucesso!",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      icon: "info",
      title: "Todos os campos já estão limpos!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

//função para formatar CPF

function formatCPF(cpfInput) {
  let cpf = cpfInput.value.replace(/\D/g, "");

  // verificação de CPF válido
  if (cpf.length === 11) {
    var Soma;
    var Resto;

    Soma = 0;
    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10))) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, insira um CPF válido.",
        showConfirmButton: false,
        timer: 1500,
      });
      cpfInput.value = "";
      return;
    }

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11))) {
      Swal.fire({
        icon: "warning",
        title: "CPF Invalido.",
        showConfirmButton: false,
        timer: 1500,
      });
      cpfInput.value = "";
      return;
    }
  }

  cpfInput.removeAttribute("readonly");

  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = cpf.substr(0, 14);
}

//Função para formatar RG
function formatRG(rgInput) {
  let rg = rgInput.value.replace(/\D/g, "");
  rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4$5");
  rgInput.value = rg.substr(0, 13);

  if (rgInput.value.length === 12) {
    rgInput.setAttribute("maxlength", "12");
  }
}

function birthValidation() {
  let inputNascimento = document.getElementById("datanascimento");

  inputNascimento.addEventListener("blur", (event) => {
    const birth = event.target.value;
    console.log(birth);

    // extrair os 4 últs caracter
    const year = parseInt(birth.substring(0, 4));
    console.log(year, "a");

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, insira uma data válida.",
        showConfirmButton: false,
        timer: 1500,
      });
      inputNascimento.value = "";
    }
  });
}
birthValidation();

//função para consultar endereco via cep
function consultAdress() {
  event.preventDefault();
  let cep = document.getElementById("cep").value;

  if (cep === "") {
    Swal.fire({
      icon: "warning",
      title: "Por favor, insira um CEP.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  let url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url).then(function (resp) {
    resp.json().then(function (data) {
      if (data.erro) {
        Swal.fire({
          icon: "warning",
          title: "CEP não encontrado. Por favor, verifique o CEP informado.",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Operação realizada com sucesso .",
        showConfirmButton: false,
        timer: 1200,
      });
      let resultCity = document.getElementById("cidade");
      let resultState = document.getElementById("estado")
      resultState.value = `${data.uf}`;
      resultCity.value = `${data.localidade}`;
    });
  });
}

function formatCep(event) {
  const maxLength = 9;
  let cep = event.target.value;
  cep = cep.replace(/\D/g, "");
  cep = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  event.target.value = cep;

  // bloqueia a entrada de novos caracts quando o numero máx de caracteres é atingido
  if (cep.length >= maxLength) {
    event.target.setAttribute("maxlength", maxLength);
  } else {
    event.target.removeAttribute("maxlength");
  }
}

document.getElementById("cep").addEventListener("input", formatCep);

function consultUser() {
  event.preventDefault();
  const id = document.getElementById("id_usuario").value;
  const fields = [
    "nome",
    "rg",
    "cpf",
    "sexo",
    "datanascimento",
    "estadocivil",
    "cep",
    "endereco",
    "complemento",
    "cidade",
    "numero",
    "bairro",
    "estado",
  ];

   if (id === "") {
    Swal.fire({
      icon: "warning",
      title: "Preencha o campo 'ID do usuário'!",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }


  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE rowid = ?",
      [id],
      function (tx, result) {
        if (result.rows.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Usuário não existe!",
            showConfirmButton: false,
            timer: 1500,
          });
          document.getElementById("id_usuario").value = "";
          return;
        }

        let user = result.rows.item(0);
        fields.forEach((field) => {
          document.getElementById(field).value = user[field];
        });

        Swal.fire({
          icon: "success",
          title: "Usuário encontrado!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          const modal = document.querySelector("#myModal");
          modal.style.display = "none";
        });
      }
    );
  });
}
//obtem o modal
const modal = document.getElementById("myModal");

//obtem o botao que abre o modal
const openModalBtn = document.getElementById("openModalBtn");

//obtem o botao de fechar
const closeBtn = document.getElementsByClassName("close")[0];

//obtem o boto de consultar usuario
const consultUserBtn = document.getElementById("consultUserBtn");

// quando o usuario clicar no botão abre o modal
openModalBtn.addEventListener("click", function () {
  event.preventDefault();
  modal.style.display = "block";
});

//quando o usuario clicar no botão de fechar, fecha o modal
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

//quando o usuario clicar no botão de consultar usuario,chama a função consultUser()
consultUserBtn.addEventListener("click", consultUser);

//função para consultar todos os usuários no banco de dados,,,
function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users",
        [],
        (tx, result) => {
          console.log(result);
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

//modal de consultar todos os usuarios.
const openModalBtn1 = document.querySelector("#openModalBtn1");
const modalContent = document.querySelector(".modal-content1");

//adiciona um eventlistenner para o evento click no botão openModalBtn1
openModalBtn1.addEventListener("click", async () => {
  event.preventDefault();

  //remove a lista de usuários caso ela (se ela já existir)...
  const existingUserList = modalContent.querySelector("ul");
  if (existingUserList) {
    modalContent.removeChild(existingUserList);
  }

  // busca todos os usuários e exibe em uma lista...
  const users = await getAllUsers();
  const userList = document.createElement("ul");
  users.forEach((user) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `Nome: <span class="user-nome">${user.nome}</span>, RG: <span class="user-rg">${user.rg}</span>, CPF: <span class="user-cpf">${user.cpf}</span>`;
    listItem.classList.add("user-list-item");
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

//funcao para atualizar o usuario por ID atraves da function consultUser
function updateUser() {
  const id = document.getElementById("id_usuario").value;

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "Por favor, consulte um usuário antes de atualizar.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const fields = [
    "nome",
    "rg",
    "cpf",
    "sexo",
    "datanascimento",
    "estadocivil",
    "cep",
    "endereco",
    "complemento",
    "cidade",
    "numero",
    "bairro",
    "estado",
  ];
  const values = fields.map((field) => document.getElementById(field).value);

  db.transaction(function (tx) {
    tx.executeSql(
      "UPDATE users SET nome=?, rg=?, cpf=?, sexo=?, datanascimento=?, estadocivil=?, cep=?, endereco=?, complemento=?, cidade=?, numero=?, bairro=?, estado=? WHERE rowid=?",
      [...values, id],
      function () {
        Swal.fire({
          icon: "success",
          title: "Usuário atualizado com sucesso!",
          showConfirmButton: false,
          timer: 1500,
        });

        document.getElementById("id_usuario").value = "";
      },
      function (tx, error) {
        Swal.fire({
          icon: "error",
          title: "Erro ao atualizar usuário",
          text: error.message,
        });
      }
    );
  });
  clearData();
}
// adiciona o evento de click no botão de edicao..
const btnEdit = document.getElementById("btn-edit");
btnEdit.addEventListener("click", function () {
  updateUser();
});

//deleta o usuario por ID
function deleteUser() {
  event.preventDefault();
  const id = document.getElementById("id_usuario").value;

  if (!id) {
    Swal.fire({
      icon: "error",
      title: "Erro ao excluir usuário",
      text: "É necessário informar o id do usuário a ser excluído.",
    });
    return;
  }

  db.transaction(function (tx) {
    tx.executeSql(
      "DELETE FROM users WHERE rowid = ?",
      [id],
      function (tx, result) {
        Swal.fire({
          icon: "success",
          title: "Usuário excluído com sucesso!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          Array.from(
            document.querySelectorAll(
              "#nome, #rg, #cpf, #cep, #endereco, #numero, #bairro, #cidade, #estado, #complemento, #sexo, #datanascimento, #estadocivil"
            )
          ).forEach((input) => (input.value = ""));
          document.getElementById("id_usuario").value = "";
        });
      },
      function (tx, error) {
        Swal.fire({
          icon: "error",
          title: "Erro ao excluir usuário",
          text: "Ocorreu um erro ao tentar excluir o usuário. Tente novamente mais tarde.",
        });
        console.log(error);
      }
    );
  });
}
