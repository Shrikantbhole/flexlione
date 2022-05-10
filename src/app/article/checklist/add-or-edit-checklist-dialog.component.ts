import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../Services/task-management-service';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageBoxService } from '../../settings/message-box.service';
import { CheckListItem } from '../models/check-list-item.model';
import {ChecklistManagementService} from '../../Services/checklist-management.service';


@Component({
  selector: 'app-create-store-order-dialog',
  templateUrl: './add-or-edit-checklist-dialog.component.html',
})
export class AddOrEditChecklistDialogComponent {

  private taskManagementService: TaskManagementService;
  private checklistManagementService: ChecklistManagementService;
  private messageBoxService: MessageBoxService;
  public isEdit: boolean ;
  public taskId: string;
  public StatusList: string[] = ['completed', 'onHold', 'notStarted'];
  public selectedStatus = '';


  // members for data-binding
  newChecklistItem: FormGroup = new FormGroup({
    'checkListItemId': new FormControl('', [Validators.required]),
    'taskId': new FormControl(''),
    'description': new FormControl(''),
    'status': new FormControl(''),
    'comment': new FormControl(''),
    'attachment' : new FormControl('')
  });


  constructor(public dialogRef: MatDialogRef<AddOrEditChecklistDialogComponent>, taskManagementService: TaskManagementService,
    messageBoxService: MessageBoxService, @Inject(MAT_DIALOG_DATA) data,
              checklistManagementService: ChecklistManagementService) {
    this.messageBoxService = messageBoxService;
    this.taskManagementService = taskManagementService;
    this.isEdit = data.isEdit;
    this.checklistManagementService = checklistManagementService;
    this.taskId = data.taskId;

    // Show list of all siblings of current task to align position


    if (this.isEdit) {
    this.selectedStatus = data.checkListItem.status;
    this.newChecklistItem.setValue({
        checkListItemId: data.checkListItem.checkListItemId,
        taskId: data.checkListItem.taskId,
        description: data.checkListItem.description,
        status: data.checkListItem.status,
        comment: data.checkListItem.comment,
        attachment: data.checkListItem.attachment
      });
      this.newChecklistItem.controls['checkListItemId'].disable();
      console.log(this.newChecklistItem.value);
    } else {
      this.newChecklistItem.setValue({
        checkListItemId: 'Server Generated',
        taskId: this.taskId,
        description: '',
        status: '',
        comment: '',
        attachment: ''
      });
      this.newChecklistItem.controls['checkListItemId'].disable();
      this.newChecklistItem.controls['taskId'].disable();
    }
  }

  OnInit() {
    this.dialogRef.updateSize('50%', '80%');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreate(): void {

    this.checklistManagementService.createOrUpdateCheckListItem(this.createCheckList(this.newChecklistItem))
      .subscribe({

      next: (checkListItem: CheckListItem) => {
        console.log('New Checklist successfully created');
        console.log(checkListItem);
        this.dialogRef.close(checkListItem);
      },
      error: () => {
        this.messageBoxService.info('Error: TaskModel not created.');
      }
    });
  }

  onUpdate(): void {

    this.checklistManagementService.createOrUpdateCheckListItem(this.createCheckList(this.newChecklistItem))
      .subscribe({

        next: (checkListItem: CheckListItem) => {
          console.log('TaskModel successfully updated');
          console.log(checkListItem);
          this.dialogRef.close(checkListItem);
        },
        error: () => {
          this.messageBoxService.info('Error: TaskModel not created.');
        }
      });
  }

  createCheckList(newCheckListItem: FormGroup): CheckListItem {
    const checkListItem = new CheckListItem();
    checkListItem.checkListItemId = newCheckListItem.getRawValue().checkListItemId;
    checkListItem.taskId = newCheckListItem.getRawValue().taskId;
    checkListItem.attachment = newCheckListItem.getRawValue().attachment;
    checkListItem.comment = newCheckListItem.getRawValue().comment;
    checkListItem.description = newCheckListItem.getRawValue().description;
    checkListItem.status = this.selectedStatus;


    return checkListItem;
  }



}

