import { Test, TestingModule } from '@nestjs/testing';
import { TrendingGeminiService } from './trending-gemini.service';

describe('TrendingGeminiService', () => {
  let service: TrendingGeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrendingGeminiService],
    }).compile();

    service = module.get<TrendingGeminiService>(TrendingGeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
