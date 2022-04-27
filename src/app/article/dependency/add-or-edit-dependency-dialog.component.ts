import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../service/task-management-service';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageBoxService } from '../../settings/message-box.service';
import { CheckListItem } from '../models/check-list-item.model';
import {ChecklistManagementService} from '../service/checklist-management.service';
import {DependencyManagementService} from '../service/dependency-management.service';
import {Dependency} from '../models/dependency.model';


@Component({
  selector: 'app-create-dependency-dialog',
  templateUrl: './add-or-edit-dependency-dialog.component.html',
})
export class AddOrEditDependencyDialogComponent {

  private dependencyManagementService: DependencyManagementService;
  private checklistManagementService: ChecklistManagementService;
  private messageBoxService: MessageBoxService;
  public isEdit: boolean;
  // members for data-binding
  newDependency: FormGroup = new FormGroup({
    dependencyId: new FormControl('', [Validators.required]),
    taskId: new FormControl(''),
    dependentTaskId: new FormControl(''),
    comment: new FormControl('')
  });


  constructor(public dialogRef: MatDialogRef<AddOrEditDependencyDialogComponent>, dependencyManagementService: DependencyManagementService,
              messageBoxService: MessageBoxService, @Inject(MAT_DIALOG_DATA) data,
              checklistManagementService: ChecklistManagementService) {
    this.messageBoxService = messageBoxService;
    this.dependencyManagementService = dependencyManagementService;
    this.checklistManagementService = checklistManagementService;
    this.isEdit = data.isEdit;
    // Show list of all siblings of current task to align position
    if (data.isEdit) {
    this.newDependency.setValue({
        dependencyId: data.dependency.dependencyId,
        taskId: data.dependency.taskId,
        dependentTaskId: data.dependency.dependentTaskId,
        comment: data.dependency.description,
      });
    } else {
      this.newDependency.setValue({
        dependencyId: 'Server Generated',
        taskId: data.type === 'downstream' ? data.taskId : '',
        dependentTaskId: data.type === 'downstream' ? '' : data.taskId ,
        comment: '',
      });
    }
    this.newDependency.controls['dependencyId'].disable();
    if ( data.type === 'downstream') {
      this.newDependency.controls['taskId'].disable();
    }

    if ( data.type === 'upstream') {
      this.newDependency.controls['dependentTaskId'].disable();
    }
  }

  OnInit() {
    this.dialogRef.updateSize('50%', '80%');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateOrUpdate(): void {

    this.dependencyManagementService.createOrUpdateDependency(this.createDependency(this.newDependency))
      .subscribe({

      next: (dependency) => {
        console.log('New Dependency successfully created');
        console.log(dependency);
        this.dialogRef.close(dependency);
      },
      error: () => {
        this.messageBoxService.info('Error: TaskModel not created.');
      }
    });
  }

  createDependency(newDependency: FormGroup): Dependency {
    const dependency = new Dependency();
    dependency.dependencyId = newDependency.getRawValue().dependencyId;
    dependency.taskId = newDependency.getRawValue().taskId;
    dependency.dependentTaskId = newDependency.getRawValue().dependentTaskId;
    dependency.description = newDependency.getRawValue().description;
    return dependency;
  }



}

