export interface Post {
  id?:string;
  title:string;
  content:string;
  likeCount?:string;
  dislikeCount?:string;
  userKey?: string;
  username?: string;
}

export interface Follower {
  userKey: string;
  username: string;
}