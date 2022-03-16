import { Injectable, Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable()
export class MessageBoxService {

  // services
  private dialog_: MatDialog;

  constructor(dialog: MatDialog) { // pass by reference
    this.dialog_ = dialog;
  }

  // Inspired from: https://blog.vanila.io/just-another-custom-alert-for-angular-c288bebc3c96

  // Show a message as warning. It has two buttons. Cancel and action button
  confirmWarn(message: string, actionButtonText: string = 'OK'): MatDialogRef<MessageBoxComponent> {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: message,
      showCancelButton: true,
      actionButtonText: actionButtonText,
      warn: true
    };

    return this.dialog_.open(MessageBoxComponent, dialogConfig);
  }

  // Shows a message as information. It has one button - OK
  // This can be used to show an error message or success message.
  info(message: string, serverMsg: string = null, detailMsg: string = null): MatDialogRef<MessageBoxComponent> {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: message,
      serverMsg: serverMsg,
      detailMsg: detailMsg,
      showCancelButton: false,
      actionButtonText: 'OK',
      warn: false
    };

    return this.dialog_.open(MessageBoxComponent, dialogConfig);
  }
}

@Component({
  template: '<h1 mat-dialog-title >Alert</h1> \
             <div mat-dialog-content> \
               <p> {{message}} </p> \
               <p> {{serverMsg}} <p> \
               <mat-expansion-panel *ngIf="detailMsg" (opened)="panelOpenState = true" \
                                                      (closed) = "panelOpenState = false"> \
                  <mat-expansion-panel-header> \
                    <mat-panel-title > \
                      Detail \
                    </mat-panel-title> \
                    <mat-panel-description> \
                      Click to {{panelOpenState ? "close" : "expand"}} \
                    </mat-panel-description > \
                  </mat-expansion-panel-header> \
                  <p>{{detailMsg}}</p> \
               </mat-expansion-panel> \
             </div> \
             <div mat-dialog-actions align="end"> \
               <button *ngIf="showCancelButton" mat-button cdkFocusInitial (click)="onCancelClick()">Cancel</button> \
               <button mat-button mat-dialog-close  cdkFocusInitial (click)="onActionButtonClick()"> {{actionButtonText}} </button> \
             </div>'
})
export class MessageBoxComponent {

  private dialogRef: MatDialogRef<MessageBoxComponent>;

  public message: string;
  public serverMsg: string;
  public detailMsg: string;

  public showCancelButton: boolean;
  public actionButtonText: string;
  public color: string;

  constructor(dialogRef: MatDialogRef<MessageBoxComponent>, @Inject(MAT_DIALOG_DATA) data) {

    this.dialogRef = dialogRef;

    this.message = data.message;
    this.serverMsg = data.serverMsg;
    this.detailMsg = data.detailMsg;
    this.showCancelButton = data.showCancelButton;
    this.actionButtonText = data.actionButtonText;
    this.color = data.warn ? 'warn' : 'primary';
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onActionButtonClick(): void {
    this.dialogRef.close(true);
  }
}
