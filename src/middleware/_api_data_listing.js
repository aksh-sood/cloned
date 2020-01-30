let Joi = require("joi");
import admin from "../firebase/firebaseConfig";

var db = admin.firestore();

const routes = [
	{
		method: "GET",
		path: "/api/products",
		config: {
			tags: ["api", "Products"],
			description: "Get products",
			notes: "Use get method to get all products"
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					const product_snapshot = await db.collection("products").get();
					const products = [];

					product_snapshot.forEach((doc) => {
						products.push({ id: doc.id, ...doc.data() });
					});

					return resolve({
						status: "success",
						message: "Products fetched successfully",
						products
					});
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "GET",
		path: "/api/products/{id}",
		config: {
			tags: ["api", "Products"],
			description: "Get product data by id",
			notes: "Use get method to get product data by id"
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.id;
				try {
					const product_doc = await db
						.collection("products")
						.doc(id)
						.get();
					var product = { id: product_doc.id, ...product_doc.data() };
					const category_doc = await db
						.collection("categories")
						.doc(product.category_id)
						.get();

					product = { ...product, category: category_doc.data() };

					return resolve({
						status: "success",
						message: "Product fetched successfully",
						product
					});
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "POST",
		path: "/api/products",
		config: {
			plugins: {
				"hapi-swagger": {
					payloadType: "form"
				}
			},
			tags: ["api", "Products"],
			description: "Upload product data",
			notes: "Upload product data",
			payload: {
				output: "stream",
				parse: true,
				allow: "multipart/form-data"
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				var newProduct = {
					product_name: request.payload.product_name,
					description: request.payload.description,
					type: request.payload.type,
					images: request.payload.images,
					category_id: request.payload.category_id,
					subcat_id: request.payload.subcat_id,
					inStock: request.payload.inStock,
					seller: request.payload.seller,
					stars: request.payload.stars,
					likes: request.payload.likes,
					total_reviews: request.payload.total_reviews,
					mrp: request.payload.mrp,
					discounted_price: request.payload.discounted_price,
					discount: request.payload.discount,
					values: request.payload.values,
					highlights: request.payload.highlights,
					specs: request.payload.specs,
					is_verified: request.payload.is_verified,
					sizes: request.payload.sizes
				};

				try {
					await db.collection("products").add(newProduct);
					return resolve({ message: "Product added successfully!" });
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "PUT",
		path: "/api/products/{id}",

		config: {
			tags: ["api", "Products"],
			description: "Update product data",
			notes: "Update product data by id",
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			},
			validate: {
				params: Joi.object({
					id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				let newProduct = {
					product_name: request.payload.product_name,
					description: request.payload.description,
					images: request.payload.images,
					type: request.payload.type,
					category_id: request.payload.category_id,
					subcat_id: request.payload.subcat_id,
					inStock: request.payload.inStock,
					seller: request.payload.seller,
					stars: request.payload.stars,
					likes: request.payload.likes,
					total_reviews: request.payload.total_reviews,
					mrp: request.payload.mrp,
					discounted_price: request.payload.discounted_price,
					discount: request.payload.discount,
					values: request.payload.values,
					highlights: request.payload.highlights,
					specs: request.payload.specs,
					is_verified: request.payload.is_verified,
					sizes: request.payload.sizes
				};

				db.collection("products")
					.doc(request.params.id)
					.set(newProduct, { merge: true })
					.then((res) => {
						console.log(res);
						return resolve({ message: "Product edited successfully" });
					})
					.catch((err) => {
						console.log(err.message);
						return reject(err);
					});
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/products/{id}",
		config: {
			tags: ["api", "Products"],
			description: "Delete product's data by id",
			notes: "Delete product",
			validate: {
				params: Joi.object({
					id: Joi.string()
				})
			},
			handler: async (request, reply) => {
				let pr = async (resolve, reject) => {
					const id = request.params.id;

					try {
						await db
							.collection("products")
							.doc(id)
							.delete();

						return resolve({
							status: "success",
							message: "Product deleted successfully!"
						});
					} catch (err) {
						reject({ message: err.message });
					}
				};
				return new Promise(pr);
			}
		}
	},
	{
		method: "GET",
		path: "/api/category",
		config: {
			tags: ["api", "Categories"],
			description: "Get categories",
			notes: "Use get method to get all categories"
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.id;
				try {
					const categories_snapshot = await db.collection("categories").get();
					const categories = [];

					categories_snapshot.forEach((doc) => {
						categories.push({ id: doc.id, ...doc.data() });
					});

					return resolve({
						status: "success",
						message: "Categories fetched successfully",
						categories
					});
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "POST",
		path: "/api/categories",
		config: {
			tags: ["api", "Categories"],
			description: "Upload category data",
			notes: "Upload category data",
			validate: {
				payload: {
					category_name: Joi.string()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				var newCategory = {
					category_name: request.payload.category_name
				};

				try {
					await db.collection("categories").add(newCategory);
					return resolve({ message: "Category added successfully!" });
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "PUT",
		path: "/api/categories/{id}",

		config: {
			tags: ["api", "Categories"],
			description: "Update category data",
			notes: "Update category data by id",
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			},
			validate: {
				params: Joi.object({
					id: Joi.string()
				}),
				payload: {
					category_name: Joi.string().optional()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const newCategory = {
					category_name: request.payload.category_name
				};
				db.collection("categories")
					.doc(request.params.id)
					.set(newCategory, { merge: true })
					.then((res) => {
						console.log(res);
						return resolve({ message: "Category edited successfully" });
					})
					.catch((err) => {
						console.log(err.message);
						return reject(err);
					});
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/categories/{id}",
		config: {
			tags: ["api", "Categories"],
			description: "Delete category's data by id",
			notes: "Delete category",
			validate: {
				params: Joi.object({
					id: Joi.string()
				})
			},
			handler: async (request, reply) => {
				let pr = async (resolve, reject) => {
					const id = request.params.id;

					try {
						await db
							.collection("categories")
							.doc(id)
							.delete();

						return resolve({
							status: "success",
							message: "Category deleted successfully!"
						});
					} catch (err) {
						reject({ message: err.message });
					}
				};
				return new Promise(pr);
			}
		}
	},

	{
		method: "GET",
		path: "/api/category/{id}/subcategories",
		config: {
			tags: ["api", "Categories"],
			description: "Get subcategories",
			notes: "Use get method to get all subcategories",
			validate: {
				params: Joi.object({
					id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.id;
				try {
					const subcategories_snapshot = await db
						.collection("categories")
						.doc(id)
						.collection("subcategories")
						.get();
					const subcategories = [];

					subcategories_snapshot.forEach((doc) => {
						subcategories.push({ id: doc.id, ...doc.data() });
					});

					return resolve({
						status: "success",
						message: "Subcategories fetched successfully",
						subcategories
					});
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "POST",
		path: "/api/categories/{id}/subcategories",
		config: {
			tags: ["api", "Categories"],
			description: "Upload subcategory data",
			notes: "Upload subcategory data",
			validate: {
				params: Joi.object({
					id: Joi.string()
				}),
				payload: {
					subcategory_name: Joi.string().optional()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const newSubcategory = {
					subcategory_name: request.payload.subcategory_name
				};

				try {
					await db
						.collection("categories")
						.doc(request.params.id)
						.collection("subcategories")
						.add(newSubcategory);
					return resolve({ message: "Subcategory added successfully!" });
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "PUT",
		path: "/api/categories/{id}/subcategories/{subcat_id}",

		config: {
			tags: ["api", "Categories"],
			description: "Update subcategory data",
			notes: "Update subcategory data by id",
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			},
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string()
				}),
				payload: {
					subcategory_name: Joi.string().optional()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const newSubcategory = {
					subcategory_name: request.payload.subcategory_name
				};
				db.collection("categories")
					.doc(request.params.id)
					.collection("subcategories")
					.doc(request.params.subcat_id)
					.set(newSubcategory, { merge: true })
					.then((res) => {
						console.log(res);
						return resolve({ message: "Subcategory edited successfully" });
					})
					.catch((err) => {
						console.log(err.message);
						return reject(err);
					});
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/categories/{id}/subcategories/{subcat_id}",
		config: {
			tags: ["api", "Categories"],
			description: "Delete category's data by id",
			notes: "Delete category",
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string()
				})
			},
			handler: async (request, reply) => {
				let pr = async (resolve, reject) => {
					const id = request.params.id;

					try {
						await db
							.collection("categories")
							.doc(id)
							.collection("subcategories")
							.doc(request.params.subcat_id)
							.delete();

						return resolve({
							status: "success",
							message: "Sub category deleted successfully!"
						});
					} catch (err) {
						reject({ message: err.message });
					}
				};
				return new Promise(pr);
			}
		}
	},
	{
		method: "GET",
		path: "/api/cart/{user_id}",
		config: {
			tags: ["api", "Cart"],
			description: "Get cart data by user id",
			notes: "Use get method to get cart data by user id",
			validate: {
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.user_id;
				try {
					var cartDoc = await db
						.collection("cart")
						.doc(id)
						.get();

					let items = [];

					var itemsSnapshot = await db
						.collection("cart")
						.doc(id)
						.collection("items")
						.get();
					itemsSnapshot.forEach((doc) => {
						items.push({ id: doc.id, ...doc.data() });
					});

					var cart = { id: cartDoc.id, items: [] };
					console.log(items);
					for (var item in items) {
						const id = items[item].id;
						const product_doc = await db
							.collection("products")
							.doc(id)
							.get();
						const product_info = {
							id: product_doc.id,
							quantity: items[item].quantity,
							...product_doc.data()
						};
						cart.items.push(product_info);
					}
					console.log(cart);
					// result

					return resolve({
						status: "success",
						message: "Cart data fetched successfully",
						cart
					});
				} catch (err) {
					console.log(err);
					return reject({ message: err });
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "POST",
		path: "/api/cart/{user_id}",
		config: {
			tags: ["api", "Cart"],
			description: "Add to cart",
			notes: "Send product details to add to cart",
			validate: {
				payload: {
					product_id: Joi.string(),
					quantity: Joi.string()
				},
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					await db
						.collection("cart")
						.doc(request.params.user_id)
						.collection("items")
						.doc(request.payload.product_id)
						.set({ quantity: request.payload.quantity });
					return resolve({ message: "Product added to cart successfully" });
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "PUT",
		path: "/api/cart/{user_id}",
		config: {
			tags: ["api", "Cart"],
			description: "Update cart",
			notes: "Edit cart details",
			validate: {
				payload: {
					product_id: Joi.string().optional(),
					quantity: Joi.string().optional()
				},
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					await db
						.collection("cart")
						.doc(request.params.user_id)
						.collection("items")
						.doc(request.payload.product_id)
						.set({ quantity: request.payload.quantity }, { merge: true });
					return resolve({ message: "Product updated in cart successfully" });
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/cart/{user_id}/by-product-id/{product_id}",
		config: {
			tags: ["api", "Cart"],
			description: "Delete product from cart by id",
			notes: "Delete product from cart",
			validate: {
				params: Joi.object({
					user_id: Joi.string(),
					product_id: Joi.string()
				})
			},
			handler: async (request, reply) => {
				let pr = async (resolve, reject) => {
					try {
						await db
							.collection("cart")
							.doc(request.params.user_id)
							.collection("items")
							.doc(request.params.product_id)
							.delete();

						resolve({ message: "Item deleted successfully" });
					} catch (err) {
						console.log(err.message);
						reject(err);
					}
				};
				return new Promise(pr);
			}
		}
	},
	{
		method: "GET",
		path: "/api/save-address/{user_id}",
		config: {
			tags: ["api", "Checkout"],
			description: "Get saved user addresses",
			notes: "Get saved user addresses",
			validate: {
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					let addresses = [];
					const addressSnapshot = await db
						.collection("saved-addresses")
						.doc(request.params.user_id)
						.collection("addresses")
						.get();
					addressSnapshot.forEach((doc) => {
						addresses.push({ id: doc.id, ...doc.data() });
					});
					return resolve({
						message: "User address saved successfully",
						addresses
					});
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "POST",
		path: "/api/save-address/{user_id}",
		config: {
			tags: ["api", "Checkout"],
			description: "Save user address",
			notes: "Save user address",
			validate: {
				payload: {
					first_name: Joi.string(),
					last_name: Joi.string(),
					company: Joi.string(),
					city: Joi.string(),
					country: Joi.string(),
					full_address: Joi.string(),
					phone: Joi.string()
				},
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					await db
						.collection("saved-addresses")
						.doc(request.params.user_id)
						.collection("addresses")
						.add({
							first_name: request.payload.first_name,
							last_name: request.payload.last_name,
							company: request.payload.company,
							city: request.payload.city,
							country: request.payload.country,
							full_address: request.payload.full_address,
							phone: request.payload.phone
						});
					return resolve({ message: "User address saved successfully" });
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/delete-address/{user_id}",
		config: {
			tags: ["api", "Checkout"],
			description: "Delete user address",
			notes: "Delete user address",
			validate: {
				payload: {
					address_id: Joi.string()
				},
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					await db
						.collection("saved-addresses")
						.doc(request.params.user_id)
						.collection("addresses")
						.doc(request.payload.address_id)
						.delete();
					return resolve({ message: "User address deleted successfully" });
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "POST",
		path: "/api/checkout/{user_id}",
		config: {
			tags: ["api", "Checkout"],
			description: "Checkout from cart",
			notes: "Checkout",
			validate: {
				payload: {
					payment_id: Joi.string(),
					total_amount: Joi.string(),
					address_id: Joi.string()
				},
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					const address_doc = await db
						.collection("saved-addresses")
						.doc(request.params.user_id)
						.collection("addresses")
						.doc(request.payload.address_id)
						.get();
					const address = { id: address_doc.id, ...address_doc.data() };

					const itemSnapshot = await db
						.collection("cart")
						.doc(request.params.user_id)
						.collection("items")
						.get();

					let item_ids = [];
					itemSnapshot.forEach((doc) => {
						item_ids.push(doc.id);
					});
					for (var item in item_ids) {
						console.log(item);
						await db
							.collection("cart")
							.doc(request.params.user_id)
							.collection("items")
							.doc(item_ids[item])
							.delete();
					}
					await db
						.collection("user-orders")
						.doc(request.params.user_id)
						.collection("orders")
						.add({
							payment_id: request.payload.payment_id,
							total_amount: request.payload.total_amount,
							address
						});
					return resolve({ message: "Order added successfully" });
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "GET",
		path: "/api/orders/{user_id}",
		config: {
			tags: ["api", "Checkout"],
			description: "Fetch orders of user",
			notes: "Fetch orders of user",
			validate: {
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					var ordersSnapshot = await db
						.collection("user-orders")
						.doc(request.params.user_id)
						.collection("orders")
						.get();
					let orders = [];
					ordersSnapshot.forEach((doc) => {
						orders.push({ id: doc.id, ...doc.data() });
					});
					return resolve({ message: "Orders fetched successfully", orders });
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	}
];

export default routes;
