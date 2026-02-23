import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
	private readonly prisma: PrismaClient;

	constructor() {
		// Use the official Postgres adapter factory so PrismaClient has a valid
		// adapter at construction time (Prisma v7 requires adapter or accelerateUrl).
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const adapterPkg = require('@prisma/adapter-pg');

		// The package exports a factory named `PrismaPg`.
		const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;

		// Pass an adapter instance created with the DATABASE_URL so the client can connect.
		const adapterInstance = new PrismaPg({ url: process.env.DATABASE_URL });
		this.prisma = new PrismaClient({
			adapter: adapterInstance,
		});
	}

	async onModuleInit(): Promise<void> {
		try {
			await this.prisma.$connect();
			console.log('[DatabaseService] Connected to database');
		} catch (err) {
			console.error('[DatabaseService] Failed to connect to database:', err);
		}
	}

	async onModuleDestroy(): Promise<void> {
		try {
			await this.prisma.$disconnect();
			console.log('[DatabaseService] Disconnected from database');
		} catch (err) {
			console.error('[DatabaseService] Error disconnecting from database:', err);
		}
	}

	// Expose the underlying client for direct queries when needed
	get client(): PrismaClient {
		return this.prisma;
	}
}
