import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteComponent } from './modules/cliente/cliente.component';
import { EnderecoComponent } from './modules/endereco/endereco.component';


const routes: Routes = [
  { path: 'cliente', component: ClienteComponent },
  { path: 'endereco', component: EnderecoComponent },
  { path: '',
    redirectTo: 'cliente',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
