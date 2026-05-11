-- AlterTable
ALTER TABLE "training_periods" ADD COLUMN     "evaluation_date" TIMESTAMP(3),
ADD COLUMN     "evaluator_id" TEXT,
ADD COLUMN     "reinforcement_notes" TEXT,
ADD COLUMN     "validation_notes" TEXT,
ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- CreateIndex
CREATE INDEX "training_periods_evaluator_id_idx" ON "training_periods"("evaluator_id");

-- AddForeignKey
ALTER TABLE "training_periods" ADD CONSTRAINT "training_periods_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
