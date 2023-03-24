const db = openDatabase('usuarios', '1.0', 'Test DB', 2 * 1024 * 1024);

async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (nome TEXT, rg TEXT, cpf TEXT, cep TEXT, endereco TEXT, numero INTEGER, bairro TEXT, cidade TEXT, estado TEXT, complemento TEXT, sexo TEXT, datanascimento DATE, estadocivil TEXT)',
        [],
        resolve,
        (_, error) => reject(error) 
      );
    });
  });
}

async function saveDate() {
  event.preventDefault()
  const nome = document.getElementById('nome').value;
  const rg = document.getElementById('rg').value;
  const cpf = document.getElementById('cpf').value;
  const cep = document.getElementById('cep').value;
  const endereco = document.getElementById('endereco').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  const estado = document.getElementById('estado').value;
  const complemento = document.getElementById('complemento').value;
  const sexo = document.getElementById('sexo').value;
  const datanascimento = document.getElementById('data-nascimento').value;
  const estadocivil = document.getElementById('estado-civil').value;

  await createTable();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO users (nome, rg, cpf, cep, endereco, numero, bairro, cidade, estado, complemento, sexo, datanascimento, estadocivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
          [nome, rg, cpf, cep, endereco, numero, bairro, cidade, estado, complemento, sexo, datanascimento, estadocivil],
          resolve,
          (_, error) => reject(error)
        );
      },
      (_, error) => reject(error)
    );
    clearData()
  });
}

  function clearData() {
      const elements = ["nome", "rg", "cpf", "cep", "endereco", "data-nascimento", "bairro", "complemento",
      "numero", "estado", "cidade"];
      
      elements.forEach((element) => {
        document.getElementById(element).value = "";
      });
      
      document.getElementById("sexo").value = "masculino";
      document.getElementById("estado-civil").value = "solteiro";
    }

  function formatCPF(cpfInput) {
      let cpf = cpfInput.value.replace(/\D/g, ''); 

      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 

      cpfInput.value = cpf; 
  }

  function formatRG(rgInput) {
    let rg = rgInput.value.replace(/\D/g, ''); 

    rg = rg.replace(/(\d{3})(\d)/, '$1.$2'); 
    rg = rg.replace(/(\d{3})(\d)/, '$1.$2'); 
    rg = rg.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 

    rgInput.value = rg;
  }

    function validateForm() {
      let nome = document.getElementById("nome").value;
      let rg = document.getElementById("rg").value;
      let cpf = document.getElementById("cpf").value;
      let cep = document.getElementById("cep").value;
      let endereco = document.getElementById("endereco").value;
      let cidade = document.getElementById("cidade").value;
      let numero = document.getElementById("numero").value;
      let bairro = document.getElementById("bairro").value;
      let estado = document.getElementById("estado").value;

      if (nome === "" || rg === "" || cpf === "" || cep === "" || endereco === "" || cidade === "" || numero === "" || bairro === "" || estado === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
      return true;
    }

    function consultAdress(){
      event.preventDefault()
        let cep = document.getElementById("cep").value;

        if(cep.length !== 8){
          alert('CEP invalido')
          return
        }

        let url = `https://viacep.com.br/ws/${cep}/json/`

        fetch(url).then(function(response){
          response.json().then(function(data){

          let resultCity = document.getElementById("cidade");
          let resultState = document.getElementById("estado")

          resultState.value = `${data.uf}`
          resultCity.value = `${data.localidade}`;

          })
        })
    }

    function consultUser() {
      event.preventDefault();
      const id = document.getElementById("id_usuario").value;
      db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM users WHERE rowid = ?', [id], function(tx, resultado) {

          let pessoa = resultado.rows.item(0);
          document.getElementById("nome").value = pessoa.nome;
          document.getElementById("rg").value = pessoa.rg;
          document.getElementById("cpf").value = pessoa.cpf;
          document.getElementById("cep").value = pessoa.cep;
          document.getElementById("endereco").value = pessoa.endereco;
          document.getElementById("complemento").value = pessoa.endereco;
          document.getElementById("cidade").value = pessoa.cidade;
          document.getElementById("numero").value = pessoa.numero;
          document.getElementById("bairro").value = pessoa.bairro;
          document.getElementById("estado").value = pessoa.estado;
          
        }, function(tx, error) {
          console.log('Erro na consulta: ' + error.message);
        });
      });
    }

    // Obtém o modal
    const modal = document.getElementById("myModal");

    // Obtém o botão que abre o modal
    const openModalBtn = document.getElementById("openModalBtn");

    // Obtém o botão de fechar
    const closeBtn = document.getElementsByClassName("close")[0];

    // Obtém o botão de consultar usuário
    const consultUserBtn = document.getElementById("consultUserBtn");

    // Quando o usuário clicar no botão, abre o modal
    openModalBtn.addEventListener("click", function() {
      event.preventDefault()
      modal.style.display = "block";
    });

    // Quando o usuário clicar no botão de fechar ou fora do modal, fecha o modal
    closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });

    // Quando o usuário clicar no botão de consultar usuário, chama a função consultUser()
    consultUserBtn.addEventListener("click", consultUser);

    // Quando o usuário clicar em qualquer lugar fora do modal, fecha o modal
    window.onclick = function(event) {
      if (event.target == modal) {
        closeModal();
      }
    }