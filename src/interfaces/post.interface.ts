// INTERFACES
import { UserInterface } from './user.interface';
import { CommentInterface } from './comment.interface';

export interface PostInterface {
	id: string;
	title: string;
	description: string;
	imageSrc: string;
	likesCount: number;
	userLikedPost: boolean;
	postedById: string;
	user: UserInterface;
	comments: CommentInterface[];
	createdAt: string;
	updatedAt: string;
}
