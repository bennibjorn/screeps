import { moveToRoom } from "utils/creeps";
import { harvestEnergy } from "utils/energy";

export const claimerBaseName = "LiamNeeson";

const spawnBasic = (spawn: StructureSpawn, workroom: string) => {
	Game.spawns[spawn.name].spawnCreep([CLAIM, WORK, CARRY, MOVE], claimerBaseName, {
		memory: { role: "claimer", workroom: workroom }
	});
};

const roleClaimer = {
    /** @param {Creep} creep **/
    run: function (creep: Creep) {
		if (creep.memory.workroom && creep.memory.workroom !== creep.room.name) {
			// if not in workroom, move to that room
			moveToRoom(creep, creep.memory.workroom);
		} else if (creep.memory.workroom && creep.memory.workroom === creep.room.name &&
				   creep.room.controller && !creep.room.controller?.owner) {
			// if in workroom and there is a controller unclaimed, claim it
			// harvest energy if needed
			if (creep.store.energy === 0) {
				harvestEnergy(creep);
			} else {
				creep.claimController(creep.room.controller);
			}
		} else {
			// else, change role to upgrader
			//creep.memory.role = 'upgrader';
		}
    },
    spawn: spawnBasic
};

export default roleClaimer;
