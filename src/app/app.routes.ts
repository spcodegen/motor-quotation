import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';

import { VehicleMakeListComponent } from './pages/vehicle-make/vehicle-make-list/vehicle-make-list.component';
import { VehicleMakeFormComponent } from './pages/vehicle-make/vehicle-make-form/vehicle-make-form.component';
import { VehicleModelListComponent } from './pages/vehicle-model/vehicle-model-list/vehicle-model-list.component';
import { VehicleModelFormComponent } from './pages/vehicle-model/vehicle-model-form/vehicle-model-form.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'Motor Quotation | Admin Dashboard',
      },
      {
      path:'vehicle-make-list',
      component:VehicleMakeListComponent,
      title:'Motor Quotation | vehicle make list'
      },
      {
      path:'vehicle-make-form',
      component:VehicleMakeFormComponent,
      title:'Motor Quotation | vehicle make form'
      },
      {
      path:'vehicle-make-form/edit/:id',
      component:VehicleMakeFormComponent,
      title:'Motor Quotation | vehicle make form edit'
      },
      // {
      //   path:'vehicle-model',
      //   component:VehicleModelComponent,
      //   title:'Motor Quotation | vehicle model'
      // },
      {
        path:'vehicle-model-list',
        component: VehicleModelListComponent,
        title:'Motor Quotation | vehicle model list'
      },
      {
        path:'vehicle-model-form',
        component: VehicleModelFormComponent,
        title:'Motor Quotation | vehicle model form'
      },
      {
        path:'vehicle-model-form/edit',
        component: VehicleModelFormComponent,
        title:'Motor Quotation | vehicle model form'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },










      ///////////////////////////////////////////////////////////
      {
        path:'calendar',
        component:CalenderComponent,
        title:'Angular Calender | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
];
