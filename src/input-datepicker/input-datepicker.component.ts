import {
  Component, ElementRef, forwardRef, Optional,
  trigger, transition, style, animate, state
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Angular2DatepickerOptions } from '../datepicker-options';
import { DatePicker } from '../datepicker/datepicker';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputDatePickerComponent),
  multi: true
};

@Component({
  moduleId: module.id,
  selector: 'jb-input-datepicker',
  templateUrl: './input-datepicker.component.html',
  styleUrls: ['./input-datepicker.component.css'],
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class InputDatePickerComponent extends DatePicker {

  constructor(protected elRef: ElementRef,
    @Optional() protected opts: Angular2DatepickerOptions) {
    super(elRef, opts);
  }

}
