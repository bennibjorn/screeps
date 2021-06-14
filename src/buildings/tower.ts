const totalEnergy = (tower: StructureTower) => {
    return tower.store.energy;
};

const buildingTower = {
    run: (tower: StructureTower) => {
		if (tower.store.energy === 0) return;
        const repairTargets = tower.room.find(FIND_STRUCTURES, { filter: structure => structure.hits < (structure.hitsMax / 2) })
        if (repairTargets.length > 0) {
			tower.repair(repairTargets[0]);
		}
    }
};

export default buildingTower;
