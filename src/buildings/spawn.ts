import harvester from 'roles/harvester';
import upgrader from 'roles/upgrader';
import builder from '../roles/builder';

// TODO: move this into a util class
const getNumberOfCreepsByRole = (role: string) => {
	return _.filter(Game.creeps, (creep) => creep.memory.role === role).length;
}

const buildersWanted = (room: Room) => {
	return room.find(FIND_CONSTRUCTION_SITES).length > 1;
}

const totalEnergy = (spawn: StructureSpawn) => {
	// while there is only one spawn, this will suffice
	return spawn.room.energyAvailable;
	//return spawn.store.getUsedCapacity('energy');
}

const buildingSpawn = {
	run: (spawn: StructureSpawn) => {
		if (spawn.spawning) return;
		// spawn basic first
		if (totalEnergy(spawn) >= 200 && getNumberOfCreepsByRole('harvester') === 0) {
			console.log('No harvesters, spawning a harvester');
			harvester.spawnBasic(spawn);
		} else if (totalEnergy(spawn) >= 200 && getNumberOfCreepsByRole('upgrader') === 0) {
			console.log("No upgraders, spawning an upgrader");
			upgrader.spawnBasic(spawn);
		} else if (buildersWanted(spawn.room) && getNumberOfCreepsByRole('builder') <= 3 && totalEnergy(spawn) >= 200) {
			console.log('want more builders');
			builder.spawnBasic(spawn);
		} else if (!buildersWanted(spawn.room) && getNumberOfCreepsByRole('upgrader') <= 3 && totalEnergy(spawn) >= 200) {
			console.log('get more upgraders while nothing else is going on');
			upgrader.spawnBasic(spawn);
		} else if (totalEnergy(spawn) >= 550) {
			console.log('BIG BOI');
			upgrader.spawnBeefy(spawn);
		}
	}
};

export default buildingSpawn;
