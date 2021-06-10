const FULL_ENERGY_TICK_THRESHOLD = 200;

const spawnEnergyFullForTooLong = (spawn: StructureSpawn) => {
	return spawn.store.getFreeCapacity('energy') === 0 && spawn.memory.energyFullOnTick !== null && (spawn.memory.energyFullOnTick + FULL_ENERGY_TICK_THRESHOLD) >= Game.time;
}

const getNumberOfCreepsByName = (name: string) => {
	return Object.keys(Game.creeps).filter(x => x.startsWith(name)).length;
}

const buildingSpawn = {
  run: (spawn: StructureSpawn) => {
	  if (spawn.spawning) return;
	//   if (spawn.store.getCapacity('energy') === spawn.store.energy)
	  if (spawn.store.energy >= 200 && Object.keys(Game.creeps).length === 0) {
		console.log('No creeps, spawning a harvester');
		spawn.spawnCreep([MOVE, WORK, CARRY], "Harry1", { memory: { role: "harvester" } });
	  } else if (spawn.store.energy >= 200 && getNumberOfCreepsByName('Upton') === 0) {
		console.log("No upgraders, spawning an upgrader");
		spawn.spawnCreep([MOVE, WORK, CARRY], "Upton1", { memory: { role: "upgrader" } });
	  }
	// if spawn energy has been full for some time, no need for more harvesters
	// if (spawnEnergyFullForTooLong(spawn)) {

	// }
	// if spawn energy never gets to full, need more harvesters
	// if there are no creeps, spawn an upgrader
  }
};

export default buildingSpawn;
