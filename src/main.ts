import { ErrorMapper } from "utils/ErrorMapper";
import harvester from './roles/harvester';
import upgrader from './roles/upgrader';
import builder from './roles/builder';
import spawn from './buildings/spawn';

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
      role: string;
      room?: string;
      working?: boolean;
      upgrading?: boolean;
      building?: boolean;
      buildingStructure?: Id<any>;
      harvestingFrom?: Id<Source>;
      alliance?: string; // TODO
  }

  interface SpawnMemory {
	energyFullOnTick: number | null;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
//   console.log(`Current game tick is ${Game.time}`);

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      harvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      upgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      builder.run(creep);
    }
  }
  spawn.run(Game.spawns['Spawn1']);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
