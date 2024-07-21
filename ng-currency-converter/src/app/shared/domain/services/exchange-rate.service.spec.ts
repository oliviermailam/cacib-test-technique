import { TestBed } from '@angular/core/testing';

import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an exchange rate signal', () => {
    expect(service.exchangeRate).toBeTruthy();
  });

  it('should only generate values between -0.05 and 0.05', () => {
    const testValues = Array.from({ length: 10 }, () =>
      service.generateVariation()
    );
    for (let value of testValues) {
      expect(value).toBeGreaterThanOrEqual(-0.05);
      expect(value).toBeLessThanOrEqual(0.05);
    }
  });

  it('should prevent binary floating point', () => {
    expect(service.preventBinaryFloatingPoint(1.123)).toBe(1.12);
    expect(service.preventBinaryFloatingPoint(1.126)).toBe(1.13);
  });

  it('should check if a custom rate is valid', () => {
    expect(service.isCustomRateValid(1.01, 1)).toBeTrue();
    expect(service.isCustomRateValid(1.02, 1)).toBeTrue();
    expect(service.isCustomRateValid(1.03, 1)).toBeFalse();
  });
});
