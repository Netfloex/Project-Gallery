-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CURATOR');

-- CreateTable
CREATE TABLE "User" (
    "studentNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("studentNumber")
);

-- CreateTable
CREATE TABLE "ProfileUpdateRequest" (
    "id" SERIAL NOT NULL,
    "newName" TEXT,
    "profilePicture" TEXT,
    "requesterStudentNumber" TEXT NOT NULL,

    CONSTRAINT "ProfileUpdateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "projectId" INTEGER NOT NULL,
    "userStudentNumber" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("userStudentNumber","projectId")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "publicVotes" INTEGER NOT NULL DEFAULT 0,
    "uploaderStudentNumber" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileUpdateRequest" ADD CONSTRAINT "ProfileUpdateRequest_requesterStudentNumber_fkey" FOREIGN KEY ("requesterStudentNumber") REFERENCES "User"("studentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userStudentNumber_fkey" FOREIGN KEY ("userStudentNumber") REFERENCES "User"("studentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_uploaderStudentNumber_fkey" FOREIGN KEY ("uploaderStudentNumber") REFERENCES "User"("studentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
