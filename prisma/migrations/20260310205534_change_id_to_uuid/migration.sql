/*
  Warnings:

  - The primary key for the `area_operations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `areas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `evaluation_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `template_operations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `training_evaluations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `training_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `training_periods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `training_templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trainings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "area_operations" DROP CONSTRAINT "area_operations_area_id_fkey";

-- DropForeignKey
ALTER TABLE "areas" DROP CONSTRAINT "areas_project_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluation_details" DROP CONSTRAINT "evaluation_details_evaluation_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluation_details" DROP CONSTRAINT "evaluation_details_template_operation_id_fkey";

-- DropForeignKey
ALTER TABLE "template_operations" DROP CONSTRAINT "template_operations_area_operation_id_fkey";

-- DropForeignKey
ALTER TABLE "template_operations" DROP CONSTRAINT "template_operations_template_id_fkey";

-- DropForeignKey
ALTER TABLE "training_evaluations" DROP CONSTRAINT "training_evaluations_evaluator_id_fkey";

-- DropForeignKey
ALTER TABLE "training_evaluations" DROP CONSTRAINT "training_evaluations_training_id_fkey";

-- DropForeignKey
ALTER TABLE "training_logs" DROP CONSTRAINT "training_logs_evaluator_id_fkey";

-- DropForeignKey
ALTER TABLE "training_logs" DROP CONSTRAINT "training_logs_template_operation_id_fkey";

-- DropForeignKey
ALTER TABLE "training_logs" DROP CONSTRAINT "training_logs_training_period_id_fkey";

-- DropForeignKey
ALTER TABLE "training_periods" DROP CONSTRAINT "training_periods_training_id_fkey";

-- DropForeignKey
ALTER TABLE "training_templates" DROP CONSTRAINT "training_templates_area_id_fkey";

-- DropForeignKey
ALTER TABLE "training_templates" DROP CONSTRAINT "training_templates_project_id_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_template_id_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_area_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_project_id_fkey";

-- AlterTable
ALTER TABLE "area_operations" DROP CONSTRAINT "area_operations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "area_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "area_operations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "area_operations_id_seq";

-- AlterTable
ALTER TABLE "areas" DROP CONSTRAINT "areas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "areas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "areas_id_seq";

-- AlterTable
ALTER TABLE "evaluation_details" DROP CONSTRAINT "evaluation_details_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "evaluation_id" SET DATA TYPE TEXT,
ALTER COLUMN "template_operation_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "evaluation_details_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "evaluation_details_id_seq";

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "projects_id_seq";

-- AlterTable
ALTER TABLE "template_operations" DROP CONSTRAINT "template_operations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "template_id" SET DATA TYPE TEXT,
ALTER COLUMN "area_operation_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "template_operations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "template_operations_id_seq";

-- AlterTable
ALTER TABLE "training_evaluations" DROP CONSTRAINT "training_evaluations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "training_id" SET DATA TYPE TEXT,
ALTER COLUMN "evaluator_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "training_evaluations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "training_evaluations_id_seq";

-- AlterTable
ALTER TABLE "training_logs" DROP CONSTRAINT "training_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "training_period_id" SET DATA TYPE TEXT,
ALTER COLUMN "template_operation_id" SET DATA TYPE TEXT,
ALTER COLUMN "evaluator_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "training_logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "training_logs_id_seq";

-- AlterTable
ALTER TABLE "training_periods" DROP CONSTRAINT "training_periods_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "training_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "training_periods_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "training_periods_id_seq";

-- AlterTable
ALTER TABLE "training_templates" DROP CONSTRAINT "training_templates_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "area_id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "training_templates_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "training_templates_id_seq";

-- AlterTable
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "template_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "trainings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "trainings_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ALTER COLUMN "area_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_operations" ADD CONSTRAINT "area_operations_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
