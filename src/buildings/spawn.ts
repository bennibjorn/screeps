const buildingSpawn = {
  run: (spawn: StructureSpawn) => {
	  if (!spawn.spawning && spawn.store.energy >= 200 && Object.keys(Game.creeps).length === 0) {
		console.log('No creeps, spawning a harvester');
		spawn.spawnCreep([MOVE, WORK, CARRY], "Harry1", { memory: { role: "harvester" } });
	  }
	  if (!spawn.spawning && spawn.store.energy >= 200 && Object.keys(Game.creeps).find(x => Game.creeps[x].memory.role === 'upgrader') === undefined) {
		console.log("No upgraders, spawning an upgrader");
		spawn.spawnCreep([MOVE, WORK, CARRY], "Upton1", { memory: { role: "upgrader" } });
	  }
	// if spawn energy has been full for some time, no need for more harvesters
	// if spawn energy never gets to full, need more harvesters
	// if there are no creeps, spawn an upgrader
  }
};

export default buildingSpawn;
