// INTERFACES
import { UserInterface } from './user.interface';
import { ListPostItemInterface } from './list-post-item.interface';

export interface UserProfileInterface {
	user: UserInterface;
	posts: ListPostItemInterface[];
}
