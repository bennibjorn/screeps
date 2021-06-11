export const getNumberOfCreepsByRole = (role: string) => {
    return _.filter(Game.creeps, creep => creep.memory.role === role).length;
};
export const getNumberOfCreepsByName = (name: string) => {
    return _.filter(Game.creeps, creep => creep.name.startsWith(name)).length;
};
