// TODO: how to decide what energy needs to be carried
// move energy from a container near sources to a container near room controller

import { depositEnergy } from "utils/energy";

export const carrierBaseName = 'Heli';

const spawnBasic = (spawn: StructureSpawn, num?: number) => {
	// get number of builders already
	const number = num || Object.keys(Game.creeps).filter(x => Game.creeps[x].memory.role === 'carrier').length;
	if (Game.spawns[spawn.name].spawnCreep( [CARRY, CARRY, MOVE, MOVE], carrierBaseName + number, { memory: { role: 'carrier' } } ) === ERR_NAME_EXISTS) {
	  spawnBasic(spawn, number + 1);
	}
}

const roleCarrier = {
    /** @param {Creep} creep **/
    run: (creep: Creep) => {
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            // get from container/corpse/ruin/ near harvesters
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (energy: Resource<ResourceConstant>) => {
                    return energy.resourceType === 'energy';
                }
            });
            if(droppedEnergy.length > 0) {
                if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
            } else {
                depositEnergy(creep);
            }

        }
        else {
            // deposit to container near room controller
            depositEnergy(creep);
        }
    },
    spawnBasic
};

export default roleCarrier;
