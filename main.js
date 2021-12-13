
const { parse } = require('csv-parse/sync');
const fs = require('fs');

const input = fs.readFileSync('TABELA.CSV', 'latin1');

const records = parse(input, {
  columns: true,
  delimiter: ';',
  skip_empty_lines: true
});

records.map(record => {
    record.descricao = record.descricao.toLocaleUpperCase();
});

//CEP
let cepCount = 0;
records.map(record => {
  let match = (/(C[Ee][Pp]:?)? (\d{5}[- ]\d{3})/g).exec(record.endereco);
  if (!match) {
    cepCount++;
    return;
  };

  record.cep = match[2];
  record.endereco = record.endereco.replace(match[0], '');

})

let emailCount = 0;
//email
records.map(record => {
  let match = (/([a-z]+\.?[a-z]+@[a-z]+(\.[a-z]{2,3}){1,2})\;?/g).exec(record.email);
  if (!match) {
    emailCount++;
    return
  };

  record.email = match[1];
  record.email = record.email.replace(match[3], '');

  console.log(record);
})

//Rua-Numero-Bairro
records.map(record => {
  let match = (/((RUA|Rua|R\.|AVENIDA|Avenida|AV\.|Av\.|TRAVESSA|Travessa|TRAV\.|tv\.|Tv\.|Trav\.|Estr\.|estr\.|Estrada|BR) (([A-zÁ-úã_\s\.])+))[, ]+(\d+)\s?\-?(CEP\d+)?(\d+ )?(\/?[\/\da-zDA-Zúãâôíê\ ]+)?/g).exec(record.endereco);
  if (!match) return;

  record.rua = match[1].toLocaleUpperCase();
  record.numero = match[5];
  record.bairro = match[8];

  console.log(record);
})

let ufCount = 0;
//UF-cidade
records.map(record => {
  let match = (/((\W)(RO|AC|AM|RR|PA|AP|TO|MA|PI|CE|RN|PB|PE|AL|SE|BA|MG|ES|RJ|SP|PR|SC|RS|MS|MT|GO|DF{2})\b(\W))/g).exec(record.endereco);
  if (!match) {
    ufCount++;
    return;
  };
  record.UF = match[1].trim();
  record.cidade = record.endereco.replace(match[3, 4], '');

  console.log(record);
})

let cidadeCountNull = 0;
let cidadeCount = 0;
//cidade
records.map(record => {
  let match = (/(([A-zÃ-õÂ-û]+ ?[A-zÃ-õÂ-û]+ ?\s[A-zÃ-õÂ-û]+ ?[A-zÃ-õÂ-û]+) (\-|,) ([A-Z]{2})?)( |,)/g).exec(record.cidade);
  if (!match) return;

  record.cidade = match[2];
  record.cidade = record.cidade.replace(match[4], '');

  console.log(record);
})

let siteCount = 0;
//Site
records.map(record => {
  let match = (/(http:\/\/(\w+\.[A-z]+\.(\w+)?\.(\w+)?\/?))/g).exec(record.site);
  if (!match) {
    siteCount++;
    return
  };

  record.site = match[1];

  console.log(record);
})


let csv = "";
records.map(record => {
  csv += `${record.nome || ''};${record.email || ''};${record.telefone || ''};${record.site || ''};${record.cidade || ''};${record.rua || ''};${record.numero || ''};${record.bairro || ''};${record.cep || ''};${record.UF || ''};\n`;
})

var calculoCidadeNotFound = 0;
if (cidadeCount > cidadeCountNull) {
  calculoCidadeNotFound = cidadeCount - cidadeCountNull;
}else {
  calculoCidadeNotFound = cidadeCountNull - cidadeCount;
}

// console.log("cepCount: " + cepCount + "\n" + 
// "siteCount: " + siteCount + "\n" + 
// "CidadeCount: " + cidadeCount + ' encontradas, ' + calculoCidadeNotFound + ' nao encontradas' + "\n" + 
// "UFCount: " + ufCount + "\n" + 
// "EmailCount: " + emailCount);

fs.writeFileSync('OUTPUT.csv', csv, { encoding: 'latin1' });