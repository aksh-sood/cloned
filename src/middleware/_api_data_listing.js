let Joi = require("joi");
import admin from "../firebase/firebaseConfig";
const AWS = require("aws-sdk");

//configuring the AWS environment
AWS.config.update({
	accessKeyId: "AKIAILVU3EZSDE7OZX2A",
	secretAccessKey: "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"
});
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
				const id = request.params.id;
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
					const product = { id: product_doc.id, ...product_doc.data() };

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
				const files = request.payload.files;
				let fileLinks = [];

				for (const file of files) {
					const gcsname = new Date().toISOString() + "-" + file.hapi.filename;

					let s3, params;

					s3 = new AWS.S3();

					const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
					var folder = "product-images";
					params = {
						Bucket: "brandedbaba-bucket",
						Body: file,
						Key: `${folder}/${gcsname}`,
						ContentType: file.hapi.headers["content-type"],
						ACL: "public-read"
					};

					const response = await s3.upload(params, options).promise();

					fileLinks.push(response.Location);
				}

				var newProduct = {
					product_name: request.payload.product_name,
					description: request.payload.description,
					type: request.payload.price,
					images: fileLinks,
					category_id: request.payload.category_id,
					inStock: request.payload.inStock,
					seller: request.payload.seller,
					stars: request.payload.stars,
					likes: request.payload.is_likes,
					total_reviews: request.payload.total_reviews,
					mrp: request.payload.mrp,
					discounted_price: request.payload.discounted_price,
					discount: request.payload.discount,
					category: request.payload.category,
					values: request.payload.values,
					highlights: request.payload.highlights,
					specs: request.payload.specs,
					is_verified: request.payload.is_verified
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
				let newProduct = {};
				if (request.payload.files) {
					const files = request.payload.files;
					let fileLinks = [];

					for (const file of files) {
						const gcsname = new Date().toISOString() + "-" + file.hapi.filename;

						let s3, params;

						s3 = new AWS.S3();

						const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
						var folder = "product-images";
						params = {
							Bucket: "brandedbaba-bucket",
							Body: file,
							Key: `${folder}/${gcsname}`,
							ContentType: file.hapi.headers["content-type"],
							ACL: "public-read"
						};

						const response = await s3.upload(params, options).promise();

						fileLinks.push(response.Location);
					}

					newProduct = {
						product_name: request.payload.product_name,
						description: request.payload.description,
						type: request.payload.price,
						images: fileLinks,
						category_id: request.payload.category_id,
						inStock: request.payload.inStock,
						seller: request.payload.seller,
						stars: request.payload.stars,
						likes: request.payload.is_likes,
						total_reviews: request.payload.total_reviews,
						mrp: request.payload.mrp,
						discounted_price: request.payload.discounted_price,
						discount: request.payload.discount,
						category: request.payload.category,
						type: request.payload.type,
						values: request.payload.values,
						highlights: request.payload.highlights,
						specs: request.payload.specs,
						is_verified: request.payload.is_verified
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
				} else {
					newProduct = {
						product_name: request.payload.product_name,
						description: request.payload.description,
						type: request.payload.price,
						inStock: request.payload.inStock,
						seller: request.payload.seller,
						stars: request.payload.stars,
						likes: request.payload.is_likes,
						total_reviews: request.payload.total_reviews,
						mrp: request.payload.mrp,
						discounted_price: request.payload.discounted_price,
						discount: request.payload.discount,
						category: request.payload.category,
						type: request.payload.type,
						values: request.payload.values,
						highlights: request.payload.highlights,
						specs: request.payload.specs,
						is_verified: request.payload.is_verified
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
				}
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
			notes: "Upload category data"
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
		path: "/api/cart/{user_id}",
		config: {
			tags: ["api", "Cart"],
			description: "Get cart data by user id",
			notes: "Use get method to get cart data by user id"
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.user_id;
				try {
					var cartDoc = await db
						.collection("cart")
						.doc(id)
						.collection("items")
						.get();
					var cart = { id: cartDoc.id, ...cartDoc.data() };

					// result
					return resolve({
						status: "success",
						message: "Cart data fetched successfully",
						cart
					});
				} catch (err) {
					reject({ message: err.message });
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
					return resolve({ message: "Product added to cart successfully" });
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
							.doc(request.params.id)
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
	}
];

export default routes;
