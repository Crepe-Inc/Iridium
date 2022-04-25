module.exports = {
	ignoredProtos: [
		// "QueryPathReq",
		// "PingReq",
		// "PingRsp",
		// "UnionCmdNotify",
		// "EvtAiSyncCombatThreatInfoNotify",
		// "WorldPlayerRTTNotify",
		// "QueryPathRsp",
		// "EvtAiSyncSkillCdNotify",
		// "SetEntityClientDataNotify",
		// "ObstacleModifyNotify",
		// "ClientReportNotify",
		// "ClientAbilityInitFinishNotify",
		// "EntityConfigHashNotify",
		// "MonsterAIConfigHashNotify",
		// "EntityAiSyncNotify",
		"EvtAiSyncSkillCdNotify",
		// //currently broken packets

		"TakeAchievementRewardRsp",
		"ActivityPlayOpenAnimNotify",
		"FurnitureCurModuleArrangeCountNotify",
		"HomeAvatarTalkFinishInfoNotify",
		"GroupLinkAllNotify",
		"UnlockedFurnitureSuiteDataNotify",
		"HomeAvatarRewardEventNotify",
		"H5ActivityIdsNotify",
		"HomePriorCheckNotify",
		"HomePlantInfoNotify",
		"HomeResourceNotify",
		"HomeAvatarAllFinishRewardNotify",
		"HomeBasicInfoNotify",
		"FurnitureMakeRsp"
	],
	ProtosToDump:[
	],  // add proto names here	to dump them
	dumpAll : false, // dump all packets except ignored ones if set to true
}