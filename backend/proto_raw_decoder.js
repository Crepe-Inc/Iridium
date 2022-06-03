const { decodeProto, TYPES } = require("./protobuf_decoder/protobufDecoder");
const { decodeFixed32, decodeFixed64, decodeVarintParts } = require("./protobuf_decoder/protobufPartDecoder");
const { parseInput } = require ("./protobuf_decoder/hexUtils");
const { decodeVarint, interpretAsSignedType } = require("./protobuf_decoder/varintUtils");

function parseType(decodeList){
    return decodeList.reduce((pre, cur, index, arr) => {
        if (index === 0) {
          return `${cur.type}:${cur.value}`;
        } else {
        } return `${pre}, ${cur.type}:${cur.value}`;
      }, '');
}

function getNextIndex(key, repeatedMap){
    if(!repeatedMap[key]){
        repeatedMap[key] = 0;
    }
    repeatedMap[key]++;
    return repeatedMap[key] < 2 ? key : `${key}#${repeatedMap[key].toString()}`;
}

function processProtoPart(raw){
    const data = decodeProto(parseInput(raw));
    const result = {};
    const repeatedMap = {};
    data.parts.forEach(e => {
        let key;
        let res;
        switch(e.type){
            case TYPES.FIXED32:
                const fixed32 = decodeFixed32(e.value);
                key = getNextIndex(`${e.index}:32b`, repeatedMap);
                res = parseType(fixed32);
                break;

            case TYPES.FIXED64:
                const fixed64 = decodeFixed64(e.value);
                key = getNextIndex(`${e.index}:64b`, repeatedMap);
                res = parseType(fixed64);
                break;

            case TYPES.VARINT:
                const varint = decodeVarintParts(e.value);
                key = getNextIndex(`${e.index}:varint`, repeatedMap);
                res = parseType(varint);
                break;

            case TYPES.STRING:
                const str = processProtoPart(e.value.toString("base64"));
                key = getNextIndex(`${e.index}:ld`, repeatedMap);
 
                if (e.value.length > 0 && !str.leftOver) {
                    res = str;
                } else {
                    res = [];
                    decodeRepeated(e, res);

                    res.push(`String:${e.value.toString()}, Raw:${e.value.toString("hex")}`);
                }

                break;
        }
        result[key] = res;
    });

    if(data.leftOver && data.leftOver.length > 0){
        result.leftOver = data.leftOver.toString("base64");
    }

    return result;
}

function decodeRepeated(e, res) {
    try {
        let list = [];
        let len = 0;
        while (len < e.value.length) {
            const reslove = decodeVarint(e.value, len);
            len += reslove.length;
            list.push(reslove.value);
        }

        if (list.length > 0) {
            res.push(`Repeated Int:[${list.toString()}]`);

            if (list[0] !== interpretAsSignedType(list[0])) {
                const newList = list.map(i => interpretAsSignedType(i));
                res.push(`Repeated Signed Int:[${newList.toString()}]`);
            }

        }
    } catch (ex) {
        // it must be not this type
    }
}

function protoRawDecode(raw){
    return processProtoPart(raw);
}

module.exports = {
	protoRawDecode
}