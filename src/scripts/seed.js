import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
	const users = await prisma.$transaction(async (txn) => {
		await txn.user.deleteMany();
		return await txn.user.createManyAndReturn({
			data: [
				{ first_name: 'Alice', last_name: 'Johnson' },
				{ first_name: 'Bob', last_name: 'Martin' }
			]
		});
	});

	console.log(`Created users: ${JSON.stringify(users)}`);
}

seed().finally(async () => {
	await prisma.$disconnect();
});
