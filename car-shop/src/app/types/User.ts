export interface User {
    _id: string; 
    username: string;
    email: string;
    password?: string; 
    avatar: string | null;
    savedPosts: string[]; 
    createdAt: Date;
    updatedAt: Date;
  }