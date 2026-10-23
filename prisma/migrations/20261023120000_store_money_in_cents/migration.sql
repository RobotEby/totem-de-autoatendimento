-- AlterTable: scale existing values to cents before changing the type
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE INTEGER USING ROUND("price" * 100);

-- AlterTable
ALTER TABLE "OrderProduct" ALTER COLUMN "price" SET DATA TYPE INTEGER USING ROUND("price" * 100);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" SET DATA TYPE INTEGER USING ROUND("total" * 100);
