const Materials = require('./source/MaterialExcelConfigData.json')
const Weapons = require('./source/WeaponExcelConfigData.json')
const EqAffix = require('./source/EquipAffixExcelConfigData.json')
const Rel = require('./source/ReliquaryExcelConfigData.json')
const RelSet = require('./source/ReliquarySetExcelConfigData.json')
const RelMP = require('./source/ReliquaryMainPropExcelConfigData.json')
const RelAffix = require('./source/ReliquaryAffixExcelConfigData.json')
const ManualText = require('./source/ManualTextMapConfigData.json')
const TextMap = require('./source/TextMapEN.json')
const RelCodex = require('./source/ReliquaryCodexExcelConfigData.json')
const Avatars = require('./source/AvatarExcelConfigData.json')

const fs = require('fs');

ManualTextMap = {};
ManualText.forEach(text => {
    ManualTextMap[text.TextMapId] = text.TextMapContentTextMapHash;
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
    AffixId: {},
    RelSet: {},
    RelMP: {},
    RelAffix: {},
    RelCodex: {},
    Avatars: {},
};

Avatars.forEach((b) => {
    let a = G.Avatars[b.id] = {};
    if (b.nameTextMapHash) {
        a.Name = TextMap[b.nameTextMapHash]
    }
});
Materials.forEach((b) => {
    let a = G.Items[b.Id] = {};
    if (b.NameTextMapHash) {
        a.Name = TextMap[b.NameTextMapHash]
    }
    if (b.Icon) a.Icon = b.Icon;
    if (b.ParamList) a.ParamList = b.ParamList;
    if (b.PropType) {
        a.Name = TextMap[ManualTextMap[b.PropType]]
        a.PropType = b.PropType;
    }
    if (b.PropValue) a.PropValue = b.PropValue;
    if (b.DepotId) a.DepotId = b.DepotId;
    if (b.ItemType) a.ItemType = b.ItemType;
    if (b.SetId) a.SetId = b.SetId;
    if (b.EquipAffixId) a.EquipAffixId = b.EquipAffixId;
});
Weapons.forEach((b) => {
    let a = G.Items[b.Id] = {};
    if (b.NameTextMapHash) {
        a.Name = TextMap[b.NameTextMapHash]
    }
    if (b.Icon) a.Icon = b.Icon;
    if (b.WeaponType) a.WeaponType = b.WeaponType;
    if (b.RankLevel) a.RankLevel = b.RankLevel;
    if (b.SkillAffix) a.SkillAffix = b.SkillAffix;
    if (b.ParamList) a.ParamList = b.ParamList;
});
Rel.forEach((b) => {
    let a = G.Items[b.Id] = {};
    if (b.NameTextMapHash) {
        a.Name = TextMap[b.NameTextMapHash]
    }
    if (b.Icon) a.Icon = b.Icon;
    if (b.ParamList) a.ParamList = b.ParamList;
    if (b.ItemType) a.ItemType = b.ItemType;
    if (b.EquipType) a.EquipType = b.EquipType;
    if (b.SetId) a.SetId = b.SetId;
    if (b.MaxLevel) a.MaxLevel = b.MaxLevel;
});
EqAffix.forEach((b) => {
    let a = G.EqAffix[b.Id] = {};
    if (b.NameTextMapHash) {
        a.Name = TextMap[b.NameTextMapHash]
    }
    if (b.ParamList) a.ParamList = b.ParamList;
    if (b.AffixId) a.AffixId = b.AffixId;
    if (b.AffixId) G.AffixId[b.AffixId] = b.Id;
});
RelSet.forEach((b) => {
    let a = G.RelSet[b.SetId] = {};
    if (b.NameTextMapHash) {
        a.Name = TextMap[b.NameTextMapHash]
    }
    if (b.SetIcon) a.Icon = b.SetIcon;
    if (b.EquipAffixId) a.EquipAffixId = b.EquipAffixId;
});
RelMP.forEach((b) => {
    let a = G.RelMP[b.Id] = {};
    if (b.PropType) {
        a.Name = TextMap[ManualTextMap[b.PropType]]
        a.PropType = b.PropType;
    }
});
RelAffix.forEach((b) => {
    let a = G.RelAffix[b.Id] = {};
    if (b.DepotId) a.DepotId = b.DepotId;
    if (b.PropType) {
        a.Name = TextMap[ManualTextMap[b.PropType]]
        a.PropType = b.PropType;
    }
    if (b.PropValue) a.PropValue = b.PropValue;
});
RelCodex.forEach((b) => {
    G.RelCodex[b.SuitId] ||= {}
    G.RelCodex[b.SuitId][b.Level] = b.SortOrder
})

function cmp(v1, v2) {
    if (v1 < v2) throw 1
    else if (v1 > v2) throw -1
}

const SlotPrior = {
    EQUIP_BRACER: 4,
    EQUIP_NECKLACE: 3,
    EQUIP_SHOES: 2,
    EQUIP_RING: 1,
    EQUIP_DRESS: 0,
}

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
            .sort((r1, r2) => {
                try {
                    let i1 = G.Items[r1.itemId],
                        i2 = G.Items[r2.itemId]
                    // rarity
                    cmp(i1.MaxLevel, i2.MaxLevel)
                    // level
                    cmp(r1.equip.reliquary.level, r2.equip.reliquary.level)
                    // setKey
                    cmp(G.RelCodex[i1.SetId][FRZ.rarities[i1.MaxLevel]], G.RelCodex[i2.SetId][FRZ.rarities[i2.MaxLevel]])
                    // slotKey
                    cmp(SlotPrior[i1.EquipType], SlotPrior[i2.EquipType])
                    // substats length
                    cmp(r1.equip.reliquary.appendPropIdList.length, r2.equip.reliquary.appendPropIdList.length)
                    // guid
                    cmp(r1.guid, r2.guid)
                    return 0
                } catch (retcode) {
                    return retcode
                }
            })
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
                    let refinement = 0;
                    if (reference.SkillAffix[0] != 0)
                        refinement = item.equip.weapon.affixMap[G.AffixId[G.EqAffix[reference.SkillAffix[0]].AffixId]];
                    g.refinement = refinement + 1;
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