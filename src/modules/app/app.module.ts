import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/modules/users/users.module'
import configuration from '../../config/configuration'
import { AuthModule } from '../auth/auth.module'
import { TokenModule } from '../token/token.module'
import { User } from '../users/models/user.model'
import { WatchList } from '../watchlist/models/watchlist.model'
import { WatchlistModule } from '../watchlist/watchlist.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				dialect: 'postgres',
				host: configService.get('db_host'),
				port: configService.get('db_port'),
				username: configService.get('db_user'),
				password: configService.get('db_password'),
				database: configService.get('db_name'),
				autoLoadModels: true,
				synchronize: true,
				models: [User, WatchList],
			}),
		}),
		UsersModule,
		AuthModule,
		TokenModule,
		WatchlistModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
