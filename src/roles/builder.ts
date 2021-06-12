import { getEnergyFromContainersOrHarvest, harvestEnergy } from "utils/energy";

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
	if (target.hits === target.hitsMax) {
		delete creep.memory.buildingStructure;
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
      creep.say("🔄 get energy");
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
      } else if (target?.progress < target?.progressTotal) {
        // build
        build(creep, target);
      } else {
        // unknown thing
        console.log('Unknown build target ', JSON.stringify(target));
        delete creep.memory.buildingStructure;
      }
    } else if (creep.memory.building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      const thingsToRepair = creep.room.find<Structure>(FIND_STRUCTURES, {
        filter: (object: Structure) =>  (object.hits < (object.hitsMax / 2)) })
      if (thingsToRepair.length) {
              repair(creep, thingsToRepair[0]);
          } else if (targets.length) {
              build(creep, targets[0]);
          }
    } else {
      getEnergyFromContainersOrHarvest(creep);
    }
  },
  spawnBasic
};

export default roleBuilder;
