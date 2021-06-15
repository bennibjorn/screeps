import { getOutOfTheWay } from "./creeps";
import { pathVisuals } from "./pathVisual";

export const chooseSource = (creep: Creep, sources: Source[]): Id<Source> | null => {
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
    const sorted = availableSpaces.sort((a, b) => b.availableSpaces - a.availableSpaces);
	if (sorted.length > 0) {
		return sorted[0].id;
	} else {
		return null;
	}
}
export const harvestOrMoveTowardsSource = (creep: Creep, source: Source) => {
	const res = creep.harvest(source);
    if (res === ERR_NOT_IN_RANGE) {
        const moveRes = creep.moveTo(source, {
            visualizePathStyle: { stroke: pathVisuals.harvest.color, lineStyle: pathVisuals.harvest.lineStyle }
        });
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
export const getEnergyFromContainersOrHarvest = (creep: Creep, onlyContainers: boolean = false) => {
    const containers = creep.room.find<StructureContainer | StructureLink>(FIND_STRUCTURES).filter((struct) =>
		struct.structureType === STRUCTURE_CONTAINER || struct.structureType === 'link');
	const containersWithEnergy = containers.filter(x => x.store.energy > 0);
    if (containersWithEnergy.length > 1) {
        // find closest, get from that one
        const distances = containersWithEnergy.map(container => {
            return creep.pos.getRangeTo(container.pos);
        });
        const minDistanceIndex = distances.indexOf(Math.min(...distances));
        if (creep.withdraw(containersWithEnergy[minDistanceIndex], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containersWithEnergy[minDistanceIndex], {
                visualizePathStyle: { stroke: pathVisuals.harvest.color, lineStyle: pathVisuals.harvest.lineStyle }
            });
        }
    } else if (containersWithEnergy.length === 1) {
        if (creep.withdraw(containersWithEnergy[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containersWithEnergy[0], {
                visualizePathStyle: { stroke: pathVisuals.harvest.color, lineStyle: pathVisuals.harvest.lineStyle }
            });
        }
    } else if (!onlyContainers || containers.length === 0) {
        // no containers with energy or no containers at all, harvest
        harvestEnergy(creep);
    } else {
        getOutOfTheWay(creep);
    }

}

export const harvesterDeposit = (creep: Creep, targetRoom?: string) => {
	let room = targetRoom ? Game.rooms[targetRoom] : creep.room;
    const targets = room.find(FIND_STRUCTURES, {
        filter: (structure: any) => {
        return (structure.structureType === STRUCTURE_STORAGE) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
                visualizePathStyle: { stroke: pathVisuals.deposit.color, lineStyle: pathVisuals.deposit.lineStyle }
            });
        }
    }
}

const transferOrMoveTo = (creep: Creep, target: AnyStructure) => {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: { stroke: pathVisuals.deposit.color, lineStyle: pathVisuals.deposit.lineStyle }
        });
    } else {
        delete creep.memory.target;
    }
}

export const carrierDeposit = (creep: Creep, predefinedTarget?: AnyStructure, targetRoom?: string) => {
    if (predefinedTarget) {
        transferOrMoveTo(creep, predefinedTarget);
    } else {
        let room = targetRoom ? Game.rooms[targetRoom] : creep.room;
        const targets = room
            .find(FIND_STRUCTURES, {
                filter: (structure: any) => {
                    return ((
                        structure.structureType === STRUCTURE_TOWER ||
                        structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_LINK) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });
        const tower = targets.find(x => x.structureType === STRUCTURE_TOWER) as StructureTower;
        if (tower && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 500) {
            creep.memory.target = tower.id;
            transferOrMoveTo(creep, tower);
        } else if (targets.length > 0) {
			const distances = targets.map(target => {
                return creep.pos.getRangeTo(target.pos);
            });
            const minDistanceIndex = distances.indexOf(Math.min(...distances));
            creep.memory.target = targets[minDistanceIndex].id;
            transferOrMoveTo(creep, targets[minDistanceIndex]);
        }
    }
};
