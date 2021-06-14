import { creepTierNames } from "utils/creeps";
import { depositEnergy, harvestEnergy } from "utils/energy";

export const harvesterBaseName = 'Harry';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
	// get number of builders already
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'harvester').length;
	if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], harvesterBaseName + number, { memory: { role: 'harvester' } } ) === ERR_NAME_EXISTS) {
	  spawnBasic(spawn, number + 1);
	}
}
const spawnMid = (spawn: StructureSpawn, num?: number) => {
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === "harvester").length;
    if (
        Game.spawns[spawn.name].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], creepTierNames.mid + harvesterBaseName + number, {
            memory: { role: "harvester" }
        }) === ERR_NAME_EXISTS
    ) {
        spawnMid(spawn, number + 1);
    }
}

const roleHarvester = {
  /** @param {Creep} creep **/
	run: (creep: Creep) => {
		if(creep.store.getFreeCapacity() > 0) {
			harvestEnergy(creep);
		}
		else {
			delete creep.memory.harvestingFrom;
			depositEnergy(creep);
		}
	},
	spawnBasic,
	spawnMid
};

export default roleHarvester;
