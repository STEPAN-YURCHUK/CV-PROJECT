import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcrypt from 'bcrypt'
import { CreateUserDTO, UpdateUserDTO } from './dto'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
	) {}

	async hashPassword(password: string) {
		return bcrypt.hash(password, 10)
	}

	async findUserByEmail(email: string): Promise<User> {
		return this.userRepository.findOne({ where: { email } })
	}

	async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
		dto.password = await this.hashPassword(dto.password)
		await this.userRepository.create({
			firstName: dto.firstName,
			username: dto.username,
			email: dto.email,
			password: dto.password,
		})
		return dto
	}

	async publicUser(email: string) {
		return this.userRepository.findOne({
			where: { email: email },
			attributes: { exclude: ['password'] },
		})
	}

	async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
		await this.userRepository.update(dto, { where: { email: email } })
		return dto
	}

	async deleteUser(email: string): Promise<boolean> {
		await this.userRepository.destroy({ where: { email: email } })
		return true
	}
}
