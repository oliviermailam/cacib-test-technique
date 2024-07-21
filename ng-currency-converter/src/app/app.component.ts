import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRateService } from './shared/domain/services/exchange-rate.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { EURO, USD } from './shared/domain/models/currency';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly exchangeRate$: Observable<number>;
  readonly EURO = EURO;
  readonly USD = USD;

  constructor(private readonly exchangeRangeService: ExchangeRateService) {
    this.exchangeRate$ = toObservable(this.exchangeRangeService.exchangeRate);
  }
}
