function clearData() {
    document.getElementById("nome").value = "";
    document.getElementById("rg").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("sexo").value = "masculino";
    document.getElementById("data-nascimento").value = "";
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
