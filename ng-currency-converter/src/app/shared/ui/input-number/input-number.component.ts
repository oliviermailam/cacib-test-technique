import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent {
  @Input()
  label = '';

  @Input()
  placeholder = '';

  @Input()
  control = new FormControl<number | null>(null);
}
