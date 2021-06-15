import { creepTierNames, moveToRoom } from "utils/creeps";
import { harvesterDeposit, harvestEnergy } from "utils/energy";

export const harvesterBaseName = 'Harry';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
	// get number of builders already
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'harvester').length;
	if (Game.spawns[spawn.name].spawnCreep( [WORK, CARRY, MOVE], harvesterBaseName + number, { memory: { role: 'harvester' } } ) === ERR_NAME_EXISTS) {
	  spawnBasic(spawn, number + 1);
	}
}
const spawnMid = (spawn: StructureSpawn, num?: number) => {
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === "harvester").length;
    if (
        Game.spawns[spawn.name].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], creepTierNames.mid + harvesterBaseName + number, {
            memory: { role: "harvester" }
        }) === ERR_NAME_EXISTS
    ) {
        spawnMid(spawn, number + 1);
    }
}
const spawnAbroad = (spawn: StructureSpawn, targetRoom: string, num?: number) => {
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === "harvester").length;
    if (
        Game.spawns[spawn.name].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], targetRoom + '-' + harvesterBaseName + number, {
            memory: { role: "harvester", workroom: targetRoom, homeroom: spawn.room.name }
        }) === ERR_NAME_EXISTS
    ) {
        spawnAbroad(spawn, targetRoom, number + 1);
    }
}

const roleHarvester = {
  /** @param {Creep} creep **/
	run: (creep: Creep) => {
		if (creep.store.getFreeCapacity() > 0 && creep.memory.workroom && creep.memory.workroom !== creep.room.name) {
			moveToRoom(creep, creep.memory.workroom);
		} else if (creep.store.getFreeCapacity() > 0) {
			harvestEnergy(creep);
		} else if (creep.store.getFreeCapacity() === 0 && creep.memory.homeroom && creep.memory.homeroom !== creep.room.name) {
			moveToRoom(creep, creep.memory.homeroom);
		}
		else {
			delete creep.memory.harvestingFrom;
			harvesterDeposit(creep);
		}
	},
	spawnBasic,
	spawnMid,
	spawnAbroad
};

export default roleHarvester;
