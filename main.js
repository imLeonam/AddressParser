
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
records.map(record => {record.endereco2 = record.endereco;});
//CEP
records.map(record => {
  let match = (/(C[Ee][Pp]:?)? (\d{5}[- ]?\d{3})/g).exec(record.endereco);
  if (!match) return;

  record.cep = match[2].replace(/\./g);

  record.endereco = record.endereco.replace(match[2], '');

})

//Site
records.map(record => {
  let match = (/(http:\/\/(\w+\.[A-z]+\.(\w+)?\.(\w+)?\/?))/g).exec(record.site, record.contato);
  if (!match) return;

  record.site = match[1];

  console.log(record);
});

//email
records.map(record => {
  let match = (/([a-z]+\.?[a-z]+@[a-z]+(\.[a-z]{2,3}){1,2})\;?/g).exec(record.email);
  if (!match) return;

  record.email = match[1];
  record.email = record.email.replace(match[3], '');

  console.log(record);
});

//Rua
records.map(record => {
  let match = (/((Rdv|RUA|Rua|R\.|AVENIDA|Avenida|AV\.|Av\.|TRAVESSA|Travessa|TRAV\.|tv\.|Tv\.|Trav\.|Estr\.|estr\.|Estrada|BR)\W*([A-zÁ-úã_\s\d?\.]+))\W*?/g).exec(record.endereco);
  if (!match) return;

  record.rua = match[1].replace(/\W*((Ap\.?) [A-zÁ-úã_\s\d?\.]+)/g, '');
  record.endereco = record.endereco.replace(match[1], '');


  console.log(record);
});

//UF-cidade
records.map(record => {
  let match = (/(Cidade: ?)?\W*([A-zÁ-úã_\s\w\d\/]+)\W+((B[Rr]|RO|AC|AM|RR|PA|AP|TO|MA|PI|CE|RN|PB|PE|AL|SE|BA|MG|ES|RJ|SP|PR|SC|E?R[Ss]|MS|MT|GO|DF),)/g).exec(record.endereco);
  if (!match) return;

  record.uf = match[4];
  record.cidade = match[2].replace(match[4], '');

  record.endereco = record.endereco.replace(match[0], '');

  console.log(record);
});

//complemento
records.map(record => {
  let match = (/\W*((Ap\.?) [A-zÁ-úã_\s\d?\.]+)/g).exec(record.endereco);
  if (!match) return;
  record.compl = match[1];
  record.endereco = record.endereco.replace(match[1], '');
});

//Numero
records.map(record => {
  let match = (/[\/, ]?(\d+|s\/n)\W*/g).exec(record.endereco);
  if (!match) return;

  record.numero = match[1];
  record.endereco = record.endereco.replace(match[1], '');
  console.log(record);
});

//Bairro
records.map(record => {
  let match = (/(\W*?\d+\W?|s\/n)\W*(Bairro:? ?)?([A-zÁ-úã_\s.]+)\W*?/g).exec(record.endereco);
  if (!match) return;

  record.bairro = match[3].replace(/C[Ee][Pp]:?/g, '');
  record.endereco = record.endereco.replace(match[3], '');


  console.log(record);
});

let csv = `nome;email;telefone;site;cidade;rua;cmpl;numero;bairro;cep;uf;\n`;
records.map(record => {
  csv += `${record.descricao || ''};${record.email || ''};${record.telefone || ''};${record.site || ''};${record.cidade || ''};${record.rua || ''};${record.compl || ''};${record.numero || ''};${record.bairro || ''};${record.cep || ''};${record.uf || ''};${record.endereco2};\n`;
});

fs.writeFileSync('OUTPUT.csv', csv, { encoding: 'latin1' });