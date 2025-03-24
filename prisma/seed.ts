import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Statuses } from 'src/types/busubessmanTypes';

const prisma = new PrismaClient();

async function seedUsersAndBusinesses() {
  console.log('Insertando usuarios y comerciantes...');

  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.users.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@email.com', password: passwordHash, role: 'ADMIN' },
  });

  await prisma.users.upsert({
    where: { email: 'assistant@email.com' },
    update: {},
    create: { name: 'Assistant', email: 'assistant@email.com', password: passwordHash, role: 'ASSISTANT' },
  });

  console.log('Usuarios y comerciantes insertados.');
}

async function seedBusinessmen() {
  console.log("Insertando comerciantes...");

  const adminUser = await prisma.users.findFirst({ where: { email: "admin@email.com" } });

  if (!adminUser) {
    console.error("No se encontró un usuario administrador.");
    return;
  }

  const businessmenData = [
    { name: "Comerciante 1", city: "Bogotá", phone: "+57 3101234567", email: "comer1@email.com", status: Statuses.ACTIVE, date: "2025-03-14"  },
    { name: "Comerciante 2", city: "Medellín", phone: "+57 3209876543", email: "comer2@email.com", status: Statuses.ACTIVE, date: "2025-03-15" },
    { name: "Comerciante 3", city: "Cali", phone: "+57 3005671234", email: "comer3@email.com", status: Statuses.INACTIVE, date: "2025-03-16" },
    { name: "Comerciante 4", city: "Barranquilla", phone: "+57 3005671532", email: "comer4@email.com", status: Statuses.INACTIVE, date: "2025-03-10" },
    { name: "Comerciante 5", city: "Cartagena", phone: "+57 3005671289", email: "comer5@email.com", status: Statuses.INACTIVE, date: "2025-03-06" },
  ];

  for (const businessman of businessmenData) {
    await prisma.businessman.create({
      data: {
        ...businessman,
        users: { connect: { id: adminUser.id } },
      },
    });
  }

  console.log("Comerciantes insertados.");
}

async function seedMunicipalities() {
  console.log('Insertando municipios...');

  const municipalities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];

  for (const name of municipalities) {
    await prisma.municipality.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Municipios insertados correctamente.');
}

async function seedEstablishments() {
  console.log("Insertando establecimientos...");

  const businessmen = await prisma.businessman.findMany();

  for (const businessman of businessmen) {
    await prisma.establishment.createMany({
      data: [
        { name: `${businessman.name} Store 1`, income: 50000, employees: 5, businessmanId: businessman.id, user: 1 },
        { name: `${businessman.name} Store 2`, income: 75000, employees: 8, businessmanId: businessman.id, user: 1 },
        { name: `${businessman.name} Store 3`, income: 92000, employees: 10, businessmanId: businessman.id, user: 2 },
      ],
    });
  }

  console.log("Establecimientos insertados.");
}

async function main() {
  const args = process.argv.slice(2);


  if (args.includes("businessmen")) {
    await seedBusinessmen();
  } else if (args.includes("establishments")) {
    await seedEstablishments();
  } else if (args.includes("all")) {
    await seedUsersAndBusinesses();
    await seedMunicipalities();
    await seedBusinessmen();
    await seedEstablishments();
  } else {
    console.log(" Debes pasar un argumento válido:");
    console.log("   - `npx prisma db seed -- businessmen` para insertar comerciantes.");
    console.log("   - `npx prisma db seed -- establishments` para insertar establecimientos.");
    console.log("   - `npx prisma db seed -- all` para insertar todo.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
