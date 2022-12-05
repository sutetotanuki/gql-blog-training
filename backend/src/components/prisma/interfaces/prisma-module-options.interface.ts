import { ModuleMetadata, Type } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const PRISMA_SERVICE_OPTIONS = 'PRISMA_SERVICE_OPTIONS';
export const PRISMA_EXPLICIT_CONNECT = 'PRISMA_EXPLICIT_CONNECT';

export interface PrismaModuleOptions {
  isGlobal?: boolean;
  prismaServiceOptions?: PrismaServiceOptions;
}

export interface PrismaServiceOptions {
  prismaOptions?: Prisma.PrismaClientOptions;
}

export interface PrismaOptionsFactory {
  createPrismaOptions(): Promise<PrismaServiceOptions> | PrismaServiceOptions;
}

export interface PrismaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useExisting?: Type<PrismaOptionsFactory>;
  useClass?: Type<PrismaOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PrismaServiceOptions> | PrismaServiceOptions;
  inject?: any[];
}
