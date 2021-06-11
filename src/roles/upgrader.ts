import { harvestEnergy } from "utils/harvest";

export const upgraderBaseName = 'UptownGirl';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
  // get number of builders already
  const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'upgrader').length;
  if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], upgraderBaseName + number, { memory: { role: 'upgrader' } } ) === ERR_NAME_EXISTS) {
    spawnBasic(spawn, number + 1);
  }
}

const spawnBeefy = (spawn: StructureSpawn, num?: number) => {
  // get number of builders already
  const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'upgrader').length;
  if (Game.spawns[spawn.name].spawnCreep( [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY], 'Beefy' + upgraderBaseName + number, { memory: { role: 'upgrader' } } ) === ERR_NAME_EXISTS) {
    spawnBeefy(spawn, number + 1);
  }
}

const roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
		// collect from spawn/ruin
		// only collect from spawn if there exists at least one harvester
		// if (Game.spawns['Spawn1'].store.energy > 0 && Game.spawns['Spawn1'].spawning != null) {
		// 	creep.withdraw(Game.spawns['Spawn1'], RESOURCE_ENERGY, creep.store.getFreeCapacity());
		// } else
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      delete creep.memory.harvestingFrom;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading && creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else {
      harvestEnergy(creep);
    }
  },
  spawnBasic,
  spawnBeefy
};

export default roleUpgrader;
