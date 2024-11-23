declare global {
    interface Window {
      cloudinary: any; // Or a more specific type if you know the exact shape
    }
  }
  
  export {};