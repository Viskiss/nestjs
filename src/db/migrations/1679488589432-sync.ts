import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679488589432 implements MigrationInterface {
    name = 'sync1679488589432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "fullName" character varying,
                "email" character varying NOT NULL,
                "avatar" character varying,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_comment" (
                "id" SERIAL NOT NULL,
                "text" character varying NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "PK_09bced71952353c5ae4e40f0f52" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_comment"
            ADD CONSTRAINT "FK_ebd475b57b16b0039934dc31a14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_comment" DROP CONSTRAINT "FK_ebd475b57b16b0039934dc31a14"
        `);
        await queryRunner.query(`
            DROP TABLE "user_comment"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
