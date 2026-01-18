/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const DashboardController = () => import('#controllers/dashboard_controller')

// Public routes
router.on('/').render('pages/home')

// Admin routes (protected) - Server-side rendering for dashboard only
router
  .group(() => {
    // Dashboard
    router.get('/dashboard', [DashboardController, 'index']).as('admin.dashboard')
  })
  .prefix('/admin')
  .use(middleware.auth())

// Import API routes for REST API (used by React frontend)
import './api_routes.js'
