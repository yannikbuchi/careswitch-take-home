import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
	await prisma.$transaction(async (txn) => {
		await txn.user.deleteMany();
		await txn.workspace.deleteMany();
		await txn.usersOnWorkspaces.deleteMany();

		const alice = await txn.user.create({
			data: { first_name: 'Alice', last_name: 'Johnson' }
		});

		const bob = await txn.user.create({
			data: { first_name: 'Bob', last_name: 'Martin' }
		});

		console.log(`Create users: ${JSON.stringify([alice, bob])}`);

		const workspace = await txn.workspace.create({
			data: {
				name: 'JavaScript Nerds Unite',
				description: 'A workspace for the JavaScript enthusiasts'
			}
		});

		console.log(`Created workspace: ${JSON.stringify([workspace])}`);

		await txn.usersOnWorkspaces.create({
			data: {
				userId: alice.id,
				workspaceId: workspace.id
			}
		});

		await txn.usersOnWorkspaces.create({
			data: {
				userId: bob.id,
				workspaceId: workspace.id
			}
		});

		console.log(`Created relationships between users and workspace`);
	});
}

seed().finally(async () => {
	await prisma.$disconnect();
});
