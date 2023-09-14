export class CartItem {
  constructor(productId: string, productSizeId: string, quantity: number) {
    this.ProductId = productId;
    this.ProductSizeId = productSizeId;
    this.Quantity = quantity;
  }

  ProductId!: string;
  ProductSizeId!: string;
  Quantity!: number;
}
