[1mdiff --git a/src/app/profile/daily-plan-summary/daily-plan-summary.component.html b/src/app/profile/daily-plan-summary/daily-plan-summary.component.html[m
[1mindex e0161f6..ccea22f 100644[m
[1m--- a/src/app/profile/daily-plan-summary/daily-plan-summary.component.html[m
[1m+++ b/src/app/profile/daily-plan-summary/daily-plan-summary.component.html[m
[36m@@ -1,6 +1,6 @@[m
 <style>[m
 .expectedOutputAdded {background-color: #F9FFA4}[m
[31m-.actualOutputAdded {background-color: #B4FF9F}[m
[32m+[m[32m.actualOutputAdded {background-color: white}[m
 .noTaskId { background-color: white}[m
 </style>[m
 [m
[36m@@ -17,7 +17,7 @@[m
     <h5>Task Summary for date: {{TaskScheduleList[0].date.}}</h5>[m
     <br/>[m
     <mat-accordion>[m
[31m-      <mat-expansion-panel  *ngFor="let taskSchedule of sortedTaskScheduleList"[m
[32m+[m[32m      <mat-expansion-panel  *ngFor="let taskSchedule of TaskScheduleList"[m
                             (click) = "getTaskSummary(taskSchedule)"[m
 [m
                             [ngClass]= " taskSchedule.taskSummary !== null ?[m
[36m@@ -37,7 +37,8 @@[m
             </button>[m
           </mat-panel-description>[m
         </mat-expansion-panel-header>[m
[31m-        <app-profile-task-summary-form [config]="TaskSummaryModel "[m
[32m+[m[32m        <app-profile-task-summary-form [config]="TaskSummaryModel"[m
[32m+[m[32m                                       (TaskSummaryCreated) = "updateTaskSchedule($event)"[m
         ></app-profile-task-summary-form>[m
 [m
 [m
