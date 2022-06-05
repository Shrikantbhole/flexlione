import {ProfileModel} from '../../profile/models/profile.model';
import {SearchTaskViewStoreModel} from '../../shared/store/interfaces/search-task-view-store.model';
import {TaskScheduleModel} from '../../profile/models/task-schedule.model';

export const mockProfile: ProfileModel = {
  profileId: '1',
  type: 'user',
  name: 'blaa',
  sprints: null,
  password: 'blaa',
  emailId: 'blaa@flexli.in'
};

export const mockProfiles: ProfileModel[] = [{
  profileId: '1',
  type: 'user',
  name: 'blaa',
  sprints: null,
  password: 'blaa',
  emailId: 'blaa@flexli.in'
}];
export const mockTaskSchedules: TaskScheduleModel[] = [{
  taskId: '1',
  taskScheduleId: '1',
  taskSummaryId: '1',
  date: null,
  description: 'blaa',
  startHour: 10,
  startMinute: 10,
  stopHour: 11,
  stopMinute: 11,
  owner: 'blaa',
  isPlanned: true
}];




export const mockParams = {
  param: null
};


export const mockSearchTaskViewStoresForRoute = {
  profile: [{
    status: '1',
    isRemoved: true,
    assignedTo: 'shrikant',
    createdAt: '2022-03-04',
    createdBy: 'shrikant',
    deadline: null,
    description: 'blaa',
    taskId: '23',
    parentTaskId: '22'
  }]
};






