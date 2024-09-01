"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProducts = fetchProducts;
exports.fetchProductDetails = fetchProductDetails;
exports.addProduct = addProduct;
exports.deleteProduct = deleteProduct;
exports.searchByTitle = searchByTitle;
exports.sortPrice = sortPrice;
exports.filterByCategory = filterByCategory;
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://dummyjson.com/products");
            const { products } = yield response.json();
            console.log(products);
            return products;
        }
        catch (error) {
            console.log("Error can't get the products: ", error);
            return [];
        }
    });
}
function fetchProductDetails(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://dummyjson.com/products/${id}`);
            const product = yield response.json();
            console.log(product);
            return product;
        }
        catch (error) {
            console.log("Error can't get the product details: ", error);
            return null;
        }
    });
}
function addProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://dummyjson.com/products/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            const data = yield response.json();
            console.log("Product added:", data);
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            cart.push(data);
            localStorage.setItem("cart", JSON.stringify(cart));
            return data;
        }
        catch (error) {
            console.log("Error adding product: ", error);
        }
    });
}
function deleteProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://dummyjson.com/products/${productId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                console.log(`Product with ID ${productId} deleted from server.`);
                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const updatedCart = cart.filter((product) => product.id !== productId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                console.log(`Product with ID ${productId} removed from cart.`);
            }
            else {
                console.log(`Failed to delete product with ID ${productId}.`);
            }
        }
        catch (error) {
            console.log("Error deleting product: ", error);
        }
    });
}
function searchByTitle(productName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(productName)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }
            const data = yield response.json();
            console.log(data.products);
            return data.products;
        }
        catch (error) {
            console.log("Error product name search: ", error);
            return [];
        }
    });
}
function sortPrice() {
    return __awaiter(this, arguments, void 0, function* (order = "asc") {
        try {
            const response = yield fetch(`https://dummyjson.com/products?sortBy=price&order=${order}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }
            const data = yield response.json();
            const products = data.products;
            console.log(products);
            return products;
        }
        catch (error) {
            console.log("Error on sorting price: ", error);
            return [];
        }
    });
}
function filterByCategory(products_1) {
    return __awaiter(this, arguments, void 0, function* (products, categoryName = "") {
        try {
            if (categoryName === "All") {
                return products;
            }
            const filteredProducts = categoryName
                ? products.filter((product) => product.category === categoryName)
                : products;
            console.log(filteredProducts);
            return filteredProducts;
        }
        catch (error) {
            console.log("Filter error: ", error);
            return [];
        }
    });
}
