import { harvestEnergy } from "utils/harvest";

export const builderBaseName = 'Bob';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
  // get number of builders already
  const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'builder').length;
  if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], builderBaseName + number, { memory: { role: 'builder' } } ) === ERR_NAME_EXISTS) {
    spawnBasic(spawn, number + 1);
  }
}

const roleBuilder = {
  /** @param {Creep} creep **/
  run: (creep: Creep) => {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      delete creep.memory.harvestingFrom;
      creep.memory.building = true;
      creep.say("🚧 build");
    }

	if (creep.memory.building) {
		const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		const roadsToRepair = creep.room.find<StructureRoad>(FIND_STRUCTURES, {
			filter: (object) => {
				return object.structureType === STRUCTURE_ROAD && (object.hits < (object.hitsMax / 2)); }})
		if (roadsToRepair.length) {
			if (creep.repair(roadsToRepair[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(roadsToRepair[0], { visualizePathStyle: { stroke: "#ffffff" } });
            }
		} else if (targets.length) {
			if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
			}
		}
	} else {
	harvestEnergy(creep);
	}
  },
  spawnBasic
};

export default roleBuilder;
