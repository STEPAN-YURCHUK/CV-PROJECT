import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { WatchList } from './models/watchlist.model'
import { WatchlistController } from './watchlist.controller'
import { WatchlistService } from './watchlist.service'

@Module({
	imports: [SequelizeModule.forFeature([WatchList])],
	controllers: [WatchlistController],
	providers: [WatchlistService],
})
export class WatchlistModule {}
