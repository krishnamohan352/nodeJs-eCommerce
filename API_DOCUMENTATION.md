# E-Commerce API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Types of Authentication
1. **User Auth** (`userAuth`) - Required for regular user operations
2. **Admin Auth** (`adminAuth`) - Required for admin operations
3. **Permission Check** - Additional permission validation for sensitive operations

### Token Format
- JWT token passed in the `Authorization` header: `Authorization: Bearer <token>`

---

## API Endpoints

### 1. USER ROUTES (`/api/user`)

#### Register User
- **Method:** `POST`
- **Endpoint:** `/api/user/register`
- **Auth:** None
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
  ```

#### Login User
- **Method:** `POST`
- **Endpoint:** `/api/user/login`
- **Auth:** None
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
  ```

#### Get All Users
- **Method:** `GET`
- **Endpoint:** `/api/user/`
- **Auth:** Admin Auth + VIEW_USER permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "List of users fetched successfully",
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin"
      }
    ]
  }
  ```

#### Update User
- **Method:** `PUT`
- **Endpoint:** `/api/user/:id`
- **Auth:** Admin Auth + UPDATE_USER permission
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": "user_id",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### Delete User
- **Method:** `DELETE`
- **Endpoint:** `/api/user/:id`
- **Auth:** Admin Auth + DELETE_USER permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

---

### 2. PRODUCT ROUTES (`/api/product`)

#### Add Product
- **Method:** `POST`
- **Endpoint:** `/api/product/`
- **Auth:** Admin Auth + CREATE_PRODUCT permission
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  ```
  - name: "Product Name" (text)
  - description: "Product Description" (text)
  - price: 99.99 (number)
  - stock: 50 (number)
  - categoryId: "category_id" (text)
  - image: <file> (file)
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Product added successfully",
    "data": {
      "id": "product_id",
      "name": "Product Name",
      "description": "Product Description",
      "price": 99.99,
      "stock": 50,
      "imageUrl": "/catalog/product/filename.jpg",
      "categoryId": "category_id"
    }
  }
  ```

#### Get All Products
- **Method:** `GET`
- **Endpoint:** `/api/product/`
- **Auth:** None (Public)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "List of products retrieved successfully",
    "products": [
      {
        "id": "product_id",
        "name": "Product Name",
        "description": "Product Description",
        "price": 99.99,
        "stock": 50,
        "imageUrl": "/catalog/product/filename.jpg"
      }
    ]
  }
  ```

#### Get Product by ID
- **Method:** `GET`
- **Endpoint:** `/api/product/:id`
- **Auth:** None (Public)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Product details retrieved successfully",
    "product": {
      "id": "product_id",
      "name": "Product Name",
      "description": "Product Description",
      "price": 99.99,
      "stock": 50,
      "imageUrl": "/catalog/product/filename.jpg"
    }
  }
  ```

#### Update Product
- **Method:** `PUT`
- **Endpoint:** `/api/product/:id`
- **Auth:** Admin Auth + UPDATE_PRODUCT permission
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  ```
  - name: "Updated Product Name" (optional)
  - description: "Updated Description" (optional)
  - price: 89.99 (optional)
  - stock: 45 (optional)
  - image: <file> (optional)
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "product": {
      "id": "product_id",
      "name": "Updated Product Name",
      "price": 89.99,
      "stock": 45
    }
  }
  ```

#### Delete Product
- **Method:** `DELETE`
- **Endpoint:** `/api/product/:id`
- **Auth:** Admin Auth + DELETE_PRODUCT permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

### 3. CART ROUTES (`/api/cart`)

#### Add to Cart
- **Method:** `POST`
- **Endpoint:** `/api/cart/add`
- **Auth:** User Auth (required)
- **Request Body:**
  ```json
  {
    "productId": "product_id",
    "quantity": 2
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Product added to cart successfully",
    "cart": {
      "userId": "user_id",
      "items": [
        {
          "productId": "product_id",
          "quantity": 2,
          "price": 99.99
        }
      ]
    }
  }
  ```

#### Get Cart
- **Method:** `GET`
- **Endpoint:** `/api/cart/`
- **Auth:** User Auth (required)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Cart retrieved successfully",
    "cart": {
      "userId": "user_id",
      "items": [
        {
          "productId": "product_id",
          "quantity": 2,
          "price": 99.99
        }
      ],
      "totalPrice": 199.98
    }
  }
  ```

#### Update Cart Item
- **Method:** `PUT`
- **Endpoint:** `/api/cart/update`
- **Auth:** User Auth (required)
- **Request Body:**
  ```json
  {
    "productId": "product_id",
    "quantity": 3
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Cart updated successfully",
    "cart": {
      "userId": "user_id",
      "items": [
        {
          "productId": "product_id",
          "quantity": 3,
          "price": 99.99
        }
      ]
    }
  }
  ```

#### Remove Item from Cart
- **Method:** `DELETE`
- **Endpoint:** `/api/cart/remove/:itemId`
- **Auth:** User Auth (required)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Item removed from cart successfully"
  }
  ```

#### Clear Cart
- **Method:** `DELETE`
- **Endpoint:** `/api/cart/clearcart`
- **Auth:** User Auth (required)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Cart cleared successfully"
  }
  ```

---

### 4. ORDER ROUTES (`/api/order`)

#### Place Order
- **Method:** `POST`
- **Endpoint:** `/api/order/placeorder`
- **Auth:** User Auth (required)
- **Request Body:**
  ```json
  {
    "items": [
      {
        "productId": "product_id",
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main St, City, State, ZIP",
    "paymentMethod": "card"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Order placed successfully",
    "order": {
      "id": "order_id",
      "userId": "user_id",
      "items": [...],
      "totalPrice": 199.98,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
  ```

#### Get User Orders
- **Method:** `GET`
- **Endpoint:** `/api/order/`
- **Auth:** User Auth (required)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "User orders retrieved successfully",
    "orders": [
      {
        "id": "order_id",
        "userId": "user_id",
        "totalPrice": 199.98,
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

#### Get All Orders (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/order/orders`
- **Auth:** Admin Auth (required)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "All orders retrieved successfully",
    "orders": [
      {
        "id": "order_id",
        "userId": "user_id",
        "totalPrice": 199.98,
        "status": "pending"
      }
    ]
  }
  ```

#### Get Order by ID
- **Method:** `GET`
- **Endpoint:** `/api/order/:id`
- **Auth:** User Auth (required)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Order details retrieved successfully",
    "order": {
      "id": "order_id",
      "userId": "user_id",
      "items": [...],
      "totalPrice": 199.98,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
  ```

#### Update Order Status
- **Method:** `PUT`
- **Endpoint:** `/api/order/status/:id`
- **Auth:** Admin Auth (required)
- **Request Body:**
  ```json
  {
    "status": "shipped"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Order status updated successfully",
    "order": {
      "id": "order_id",
      "status": "shipped"
    }
  }
  ```

---

### 5. CATEGORY ROUTES (`/api/category`)

#### Create Category
- **Method:** `POST`
- **Endpoint:** `/api/category/create`
- **Auth:** Admin Auth + CREATE_CATEGORY permission
- **Request Body:**
  ```json
  {
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "id": "category_id",
      "name": "Electronics",
      "description": "Electronic devices and gadgets"
    }
  }
  ```

#### Get All Categories
- **Method:** `GET`
- **Endpoint:** `/api/category/`
- **Auth:** Admin Auth + VIEW_CATEGORY permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Categories retrieved successfully",
    "categories": [
      {
        "id": "category_id",
        "name": "Electronics",
        "description": "Electronic devices and gadgets"
      }
    ]
  }
  ```

#### Update Category
- **Method:** `PUT`
- **Endpoint:** `/api/category/:id`
- **Auth:** Admin Auth + UPDATE_CATEGORY permission
- **Request Body:**
  ```json
  {
    "name": "Updated Electronics",
    "description": "Updated description"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Category updated successfully",
    "data": {
      "id": "category_id",
      "name": "Updated Electronics"
    }
  }
  ```

#### Delete Category
- **Method:** `DELETE`
- **Endpoint:** `/api/category/:id`
- **Auth:** Admin Auth + DELETE_CATEGORY permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Category deleted successfully"
  }
  ```

---

### 6. ROLE ROUTES (`/api/role`)

#### Create Role
- **Method:** `POST`
- **Endpoint:** `/api/role/create`
- **Auth:** Admin Auth + CREATE_ROLE permission
- **Request Body:**
  ```json
  {
    "name": "Moderator",
    "permissions": ["view_products", "view_orders"]
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Role created successfully",
    "data": {
      "id": "role_id",
      "name": "Moderator",
      "permissions": ["view_products", "view_orders"]
    }
  }
  ```

#### Get All Roles
- **Method:** `GET`
- **Endpoint:** `/api/role/all`
- **Auth:** Admin Auth + VIEW_ROLES permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Roles retrieved successfully",
    "roles": [
      {
        "id": "role_id",
        "name": "Moderator",
        "permissions": ["view_products", "view_orders"]
      }
    ]
  }
  ```

#### Update Role
- **Method:** `PUT`
- **Endpoint:** `/api/role/update/:id`
- **Auth:** Admin Auth + UPDATE_ROLE permission
- **Request Body:**
  ```json
  {
    "name": "Updated Moderator",
    "permissions": ["view_products", "view_orders", "update_orders"]
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Role updated successfully",
    "data": {
      "id": "role_id",
      "name": "Updated Moderator"
    }
  }
  ```

#### Delete Role
- **Method:** `DELETE`
- **Endpoint:** `/api/role/delete/:id`
- **Auth:** Admin Auth + DELETE_ROLE permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Role deleted successfully"
  }
  ```

---

### 7. PERMISSION ROUTES (`/api/permission`)

#### Create Permission
- **Method:** `POST`
- **Endpoint:** `/api/permission/create`
- **Auth:** Admin Auth + CREATE_PERMISSION permission
- **Request Body:**
  ```json
  {
    "name": "view_reports",
    "description": "Permission to view reports"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Permission created successfully",
    "data": {
      "id": "permission_id",
      "name": "view_reports",
      "description": "Permission to view reports"
    }
  }
  ```

#### Get All Permissions
- **Method:** `GET`
- **Endpoint:** `/api/permission/all`
- **Auth:** Admin Auth + VIEW_PERMISSIONS permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Permissions retrieved successfully",
    "permissions": [
      {
        "id": "permission_id",
        "name": "view_reports",
        "description": "Permission to view reports"
      }
    ]
  }
  ```

#### Update Permission
- **Method:** `PUT`
- **Endpoint:** `/api/permission/update/:id`
- **Auth:** Admin Auth + UPDATE_PERMISSIONS permission
- **Request Body:**
  ```json
  {
    "name": "view_analytics",
    "description": "Permission to view analytics"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Permission updated successfully",
    "data": {
      "id": "permission_id",
      "name": "view_analytics"
    }
  }
  ```

#### Delete Permission
- **Method:** `DELETE`
- **Endpoint:** `/api/permission/delete/:id`
- **Auth:** Admin Auth + DELETE_PERMISSIONS permission
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Permission deleted successfully"
  }
  ```

---

## Available Permissions

| Permission | Description |
|-----------|-------------|
| `create_category` | Create new product categories |
| `delete_category` | Delete product categories |
| `update_category` | Update product categories |
| `view_category` | View product categories |
| `create_product` | Create new products |
| `delete_product` | Delete products |
| `update_product` | Update products |
| `view_products` | View products |
| `view_orders` | View orders |
| `update_orders` | Update orders |
| `create_permission` | Create new permissions |
| `view_permissions` | View permissions |
| `update_permissions` | Update permissions |
| `delete_permissions` | Delete permissions |
| `create_role` | Create new roles |
| `update_role` | Update roles |
| `delete_role` | Delete roles |
| `view_role` | View roles |
| `create_user` | Create new users |
| `update_user` | Update users |
| `delete_user` | Delete users |
| `view_user` | View users |

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Static Files

### Product Images
- **Base Path:** `/catalog/product/`
- **Example:** `/catalog/product/filename.jpg`

---

## Notes
- All datetime values are in ISO 8601 format (UTC)
- IDs are typically MongoDB ObjectIds or UUID format
- Some endpoints require file uploads (marked with `multipart/form-data`)
- Admin operations require both `adminAuth` middleware and specific permissions
- User operations require `userAuth` middleware
