import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(username: string, password: string) {
    const adminUser = this.config.get('ADMIN_USERNAME', 'admin')
    const adminPass = this.config.get('ADMIN_PASSWORD', 'chanzonmagazine')

    if (username !== adminUser) throw new UnauthorizedException('Invalid credentials')

    const valid = password === adminPass
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const payload = { sub: 1, username, role: 'admin' }
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: 1, username, role: 'admin' },
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token)
    } catch {
      throw new UnauthorizedException()
    }
  }
}
