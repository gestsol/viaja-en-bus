import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PipesModule } from './pipes/pipes.module';

const routes: Routes = [
  // // ORIGINAL
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  
  // { path: '', redirectTo: 'payment-methods', pathMatch: 'full' },
  // {
  //   path: 'payment-methods',
  //   loadChildren: () => import('./pages/payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  // }, 
  ////////////////////////////////////////////////////////////////////////////////////
  //  PARA PDF
  // { path: '', redirectTo: 'transaction-voucher/LQN64693497', pathMatch: 'full' },
  // {
  //   path: 'transaction-voucher/LQN64693497',
  //   loadChildren: () => import('./pages/transaction-voucher/transaction-voucher.module').then(m => m.TransactionVoucherPageModule)
  // },
  ////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user-panel',
    loadChildren: () => import('./pages/user-panel/user-panel.module').then(m => m.UserPanelPageModule)
  },
  {
    path: 'my-tickets',
    loadChildren: () => import('./pages/my-tickets/my-tickets.module').then(m => m.MyTicketsPageModule)
  },
  {
    path: 'my-data',
    loadChildren: () => import('./pages/my-data/my-data.module').then(m => m.MyDataPageModule)
  },
  {
    path: 'my-cancellations',
    loadChildren: () => import('./pages/my-cancellations/my-cancellations.module').then(m => m.MyCancellationsPageModule)
  },
  {
    path: 'my-change-password',
    loadChildren: () => import('./pages/my-change-password/my-change-password.module').then(m => m.MyChangePasswordPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./pages/payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  },
  {
    path: 'notice',
    loadChildren: () => import('./pages/notice/notice.module').then(m => m.NoticePageModule)
  },
  {
    path: 'seat-selection',
    loadChildren: () => import('./pages/seat-selection/seat-selection.module').then(m => m.SeatSelectionPageModule)
  },
  {
    path: 'purchase-detail',
    loadChildren: () => import('./pages/purchase-detail/purchase-detail.module').then(m => m.PurchaseDetailPageModule)
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ORIGINAL
  {
    path: 'transaction-voucher/:codigo',
    loadChildren: () => import('./pages/transaction-voucher/transaction-voucher.module').then(m => m.TransactionVoucherPageModule)
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  {
    path: 'buy-your-ticket',
    loadChildren: () => import('./pages/buy-your-ticket/buy-your-ticket.module').then(m => m.BuyYourTicketPageModule)
  },
  {
    path: 'payment-confirmation',
    loadChildren: () => import('./pages/payment-confirmation/payment-confirmation.module').then(m => m.PaymentConfirmationPageModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then(m => m.TicketPageModule)
  },
  {
    path: 'recover-password',
    loadChildren: () => import('./pages/recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule)
  },


];

@NgModule({
  imports: [
    PipesModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
