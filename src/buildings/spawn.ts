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
	return spawn.room.energyAvailable;
}

const buildingSpawn = {
	run: (spawn: StructureSpawn) => {
		if (spawn.spawning) return;
		if (totalEnergy(spawn) >= 200) {
			// must have spawns first
			if (getNumberOfCreepsByRole('harvester') <= 2) {
				console.log("spawn basic harvester, total harvesters will be: " + getNumberOfCreepsByRole('harvester') + 1);
                harvester.spawnBasic(spawn);
			} else if (getNumberOfCreepsByRole('upgrader') === 0) {
				console.log('spawn basic upgrader, total upgraders will be 1');
				upgrader.spawnBasic(spawn);
			} else if (buildersWanted(spawn.room) && getNumberOfCreepsByRole('builder') <= 3) {
				console.log("spawn basic builder, total builders will be " + getNumberOfCreepsByRole("builder") + 1);
				builder.spawnBasic(spawn);
			}
		}
		if (totalEnergy(spawn) >= 600) {
			// mid sized spawns
			if (getNumberOfCreepsByName('BeefyHarry') <= 3) {
				console.log(
                    "spawn beefy harvester, total beefy harvesters will be " +
                        getNumberOfCreepsByName("BeefyHarry") + 1
                );
				harvester.spawnBeefy(spawn);
			} else if (getNumberOfCreepsByName('BeefyUptownGirl') <= 5) {
				console.log(
                    "spawn beefy upgrader, total beefy upgraders will be " + getNumberOfCreepsByName("BeefyUptownGirl") + 1
                );
				upgrader.spawnBeefy(spawn);
			}
		}
	}
};

export default buildingSpawn;
