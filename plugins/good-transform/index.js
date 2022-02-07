const Materials = require('./source/MaterialExcelConfigData.json')
const Weapons = require('./source/WeaponExcelConfigData.json')
const EqAffix = require('./source/EquipAffixExcelConfigData.json')
const Rel = require('./source/ReliquaryExcelConfigData.json')
const RelSet = require('./source/ReliquarySetExcelConfigData.json')
const RelMP = require('./source/ReliquaryMainPropExcelConfigData.json')
const RelAffix = require('./source/ReliquaryAffixExcelConfigData.json')
const ManualText = require('./source/ManualTextMapConfigData.json')
const TextMap = require('./source/TextMapEN.json')

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
				function(txt) {
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
	rarities: {1:1,5:2,13:3,17:4,21:5}
}


const G = {
	Items: {},
	EqAffix: {},
	RelSet: {},
	RelMP: {},
	RelAffix: {},
};

Materials.forEach((b) => {
	let a = G.Items[b.Id] = {};
	if(b.NameTextMapHash) {
		a.Name = TextMap[b.NameTextMapHash]
	}
	if(b.Icon) a.Icon = b.Icon;
	if(b.ParamList) a.ParamList = b.ParamList;
	if(b.PropType) {
		a.Name = TextMap[ManualTextMap[b.PropType]]
		a.PropType = b.PropType;
	}
	if(b.PropValue) a.PropValue = b.PropValue;
	if(b.DepotId) a.DepotId = b.DepotId;
	if(b.ItemType) a.ItemType = b.ItemType;
	if(b.SetId) a.SetId = b.SetId;
	if(b.EquipAffixId) a.EquipAffixId = b.EquipAffixId;
});
Weapons.forEach((b) => {
	let a = G.Items[b.Id] = {};
	if(b.NameTextMapHash) {
		a.Name = TextMap[b.NameTextMapHash]
	}
	if(b.Icon) a.Icon = b.Icon;
	if(b.ParamList) a.ParamList = b.ParamList;
});
Rel.forEach((b) => {
	let a = G.Items[b.Id] = {};
	if(b.NameTextMapHash) {
		a.Name = TextMap[b.NameTextMapHash]
	}
	if(b.Icon) a.Icon = b.Icon;
	if(b.ParamList) a.ParamList = b.ParamList;
	if(b.ItemType) a.ItemType = b.ItemType;
	if(b.EquipType) a.EquipType = b.EquipType;
	if(b.SetId) a.SetId = b.SetId;
	if(b.MaxLevel) a.MaxLevel = b.MaxLevel;
});
EqAffix.forEach((b) => {
	let a = G.EqAffix[b.Id] = {};
	if(b.NameTextMapHash) {
		a.Name = TextMap[b.NameTextMapHash]
	}
	if(b.ParamList) a.ParamList = b.ParamList;
	if(b.AffixId) a.AffixId = b.AffixId;
});
RelSet.forEach((b) => {
	let a = G.RelSet[b.SetId] = {};
	if(b.NameTextMapHash) {
		a.Name = TextMap[b.NameTextMapHash]
	}
	if(b.SetIcon) a.Icon = b.SetIcon;
	if(b.EquipAffixId) a.EquipAffixId = b.EquipAffixId;
});
RelMP.forEach((b) => {
	let a = G.RelMP[b.Id] = {};
	if(b.PropType) {
		a.Name = TextMap[ManualTextMap[b.PropType]]
		a.PropType = b.PropType;
	}
});
RelAffix.forEach((b) => {
	let a = G.RelAffix[b.Id] = {};
	if(b.DepotId) a.DepotId = b.DepotId;
	if(b.PropType) {
		a.Name = TextMap[ManualTextMap[b.PropType]]
		a.PropType = b.PropType;
	}
	if(b.PropValue) a.PropValue = b.PropValue;
});

module.exports = {
	PlayerStoreNotify(store) {
		const Store = store;
		const GOOD = {
			format: "GOOD",
			version: 1,
			source: "Iridium",
		}
		GOOD.artifacts = Store.itemList.map(item => {
			let reference = G.Items[item.itemId];
			if(!reference) {
				item.NOTFOUND = true;
				return;
			}
			item.Name = reference.Name;
			let g = {};
			if(item.equip && item.equip.reliquary) {
				g.setKey = FRZ.goodize(G.EqAffix[G.RelSet[reference.SetId].EquipAffixId].Name)
				g.slotKey = FRZ.rels[reference.EquipType]
				g.level = item.equip.reliquary.level - 1;
				g.rarity = FRZ.rarities[reference.MaxLevel];
				if(g.rarity < 5) return;
				g.mainStatKey = FRZ.stats[G.RelMP[item.equip.reliquary.mainPropId].PropType];
				g.lock = item.equip.isLocked;
				if(item.equip.reliquary.appendPropIdList) {
					let substats = new Map();
					item.equip.reliquary.appendPropIdList.forEach(prop => {
						let key = FRZ.stats[G.RelAffix[prop].PropType];
						if(substats.has(key))
							substats.set(key, substats.get(key) + G.RelAffix[prop].PropValue)
						else
							substats.set(key, G.RelAffix[prop].PropValue)
					})
					g.substats = Array.from(substats, ([key, value]) => {
						if(key[key.length - 1] == '_')
							value = Math.round((value * 100 + Number.EPSILON + 0.0001) * 10) / 10;
						else
							value = +Math.round(value).toFixed(1);

						return {key: key, value: value}
					});
					console.log(g.substats);
				}
				return g;
			}
		}).filter(_=>_)
		return GOOD;
	}
}