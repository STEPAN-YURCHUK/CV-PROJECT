import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AppError } from '../../common/constants/errors'
import { TokenService } from '../token/token.service'
import { CreateUserDTO } from '../users/dto'
import { UsersService } from './../users/users.service'
import { UserLoginDTO } from './dto'
import { AuthUserResponse } from './response'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService,
	) {}

	async registerUsers(dto: CreateUserDTO): Promise<CreateUserDTO> {
		const exitsUser = await this.usersService.findUserByEmail(dto.email)
		if (exitsUser) throw new BadRequestException(AppError.USER_EXIST)
		return this.usersService.createUser(dto)
	}

	async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
		const existUser = await this.usersService.findUserByEmail(dto.email)
		if (!existUser) throw new BadRequestException(AppError.USER_NOT_FOUND)
		const validatePassword = await bcrypt.compare(
			dto.password,
			existUser.password,
		)
		if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA)
		const userDate = {
			name: existUser.firstName,
			email: existUser.email,
		}
		const token = await this.tokenService.generateJwtToken(userDate)
		const user = await this.usersService.publicUser(dto.email)
		return { ...user, token }
	}
}