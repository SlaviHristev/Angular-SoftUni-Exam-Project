import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth-service.service";


export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>{
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.getCurrentUser()){
        console.log(authService.getCurrentUser());
        return true
    }
    router.navigate(['/home'])
    return false;
}

export const editGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>{
    const authService = inject(AuthService);
    const router = inject(Router);
    

    if(authService.getCurrentUser()?._id){
        console.log(authService.getCurrentUser());
        return true
    }
    router.navigate(['/home'])
    return false;
}