import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import * as path from 'path';
import winston, { level } from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { PrismaClientOptions } from '@prisma/client/runtime';

/**
 * アプリケーションモジュールで利用する設定値は、ここから取得します。
 */
@Injectable()
export class PbEnv {
  constructor(private configService: ConfigService) {}

  isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }

  get service() {
    return this.configService;
  }

  get NodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get Port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get DatabaseUrl(): string {
    return this.configService.get('DATABASE_URL');
  }

  get GqlModuleOptionsFactory(): GqlModuleOptions {
    // 開発：コードからスキーマを生成し、Playgroundも利用する。
    // バックエンドのコードが正なのでコードファーストアプローチを使う
    const devOptions: GqlModuleOptions = {
      autoSchemaFile: path.join(
        process.cwd(),
        'src/generated/graphql/schema.gql',
      ),
      sortSchema: true,
      debug: true,
      playground: true,
    };

    // 本番環境：実行だけ
    const prdOptions: GqlModuleOptions = {
      autoSchemaFile: true,
      debug: false,
      playground: false,
    };
    if (this.isProduction()) {
      return prdOptions;
    } else {
      return devOptions;
    }
  }

  get WinstonModuleOptionsFactory(): WinstonModuleOptions {
    const logginConsole = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        nestWinstonModuleUtilities.format.nestLike('PB_BACKEND', {
          prettyPrint: true,
        }),
      ),
    });

    const loggingCloudLoggin = new LoggingWinston({
      serviceContext: {
        service: 'pb-backend',
        version: '1.0.0',
      },
    });

    return {
      level: this.isProduction() ? 'info' : 'debug',
      transports: this.isProduction()
        ? [logginConsole, loggingCloudLoggin]
        : [logginConsole],
    };
  }

  get PrismaOptionsFactory(): PrismaClientOptions {
    const logOptions = {
      development: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      production: [{ emit: 'event', level: 'warn' }],
      test: [
        { emit: 'event', leve: 'info' },
        { emit: 'event', leve: 'warn' },
      ],
    };

    return {
      errorFormat: 'colorless',
      rejectOnNotFound: true,
      log: logOptions[this.NodeEnv],
    };
  }
}
