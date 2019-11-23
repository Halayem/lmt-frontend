import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInformationComponent } from './user-registry/components/user-information.component';
import { UserBasicInformationComponent } from './user-registry/user-basic-information/components/user-basic-information.component';
import { UserExperianceResolverService } from './user-registry/user-experiance/service/user-experiance-resolver.service';
import { UserExperianceComponent } from './user-registry/user-experiance/components/user-experiance.component';

const routes: Routes = [
  {
    path:       'user-information',
    component:  UserInformationComponent,
    resolve: {
      data: UserExperianceResolverService
      }
  },
  {
    path: 'user-basic-information',
    component: UserBasicInformationComponent
  },
  {
    path: 'user-experiences',
    component: UserExperianceComponent
  }
   
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
