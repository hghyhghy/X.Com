import { Test, TestingModule } from '@nestjs/testing';
import { NewsGeminiService } from './news-gemini.service';

describe('NewsGeminiService', () => {
  let service: NewsGeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsGeminiService],
    }).compile();

    service = module.get<NewsGeminiService>(NewsGeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
