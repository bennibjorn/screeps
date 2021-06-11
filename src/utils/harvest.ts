export const chooseSource = (creep: Creep, sources: Source[]): Id<Source> => {
    // look for creeps at source location
    // look for walls at source location
    // if there is a free spot, remaining energy and regen is reasonable, choose it
    let optimalSource: Id<Source> = sources[0].id;
    sources.forEach((source) => {
        const rangeToCurrentOptimalSource = Game.getObjectById(optimalSource)?.pos.getRangeTo(creep.pos) as number;
        const mostAvailableSides = 9;
        const creepsAtSource = creep.room.lookForAtArea(LOOK_CREEPS, source.pos.y + 1, source.pos.x - 1, source.pos.y - 1, source.pos.x + 1, true).length;
        const wallsAtSource = creep.room.lookForAtArea(LOOK_TERRAIN, source.pos.y + 1, source.pos.x - 1, source.pos.y - 1, source.pos.x + 1, true).length;
        const availableSpaces = mostAvailableSides - creepsAtSource - wallsAtSource;
        if (availableSpaces >= 1 && source.pos.getRangeTo(creep.pos) < rangeToCurrentOptimalSource) {
            optimalSource = source.id;
        }
    });
    return optimalSource;
}
export const harvestOrMoveTowardsSource = (creep: Creep, source: Source) => {
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
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
