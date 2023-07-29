// INTERFACES
import { UserInterface } from './user.interface';
import { PostInterface } from './post.interface';

export interface CommentInterface {
	id: string;
	content: string;
	user: UserInterface;
	post: PostInterface;
	createdAt: string;
	updatedAt: string;
}
