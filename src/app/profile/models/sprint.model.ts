// tslint:disable-next-line:import-spacing
import  {Task} from '../../article/models/task.model';
export class SprintModel {
sprintId: string;
owner: string;
fromDate: string;
toDate: string;
score: number;
taskList: Task[];
}
