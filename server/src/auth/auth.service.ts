import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninParams, SignupParams } from 'src/shared/interfaces/auth';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(
    { email, name, password, phone }: SignupParams,
    userType: UserType,
  ): Promise<string> {
    const userExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) throw new ConflictException();

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });

    return this.generateJWT(name, user.id);
  }

  async signin({ email, password }: SigninParams): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException('Invalid Credentials', 400);

    const isValidPassport = await bcrypt.compare(password, user.password);

    if (!isValidPassport) throw new HttpException('Invalid Credentials', 400);

    return this.generateJWT(user.name, user.id);
  }

  async generateProductKey(email: string, userType: UserType): Promise<string> {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY}`;
    return bcrypt.hash(string, 10);
  }

  private generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 36000 },
    );
  }
}
