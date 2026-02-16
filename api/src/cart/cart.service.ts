import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product', 'name images basePrice brand category variants')
      .populate('items.seller', 'name shopName')
      .exec();

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }

    console.log(`📦 getCart for user ${userId}: ${cart.items.length} items`);

    // Debug: check if products are populated
    if (cart.items.length > 0) {
      const firstItem = cart.items[0] as any;
      const isPopulated = firstItem.product && typeof firstItem.product === 'object' && firstItem.product.name;
      console.log(`  🔍 First item product populated: ${isPopulated ? 'YES ✅' : 'NO ❌'}`);
      if (!isPopulated && firstItem.product) {
        console.log(`  🔍 Product value type: ${typeof firstItem.product}, value: ${firstItem.product}`);
      }
    }

    // Check for null products (deleted from DB) and duplicates
    const seen = new Set<string>();
    let hasDuplicates = false;
    const hasNullProducts = cart.items.some((item: any) => !item.product);

    // Clean up null products first
    if (hasNullProducts) {
      console.log('🧹 Removing items with deleted products...');
      cart.items = cart.items.filter((item: any) => item.product != null);
      await cart.save();
      const refreshed = await this.cartModel
        .findOne({ user: userId })
        .populate('items.product', 'name images basePrice brand category variants')
        .populate('items.seller', 'name shopName')
        .exec();
      if (refreshed) cart = refreshed;
    }

    // Detect duplicates
    cart.items.forEach((item: any) => {
      const productId = item.product?._id
        ? item.product._id.toString()
        : item.product?.toString();
      if (!productId) return;
      const key = `${productId}###${item.variantSku || 'default'}`;
      if (seen.has(key)) hasDuplicates = true;
      seen.add(key);
    });

    if (hasDuplicates) {
      console.log('🧹 Auto-cleaning duplicates...');
      return await this.removeDuplicatesFromCart(userId);
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, variantSku, quantity, sellerId } = addToCartDto;

    // Validate product
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let price = product.basePrice || 0;

    // Validate variant if provided
    if (variantSku && product.variants?.length > 0) {
      const variant = product.variants.find(v => v.sku === variantSku);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      if (variant.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
      
      price = variant.price;
    }

    // Get or create cart
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        (item.variantSku || 'default') === (variantSku || 'default'),
    );

    if (existingItemIndex > -1) {
      // Update quantity
      console.log(`📦 Updating existing cart item: ${productId}###${variantSku}`);
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      console.log(`➕ Adding new cart item: ${productId}###${variantSku}`);
      cart.items.push({
        product: new Types.ObjectId(productId),
        variantSku: variantSku || 'default',
        seller: sellerId ? new Types.ObjectId(sellerId) : undefined,
        quantity,
        price,
        addedAt: new Date(),
      } as any);
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateCartItem(
    userId: string,
    productId: string,
    variantSku: string,
    updateDto: UpdateCartItemDto,
  ) {
    console.log(`📝 === UPDATE CART ITEM ===`);
    console.log(`  userId: ${userId}`);
    console.log(`  productId: ${productId}`);
    console.log(`  variantSku: ${variantSku}`);
    console.log(`  new quantity: ${updateDto.quantity}`);
    
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    console.log(`  Current cart has ${cart.items.length} items:`);
    cart.items.forEach((item: any, idx) => {
      console.log(`    [${idx}] productId=${item.product.toString()}, variantSku="${item.variantSku}"`);
    });

    const targetVariantSku = variantSku || 'default';
    const itemIndex = cart.items.findIndex(
      item => {
        const productMatch = item.product.toString() === productId;
        const variantMatch = (item.variantSku || 'default') === targetVariantSku;
        console.log(`    Checking: ${item.product.toString()}###${item.variantSku || 'default'} - productMatch=${productMatch}, variantMatch=${variantMatch}`);
        return productMatch && variantMatch;
      }
    );

    if (itemIndex === -1) {
      console.error(`❌ Item not found: ${productId}###${targetVariantSku}`);
      throw new NotFoundException('Item not found in cart');
    }

    console.log(`  ✅ Found item at index ${itemIndex}, updating quantity to ${updateDto.quantity}`);

    // Validate stock
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const variant = product.variants.find(v => v.sku === variantSku);
    if (variant && variant.stock < updateDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cart.items[itemIndex].quantity = updateDto.quantity;
    await cart.save();

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string, variantSku: string) {
    console.log(`🗑️ === REMOVE FROM CART ===`);
    console.log(`  userId: ${userId}`);
    console.log(`  productId: ${productId}`);
    console.log(`  variantSku: ${variantSku}`);
    
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    console.log(`  Current cart has ${cart.items.length} items:`);
    cart.items.forEach((item: any, idx) => {
      console.log(`    [${idx}] productId=${item.product.toString()}, variantSku="${item.variantSku}"`);
    });

    const initialLength = cart.items.length;
    const targetVariantSku = variantSku || 'default';
    
    cart.items = cart.items.filter(
      item => {
        const itemProductId = item.product.toString();
        const itemVariantSku = item.variantSku || 'default';
        
        const productMatch = itemProductId === productId;
        const variantMatch = itemVariantSku === targetVariantSku;
        const shouldRemove = productMatch && variantMatch;
        
        console.log(`    Checking item: ${itemProductId}###${itemVariantSku}`);
        console.log(`      Product match: ${productMatch} (${itemProductId} === ${productId})`);
        console.log(`      Variant match: ${variantMatch} ("${itemVariantSku}" === "${targetVariantSku}")`);
        console.log(`      Should remove: ${shouldRemove}`);
        
        if (shouldRemove) {
          console.log(`    ❌ REMOVING: ${itemProductId}###${itemVariantSku}`);
        }
        
        return !shouldRemove;
      },
    );

    const removedCount = initialLength - cart.items.length;
    console.log(`  ✅ Removed ${removedCount} item(s). Remaining: ${cart.items.length}`);

    if (removedCount === 0) {
      console.warn(`  ⚠️ No items were removed! Item not found.`);
    }

    await cart.save();
    return this.getCart(userId);
  }

  // ✅ CLEAR CART - XỬ LÝ Ở BE (theo yêu cầu)
  async clearCart(userId: string, productIds?: string[]) {
    console.log(`🗑️ Clear cart: userId=${userId}, productIds=${productIds}`);
    
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (productIds && productIds.length > 0) {
      // Remove specific products (sau khi checkout thành công)
      cart.items = cart.items.filter(
        item => !productIds.includes(item.product.toString()),
      );
      console.log(`  ✅ Removed specific items. Remaining: ${cart.items.length}`);
    } else {
      // Clear all items
      console.log(`  ✅ Clearing all ${cart.items.length} items`);
      cart.items = [];
    }

    await cart.save();
    return { message: 'Cart cleared successfully', cart };
  }

  // Helper method to remove duplicate items from cart
  async removeDuplicatesFromCart(userId: string) {
    console.log('🧹 === REMOVE DUPLICATES ===')
    
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      console.log('  ❌ Cart not found')
      return;
    }

    console.log(`  Checking ${cart.items.length} items for duplicates`);
    
    const seen = new Map<string, number>();
    const uniqueItems: any[] = [];

    cart.items.forEach((item: any, idx) => {
      // CRITICAL: Proper productId extraction
      let productId: string;
      
      if (item.product?._id) {
        // Populated: product is an object with _id
        productId = item.product._id.toString();
      } else if (item.product?.toString) {
        // Not populated: product is ObjectId
        productId = item.product.toString();
      } else {
        console.error(`  ❌ [${idx}] INVALID item.product:`, item.product);
        return; // Skip this invalid item
      }
      
      const variantSku = item.variantSku || 'default';
      const key = `${productId}###${variantSku}`;
      
      console.log(`  [${idx}] Checking: ${key}`);

      const existingIndex = seen.get(key);
      if (existingIndex !== undefined) {
        // Found duplicate - merge quantities
        uniqueItems[existingIndex].quantity += item.quantity;
        console.warn(`  ⚠️  DUPLICATE: ${key} - Merged qty ${item.quantity} into existing`);
      } else {
        // New unique item
        seen.set(key, uniqueItems.length);
        uniqueItems.push(item);
        console.log(`  ✅ UNIQUE: ${key}`);
      }
    });

    console.log(`  Result: ${uniqueItems.length} unique items (was ${cart.items.length})`);

    if (uniqueItems.length < cart.items.length) {
      const removedCount = cart.items.length - uniqueItems.length;
      console.log(`🧹 Cleaning ${removedCount} duplicate(s) from cart`);
      
      // Safety check: don't remove everything
      if (uniqueItems.length === 0 && cart.items.length > 0) {
        console.error('❌ ABORT: Would remove all items! Keeping original cart.');
        return cart;
      }
      
      cart.items = uniqueItems;
      await cart.save();
      
      // Refetch with populated data
      return await this.cartModel
        .findOne({ user: userId })
        .populate('items.product', 'name images basePrice brand category variants')
        .populate('items.seller', 'name shopName')
        .exec();
    }

    console.log('  No duplicates found');
    return cart;
  }
}
