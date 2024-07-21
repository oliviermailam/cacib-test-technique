import { Injectable, OnDestroy, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService implements OnDestroy {
  readonly exchangeRate = signal(1.1);

  private subscription: Subscription;

  constructor() {
    this.subscription = new Subscription();
    this.subscription.add(
      interval(3000).subscribe({ next: () => this.updateExchangeRate() })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateExchangeRate(): void {
    this.exchangeRate.update((oldRate) => {
      return this.preventBinaryFloatingPoint(
        oldRate + this.generateVariation()
      );
    });
  }

  generateVariation(): number {
    return Math.random() * 0.1 - 0.05;
  }

  preventBinaryFloatingPoint(value: number): number {
    console.log(Number(value.toFixed(2)));
    return Number(value.toFixed(2));
  }
}
