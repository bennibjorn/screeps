const withdrawFromRuins = () => {

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
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading && creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

export default roleUpgrader;
