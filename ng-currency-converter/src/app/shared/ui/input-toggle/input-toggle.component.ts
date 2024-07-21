import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-toggle',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-toggle.component.html',
  styleUrl: './input-toggle.component.scss',
})
export class InputToggleComponent {
  @Input()
  control = new FormControl(false);
}
