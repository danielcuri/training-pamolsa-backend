-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OperationPriority" AS ENUM ('CRITICAL', 'SEMI_CRITICAL', 'NON_CRITICAL');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TrainingResult" AS ENUM ('PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "PeriodStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area_operations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" "OperationPriority" NOT NULL,
    "weight_percent" DOUBLE PRECISION,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "area_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "area_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "dni" TEXT,
    "password" TEXT,
    "education_level" TEXT,
    "hire_date" TIMESTAMP(3),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "project_id" INTEGER,
    "area_id" INTEGER,
    "role_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "period_duration_days" INTEGER,
    "total_periods" INTEGER,
    "minimum_passing_score" DOUBLE PRECISION,
    "certificate_template_pdf" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "area_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_operations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" "OperationPriority" NOT NULL,
    "weight_percent" DOUBLE PRECISION,
    "order" INTEGER,
    "minimum_score" DOUBLE PRECISION,
    "template_id" INTEGER NOT NULL,
    "area_operation_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "template_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3),
    "status" "TrainingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "result" "TrainingResult",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_periods" (
    "id" SERIAL NOT NULL,
    "training_id" INTEGER NOT NULL,
    "period_number" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "PeriodStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_logs" (
    "id" SERIAL NOT NULL,
    "training_period_id" INTEGER NOT NULL,
    "template_operation_id" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "checklist" TEXT,
    "notes" TEXT,
    "evaluator_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_evaluations" (
    "id" SERIAL NOT NULL,
    "training_id" INTEGER NOT NULL,
    "evaluation_date" TIMESTAMP(3),
    "final_score" DOUBLE PRECISION,
    "result" "TrainingResult",
    "notes" TEXT,
    "evaluator_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_details" (
    "id" SERIAL NOT NULL,
    "evaluation_id" INTEGER NOT NULL,
    "template_operation_id" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "evaluator_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "evaluation_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "users"("dni");

-- CreateIndex
CREATE INDEX "training_templates_project_id_idx" ON "training_templates"("project_id");

-- CreateIndex
CREATE INDEX "training_templates_area_id_idx" ON "training_templates"("area_id");

-- CreateIndex
CREATE INDEX "training_periods_training_id_idx" ON "training_periods"("training_id");

-- CreateIndex
CREATE INDEX "training_logs_training_period_id_idx" ON "training_logs"("training_period_id");

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_operations" ADD CONSTRAINT "area_operations_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_templates" ADD CONSTRAINT "training_templates_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_templates" ADD CONSTRAINT "training_templates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_operations" ADD CONSTRAINT "template_operations_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "training_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_operations" ADD CONSTRAINT "template_operations_area_operation_id_fkey" FOREIGN KEY ("area_operation_id") REFERENCES "area_operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "training_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_periods" ADD CONSTRAINT "training_periods_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_logs" ADD CONSTRAINT "training_logs_training_period_id_fkey" FOREIGN KEY ("training_period_id") REFERENCES "training_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_logs" ADD CONSTRAINT "training_logs_template_operation_id_fkey" FOREIGN KEY ("template_operation_id") REFERENCES "template_operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_logs" ADD CONSTRAINT "training_logs_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_evaluations" ADD CONSTRAINT "training_evaluations_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_evaluations" ADD CONSTRAINT "training_evaluations_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_details" ADD CONSTRAINT "evaluation_details_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "training_evaluations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_details" ADD CONSTRAINT "evaluation_details_template_operation_id_fkey" FOREIGN KEY ("template_operation_id") REFERENCES "template_operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
