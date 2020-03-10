/**
 *Post Object
 *
 * @export
 * @interface Post
 */
export interface Post {
  id?:string;
  title:string;
  content:string;
  likeCount?:string;
  dislikeCount?:string;
  userKey?: string;
  username?: string;
}

/**
 *Follower Object
 *
 * @export
 * @interface Follower
 */
export interface Follower {
  userKey: string;
  username: string;
}