import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {SearchQueryForm} from '../../home/models/search-query-form.model';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {SprintModel} from '../../profile/models/sprint.model';

@Component({
  selector: 'app-auto-search',
  templateUrl: './auto-search.component.html',
})
export class AutoSearchComponent implements OnInit, AfterViewInit  {

@Input() options;
@Input() description;
@Input() baseUrl;
@Input() search;
@Output() newItemEvent  = new EventEmitter<string>();
  @ViewChild(MatAutocompleteTrigger ) trigger: MatAutocompleteTrigger;
filteredOptions: Observable<string[]>;
myControl = new FormControl();
 constructor(private router: Router) {


 }

  ngAfterViewInit() {
    // Clear the input and emit when a selection is made
    this.trigger.autocomplete.optionSelected
      .subscribe(option => {
        this.myControl.setValue('');
      });
  }
 ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
 }

  private _filter(value: string): string[] {
    return this.options.filter(option => option.toLowerCase().includes(
      value === undefined ? '' : value.toLowerCase()
    ));
  }
  private onRowClick(selected: string) {
    this.newItemEvent.emit(selected);
  }


}

