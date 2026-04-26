// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import allProductsData from "../data/productsData";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("hawaiiCart");
      if (savedCart) return JSON.parse(savedCart);
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("hawaiiCart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }, [cartItems]);

  const addItemToCart = (productToAdd, shopId, shopName, isMall = false, quantity = 1) => {
    if (!productToAdd || !productToAdd.itemId || quantity <= 0) {
      console.error("Invalid product data:", productToAdd);
      return;
    }

    const productData = allProductsData.find(
      (p) => p.id.toString() === productToAdd.itemId.toString()
    );

    if (!productData) {
      console.error(`Product with itemId "${productToAdd.itemId}" not found.`);
      alert(`Produk ${productToAdd.name || "tidak dikenal"} tidak ditemukan.`);
      return;
    }

    setCartItems((prevCartItems) => {
      const existingShopIndex = prevCartItems.findIndex((shop) => shop.id === shopId);

      if (existingShopIndex > -1) {
        const updatedShops = [...prevCartItems];
        const shop = { ...updatedShops[existingShopIndex] };
        const existingProductIndex = shop.products.findIndex(
          (p) => p.itemId === productToAdd.itemId
        );

        if (existingProductIndex > -1) {
          shop.products[existingProductIndex].qty += quantity;
        } else {
          shop.products.push({ ...productData, itemId: productToAdd.itemId, qty: quantity, selected: true });
        }

        updatedShops[existingShopIndex] = shop;
        return updatedShops;
      } else {
        return [
          ...prevCartItems,
          {
            id: shopId,
            shopName,
            isMall,
            hasShopVoucher: false,
            products: [
              { ...productData, itemId: productToAdd.itemId, qty: quantity, selected: true },
            ],
          },
        ];
      }
    });
  };

  const updateQuantity = (shopId, itemId, delta) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            products: shop.products.map((product) => {
              if (product.itemId === itemId) {
                return { ...product, qty: Math.max(1, product.qty + delta) };
              }
              return product;
            }),
          };
        }
        return shop;
      })
    );
  };

  const removeItem = (shopId, itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((shop) => {
          if (shop.id === shopId) {
            return {
              ...shop,
              products: shop.products.filter((p) => p.itemId !== itemId),
            };
          }
          return shop;
        })
        .filter((shop) => shop.products.length > 0)
    );
  };

  const toggleItemSelection = (shopId, itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            products: shop.products.map((product) => {
              if (product.itemId === itemId) {
                return { ...product, selected: !product.selected };
              }
              return product;
            }),
          };
        }
        return shop;
      })
    );
  };

  const toggleShopSelection = (shopId, selected) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            products: shop.products.map((product) => ({ ...product, selected })),
          };
        }
        return shop;
      })
    );
  };

  const toggleSelectAll = (selected) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((shop) => ({
        ...shop,
        products: shop.products.map((product) => ({ ...product, selected })),
      }))
    );
  };

  const getSelectedCartItems = () => {
    const selected = [];
    cartItems.forEach((shop) => {
      shop.products.forEach((product) => {
        if (product.selected) {
          selected.push({
            ...product,
            shopId: shop.id,
            shopName: shop.shopName,
            isMall: shop.isMall,
          });
        }
      });
    });
    return selected;
  };

  const calculateTotals = () => {
    let totalProductsSelected = 0;
    let totalPrice = 0;
    cartItems.forEach((shop) => {
      shop.products.forEach((product) => {
        if (product.selected) {
          totalProductsSelected += product.qty;
          totalPrice += product.currentPrice * product.qty;
        }
      });
    });
    return { totalProductsSelected, totalPrice };
  };

  const { totalProductsSelected, totalPrice } = calculateTotals();

  const contextValue = {
    cartItems,
    addItemToCart,
    updateQuantity,
    removeItem,
    toggleItemSelection,
    toggleShopSelection,
    toggleSelectAll,
    getSelectedCartItems,
    totalProductsSelected,
    totalPrice,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
