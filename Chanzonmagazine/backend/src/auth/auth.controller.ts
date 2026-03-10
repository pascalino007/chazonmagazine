import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { IsString } from 'class-validator'

export class LoginDto {
  @IsString()
  username: string

  @IsString()
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    if (!dto.username || !dto.password) throw new UnauthorizedException('Username and password required')
    return this.authService.login(dto.username, dto.password)
  }
}
