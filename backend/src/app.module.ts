import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from '@pb-components/prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './components/posts/posts.module';
import { PbEnvModule } from './environments/pb-env.module';
import { PbEnv } from './environments/pb-env.service';

@Module({
  imports: [
    PbEnvModule,
    GraphQLModule.forRootAsync({
      inject: [PbEnv],
      useFactory: (env: PbEnv) => env.GqlModuleOptionsFactory,
    }),
    WinstonModule.forRootAsync({
      inject: [PbEnv],
      useFactory: (env: PbEnv) => env.WinstonModuleOptionsFactory,
    }),
    PrismaModule.forRootAsync({
      imports: [WinstonModule],
      inject: [PbEnv],
      isGlobal: true,
      useFactory: (env: PbEnv) => ({
        prismaOptions: env.PrismaOptionsFactory,
      }),
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
