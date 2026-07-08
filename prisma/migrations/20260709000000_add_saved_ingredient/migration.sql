-- CreateTable
CREATE TABLE "SavedIngredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUnit" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedIngredient_name_key" ON "SavedIngredient"("name");

