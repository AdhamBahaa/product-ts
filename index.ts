import { IProduct, IResponse } from "./interface";

export async function fetchProducts<T extends IProduct>(): Promise<T[]> {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const { products } = await response.json();
    console.log(products);
    return products as T[];
  } catch (error) {
    console.log("Error can't get the products: ", error);
    return [];
  }
}

export async function fetchProductDetails<T extends IProduct>(
  id: number
): Promise<T | null> {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await response.json();
    console.log(product);
    return product as T;
  } catch (error) {
    console.log("Error can't get the product details: ", error);
    return null;
  }
}

export async function addProduct(product: IProduct): Promise<IProduct | void> {
  try {
    const response = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data: IProduct = await response.json();
    console.log("Product added:", data);
    const cart: IProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(data);
    localStorage.setItem("cart", JSON.stringify(cart));

    return data;
  } catch (error) {
    console.log("Error adding product: ", error);
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  try {
    const response: Response = await fetch(
      `https://dummyjson.com/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      console.log(`Product with ID ${productId} deleted from server.`);
      const cart: IProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.filter((product) => product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      console.log(`Product with ID ${productId} removed from cart.`);
    } else {
      console.log(`Failed to delete product with ID ${productId}.`);
    }
  } catch (error) {
    console.log("Error deleting product: ", error);
  }
}

export async function searchByTitle(productName: string): Promise<IProduct[]> {
  try {
    const response: Response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(
        productName
      )}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: IResponse = await response.json();
    console.log(data.products);
    return data.products;
  } catch (error) {
    console.log("Error product name search: ", error);
    return [];
  }
}

export async function sortPrice(
  order: "asc" | "desc" = "asc"
): Promise<IProduct[]> {
  try {
    const response: Response = await fetch(
      `https://dummyjson.com/products?sortBy=price&order=${order}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: IResponse = await response.json();
    const products: IProduct[] = data.products;

    console.log(products);
    return products;
  } catch (error) {
    console.log("Error on sorting price: ", error);
    return [];
  }
}

export async function filterByCategory(
  products: IProduct[],
  categoryName: string = ""
): Promise<IProduct[]> {
  try {
    if (categoryName === "All") {
      return products;
    }

    const filteredProducts: IProduct[] = categoryName
      ? products.filter((product) => product.category === categoryName)
      : products;

    console.log(filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.log("Filter error: ", error);
    return [];
  }
}
