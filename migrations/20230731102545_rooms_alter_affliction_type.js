/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// ALTER COLUMN affliction TYPE bodyParts_temp USING affliction::text::bodyParts_temp;
export const up = async (knex) => {
  await knex.raw(`
    CREATE TYPE "bodyPartTemp" AS ENUM ('head', 'heart', 'stomach', 'leftHand', 'rightHand', 'none');
    ALTER TABLE rooms 
      ALTER COLUMN affliction 
      TYPE "bodyPartTemp" USING affliction::text::"bodyPartTemp";
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction"
      TYPE "bodyPartTemp" USING "resultAffliction"::text::"bodyPartTemp";
    DROP TYPE "bodyPart";
    ALTER TABLE rooms 
      ALTER COLUMN affliction 
      TYPE "bodyPartTemp"[] USING array[affliction];
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction"
      TYPE "bodyPartTemp"[] USING array["resultAffliction"];
    ALTER TYPE "bodyPartTemp" RENAME TO "bodyPart";
    ALTER TABLE rooms 
      ALTER COLUMN affliction
      SET DEFAULT '{none}';
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction"
      SET DEFAULT '{none}';
    ALTER TABLE rooms 
      ALTER COLUMN affliction
      SET NOT null;
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction"
      SET NOT null;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
  await knex.raw(`
    CREATE TYPE "bodyPartOld" AS ENUM ('head', 'heart', 'stomach');
    ALTER TABLE rooms 
      ALTER COLUMN affliction
      SET DEFAULT null;
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction" 
      SET DEFAULT null;
    ALTER TABLE rooms 
      ALTER COLUMN affliction 
      TYPE "bodyPart" USING affliction[1]::text::"bodyPart";
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction" 
      TYPE "bodyPart" USING "resultAffliction"[1]::text::"bodyPart";
    ALTER TABLE rooms 
      ALTER COLUMN affliction 
      TYPE "bodyPartOld" USING affliction::text::"bodyPartOld";
    ALTER TABLE rooms 
      ALTER COLUMN "resultAffliction"
      TYPE "bodyPartOld" USING "resultAffliction"::text::"bodyPartOld";
    DROP TYPE "bodyPart";
    ALTER TYPE "bodyPartOld" RENAME TO "bodyPart";
  `);
};