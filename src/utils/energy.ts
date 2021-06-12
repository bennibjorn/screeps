export const getEnergy = (creep: Creep) => {
    const containers = creep.room.find<StructureContainer>(FIND_STRUCTURES, { filter: STRUCTURE_CONTAINER });
    const sources = creep.room.find(FIND_SOURCES);
    // check if containers have any energy in them

}
