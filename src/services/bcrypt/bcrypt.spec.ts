import { BcryptService } from './bcrypt.service';

describe('bcrypt test', () => {
  it('Return boolean result before compare passwords', async () => {
    const bcryptService = new BcryptService();

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
    const bcryptService = new BcryptService();

    const hash = await bcryptService.hash('11111');

    expect(hash).toMatch(/[s0/\/\P4$$w0rD]/);
  });
});