export interface CartItem {
  cartItemId: number;               // id của cartItem
  cartId: number;
  productId: number;        // id sản phẩm
  name: string;             // tên sản phẩm
  price: number;            // giá 1 sản phẩm
  quantity: number;         // số lượng
  imageUrl?: string;        // ảnh sản phẩm (optional)
}

export interface Cart {
  cartId: number;               // id của giỏ hàng
  userId: number;           // id user sở hữu giỏ hàng
  cartItems: CartItem[];        // danh sách cartItem
  totalPrice: number;       // tổng tiền
  createdAt?: string;       // thời gian tạo (optional)
  updatedAt?: string;       // thời gian cập nhật (optional)
}
