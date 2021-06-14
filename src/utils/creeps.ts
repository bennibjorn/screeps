export const creepTierNames = {
    basic: '',
    mid: 'Beefy',
    high: 'Badass',
}

export const getNumberOfCreepsByRole = (role: string) => {
    return _.filter(Game.creeps, creep => creep.memory.role === role).length;
};
export const getNumberOfCreepsByName = (name: string) => {
    return _.filter(Game.creeps, creep => creep.name.startsWith(name)).length;
};
export const getOutOfTheWay = (creep: Creep) => {
    const ootw = creep.room.find(FIND_FLAGS, { filter: (flags) => flags.name === 'OOTW' });
    if (ootw.length > 0 && ootw[0].pos !== creep.pos) {
        creep.moveTo(ootw[0].pos);
    }
}
export const moveToRoom = (creep: Creep, room: string) => {
	const to = new RoomPosition(25, 25, room);
	const route = PathFinder.search(creep.pos, to);
	creep.moveByPath(route.path);
}
