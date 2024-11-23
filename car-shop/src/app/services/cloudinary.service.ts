import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryScriptService {
  
  public uwConfig = {
    cloudName: 'dknpnmf1m',
    uploadPreset: "carShop",
    folder: "carShop"
  };

  constructor() {}
}
