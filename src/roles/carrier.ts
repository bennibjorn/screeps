// TODO: how to decide what energy needs to be carried
// move energy from a container near sources to a container near room controller

import { creepTierNames } from "utils/creeps";
import { depositEnergy, carrierDeposit } from "utils/energy";

export const carrierBaseName = 'Heli';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
	// get number of builders already
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'carrier').length;
	if (Game.spawns[spawn.name].spawnCreep( [CARRY, CARRY, MOVE, MOVE], carrierBaseName + number, { memory: { role: 'carrier' } } ) === ERR_NAME_EXISTS) {
	  spawnBasic(spawn, number + 1);
	}
}
const spawnMid = (spawn: StructureSpawn, num?: number) => {
	// get number of builders already
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'carrier').length;
	if (Game.spawns[spawn.name].spawnCreep(
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        creepTierNames.mid + carrierBaseName + number, { memory: { role: 'carrier' } } ) === ERR_NAME_EXISTS) {
        spawnMid(spawn, number + 1);
	}
}

const pickupOrApproach = (creep: Creep, target: Resource<ResourceConstant>) => {
	if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaabb" } });
    }
}

const withdrawOrApproach = (creep: Creep, target: Tombstone | Ruin | StructureStorage) => {
    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaabb" } });
        return;
    } else {
        delete creep.memory.target;
    }
};

const roleCarrier = {
    /** @param {Creep} creep **/
    run: (creep: Creep) => {
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.memory.target !== undefined) {
                // already have a target
                const thing = Game.getObjectById(creep.memory.target);
                if (thing?.store?.getFreeCapacity && thing?.store?.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    // target energy store is not full, continue moving towards it
                    withdrawOrApproach(creep, thing);
                    return;
                } else {
                    delete creep.memory.target;
                }
            }
            // get from container/corpse/ruin/ near harvesters
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (energy: Resource<ResourceConstant>) => {
                    return energy.resourceType === 'energy';
                }
            });
			const tombstoneEnergy = creep.room.find(FIND_TOMBSTONES, {
				filter: (ts) => ts.store.energy > 0
			});
			const ruins = creep.room.find(FIND_RUINS, { filter: (ruin) => ruin.store.energy > 0 });
			const storage = creep.room.storage;
            if(droppedEnergy.length > 0) {
                pickupOrApproach(creep, droppedEnergy[0]);
            } else if (tombstoneEnergy.length > 0) {
                creep.memory.target = tombstoneEnergy[0].id;
				withdrawOrApproach(creep, tombstoneEnergy[0]);
			} else if (ruins.length > 0) {
                creep.memory.target = ruins[0].id;
				withdrawOrApproach(creep, ruins[0]);
			} else if (storage && storage.store.energy >= 50) {
                creep.memory.target = storage.id;
				withdrawOrApproach(creep, storage);
			} else if (creep.store.energy > 0) {
                carrierDeposit(creep);
            }
        }
        else if (creep.memory.target !== undefined) {
            // had a deposit target
            const thing = Game.getObjectById(creep.memory.target);
            if (thing?.store?.getFreeCapacity && thing?.store?.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                // target energy store is not full, continue moving towards it
                carrierDeposit(creep, thing);
            } else {
                delete creep.memory.target;
            }
        }
        else {
            // deposit to container near room controller
            carrierDeposit(creep);
        }
    },
    spawnBasic,
    spawnMid
};

export default roleCarrier;
