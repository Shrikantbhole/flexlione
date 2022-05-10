import {SprintModel} from './sprint.model';

export class ProfileModel {
  profileId: string;
  type: string;
  name: string;
  sprints: SprintModel[];
  emailId: string;
  password: string;
}
