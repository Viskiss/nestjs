import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { BcryptService } from './bcrypt.service';

import { BcryptModule } from './bcrypt.module';

describe('bcrypt test', () => {
  let bcryptService: BcryptService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BcryptModule],
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
    jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => {
      throw new TypeError();
    });

    const test = bcryptService.compare('', '');

    expect(test).rejects.toThrow('INTERNAL_SERVER_ERROR');
  });

  it('Return error hash', async () => {
    jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
      throw new TypeError();
    });

    const test = bcryptService.hash('');

    expect(test).rejects.toThrow('INTERNAL_SERVER_ERROR');
  });

  afterAll(async () => {
    await module.close();
  });
});
