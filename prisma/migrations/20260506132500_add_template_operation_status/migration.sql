-- Add status column to template_operations for soft inactivation
ALTER TABLE "template_operations"
ADD COLUMN "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE';

