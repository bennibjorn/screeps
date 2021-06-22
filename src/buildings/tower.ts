const totalEnergy = (tower: StructureTower) => {
    return tower.store.energy;
};

const buildingTower = {
    run: (tower: StructureTower) => {
		if (tower.store.energy === 0) return;
		const enemies = tower.room.find(FIND_HOSTILE_CREEPS);
        const repairTargets = tower.room.find(FIND_STRUCTURES, { filter: structure => structure.hits < (structure.hitsMax / 2) })
        if (enemies.length > 0) {
			tower.attack(enemies[0]);
		} else if (repairTargets.length > 0) {
			tower.repair(repairTargets[0]);
		}
    }
};

export default buildingTower;
