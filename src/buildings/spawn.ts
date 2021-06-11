import harvester from 'roles/harvester';
import upgrader from 'roles/upgrader';
import builder from '../roles/builder';
import { getNumberOfCreepsByName, getNumberOfCreepsByRole } from 'utils/creeps';

const buildersWanted = (room: Room) => {
	const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
	const thingsToRepair = room.find<Structure>(FIND_STRUCTURES).filter(struct => struct.hits < struct.hitsMax / 2);
	return constructionSites.length >= 1 || thingsToRepair.length >= 3;
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
		if (totalEnergy(spawn) >= 200 && getNumberOfCreepsByRole('harvester') <= 2) {
			console.log('want more harvesters');
			harvester.spawnBasic(spawn);
		} else if (totalEnergy(spawn) >= 200 && getNumberOfCreepsByRole('upgrader') === 0) {
			console.log("need at least one upgrader");
			upgrader.spawnBasic(spawn);
		} else if (totalEnergy(spawn) >= 200 && buildersWanted(spawn.room) && getNumberOfCreepsByRole('builder') <= 3) {
			console.log('want more builders');
			builder.spawnBasic(spawn);
		} else if (totalEnergy(spawn) >= 200 && !buildersWanted(spawn.room) && getNumberOfCreepsByRole('upgrader') <= 3) {
			console.log('get more upgraders while nothing else is going on');
			upgrader.spawnBasic(spawn);
		} else if (totalEnergy(spawn) >= 550 && getNumberOfCreepsByName('BeefyUptownGirl') >= 5) {
			console.log('BIG BOI');
			upgrader.spawnBeefy(spawn);
		}
	}
};

export default buildingSpawn;
