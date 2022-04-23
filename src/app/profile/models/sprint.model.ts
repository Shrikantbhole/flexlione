// tslint:disable-next-line:import-spacing
import  {TaskModel} from '../../article/models/taskModel';
export class SprintModel {
sprintId: string;
owner: string;
fromDate: string;
toDate: string;
score: number;
description: string;
deliverable: string;
delivered: string;
tasks: TaskModel[];
}
