const E = require('../../backend/excelPivot');

async function execute(cmd, data) {
    return E.map(excel => {
        const result = excel.json[data.id];
        if(result) return {name: excel.name, json: result};
    }).filter(a=>a)
}

module.exports = {execute}