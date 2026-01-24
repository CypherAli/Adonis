/*
|--------------------------------------------------------------------------
| Admin Routes for Categories, Brands, Attributes Management
|--------------------------------------------------------------------------
|
| These routes should be added to the admin group in api_routes.ts
|
*/

/**
 * ADD THESE ROUTES TO THE ADMIN GROUP IN api_routes.ts:
 * 
 * Import controllers at the top:
 * const CategoriesController = () => import('#controllers/categories_controller')
 * const BrandsController = () => import('#controllers/brands_controller')
 * const AttributesController = () => import('#controllers/attributes_controller')
 * 
 * Inside the admin group (after existing admin routes):
 * 
 * // ==================== CATEGORIES MANAGEMENT ====================
 * router.get('/categories', [CategoriesController, 'index'])
 * router.get('/categories/tree', [CategoriesController, 'tree'])
 * router.get('/categories/:id', [CategoriesController, 'show'])
 * router.post('/categories', [CategoriesController, 'store'])
 * router.put('/categories/:id', [CategoriesController, 'update'])
 * router.delete('/categories/:id', [CategoriesController, 'destroy'])
 * router.put('/categories/:id/toggle-active', [CategoriesController, 'toggleActive'])
 * 
 * // ==================== BRANDS MANAGEMENT ====================
 * router.get('/brands', [BrandsController, 'index'])
 * router.get('/brands/list', [BrandsController, 'list'])
 * router.get('/brands/:id', [BrandsController, 'show'])
 * router.post('/brands', [BrandsController, 'store'])
 * router.put('/brands/:id', [BrandsController, 'update'])
 * router.delete('/brands/:id', [BrandsController, 'destroy'])
 * router.put('/brands/:id/toggle-active', [BrandsController, 'toggleActive'])
 * 
 * // ==================== ATTRIBUTES MANAGEMENT ====================
 * router.get('/attributes', [AttributesController, 'index'])
 * router.get('/attributes/filterable', [AttributesController, 'filterable'])
 * router.get('/attributes/variants', [AttributesController, 'variants'])
 * router.get('/attributes/:id', [AttributesController, 'show'])
 * router.post('/attributes', [AttributesController, 'store'])
 * router.put('/attributes/:id', [AttributesController, 'update'])
 * router.delete('/attributes/:id', [AttributesController, 'destroy'])
 * router.put('/attributes/:id/toggle-active', [AttributesController, 'toggleActive'])
 * router.post('/attributes/:id/values', [AttributesController, 'addValue'])
 * router.delete('/attributes/:id/values', [AttributesController, 'removeValue'])
 * 
 */

// PUBLIC ROUTES (không cần auth) - ADD TO MAIN API GROUP
/**
 * // Public access to categories and brands
 * router.get('/api/categories/tree', [CategoriesController, 'tree'])
 * router.get('/api/brands/list', [BrandsController, 'list'])
 * router.get('/api/attributes/filterable', [AttributesController, 'filterable'])
 */
