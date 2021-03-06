import {
    Component, ElementRef, OnInit, AfterViewInit, OnDestroy, Input
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { DatePickerContainerComponent } from '../datepicker-container/datepicker-container.component';
import { AngularDatepickerOptions } from '../datepicker-options';

import moment from 'moment';

export interface CalendarDate {
    day: number;
    month: number;
    year: number;
    differentMonth: boolean;
    enabled: boolean;
    today: boolean;
    weekend: boolean;
    selected: boolean;
}

@Component({
    selector: '',
    template: ''
})
export class DatePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
    @Input() class: string;
    @Input() opened: boolean;
    @Input() options: AngularDatepickerOptions = {};

    protected datePicker: DatePickerContainerComponent;

    public date: any = moment();
    public viewDate: string | null = null;
    public weeks: Array<{ rowId?: number; days?: Array<CalendarDate> }>;
    public weekDayNames: Array<string>;
    public days: Array<any> = [];
    public disabled = false;

    public onTouchedCallback: () => void = () => { };
    public onChangeCallback: (_: any) => void = () => { };

    private closePickerOnOutsideClick = (event: MouseEvent) => this.close(event);
    private closePickerOnTab = (event: KeyboardEvent) => this.closeOnTab(event);

    constructor(protected elRef: ElementRef,
        protected opts: AngularDatepickerOptions) {
    }

    get value(): any {
        return this.viewDate;
    }

    set value(value: any) {
        let date = (value instanceof moment) ? value : moment(value, this.options.format);
        this.viewDate = date.isValid() ? date.format(this.options.viewFormat) : value;

    }

    onDateSelected(date: moment.Moment) {
        this.value = date;
        this.onChangeCallback(date.format(this.options.format));
        if (this.options.closeOnSelect) {
            this.close();
        }
    }

    ngOnInit() {
        if (this.opts) {
            if (typeof this.options.format === 'undefined') {
                this.options.format = this.opts.format;
            }
            if (typeof this.options.viewFormat === 'undefined') {
                this.options.viewFormat = this.opts.viewFormat;
            }
            if (typeof this.options.modalMediaQuery === 'undefined') {
                this.options.modalMediaQuery = this.opts.modalMediaQuery;
            }
            if (typeof this.options.firstWeekdaySunday === 'undefined') {
                this.options.firstWeekdaySunday = this.opts.firstWeekdaySunday;
            } else {
                this.options.firstWeekdaySunday = this.options.firstWeekdaySunday.toString() === 'true';
            }
            if (typeof this.options.todayString === 'undefined') {
                this.options.todayString = this.opts.todayString;
            }
            if (typeof this.options.todayButtonEnabled === 'undefined') {
                this.options.todayButtonEnabled = this.opts.todayButtonEnabled;
            } else {
                this.options.todayButtonEnabled = this.options.todayButtonEnabled.toString() === 'true';
            }
            if (typeof this.options.todayHighlight === 'undefined') {
                this.options.todayHighlight = this.opts.todayHighlight;
            } else {
                this.options.todayHighlight = this.options.todayHighlight.toString() === 'true';
            }
            if (typeof this.options.weekendHighlight === 'undefined') {
                this.options.weekendHighlight = this.opts.weekendHighlight;
            } else {
                this.options.weekendHighlight = this.options.weekendHighlight.toString() === 'true';
            }
            if (typeof this.options.closeOnSelect === 'undefined') {
                this.options.closeOnSelect = this.opts.closeOnSelect;
            } else {
                this.options.closeOnSelect = this.options.closeOnSelect.toString() === 'true';
            }
        }
        this.datePicker.mergeOptions(this.options);
    }

    ngAfterViewInit() {
        if (this.opened) {
            this.datePicker.open();
        }
    }

    writeValue(value: any) {
        this.viewDate = value;
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean) : void {
        this.disabled = isDisabled;
    }

    toggle() {
        if (!this.datePicker.opened) {
            this.open();
        } else {
            // this.close();
        }
    }

    closeOnTab(event) {
        if (event.keyCode === 9) {
            if (this.viewDate) {
                this.value = moment(this.viewDate, this.options.viewFormat);
            }
            this.onTouchedCallback();
            this.close();
        }
    }

    open(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        let date = moment(this.value, this.options.viewFormat);
        this.datePicker.inputDate = date.isValid() ? date : null;
        this.datePicker.open();
        window.addEventListener('click', this.closePickerOnOutsideClick, true);
        window.addEventListener('keydown', this.closePickerOnTab, true);
    }

    close(event?: MouseEvent) {
        if (event && this.elRef.nativeElement.contains(event.target)) {
            return;
        }
        this.onTouchedCallback();
        window.removeEventListener('keydown', this.closePickerOnTab, true);
        window.removeEventListener('click', this.closePickerOnOutsideClick, true);
        this.datePicker.close();
    }

    ngOnDestroy() {
        window.removeEventListener('keydown', this.closePickerOnTab, true);
        window.removeEventListener('click', this.closePickerOnOutsideClick, true);
    }
}