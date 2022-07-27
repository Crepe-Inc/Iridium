const Avatars = require('../../GenshinData/ExcelBinOutput/AvatarExcelConfigData.json')
const Materials = require('../../GenshinData/ExcelBinOutput/MaterialExcelConfigData.json')
const Weapons = require('../../GenshinData/ExcelBinOutput/WeaponExcelConfigData.json')
const EqAffix = require('../../GenshinData/ExcelBinOutput/EquipAffixExcelConfigData.json')
const Rel = require('../../GenshinData/ExcelBinOutput/ReliquaryExcelConfigData.json')
const RelSet = require('../../GenshinData/ExcelBinOutput/ReliquarySetExcelConfigData.json')
const RelMP = require('../../GenshinData/ExcelBinOutput/ReliquaryMainPropExcelConfigData.json')
const RelAffix = require('../../GenshinData/ExcelBinOutput/ReliquaryAffixExcelConfigData.json')
const ManualText = require('../../GenshinData/ExcelBinOutput/ManualTextMapConfigData.json')
const TextMap = require('../../GenshinData/TextMap/TextMapEN.json')

ManualTextMap = {};
ManualText.forEach(text => {
    ManualTextMap[text.textMapId] = text.textMapContentTextMapHash;
})


const FRZ = {
    goodize: (string) => {
        function toTitleCase(str) {
            return str.replace(/-/g, ' ').replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        return toTitleCase(string || '').replace(/[^A-Za-z]/g, '');
    },
    rels: {
        EQUIP_BRACER: 'flower',
        EQUIP_NECKLACE: 'plume',
        EQUIP_SHOES: 'sands',
        EQUIP_RING: 'goblet',
        EQUIP_DRESS: 'circlet'
    },
    stats: {
        FIGHT_PROP_HP: 'hp',
        FIGHT_PROP_HP_PERCENT: 'hp_',
        FIGHT_PROP_ATTACK: 'atk',
        FIGHT_PROP_ATTACK_PERCENT: 'atk_',
        FIGHT_PROP_DEFENSE: 'def',
        FIGHT_PROP_DEFENSE_PERCENT: 'def_',
        FIGHT_PROP_CHARGE_EFFICIENCY: 'enerRech_',
        FIGHT_PROP_ELEMENT_MASTERY: 'eleMas',
        FIGHT_PROP_CRITICAL: 'critRate_',
        FIGHT_PROP_CRITICAL_HURT: 'critDMG_',
        FIGHT_PROP_HEAL_ADD: 'heal_',
        FIGHT_PROP_FIRE_ADD_HURT: 'pyro_dmg_',
        FIGHT_PROP_ELEC_ADD_HURT: 'electro_dmg_',
        FIGHT_PROP_ICE_ADD_HURT: 'cryo_dmg_',
        FIGHT_PROP_WATER_ADD_HURT: 'hydro_dmg_',
        FIGHT_PROP_WIND_ADD_HURT: 'anemo_dmg_',
        FIGHT_PROP_ROCK_ADD_HURT: 'geo_dmg_',
        FIGHT_PROP_GRASS_ADD_HURT: 'dendro_dmg_',
        FIGHT_PROP_PHYSICAL_ADD_HURT: 'physical_dmg_'
    },
    rarities: { 1: 1, 5: 2, 13: 3, 17: 4, 21: 5 },

}


const G = {
    Items: {},
    EqAffix: {},
    RelSet: {},
    RelMP: {},
    RelAffix: {},
    Avatars: {},
};

Avatars.forEach((b) => {
    let a = G.Avatars[b.id] = {};
    if (b.nameTextMapHash) {
        a.Name = TextMap[b.nameTextMapHash]
    }
});
Materials.forEach((b) => {
    let a = G.Items[b.id] = {};
    if (b.nameTextMapHash) {
        a.Name = TextMap[b.nameTextMapHash]
    }
    if (b.icon) a.Icon = b.icon;
    if (b.itemType) a.ItemType = b.itemType;
});
Weapons.forEach((b) => {
    let a = G.Items[b.id] = {};
    if (b.nameTextMapHash) {
        a.Name = TextMap[b.nameTextMapHash]
    }
    if (b.icon) a.Icon = b.icon;
    if (b.itemType) a.ItemType = b.itemType;
    if (b.weaponType) a.WeaponType = b.weaponType;
    if (b.skillAffix) a.SkillAffix = b.skillAffix;
});
Rel.forEach((b) => {
    let a = G.Items[b.id] = {};
    if (b.nameTextMapHash) {
        a.Name = TextMap[b.nameTextMapHash]
    }
    if (b.icon) a.Icon = b.icon;
    if (b.itemType) a.ItemType = b.itemType;
    if (b.equipType) a.EquipType = b.equipType;
    if (b.maxLevel) a.MaxLevel = b.maxLevel;
    if (b.setId) a.SetId = b.setId;
});
EqAffix.forEach((b) => {
    let a = G.EqAffix[b.id] = {};
    if (b.nameTextMapHash) {
        a.Name = TextMap[b.nameTextMapHash]
    }
    if (b.paramList) a.ParamList = b.paramList;
    if (b.affixId) a.AffixId = b.affixId;
});
RelSet.forEach((b) => {
    let a = G.RelSet[b.setId] = {};
    if (b.EquipAffixId) a.EquipAffixId = b.EquipAffixId;
});
RelMP.forEach((b) => {
    let a = G.RelMP[b.id] = {};
    if (b.propType) {
        a.Name = TextMap[ManualTextMap[b.propType]]
        a.PropType = b.propType;
    }
});
RelAffix.forEach((b) => {
    let a = G.RelAffix[b.id] = {};
    if (b.depotId) a.DepotId = b.depotId;
    if (b.propType) {
        a.Name = TextMap[ManualTextMap[b.propType]]
        a.PropType = b.propType;
    }
    if (b.propValue) a.PropValue = b.propValue;
});

module.exports = {
    AvatarDataNotifyAndPlayerStoreNotify(avatars, items) {
        const Avatar = avatars;
        const Store = items;

        var guidMap = {};

        const GOOD = {
            format: "GOOD",
            version: 1,
            source: "Iridium",
        }
        GOOD.characters = Avatar.avatarList
            .filter(avatar => avatar.avatarType == 1)
            .map(avatar => {
                let reference = G.Avatars[avatar.avatarId];
                if (!reference) {
                    avatar.NOTFOUND = true;
                    return;
                }
                avatar.Name = reference.Name;
                let g = {};
                if (avatar.avatarType == 1 && avatar.Name != null) {
                    g.key = FRZ.goodize(avatar.Name);
                    g.level = avatar.propMap['4001'].val['low'];
                    g.ascension = avatar.propMap['1002'].val['low'];
                    g.constellation = avatar.talentIdList.length;
                    avatar.equipGuidList.forEach(guid => guidMap[guid] = FRZ.goodize(avatar.Name));
                    g.talent = {};
                    g.talent['auto'] = Object.entries(avatar.skillLevelMap)[0][1];
                    g.talent['skill'] = Object.entries(avatar.skillLevelMap)[1][1];
                    g.talent['burst'] = Object.entries(avatar.skillLevelMap)[2][1];
                    return g;
                }
            }).filter(_ => _)
        GOOD.artifacts = Store.itemList
            .filter(item => item.equip && item.equip.reliquary)
            .map(item => {
                let reference = G.Items[item.itemId];
                if (!reference) {
                    item.NOTFOUND = true;
                    return;
                }
                item.Name = reference.Name;
                let g = {};
                if (item.equip && item.equip.reliquary) {
                    g.setKey = FRZ.goodize(G.EqAffix[G.RelSet[reference.SetId].EquipAffixId].Name)
                    g.slotKey = FRZ.rels[reference.EquipType]
                    g.level = item.equip.reliquary.level - 1;
                    g.rarity = FRZ.rarities[reference.MaxLevel];
                    if (g.rarity < 4) return;
                    g.mainStatKey = FRZ.stats[G.RelMP[item.equip.reliquary.mainPropId].PropType];
                    g.lock = item.equip.isLocked;
                    g.location = guidMap[item.guid] || '';
                    if (item.equip.reliquary.appendPropIdList) {
                        let substats = new Map();
                        item.equip.reliquary.appendPropIdList.forEach(prop => {
                            let key = FRZ.stats[G.RelAffix[prop].PropType];
                            if (substats.has(key))
                                substats.set(key, substats.get(key) + G.RelAffix[prop].PropValue)
                            else
                                substats.set(key, G.RelAffix[prop].PropValue)
                        })
                        g.substats = Array.from(substats, ([key, value]) => {
                            if (key[key.length - 1] == '_')
                                value = Math.round((value * 100 + Number.EPSILON + 0.0001) * 10) / 10;
                            else
                                value = +Math.round(value).toFixed(1);

                            return { key: key, value: value }
                        });
                        // console.log(g.substats);
                    }
                    return g;
                }
            }).filter(_ => _)
        GOOD.weapons = Store.itemList
            .filter(item => item.equip && item.equip.weapon)
            .map(item => {
                let reference = G.Items[item.itemId];
                if (!reference) {
                    item.NOTFOUND = true;
                    return;
                }
                item.Name = reference.Name;
                let g = {};
                if (item.equip && item.equip.weapon) {
                    g.key = FRZ.goodize(item.Name);
                    g.level = item.equip.weapon.level;
                    g.ascension = item.equip.weapon.promoteLevel;
                    g.refinement = (Object.entries(item.equip.weapon.affixMap)[0] != null ? Object.entries(item.equip.weapon.affixMap)[0][1] : 0) + 1;
                    g.location = guidMap[item.guid] || '';
                    g.lock = item.equip.isLocked;
                    return g;
                }
            }).filter(_ => _)
        let materials = Object.create(null);
        Store.itemList
            .filter(item => item.material).map(item => {
                let reference = G.Items[item.itemId];
                if (!reference) {
                    item.NOTFOUND = true;
                    return;
                }
                materials[FRZ.goodize(reference.Name)] = item.material.count;
            }).filter(_ => _)
        GOOD.materials = materials
        return GOOD;
    }
}