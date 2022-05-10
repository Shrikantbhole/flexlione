import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Template} from '../article/models/template.model';
import {ApiError} from '../settings/api-error.model';
import {ActivatedRoute} from '@angular/router';
import {MessageBoxService} from '../settings/message-box.service';
import {TaskManagementService} from '../Services/task-management-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-templates.component.html'
})
export class AddTemplateComponent implements OnInit {


  newTemplateForm = new FormGroup ({
    templateId: new FormControl(''),
    description: new FormControl('Please enter a description for template.'),
    taskList: new FormControl([]),
  });

  constructor(private dialogRef: MatDialogRef<AddTemplateComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private messageBoxService: MessageBoxService,
    private taskManagementService: TaskManagementService,
    private snackBarService: MatSnackBar,
  ) {
    this.snackBarService = snackBarService;
  }

  ngOnInit(): void {
   // this.newTemplate = this.createTemplateForm(this.dummyTemplate);
    }

  createTemplate(templateForm: FormGroup): Template {
    const template = new Template;
    template.templateId =  templateForm.value.templateId;
    template.description = templateForm.value.description;
    template.taskList = templateForm.value.taskList;
    return template;
  }

  onSubmit() {
    this.taskManagementService.createOrUpdateTemplate(this.createTemplate(this.newTemplateForm))
      .subscribe({
       next: (template) => {
       this.snackBarService.open('Success. Template has been added.', '', { duration: 3000 });
         this.dialogRef.close(2000);
       },
       error: (apiError: ApiError) => {
        this.messageBoxService.info('Error: Template not added .', apiError.title, apiError.detail);
       }
       });
  }
}
