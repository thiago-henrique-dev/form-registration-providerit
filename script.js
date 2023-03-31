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
    {name: 'nome', label: 'Nome'},
    {name: 'rg', label: 'RG'},
    {name: 'cpf', label: 'CPF'},
    {name: 'cep', label: 'CEP'},
    {name: 'endereco', label: 'Endereço'},
    {name: 'numero', label: 'Número'},
    {name: 'bairro', label: 'Bairro'},
    {name: 'cidade', label: 'Cidade'},
    {name: 'estado', label: 'Estado'},
    {name: 'complemento', label: 'Complemento'},
    {name: 'sexo', label: 'Sexo'},
    {name: 'datanascimento', label: 'Data de Nascimento'},
    {name: 'estadocivil', label: 'Estado Civil'}
  ];
  
  let field_empty = [];
  
  fields.forEach(function(field) {
    if (!eval(field.name)) {
      field_empty.push(field.label);
    }
  });
  
  if (field_empty.length > 0) {
    let msg = 'Os seguintes fields estão em branco: ';
    msg += field_empty.join(', ') + '. Por favor preencha eles.';
  
    Swal.fire({
      icon: 'error',
      title: 'Erro ao enviar...',
      text: msg
      
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
  });
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

  cpf = cpf.padStart(0, '0'); 
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  if (cpf.length > 14) { 
    cpfInput.value = cpf.substring(0, 14);
  } else {
    cpfInput.value = cpf;
  }
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
  let inputNascimento = document.getElementById('datanascimento');

  inputNascimento.addEventListener('blur', (event) => {
    const birth = event.target.value;
    console.log(birth)

    // extrair os 4 últimos caracteres
    const year = parseInt(birth.substring(0, 4));
    console.log(year, "a" )

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor, insira uma data válida.',
        showConfirmButton: false,
        timer: 1500
      });
      inputNascimento.value = ""
    }
  }); 
}
birthValidation();

//função para consultar endereco via cep
function consultAdress() {
  event.preventDefault();
  let cep = document.getElementById("cep").value;

  let url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url).then(function (resp) {
    resp.json().then(function (data) {
      Swal.fire({
        icon: 'success',
        title: 'Operação realizada com sucesso .',
        showConfirmButton: false,
        timer: 1200
      });
      let resultCity = document.getElementById("cidade");
      let resultState = document.getElementById("estado");
      console.log(resp)
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

  // bloqueia o input quando o número máximo de caracteres é atingido
  if (event.keyCode !== 8 && cep.length === maxLength) {
    event.preventDefault();
  }
}
document.getElementById("cep").addEventListener("keydown", formatCep);


//funcao para consultar usuario por id
function consultUser() {
  event.preventDefault();
  const id = document.getElementById("id_usuario").value;
  const campos = [
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

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE rowid = ?",
      [id],
      function (tx, result) {
        let pessoa = result.rows.item(0);
        console.log(result, "?")
        campos.forEach((field) => {
          document.getElementById(field).value = pessoa[field];
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
          console.log(result)
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
    listItem.textContent = `Nome: ${user.nome}, RG: ${user.rg}, CPF: ${user.cpf}`;
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
      icon: 'warning',
      title: 'Por favor, consulte um usuário antes de atualizar.',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  const campos = [
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
  const valores = campos.map((campo) => document.getElementById(campo).value);

  db.transaction(function (tx) {
    tx.executeSql(
      "UPDATE users SET nome=?, rg=?, cpf=?, sexo=?, datanascimento=?, estadocivil=?, cep=?, endereco=?, complemento=?, cidade=?, numero=?, bairro=?, estado=? WHERE rowid=?",
      [...valores, id],
      function () {
        Swal.fire({
          icon: 'success',
          title: 'Usuário atualizado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
        clearData();
        document.getElementById("id_usuario").value = "";

      },
      function (tx, error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar usuário',
          text: error.message
        });
      }
    );
  });
}
// adiciona o evento de click no botão de edicao..
const btnEdit = document.getElementById("btn-edit");
btnEdit.addEventListener("click", function () {
  consultUser();
  updateUser();
});

//deleta o usuario por ID
function deleteUser() {
  event.preventDefault();
  const id = document.getElementById("id_usuario").value;

  if (!id) {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao excluir usuário',
      text: 'É necessário informar o id do usuário a ser excluído.'
    });
    return;
  }

  db.transaction(function (tx) {
    tx.executeSql(
      "DELETE FROM users WHERE rowid = ?",
      [id],
      function (tx, result) {
        Swal.fire({
          icon: 'success',
          title: 'Usuário excluído com sucesso!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          clearData(false);
          document.getElementById("id_usuario").value = "";
        });
      },
      function (tx, error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao excluir usuário',
          text: 'Ocorreu um erro ao tentar excluir o usuário. Tente novamente mais tarde.',
        });
        console.log(error);
      }
    );
  });
}
