const fs = require('fs');
const path = require('path')

const log = new (require("../util/log"))('Excel', 'redBright');

log.start('Loading Excels...')
const jsonsInDir = fs.readdirSync('./GenshinData/ExcelBinOutput/');
jsonsInDir.push('../TextMap/TextMapEN.json');
const excels = jsonsInDir.map((file) => {
  const fileData = fs.readFileSync(path.join('./GenshinData/ExcelBinOutput/', file));
  const o = JSON.parse(fileData.toString());
  if(file.includes('TextMapEN')) {
    return {name: 'TextMap', json: o}
  }
  const E = {};
  if(!o[0]) return;
  const key = Object.keys(o[0]).find(key => key == 'Id') ||
              Object.keys(o[0]).find(key => key == 'ID') ||
              Object.keys(o[0]).find(key => key.includes('Id') || key.includes('ID'));
  if(!key) return;
  o.forEach(item => {
    E[item[key]] = item;
  })
  return {name: file, json: E};
}).filter(a=>a);
log.log(excels.length + '/' + jsonsInDir.length + ' excels are loaded into memory.')
log.log('ID lookup is now enabled. Select text and press Enter or use q(id) in console.')

module.exports = excels || [];
