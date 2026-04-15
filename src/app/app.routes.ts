import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'categories', loadComponent: () => import('../category/category-list/category-list').then(m => m.CategoryList)}
];
