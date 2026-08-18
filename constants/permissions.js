export const PERMISSIONS = {
    CREATE_CATEGORY: "create_category",
    DELETE_CATEGORY: "delete_category",
    UPDATE_CATEGORY: "update_category",
    VIEW_CATEGORY: "view_category",

    CREATE_PRODUCT: "create_product",
    DELETE_PRODUCT: "delete_product",
    UPDATE_PRODUCT: "update_product",
    VIEW_PRODUCTS: "view_products",

    UPDATE_ORDERS: "update_orders",
    VIEW_ALL_ORDERS: "view_all_orders",
    UPDATE_ORDER_STATUS: "update_order_status",

    CREATE_PERMISSION: "create_permission",
    VIEW_PERMISSIONS: "view_permissions",
    UPDATE_PERMISSIONS: "update_permissions",
    DELETE_PERMISSIONS: "delete_permissions",

    CREATE_ROLE: "create_role",
    UPDATE_ROLE: "update_role",
    DELETE_ROLE: "delete_role",
    VIEW_ROLES: "view_role",

    CREATE_USER: "create_user",
    UPDATE_USER: "update_user",
    DELETE_USER: "delete_user",
    VIEW_USER: "view_user"
};

export const USER_PERMISSIONS = {
    ADD_TO_CART: "add_to_cart",
    VIEW_CART: "view_cart",
    UPDATE_CART: "update_cart",
    REMOVE_FROM_CART: "remove_from_cart",
    CLEAR_CART: "clear_cart",

    CREATE_ORDER: "create_order",
    VIEW_ORDER: "view_order",
    VIEW_ORDERS: "view_orders",
};

export const permissionNames = Object.values(PERMISSIONS);
export const userPermissionNames = Object.values(USER_PERMISSIONS);
