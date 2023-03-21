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
let cpf = cpfInput.value.replace(/\D/g, ''); // remove tudo que não for nmro do input

cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // coloca um ponto após os primeiros 3 dígitos
cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // coloca um ponto após os próximos 3 dígitos
cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // coloca um traço após os últimos 2 dígitos

cpfInput.value = cpf; // atualiza o valor do input com o CPF formatado
}

function formatRG(rgInput) {
let rg = rgInput.value.replace(/\D/g, ''); // remove tudo que não for numero do input

rg = rg.replace(/(\d{3})(\d)/, '$1.$2'); // coloca um ponto após os primeiros 2 dígitos
rg = rg.replace(/(\d{3})(\d)/, '$1.$2'); // coloca um ponto após os proxs 3 dígitos
rg = rg.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // coloca um traco após os ults 2 dígitos

rgInput.value = rg; // atualizar o valor do input com o RG formatado
}
