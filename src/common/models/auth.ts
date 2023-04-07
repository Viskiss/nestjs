import { ApiProperty } from '@nestjs/swagger';
import User from '../../db/entities/user.entity';

export class AuthPayload {
  @ApiProperty({ example: User })
  user: User;

  @ApiProperty({
    example:
      'accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjgwNzc0MzExLCJleHAiOjE2ODA3NzYxMTF9.q338WMk-zoGWt02d_e1T-E7Dxd0xdZVJnOXoYT6Obss, refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjgwNzc0MzExLCJleHAiOjE2ODA3NzYxMTF9.q338WMk-zoGWt02d_e1T-E7Dxd0xdZVJnOXoYT6Obss',
  })
  tokens: {
    accessToken: string;
    refresgToken: string;
  };
}

export class AuthRefreshPayload {
  @ApiProperty({
    example:
      'accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjgwNzc0MzExLCJleHAiOjE2ODA3NzYxMTF9.q338WMk-zoGWt02d_e1T-E7Dxd0xdZVJnOXoYT6Obss, refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjgwNzc0MzExLCJleHAiOjE2ODA3NzYxMTF9.q338WMk-zoGWt02d_e1T-E7Dxd0xdZVJnOXoYT6Obss',
  })
  tokens: {
    accessToken: string;
    refresgToken: string;
  };
}
