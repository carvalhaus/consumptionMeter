/*
  Warnings:

  - Added the required column `customerCustomer_code` to the `Measurement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Customer" (
    "customer_code" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Measurement" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" DATETIME NOT NULL,
    "measure_type" TEXT NOT NULL,
    "image" TEXT,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT,
    "measure_value" INTEGER,
    "customerCustomer_code" TEXT NOT NULL,
    CONSTRAINT "Measurement_customerCustomer_code_fkey" FOREIGN KEY ("customerCustomer_code") REFERENCES "Customer" ("customer_code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Measurement" ("customer_code", "has_confirmed", "image", "image_url", "measure_datetime", "measure_type", "measure_uuid", "measure_value") SELECT "customer_code", "has_confirmed", "image", "image_url", "measure_datetime", "measure_type", "measure_uuid", "measure_value" FROM "Measurement";
DROP TABLE "Measurement";
ALTER TABLE "new_Measurement" RENAME TO "Measurement";
CREATE INDEX "Measurement_customer_code_idx" ON "Measurement"("customer_code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Customer_customer_code_idx" ON "Customer"("customer_code");
