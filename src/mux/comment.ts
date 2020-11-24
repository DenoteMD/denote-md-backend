import Mux from '../framework/mux';
import { IComment } from '../model/comment';
import { CommentValidator, UuidValidator } from '../validators';

// Get all comments at root level in article for a given article's UUID
Mux.get<[IComment]>('/v1/comment/article/:articleUuid', UuidValidator, async (): Promise<any> => {});

// Get all comments that's reply to a given comment UUID
Mux.get<[IComment]>('/v1/comment/comment/:commentUuid', UuidValidator, async (): Promise<any> => {});

// Add a comment at root level in an article base on article's uuid
Mux.post<IComment>('/v1/comment/article/:articleUuid', CommentValidator, async (): Promise<any> => {});

// Reply to a comment in an article base on article's uuid
Mux.post<IComment>('/v1/comment/:commentUuid/article/:articleUuid', CommentValidator, async (): Promise<any> => {});

// Edit comment in article
Mux.put<IComment>('/v1/comment/:commentUuid', CommentValidator, async (): Promise<any> => {});

// Delete a comment
Mux.delete<IComment>('/v1/comment/:commentUuid', UuidValidator, async (): Promise<any> => {});
