import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1738640000000 implements MigrationInterface {
    name = 'InitialSchema1738640000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ==========================================
        // 1. TABLA USERS
        // ==========================================
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(20) NOT NULL DEFAULT 'user',
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )
        `);


        // ==========================================
        // 2. TABLA UPLOADS
        // ==========================================
        await queryRunner.query(`
            CREATE TABLE "uploads" (
                "id" SERIAL PRIMARY KEY,
                "originalFileName" VARCHAR(255) NOT NULL,
                "filePath" VARCHAR(500) NOT NULL,
                "totalRecords" INTEGER NOT NULL,
                "uploadedById" INTEGER NOT NULL,
                "uploadedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "FK_uploads_user" 
                    FOREIGN KEY ("uploadedById") 
                    REFERENCES "users"("id") 
                    ON DELETE CASCADE
            )
        `);

        // Índices para uploads
        await queryRunner.query(`
            CREATE INDEX "IDX_uploads_user" ON "uploads"("uploadedById");
        `);


        // ==========================================
        // 3. TABLA DOCUMENTS
        // ==========================================
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" SERIAL PRIMARY KEY,
                "correo" VARCHAR(255) NOT NULL,
                "nombre" VARCHAR(255) NOT NULL,
                "telefono" VARCHAR(20) NOT NULL,
                "ciudad" VARCHAR(100) NOT NULL,
                "notas" TEXT,
                "uploadId" INTEGER NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "FK_documents_upload" 
                    FOREIGN KEY ("uploadId") 
                    REFERENCES "uploads"("id") 
                    ON DELETE CASCADE
            )
        `);

        // Índices para documents
        await queryRunner.query(`
            CREATE INDEX "IDX_documents_upload" ON "documents"("uploadId");
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "documents" CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS "uploads" CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    }
}
