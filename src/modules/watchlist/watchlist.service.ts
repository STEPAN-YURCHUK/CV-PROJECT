import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WatchList } from './models/watchlist.model'
import { CreateAssetResponse } from './response'

@Injectable()
export class WatchlistService {
	constructor(
		@InjectModel(WatchList) private watchlistRepository: typeof WatchList,
	) {}

	async createAsset(user, dto): Promise<CreateAssetResponse> {
		try {
			const watchList = {
				user: user.id,
				name: dto.name,
				assetId: dto.assetId,
			}
			await this.watchlistRepository.create(watchList)
			return watchList
		} catch (e) {
			throw new Error(e)
		}
	}

	async deleteAsset(userId: number, assetId: string): Promise<boolean> {
		try {
			await this.watchlistRepository.destroy({
				where: { id: assetId, user: userId },
			})
			return true
		} catch (e) {
			throw new Error(e)
		}
	}
}
