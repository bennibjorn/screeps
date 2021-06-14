export const chooseSource = (creep: Creep, sources: Source[]): Id<Source> => {
    // look for creeps at source location
    // look for walls at source location
    // if there is a free spot, remaining energy and regen is reasonable, choose it
	const availableSpaces: Array<{ id: Id<Source>, availableSpaces: number }> = [];
    sources.forEach((source) => {
        const mostAvailableSides = 9;
        const creepsAtSource = creep.room.lookForAtArea(LOOK_CREEPS, source.pos.y + 1, source.pos.x - 1, source.pos.y - 1, source.pos.x + 1, true).length;
        const wallsAtSource = creep.room.lookForAtArea(LOOK_TERRAIN, source.pos.y + 1, source.pos.x - 1, source.pos.y - 1, source.pos.x + 1, true).length;
        const free = mostAvailableSides - creepsAtSource - wallsAtSource;
		if (source.energy !== 0) {
			availableSpaces.push({ id: source.id, availableSpaces: free });
		}
    });
    return availableSpaces.sort((a, b) => b.availableSpaces - a.availableSpaces)[0].id;
}
export const harvestOrMoveTowardsSource = (creep: Creep, source: Source) => {
	const res = creep.harvest(source);
    if (res === ERR_NOT_IN_RANGE) {
        const moveRes = creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
		if (moveRes === ERR_NO_PATH) {
			delete creep.memory.harvestingFrom;
		}
    } else if (res === ERR_NOT_ENOUGH_ENERGY) {
		delete creep.memory.harvestingFrom;
	}
}
export const harvestEnergy = (creep: Creep) => {
    if (creep.memory.harvestingFrom) {
        harvestOrMoveTowardsSource(creep, Game.getObjectById<Source>(creep.memory.harvestingFrom) as Source);
    } else {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            const best = chooseSource(creep, sources);
            if (best !== null) {
                creep.memory.harvestingFrom = best;
                harvestOrMoveTowardsSource(creep, Game.getObjectById<Source>(best) as Source);
            } else {
                harvestOrMoveTowardsSource(creep, sources[0]);
            }
        }
    }
}
export const getEnergyFromContainersOrHarvest = (creep: Creep) => {
    const containersWithEnergy = creep.room.find<StructureContainer>(FIND_STRUCTURES).filter((struct) => struct.structureType === STRUCTURE_CONTAINER && struct.store.energy > 0);
    if (containersWithEnergy.length > 1) {
        // find closest, get from that one
		const distances = containersWithEnergy.map((container) => {
			return creep.pos.getRangeTo(container.pos);
		});
		const minDistanceIndex = distances.indexOf(Math.min(...distances));
		if (creep.withdraw(containersWithEnergy[minDistanceIndex], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containersWithEnergy[minDistanceIndex], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
    } else if (containersWithEnergy.length === 1) {
        if (creep.withdraw(containersWithEnergy[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containersWithEnergy[0], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
    } else {
        // no containers with energy, harvest
        harvestEnergy(creep);
    }

}

const sortEnergyReceiversByPriority = ((a: Structure, b: Structure) => {
	if (b.structureType === STRUCTURE_SPAWN && a.structureType !== STRUCTURE_SPAWN) {
		return 3;
	} else if (b.structureType === STRUCTURE_EXTENSION && a.structureType !== STRUCTURE_EXTENSION) {
        return 2;
    } else if (b.structureType === STRUCTURE_CONTAINER && a.structureType !== STRUCTURE_CONTAINER) {
		return 1;
	} else if (b.structureType === STRUCTURE_TOWER) {
		return -1;
	} else {
		return 0;
	}
})

export const depositEnergy = (creep: Creep, targetRoom?: string) => {
	let room = targetRoom ? Game.rooms[targetRoom] : creep.room;
    const targets = room.find(FIND_STRUCTURES, {
        filter: (structure: any) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
				structure.structureType === STRUCTURE_TOWER ||
                structure.structureType === STRUCTURE_STORAGE) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    }).sort(sortEnergyReceiversByPriority);
    if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

export const depositEnergyInContainer = (creep: Creep, targetRoom?: string) => {
    let room = targetRoom ? Game.rooms[targetRoom] : creep.room;
    const targets = room
        .find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                return (
                    (structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            }
        });
    if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
    }
};
