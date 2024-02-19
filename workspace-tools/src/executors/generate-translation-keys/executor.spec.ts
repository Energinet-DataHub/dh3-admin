import { GenerateTranslationKeysExecutorSchema } from './schema';
import executor from './executor';

const options: GenerateTranslationKeysExecutorSchema = {};

describe('GenerateTranslationKeys Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
