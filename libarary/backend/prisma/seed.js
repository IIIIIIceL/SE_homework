const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/common/utils/password');

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = hashPassword('123456');

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: '系统管理员'
    }
  });

  await prisma.role.upsert({
    where: { name: 'LIBRARIAN' },
    update: {},
    create: {
      name: 'LIBRARIAN',
      description: '图书管理员'
    }
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: adminPasswordHash,
      roleId: adminRole.id,
      status: 'ACTIVE'
    },
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      fullName: '系统管理员',
      roleId: adminRole.id,
      status: 'ACTIVE'
    }
  });

  let category = await prisma.category.findFirst({
    where: { name: '软件工程', parentId: null }
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: '软件工程' }
    });
  }

  const publisher = await prisma.publisher.upsert({
    where: { name: '高等教育出版社' },
    update: {},
    create: { name: '高等教育出版社' }
  });

  await prisma.book.upsert({
    where: { isbn: '9787040000001' },
    update: {},
    create: {
      isbn: '9787040000001',
      title: '软件工程导论',
      author: '张三',
      categoryId: category.id,
      publisherId: publisher.id,
      totalCopies: 10,
      availableCopies: 10,
      location: 'A-01-01'
    }
  });

  await prisma.reader.upsert({
    where: { readerNo: 'R20260001' },
    update: {},
    create: {
      readerNo: 'R20260001',
      name: '测试读者',
      maxBorrowCount: 5,
      status: 'ACTIVE'
    }
  });

  console.log('Seed completed. Default login: admin / 123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
