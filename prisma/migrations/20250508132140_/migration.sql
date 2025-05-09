-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PYTHON', 'JAVA');

-- CreateTable
CREATE TABLE "User" (
    "studentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("studentNumber")
);

-- CreateTable
CREATE TABLE "Curator" (
    "studentNumber" TEXT NOT NULL,

    CONSTRAINT "Curator_pkey" PRIMARY KEY ("studentNumber")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "uploaderStudentNumber" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "curatorStudentNumber" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_uploaderStudentNumber_fkey" FOREIGN KEY ("uploaderStudentNumber") REFERENCES "User"("studentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_curatorStudentNumber_fkey" FOREIGN KEY ("curatorStudentNumber") REFERENCES "Curator"("studentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
