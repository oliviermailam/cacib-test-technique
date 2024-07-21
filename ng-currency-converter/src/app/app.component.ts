import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { EURO, USD } from './shared/domain/models/currency';
import { ExchangeRateService } from './shared/domain/services/exchange-rate.service';
import { InputNumberComponent } from './shared/ui/input-number/input-number.component';
import { InputToggleComponent } from './shared/ui/input-toggle/input-toggle.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InputNumberComponent, InputToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  exchangeRate$: Observable<number>;

  readonly EURO = EURO;
  readonly USD = USD;

  from_label = `FROM ${EURO.code} ${EURO.flag}`;
  to_label = `TO ${USD.code} ${USD.flag}`;

  valueInputControl = new FormControl<number | null>(1, {
    validators: [Validators.required],
  });
  toggleControl = new FormControl<boolean>(false);
  customRateControl = new FormControl<number | null>(null);

  readonly valueInput = signal<number | null>(1);
  readonly toggle = signal<boolean>(false);
  readonly result = computed(() => {
    return this.exchangeRateService.preventBinaryFloatingPoint(
      this.toggle()
        ? (this.valueInput() ?? 0) / this.exchangeRateService.exchangeRate()
        : (this.valueInput() ?? 0) * this.exchangeRateService.exchangeRate()
    );
  });
  readonly customRate = signal<number | null>(null);
  readonly currentRate = computed(() => {
    const customRate = this.customRate();
    if (
      typeof customRate === 'number' &&
      this.exchangeRateService.isCustomRateValid(
        customRate,
        this.exchangeRateService.exchangeRate()
      )
    ) {
      return customRate;
    }

    return this.exchangeRateService.exchangeRate();
  });
  readonly showCustomRate = computed(() => {
    return this.customRate() === this.currentRate();
  });

  private readonly subscription: Subscription;

  constructor(private readonly exchangeRateService: ExchangeRateService) {
    this.exchangeRate$ = toObservable(this.exchangeRateService.exchangeRate);

    this.subscription = new Subscription();

    this.subscription.add(
      this.valueInputControl.valueChanges.subscribe({
        next: (value) => this.valueInput.update(() => value),
      })
    );

    this.subscription.add(
      this.toggleControl.valueChanges.subscribe({
        next: (value) => {
          this.from_label = value
            ? `FROM ${USD.code} ${USD.flag}`
            : `FROM ${EURO.code} ${EURO.flag}`;
          this.to_label = value
            ? `TO ${EURO.code} ${EURO.flag}`
            : `TO ${USD.code} ${USD.flag}`;

          this.valueInputControl.patchValue(
            this.exchangeRateService.preventBinaryFloatingPoint(this.result())
          );

          this.toggle.update((value) => !value);
        },
      })
    );

    this.subscription.add(
      this.customRateControl.valueChanges.subscribe({
        next: (customRate) => {
          this.customRate.update(() => customRate);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
