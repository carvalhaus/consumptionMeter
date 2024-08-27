-- CreateTable
CREATE TABLE "Measurement" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" DATETIME NOT NULL,
    "measure_type" TEXT NOT NULL,
    "image" TEXT,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT
);

-- CreateTable
CREATE TABLE "ConfirmedValue" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "confirmed_value" INTEGER NOT NULL,
    CONSTRAINT "ConfirmedValue_measure_uuid_fkey" FOREIGN KEY ("measure_uuid") REFERENCES "Measurement" ("measure_uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Measurement_customer_code_idx" ON "Measurement"("customer_code");

-- CreateIndex
CREATE INDEX "ConfirmedValue_measure_uuid_idx" ON "ConfirmedValue"("measure_uuid");
