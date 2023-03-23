const db = openDatabase('provider', '1.0', 'Test DB', 2 * 1024 * 1024);

async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS pessoas (nome TEXT, rg TEXT, cpf TEXT, endereco TEXT, numero INTEGER, bairro TEXT, cidade TEXT, estado TEXT, complemento TEXT, sexo TEXT, datanascimento DATE, estadocivil TEXT)',
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
  const endereco = document.getElementById('endereco').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  const estado = document.getElementById('estado').value;
  const complemento = document.getElementById('complemento').value;
  const sexo = document.getElementById('sexo').value;
  const datanascimento = document.getElementById('data-nascimento').value;
  const estadocivil = document.getElementById('estado-civil').value;
  console.log(nome, rg, cpf, endereco, numero, bairro, cidade, estado, complemento, sexo, datanascimento, estadocivil)

  await createTable();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO pessoas (nome, rg, cpf, endereco, numero, bairro, cidade, estado, complemento, sexo, datanascimento, estadocivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [nome, rg, cpf, endereco, numero, bairro, cidade, estado, complemento, sexo, datanascimento, estadocivil],
          resolve,
          (_, error) => reject(error)
        );
      },
      (_, error) => reject(error)
    );
  });
}

function clearData() {
    const elements = ["nome", "rg", "cpf", "endereco", "data-nascimento", "endereco", "bairro", "complemento",
     "estado", "residencia", "cidade"];
    
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