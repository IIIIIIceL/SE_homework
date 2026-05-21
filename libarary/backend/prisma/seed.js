const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/common/utils/password');

const prisma = new PrismaClient();

async function main() {
  const defaultPasswordHash = hashPassword('123456');

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'System administrator'
    }
  });

  const librarianRole = await prisma.role.upsert({
    where: { name: 'LIBRARIAN' },
    update: {},
    create: {
      name: 'LIBRARIAN',
      description: 'Reader account'
    }
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: adminRole.id,
      status: 'ACTIVE'
    },
    create: {
      username: 'admin',
      passwordHash: defaultPasswordHash,
      fullName: 'System Administrator',
      roleId: adminRole.id,
      status: 'ACTIVE'
    }
  });

  let category = await prisma.category.findFirst({
    where: { name: 'Software Engineering', parentId: null }
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Software Engineering' }
    });
  }

  const publisher = await prisma.publisher.upsert({
    where: { name: 'Higher Education Press' },
    update: {},
    create: { name: 'Higher Education Press' }
  });

  await prisma.book.upsert({
    where: { isbn: '9787040000001' },
    update: {},
    create: {
      isbn: '9787040000001',
      title: 'Introduction to Software Engineering',
      author: 'Zhang San',
      categoryId: category.id,
      publisherId: publisher.id,
      totalCopies: 10,
      availableCopies: 10,
      location: 'A-01-01'
    }
  });

  const reader = await prisma.reader.upsert({
    where: { readerNo: 'R20260001' },
    update: {},
    create: {
      readerNo: 'R20260001',
      name: 'Test Reader',
      maxBorrowCount: 5,
      status: 'ACTIVE'
    }
  });

  const readerUser = await prisma.user.upsert({
    where: { username: reader.readerNo },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: librarianRole.id,
      fullName: reader.name,
      status: 'ACTIVE'
    },
    create: {
      username: reader.readerNo,
      passwordHash: defaultPasswordHash,
      fullName: reader.name,
      roleId: librarianRole.id,
      status: 'ACTIVE'
    }
  });

  await prisma.reader.update({
    where: { id: reader.id },
    data: { userId: readerUser.id }
  });

  console.log('Seed completed. Admin: admin / 123456, Reader: R20260001 / 123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
