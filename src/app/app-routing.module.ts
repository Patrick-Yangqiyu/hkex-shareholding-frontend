import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TrendComponent} from './pages/trend/trend.component';
import {TransactionComponent} from './pages/transaction/transaction.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/trend'},
  {path: 'trend', component: TrendComponent},
  {path: 'transaction', component: TransactionComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
