import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('bcrypt test', () => {
  let bcryptService: BcryptService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('Return boolean result before compare passwords', async () => {
    const compareTrue = await bcryptService.compare(
      '11111',
      '$2a$10$0ALq5gVIkLio0OM.hlFb.eBFwmgHlUmqmh5GT146rV69svI2SeNr6',
    );
    expect(compareTrue).toBeTruthy;

    const compareFalse = await bcryptService.compare(
      '11111',
      'some hashed string',
    );
    expect(compareFalse).toBeFalsy;
  });

  it('Return string result before hash password', async () => {
    const hash = await bcryptService.hash('11111');

    expect(hash).toMatch(/[s0/\/\P4$$w0rD]/);
  });

  it('Return error compare', async () => {
    try {
      jest
        .spyOn(bcryptService, 'compare')
        .mockRejectedValue(new BadRequestException('Bad Request'));
      await bcryptService.compare('', '');
    } catch (error) {
      expect(error.message).toBe('Bad Request');
    }
  });

  it('Return error hash', async () => {
    try {
      jest
        .spyOn(bcryptService, 'compare')
        .mockRejectedValue(new BadRequestException('Bad Request'));
      await bcryptService.hash('');
    } catch (error) {
      expect(error.message).toBe('Bad Request');
    }
  });

  afterAll(async () => {
    await module.close();
  });
});
