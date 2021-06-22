export const getRoomToExpandTo = (): string | null => {
	const roomsWithConstructionSites = new Set(
        Object.keys(Game.constructionSites).map(x => Game.constructionSites[x].pos.roomName)
    );
	let roomToExpandTo: string | null = null;
	roomsWithConstructionSites.forEach((room) => {
		if (!Game.rooms[room].controller) {
			roomToExpandTo = room;
		}
	})
	return roomToExpandTo;
}
