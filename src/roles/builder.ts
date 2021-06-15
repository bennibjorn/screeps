import { getOutOfTheWay, moveToRoom } from "utils/creeps";
import { getEnergyFromContainersOrHarvest } from "utils/energy";
import { pathVisuals } from "utils/pathVisual";

export const builderBaseName = 'Bob';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
  // get number of builders already
  const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'builder').length;
  if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], builderBaseName + number, { memory: { role: 'builder' } } ) === ERR_NAME_EXISTS) {
    spawnBasic(spawn, number + 1);
  }
}
const spawnForRoom = (spawn: StructureSpawn, targetRoom: string, num?: number) => {
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === "builder" && Game.creeps[x].memory.workroom === targetRoom).length;
	if (
		Game.spawns[spawn.name].spawnCreep([WORK, CARRY, MOVE], targetRoom + '-' + builderBaseName + number, {
			memory: { role: "builder", workroom: targetRoom }
		}) === ERR_NAME_EXISTS
	) {
		spawnForRoom(spawn, targetRoom, number + 1);
	}
}

const build = (creep: Creep, target: ConstructionSite<BuildableStructureConstant>) => {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.memory.buildingStructure = target.id;
        creep.moveTo(target, { visualizePathStyle: { stroke: pathVisuals.build.color, lineStyle: pathVisuals.build.lineStyle } });
    }
};

const roleBuilder = {
  /** @param {Creep} creep **/
  run: (creep: Creep) => {
	if (creep.memory.workroom && creep.memory.workroom !== creep.room.name) {
		moveToRoom(creep, creep.memory.workroom);
	} else {
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		  creep.memory.building = false;
			delete creep.memory.buildingStructure;
		  creep.say("🔄 collect");
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		  delete creep.memory.harvestingFrom;
		  creep.memory.building = true;
		  creep.say("🚧 build");
		}

		if (creep.memory.building && creep.memory.buildingStructure) {
		  const target = Game.getObjectById(creep.memory.buildingStructure);
		  if (target?.progress < target?.progressTotal) {
			// build
			build(creep, target);
		  } else {
			// unknown thing
			console.log('Unknown build target ', JSON.stringify(target));
			delete creep.memory.buildingStructure;
		  }
		} else if (creep.memory.building) {
		  const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length > 0) {
				build(creep, targets[0]);
			} else {
				// nothing to build or repair
				// move out of the way
				getOutOfTheWay(creep);
			}
		} else {
		  getEnergyFromContainersOrHarvest(creep);
		}
	}
  },
  spawnBasic,
  spawnForRoom
};

export default roleBuilder;
