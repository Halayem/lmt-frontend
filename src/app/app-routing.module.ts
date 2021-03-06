import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInformationComponent } from './components/user-information/user-information.component';


const routes: Routes = [
  {
    path:       'user-information',
    component:  UserInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
