import { harvestEnergy } from "utils/harvest";

export const builderBaseName = 'Bob';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
  // get number of builders already
  const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'builder').length;
  if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], builderBaseName + number, { memory: { role: 'builder' } } ) === ERR_NAME_EXISTS) {
    spawnBasic(spawn, number + 1);
  }
}

const repair = (creep: Creep, target: Structure<StructureConstant>) => {
	if (creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.memory.buildingStructure = target.id;
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
    }
}
const build = (creep: Creep, target: ConstructionSite<BuildableStructureConstant>) => {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.memory.buildingStructure = target.id;
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
    }
};

const roleBuilder = {
  /** @param {Creep} creep **/
  run: (creep: Creep) => {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
	  delete creep.memory.buildingStructure;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      delete creep.memory.harvestingFrom;
      creep.memory.building = true;
      creep.say("🚧 build");
    }

	if (creep.memory.building && creep.memory.buildingStructure) {
		const target = Game.getObjectById(creep.memory.buildingStructure);
		if (target?.hits && target?.hits < target?.hitsMax) {
			// repair
			repair(creep, target);
		} else if (target?.progress) {
			// build
			build(creep, target);
		} else {
			// unknown thing
			console.log('Unknown build target ', JSON.stringify(target));
			delete creep.memory.buildingStructure;
		}
		if (target !== null && target.structureType === 'road' && target.hits < target.hitsMax) {
			console.log(target.structureType);
		}
	} else if (creep.memory.building) {
		const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		const roadsToRepair = creep.room.find<StructureRoad>(FIND_STRUCTURES, {
			filter: (object) => {
				return object.structureType === STRUCTURE_ROAD && (object.hits < (object.hitsMax / 2)); }})
		if (roadsToRepair.length) {
			repair(creep, roadsToRepair[0]);
		} else if (targets.length) {
			build(creep, targets[0]);
		}
	} else {
		harvestEnergy(creep);
	}
  },
  spawnBasic
};

export default roleBuilder;
