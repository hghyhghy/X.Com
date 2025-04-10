import { Test, TestingModule } from '@nestjs/testing';
import { TechGeminiService } from './tech-gemini.service';

describe('TechGeminiService', () => {
  let service: TechGeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechGeminiService],
    }).compile();

    service = module.get<TechGeminiService>(TechGeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
