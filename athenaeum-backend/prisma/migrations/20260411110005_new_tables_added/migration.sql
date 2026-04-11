-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "language" TEXT,
    "length" INTEGER,
    "size" TEXT,
    "coverType" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MyBook" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "libraryId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "MyBook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyBook" ADD CONSTRAINT "MyBook_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyBook" ADD CONSTRAINT "MyBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
