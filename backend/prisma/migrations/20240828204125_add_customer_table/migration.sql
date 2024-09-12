/*
  Warnings:

  - You are about to drop the column `customerCustomer_code` on the `Measurement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_code]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_customer_code_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Measurement" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" DATETIME NOT NULL,
    "measure_type" TEXT NOT NULL,
    "image" TEXT,
    "measure_value" INTEGER,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT,
    CONSTRAINT "Measurement_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer" ("customer_code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Measurement" ("customer_code", "has_confirmed", "image", "image_url", "measure_datetime", "measure_type", "measure_uuid", "measure_value") SELECT "customer_code", "has_confirmed", "image", "image_url", "measure_datetime", "measure_type", "measure_uuid", "measure_value" FROM "Measurement";
DROP TABLE "Measurement";
ALTER TABLE "new_Measurement" RENAME TO "Measurement";
CREATE INDEX "Measurement_customer_code_idx" ON "Measurement"("customer_code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");
