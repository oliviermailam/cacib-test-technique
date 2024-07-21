import { Component, computed, effect, Signal, signal } from '@angular/core';
import { filter, Observable, Subscription } from 'rxjs';
import { ExchangeRateService } from './shared/domain/services/exchange-rate.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { EURO, USD } from './shared/domain/models/currency';
import { CommonModule } from '@angular/common';
import { InputNumberComponent } from './shared/ui/input-number/input-number.component';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InputNumberComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly exchangeRate$: Observable<number>;
  readonly EURO = EURO;
  readonly USD = USD;

  readonly FROM_LABEL = `FROM ${EURO.flag}`;
  readonly TO_LABEL = `TO ${USD.flag}`;

  valueInputControl = new FormControl<number | null>(1, {
    validators: [Validators.required],
  });
  readonly valueInput = signal<number | null>(1);
  readonly result = computed(() => {
    return (this.valueInput() ?? 0) * this.exchangeRangeService.exchangeRate();
  });

  private readonly subscription: Subscription;

  constructor(private readonly exchangeRangeService: ExchangeRateService) {
    this.subscription = new Subscription();

    this.exchangeRate$ = toObservable(this.exchangeRangeService.exchangeRate);

    this.subscription.add(
      this.valueInputControl.valueChanges.subscribe({
        next: (value) => this.valueInput.update(() => value),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
