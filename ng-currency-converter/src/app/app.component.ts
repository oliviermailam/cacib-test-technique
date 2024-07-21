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
  readonly exchangeRate$: Observable<number>;
  readonly EURO = EURO;
  readonly USD = USD;

  from_label = `FROM ${EURO.code} ${EURO.flag}`;
  to_label = `TO ${USD.code} ${USD.flag}`;

  valueInputControl = new FormControl<number | null>(1, {
    validators: [Validators.required],
  });
  toggleControl = new FormControl<boolean>(false);

  readonly valueInput = signal<number | null>(1);
  readonly toggle = signal<boolean>(false);
  readonly result = computed(() => {
    return this.exchangeRangeService.preventBinaryFloatingPoint(
      this.toggle()
        ? (this.valueInput() ?? 0) / this.exchangeRangeService.exchangeRate()
        : (this.valueInput() ?? 0) * this.exchangeRangeService.exchangeRate()
    );
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
            this.exchangeRangeService.preventBinaryFloatingPoint(this.result())
          );

          this.toggle.update((value) => !value);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
