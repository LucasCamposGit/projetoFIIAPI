let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url){
    await fetch(url)
            .then(resp => resp.json())
            .then(json => fii_user = json);
    carregarDadosFundos();
}

async function carregarDadosFundos(){
    
    for (let fii of fii_user){
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
                        .then(resp => resp.json());
        fii_table.push(json);  
    }
     

    exibirTabela();
}


carregarDadosUser("json/fii.json");

function createCol (text, row) {
    let col = document.createElement("td");
    col.innerText = text;
    row.appendChild(col);
}

function exibirTabela(){ 
        
    console.log(fii_user);
    console.log(fii_table);

    const table = document.querySelector("table");

    for (let i = 0; i < fii_user.length; i++) {
        let row = document.createElement("tr");
        let texts = [];

        table.appendChild(row);

        texts.push(fii_user[i]['nome']);
        texts.push(fii_table[i]['setor']);

        if (fii_table[i]['proximoRendimento']['dataBase'] == '-') {
            texts.push(fii_table[i]['ultimoRendimento']['dataBase']);
        } else {
            texts.push(fii_table[i]['proximoRendimento']['dataBase']);
        }

        if (fii_table[i]['proximoRendimento']['dataPag'] == '-') {
            texts.push(fii_table[i]['ultimoRendimento']['dataPag']);
        } else {
            texts.push(fii_table[i]['proximoRendimento']['dataPag']);
        }
  
        let valorProv;
        if (fii_table[i]['proximoRendimento']['rendimento'] == '-') {
            valorProv = fii_table[i]['ultimoRendimento']['rendimento'];
            texts.push("R$" + valorProv.toFixed(2));
        } else {
            valorProv = fii_table[i]['proximoRendimento']['rendimento'];
            texts.push("R$" + valorProv.toFixed(2));
        }

        texts.push("R$" + fii_table[i]['valorAtual']);
        texts.push(fii_user[i]['qtde']);
        texts.push("R$" + fii_user[i]['totalgasto']);
        texts.push("R$" + ((fii_user[i]['totalgasto'] / fii_user[i]['qtde'])).toFixed(2));
        texts.push(((valorProv * 100) / fii_table[i]['valorAtual']).toFixed(2) + "%");
        texts.push(fii_table[i]['dividendYield'] + "%");
        texts.push("R$" + fii_table[i]['rendimentoMedio24M'].toFixed(2));
        
        console.log(texts);

        for (text of texts) {
            createCol(text, row);
        }

    }

    const rows = document.querySelectorAll("tr");
    for (let row of rows) {
        let rendimento = row['children'][9]['innerText'];
        if (rendimento.split('%')[0] < 0.6) {
            row.classList.add('negativo');
        } else if (rendimento.split('%')[0] >= 0.6){
            row.classList.add('positivo');
        }
    }


}