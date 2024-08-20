-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BOUTIQUIER', 'CLIENT', 'ADMIN');

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "quantiteStock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dette" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "montantDue" DOUBLE PRECISION NOT NULL,
    "montantVerser" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleDette" (
    "detteId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "quantiteArticleDette" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleDette_pkey" PRIMARY KEY ("detteId","articleId")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "detteId" INTEGER NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DetteArticle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_libelle_key" ON "Article"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "_DetteArticle_AB_unique" ON "_DetteArticle"("A", "B");

-- CreateIndex
CREATE INDEX "_DetteArticle_B_index" ON "_DetteArticle"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dette" ADD CONSTRAINT "Dette_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleDette" ADD CONSTRAINT "ArticleDette_detteId_fkey" FOREIGN KEY ("detteId") REFERENCES "Dette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleDette" ADD CONSTRAINT "ArticleDette_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_detteId_fkey" FOREIGN KEY ("detteId") REFERENCES "Dette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DetteArticle" ADD CONSTRAINT "_DetteArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DetteArticle" ADD CONSTRAINT "_DetteArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "Dette"("id") ON DELETE CASCADE ON UPDATE CASCADE;
