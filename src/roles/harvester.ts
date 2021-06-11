import { harvestEnergy } from "utils/harvest";

export const harvesterBaseName = 'Harry';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
	// get number of builders already
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'harvester').length;
	if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], harvesterBaseName + number, { memory: { role: 'harvester' } } ) === ERR_NAME_EXISTS) {
	  spawnBasic(spawn, number + 1);
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
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure: any) => {
				return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
	},
	spawnBasic
};

export default roleHarvester;
