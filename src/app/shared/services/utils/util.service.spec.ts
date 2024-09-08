import { TestBed } from '@angular/core/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService],
    });
    service = TestBed.inject(UtilService);
  });

  describe('extractJustNumbers', () => {
    it('should return only numbers from a string with letters', () => {
      const input = 'abc123def456';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('123456');
    });

    it('should return only numbers from a string with special characters', () => {
      const input = '12@34#56$';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('123456');
    });

    it('should return only numbers from a string with spaces', () => {
      const input = '12 34 56';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('123456');
    });

    it('should return an empty string when input is empty', () => {
      const input = '';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('');
    });

    it('should return an empty string when input has no numbers', () => {
      const input = 'abc!@#$';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('');
    });

    it('should return the same number string when input contains only numbers', () => {
      const input = '123456';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('123456');
    });

    it('should handle very large numbers', () => {
      const input = '9876543210';
      const result = service.extractJustNumbers(input);
      expect(result).toBe('9876543210');
    });
  });
});
