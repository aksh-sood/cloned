let Joi = require("joi");
import admin from "../firebase/firebaseConfig";
import AWS from "aws-sdk";
var _ = require("lodash");
//configuring the AWS environment
AWS.config.update({
	accessKeyId: "AKIAILVU3EZSDE7OZX2A",
	secretAccessKey: "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"
});
var db = admin.firestore();

const routes = [
	{
		method: "POST",
		path: "/api/search/products",
		config: {
			tags: ["api", "Products"],
			description: "Get products",
			notes: "Use get method to get all products",
			validate: {
				payload: {
					query: Joi.string().optional(),
					filters: Joi.object({
						category_id: Joi.string().optional(),
						subcategory_id: Joi.string().optional(),
						sub_subcategory_id: Joi.string().optional()
					}).optional(),
					sorting_query: Joi.string().optional()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					const { query, filters, sorting_query } = request.payload;

					const product_snapshot = await db.collection("products").get();
					var products = [];

					product_snapshot.forEach((doc) => {
						products.push({ id: doc.id, ...doc.data() });
					});

					for (var index in products) {
						var prod = products[index];
						const category_doc = await db
							.collection("categories")
							.doc(prod.category_id)
							.get();
						prod = { ...prod, category: category_doc.data() };

						if (prod.subcat_id !== "") {
							const subcategory_doc = await db
								.collection("categories")
								.doc(prod.category_id)
								.collection("subcategories")
								.doc(prod.subcat_id)
								.get();

							prod = { ...prod, subcategory: subcategory_doc.data() };
						}

						if (prod.sub_subcat_id !== "") {
							const sub_subcategory_doc = await db
								.collection("categories")
								.doc(prod.category_id)
								.collection("subcategories")
								.doc(prod.subcat_id)
								.collection("sub-subcategories")
								.doc(prod.sub_subcat_id)
								.get();

							prod = {
								...prod,
								sub_subcategory: sub_subcategory_doc.data()
							};
						}
						products[index] = prod;
					}

					if (sorting_query === "alphabetical") {
						products = _.orderBy(
							products,
							[(product) => product.product_name.toLowerCase()],
							["asc"]
						);
					} else if (sorting_query === "price_low") {
						products = _.orderBy(products, ["mrp"], ["asc"]);
					} else if (sorting_query === "price_high") {
						products = _.orderBy(products, ["mrp"], ["desc"]);
					} else if (sorting_query === "newest") {
					}

					if (query === "" || typeof query === "undefined") {
						console.log("No query string");
						if (filters) {
							if (filters.category_id) {
								products = products.filter((product) => {
									return product.category_id === filters.category_id;
								});
								if (filters.subcategory_id) {
									products = products.filter((product) => {
										return product.subcat_id === filters.subcategory_id;
									});
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								} else {
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								}
							} else {
								if (filters.subcategory_id) {
									products = products.filter((product) => {
										return product.subcat_id === filters.subcategory_id;
									});
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								} else {
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								}
							}
						} else {
							console.log("Pno filters");
						}
					} else {
						console.log("Query passed");
						products = products.filter((product) => {
							return product.product_name.includes(query);
						});
						if (filters) {
							if (filters.category_id) {
								products = products.filter((product) => {
									return product.category_id === filters.category_id;
								});
								if (filters.subcategory_id) {
									products = products.filter((product) => {
										return product.subcat_id === filters.subcategory_id;
									});
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								} else {
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								}
							} else {
								if (filters.subcategory_id) {
									products = products.filter((product) => {
										return product.subcat_id === filters.subcategory_id;
									});
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								} else {
									if (filters.sub_subcategory_id) {
										products = products.filter((product) => {
											return (
												product.sub_subcat_id === filters.sub_subcategory_id
											);
										});
									}
								}
							}
						}
					}

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

					for (var index in products) {
						var prod = products[index];
						const category_doc = await db
							.collection("categories")
							.doc(prod.category_id)
							.get();
						prod = { ...prod, category: category_doc.data() };

						if (prod.subcat_id !== "") {
							const subcategory_doc = await db
								.collection("categories")
								.doc(prod.category_id)
								.collection("subcategories")
								.doc(prod.subcat_id)
								.get();

							prod = { ...prod, subcategory: subcategory_doc.data() };
						}

						if (prod.sub_subcat_id !== "") {
							const sub_subcategory_doc = await db
								.collection("categories")
								.doc(prod.category_id)
								.collection("subcategories")
								.doc(prod.subcat_id)
								.collection("sub-subcategories")
								.doc(prod.sub_subcat_id)
								.get();

							prod = {
								...prod,
								sub_subcategory: sub_subcategory_doc.data()
							};
						}
						products[index] = prod;
					}

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

					if (product.subcat_id !== "") {
						const subcategory_doc = await db
							.collection("categories")
							.doc(product.category_id)
							.collection("subcategories")
							.doc(product.subcat_id)
							.get();

						product = { ...product, subcategory: subcategory_doc.data() };
					}

					if (product.sub_subcat_id !== "") {
						const sub_subcategory_doc = await db
							.collection("categories")
							.doc(product.category_id)
							.collection("subcategories")
							.doc(product.subcat_id)
							.collection("sub-subcategories")
							.doc(product.sub_subcat_id)
							.get();

						product = {
							...product,
							sub_subcategory: sub_subcategory_doc.data()
						};
					}
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
		path: "/api/save-product-image",
		config: {
			plugins: {
				"hapi-swagger": {
					payloadType: "form"
				}
			},
			tags: ["api", "Products"],
			description: "Upload product image",
			notes: "Upload product image",
			payload: {
				output: "stream",
				parse: true,
				allow: "multipart/form-data"
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					const file = request.payload.file;
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

					return resolve({
						message: "Image uploaded to AWS",
						image_url: response.Location
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
			tags: ["api", "Products"],
			description: "Upload product data",
			notes: "Upload product data",
			validate: {
				payload: {
					product_name: Joi.string(),
					description: Joi.string(),
					featuredImageId: Joi.string().optional(),
					images: Joi.array().items(Joi.string()),
					category_id: Joi.string(),
					sub_subcat_id: Joi.string().optional(),
					subcat_id: Joi.string().optional(),
					inStock: Joi.bool(),
					seller: Joi.string(),
					stars: Joi.number(),
					likes: Joi.number(),
					total_reviews: Joi.number(),
					mrp: Joi.number(),
					discounted_price: Joi.number(),
					discount: Joi.number(),
					highlights: Joi.array().items(Joi.string()),
					is_verified: Joi.bool(),
					sizes: Joi.array().items(Joi.string())
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				let newProduct;
				if (request.payload.subcat_id) {
					if (request.payload.sub_subcat_id) {
						newProduct = {
							product_name: request.payload.product_name,
							description: request.payload.description,
							featuredImageId: request.payload.featuredImageId,
							images: request.payload.images,
							category_id: request.payload.category_id,
							sub_subcat_id: request.payload.sub_subcat_id,
							subcat_id: request.payload.subcat_id,
							inStock: request.payload.inStock,
							seller: request.payload.seller,
							stars: request.payload.stars,
							likes: request.payload.likes,
							total_reviews: request.payload.total_reviews,
							mrp: request.payload.mrp,
							discounted_price: request.payload.discounted_price,
							discount: request.payload.discount,
							highlights: request.payload.highlights,
							is_verified: request.payload.is_verified,
							sizes: request.payload.sizes
						};
					} else {
						newProduct = {
							product_name: request.payload.product_name,
							description: request.payload.description,
							featuredImageId: request.payload.featuredImageId,
							images: request.payload.images,
							category_id: request.payload.category_id,
							subcat_id: request.payload.subcat_id,
							sub_subcat_id: "",
							inStock: request.payload.inStock,
							seller: request.payload.seller,
							stars: request.payload.stars,
							likes: request.payload.likes,
							total_reviews: request.payload.total_reviews,
							mrp: request.payload.mrp,
							discounted_price: request.payload.discounted_price,
							discount: request.payload.discount,
							highlights: request.payload.highlights,
							is_verified: request.payload.is_verified,
							sizes: request.payload.sizes
						};
					}
				} else {
					newProduct = {
						product_name: request.payload.product_name,
						description: request.payload.description,
						featuredImageId: request.payload.featuredImageId,
						images: request.payload.images,
						category_id: request.payload.category_id,
						sub_subcat_id: "",
						subcat_id: "",
						inStock: request.payload.inStock,
						seller: request.payload.seller,
						stars: request.payload.stars,
						likes: request.payload.likes,
						total_reviews: request.payload.total_reviews,
						mrp: request.payload.mrp,
						discounted_price: request.payload.discounted_price,
						discount: request.payload.discount,
						highlights: request.payload.highlights,
						is_verified: request.payload.is_verified,
						sizes: request.payload.sizes
					};
				}

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
		path: "/api/products",

		config: {
			tags: ["api", "Products"],
			description: "Update product data",
			notes: "Update product data by id",
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			},
			validate: {
				payload: {
					id: Joi.string().optional(),
					product_name: Joi.string().optional(),
					description: Joi.string().optional(),
					featuredImageId: Joi.string().optional(),
					images: Joi.array()
						.items(Joi.string())
						.optional(),
					category_id: Joi.string().optional(),
					sub_subcat_id: Joi.string().optional(),
					subcat_id: Joi.string().optional(),
					inStock: Joi.bool().optional(),
					seller: Joi.string().optional(),
					stars: Joi.number().optional(),
					likes: Joi.number().optional(),
					total_reviews: Joi.number().optional(),
					mrp: Joi.number().optional(),
					discounted_price: Joi.number().optional(),
					discount: Joi.number().optional(),
					highlights: Joi.array()
						.items(Joi.string())
						.optional(),
					is_verified: Joi.bool().optional(),
					sizes: Joi.array()
						.items(Joi.string())
						.optional()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				let newProduct = {
					product_name: request.payload.product_name,
					description: request.payload.description,
					featuredImageId: request.payload.featuredImageId,
					images: request.payload.images,
					category_id: request.payload.category_id,
					sub_subcat_id: request.payload.sub_subcat_id,
					subcat_id: request.payload.subcat_id,
					inStock: request.payload.inStock,
					seller: request.payload.seller,
					stars: request.payload.stars,
					likes: request.payload.likes,
					total_reviews: request.payload.total_reviews,
					mrp: request.payload.mrp,
					discounted_price: request.payload.discounted_price,
					discount: request.payload.discount,
					highlights: request.payload.highlights,
					is_verified: request.payload.is_verified,
					sizes: request.payload.sizes
				};

				db.collection("products")
					.doc(request.payload.id)
					.set(newProduct, { merge: true })
					.then((res) => {
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
		path: "/api/category/{id}",
		config: {
			tags: ["api", "Categories"],
			description: "Get category by id",
			notes: "Use get method to get category by id",
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
					const category_doc = await db
						.collection("categories")
						.doc(id)
						.get();
					const category = {
						id: category_doc.id,
						...category_doc.data(),
						subcategories: []
					};

					const subcat_snapshot = await db
						.collection("categories")
						.doc(category_doc.id)
						.collection("subcategories")
						.get();
					subcat_snapshot.forEach((subcat) => {
						category.subcategories.push({
							id: subcat.id,
							...subcat.data(),
							sub_subcategories: []
						});
					});

					for (var subindex in category.subcategories) {
						const sub_subcat_snapshot = await db
							.collection("categories")
							.doc(category.id)
							.collection("subcategories")
							.doc(category.subcategories[subindex].id)
							.collection("sub-subcategories")
							.get();
						sub_subcat_snapshot.forEach((subsubcat) => {
							category.subcategories[subindex].sub_subcategories.push({
								id: subsubcat.id,
								...subsubcat.data()
							});
						});
					}

					return resolve({
						status: "success",
						message: "Category fetched successfully",
						category
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
						categories.push({ id: doc.id, ...doc.data(), subcategories: [] });
					});

					for (var cat in categories) {
						const subcat_snapshot = await db
							.collection("categories")
							.doc(categories[cat].id)
							.collection("subcategories")
							.get();
						subcat_snapshot.forEach((subcat) => {
							categories[cat].subcategories.push({
								id: subcat.id,
								...subcat.data(),
								sub_subcategories: []
							});
						});

						for (var subindex in categories[cat].subcategories) {
							const sub_subcat_snapshot = await db
								.collection("categories")
								.doc(categories[cat].id)
								.collection("subcategories")
								.doc(categories[cat].subcategories[subindex].id)
								.collection("sub-subcategories")
								.get();
							sub_subcat_snapshot.forEach((subsubcat) => {
								categories[cat].subcategories[subindex].sub_subcategories.push({
									id: subsubcat.id,
									...subsubcat.data()
								});
							});
						}
					}

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
			tags: ["api", "Subcategories"],
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
		method: "GET",
		path: "/api/category/{id}/subcategories/{subcat_id}",
		config: {
			tags: ["api", "Subcategories"],
			description: "Get subcategory by id",
			notes: "Use get method to get subcategory by id",
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.id;
				try {
					const subcategory_doc = await db
						.collection("categories")
						.doc(id)
						.collection("subcategories")
						.doc(request.params.subcat_id)
						.get();

					const subcategory = {
						id: subcategory_doc.id,
						...subcategory_doc.data(),
						sub_subcategories: []
					};
					const sub_subcat_snapshot = await db
						.collection("categories")
						.doc(id)
						.collection("subcategories")
						.doc(request.params.subcat_id)
						.collection("sub-subcategories")
						.get();
					sub_subcat_snapshot.forEach((subsubcat) => {
						subcategory.sub_subcategories.push({
							id: subsubcat.id,
							...subsubcat.data()
						});
					});

					return resolve({
						status: "success",
						message: "Subcategories fetched successfully",
						subcategory
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
			tags: ["api", "Subcategories"],
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
			tags: ["api", "Subcategories"],
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
			tags: ["api", "Subcategories"],
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
		path: "/api/category/{id}/subcategories/{subcat_id}/subsubcategories",
		config: {
			tags: ["api", "Sub Subcategories"],
			description: "Get sub-subcategories",
			notes: "Use get method to get all sub-subcategories",
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.id;
				try {
					const sub_subcategories_snapshot = await db
						.collection("categories")
						.doc(id)
						.collection("subcategories")
						.doc(request.params.subcat_id)
						.collection("sub-subcategories")
						.get();
					const sub_subcategories = [];

					sub_subcategories_snapshot.forEach((doc) => {
						sub_subcategories.push({ id: doc.id, ...doc.data() });
					});

					return resolve({
						status: "success",
						message: "Sub-subcategories fetched successfully",
						sub_subcategories
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
		path:
			"/api/category/{id}/subcategories/{subcat_id}/subsubcategories/{sub_subcat_id}",
		config: {
			tags: ["api", "Sub Subcategories"],
			description: "Get sub-subcategory by id",
			notes: "Use get method to get sub-subcategory by id",
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string(),
					sub_subcat_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const id = request.params.id;
				try {
					const sub_subcategories_doc = await db
						.collection("categories")
						.doc(id)
						.collection("subcategories")
						.doc(request.params.subcat_id)
						.collection("sub-subcategories")
						.doc(request.params.sub_subcat_id)
						.get();
					const sub_subcategory = {
						id: sub_subcategories_doc.id,
						...sub_subcategories_doc.data()
					};

					return resolve({
						status: "success",
						message: "Sub-subcategory fetched successfully",
						sub_subcategory
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
		path: "/api/category/{id}/subcategories/{subcat_id}/subsubcategories",
		config: {
			tags: ["api", "Sub Subcategories"],
			description: "Upload sub-subcategory data",
			notes: "Upload sub-subcategory data",
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string()
				}),
				payload: {
					sub_subcategory_name: Joi.string()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const newSubSubcategory = {
					sub_subcategory_name: request.payload.sub_subcategory_name
				};

				try {
					await db
						.collection("categories")
						.doc(request.params.id)
						.collection("subcategories")
						.doc(request.params.subcat_id)
						.collection("sub-subcategories")
						.add(newSubSubcategory);
					return resolve({ message: "Sub-subcategory added successfully!" });
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
		path:
			"/api/category/{id}/subcategories/{subcat_id}/subsubcategories/{subsubcat_id}",

		config: {
			tags: ["api", "Sub Subcategories"],
			description: "Update sub-subcategory data",
			notes: "Update sub-subcategory data by id",
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			},
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string(),
					subsubcat_id: Joi.string()
				}),
				payload: {
					sub_subcategory_name: Joi.string().optional()
				}
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				const newSubSubcategory = {
					sub_subcategory_name: request.payload.sub_subcategory_name
				};

				try {
					await db
						.collection("categories")
						.doc(request.params.id)
						.collection("subcategories")
						.doc(request.params.subcat_id)
						.collection("sub-subcategories")
						.doc(request.params.subsubcat_id)
						.set(newSubSubcategory, { merge: true })
						.then((res) => {
							return resolve({
								message: "Sub-subcategory edited successfully"
							});
						})
						.catch((err) => {
							console.log(err.message);
							return reject(err);
						});
				} catch (err) {
					console.log(err.message);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path:
			"/api/category/{id}/subcategories/{subcat_id}/subsubcategories/{subsubcat_id}",
		config: {
			tags: ["api", "Sub Subcategories"],
			description: "Delete category's data by id",
			notes: "Delete category",
			validate: {
				params: Joi.object({
					id: Joi.string(),
					subcat_id: Joi.string(),
					subsubcat_id: Joi.string()
				})
			},
			handler: async (request, reply) => {
				let pr = async (resolve, reject) => {
					const id = request.params.id;

					try {
						await db
							.collection("categories")
							.doc(request.params.id)
							.collection("subcategories")
							.doc(request.params.subcat_id)
							.collection("sub-subcategories")
							.doc(request.params.subsubcat_id)
							.delete();

						return resolve({
							status: "success",
							message: "Sub subcategory deleted successfully!"
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
					quantity: Joi.string(),
					selected_size: Joi.string().optional()
				},
				params: Joi.object({
					user_id: Joi.string()
				})
			}
		},
		handler: async (request, reply) => {
			let pr = async (resolve, reject) => {
				try {
					request.payload.selected_size
						? await db
								.collection("cart")
								.doc(request.params.user_id)
								.collection("items")
								.doc(request.payload.product_id)
								.set({
									quantity: request.payload.quantity,
									selected_size: request.payload.selected_size
								})
						: await db
								.collection("cart")
								.doc(request.params.user_id)
								.collection("items")
								.doc(request.payload.product_id)
								.set({
									quantity: request.payload.quantity,
									selected_size: "NA"
								});
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
					quantity: Joi.string().optional(),
					selected_size: Joi.string().optional()
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
						.set(
							{
								quantity: request.payload.quantity,
								selected_size: request.payload.selected_size
							},
							{ merge: true }
						);
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
	},

	{
		method: "GET",
		path: "/api/offer-categories",
		config: {
			tags: ["api", "Offer Categories"],
			description: "Get all offer-categories",
			notes: "Use get method to get all offer-categories"
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				try {
					const offerCategoriesSnapshot = await db
						.collection("offer-categories")
						.get();
					const offerCategories = [];
					offerCategoriesSnapshot.forEach((doc) => {
						offerCategories.push({ id: doc.id, ...doc.data() });
					});

					return resolve({
						status: "success",
						message: "Offer Categories fetched successfully",
						data: offerCategories
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
		path: "/api/offer-categories",
		config: {
			tags: ["api", "Offer Categories"],
			description: "Add a new offer category",
			notes:
				"Post the required offer category details to add a new offer category",
			validate: {
				payload: {
					category_type: Joi.string()
				}
			}
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				var newOfferCategory = {
					category_type: request.payload.category_type
				};

				try {
					await db.collection("offer-categories").add(newOfferCategory);
					return resolve({ message: "Offer category added successfully!" });
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
		path: "/api/offer-category/{id}",
		config: {
			tags: ["api", "Offer Categories"],
			description: "Update a offer category data by it's ID",
			notes: "Update offer category data using offer category ID",
			validate: {
				payload: {
					category_type: Joi.string().optional()
				},
				params: Joi.object({
					id: Joi.string()
				})
			},
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			}
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				const updatedOfferCategory = {
					category_type: request.payload.category_type
				};

				const offerCategoryId = request.params.id;

				try {
					await db
						.collection("offer-categories")
						.doc(offerCategoryId)
						.set(updatedOfferCategory, {
							merge: true
						});

					return resolve({ message: "Offer category edited successfully" });
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/offer-category/{id}",
		config: {
			tags: ["api", "Offer Categories"],
			description: "Delete offerCategory data by ID",
			notes: "Delete offerCategory data using offerCategory ID",
			validate: {
				params: Joi.object({
					id: Joi.string()
				})
			},
			handler: async (request, h) => {
				let pr = async (resolve, reject) => {
					const offerCategoryId = request.params.id;

					try {
						await db
							.collection("offer-categories")
							.doc(offerCategoryId)
							.delete();
						return resolve({
							status: "success",
							message: "Offer category deleted successfully!"
						});
					} catch (err) {
						console.log(err.message);
						return reject(err);
					}
				};
				return new Promise(pr);
			}
		}
	},
	{
		method: "GET",
		path: "/api/offers",
		config: {
			tags: ["api", "offers"],
			description: "Get all offers",
			notes: "Use get method to get all offers"
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				try {
					const offersSnapshot = await db.collection("offers").get();
					const offers = [];
					offersSnapshot.forEach((doc) => {
						offers.push({ id: doc.id, ...doc.data() });
					});

					return resolve({
						status: "success",
						message: "Offers fetched successfully",
						data: offers
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
		path: "/api/offers/{id}",
		config: {
			tags: ["api", "offers"],
			description: "Get offer by id",
			notes: "Use get method to get a particular offer by id"
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				try {
					const id = request.params.id;
					const offersDoc = await db
						.collection("offers")
						.doc(id)
						.get();
					const offer = { id: offersDoc.id, ...offersDoc.data() };

					return resolve({
						status: "success",
						message: "Offer fetched successfully",
						data: offer
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
		path: "/api/offers",
		config: {
			tags: ["api", "offers"],
			description: "Add a new offer",
			notes: "Post the required offer details to add a new offer",
			validate: {
				payload: {
					offer_description: Joi.string(),
					offer_price: Joi.number(),
					offer_code: Joi.string(),
					offer_category_id: Joi.string(),
					original_price: Joi.number(),
					saved_amount: Joi.number(),
					redeemed_count: Joi.number(),
					max_redeems: Joi.string(),
					valid_from: Joi.string(),
					valid_till: Joi.string(),
					validity: Joi.string()
				}
			}
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				var newOffer = {
					offer_description: request.payload.offer_description,
					offer_price: request.payload.offer_price,
					offer_code: request.payload.offer_code,
					offer_category_id: request.payload.offer_category_id,
					original_price: request.payload.original_price,
					saved_amount: request.payload.saved_amount,
					redeemed_count: request.payload.redeemed_count,
					max_redeems: request.payload.max_redeems,
					valid_from: request.payload.valid_from,
					valid_till: request.payload.valid_till,
					validity: request.payload.validity
				};

				try {
					await db.collection("offers").add(newOffer);
					return resolve({ message: "Offer added successfully!" });
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
		path: "/api/offers/{id}",
		config: {
			tags: ["api", "offers"],
			description: "Update a offer data by it's ID",
			notes: "Update offer data using offer ID",
			validate: {
				payload: {
					offer_description: Joi.string().optional(),
					offer_price: Joi.number().optional(),
					offer_code: Joi.string().optional(),
					offer_category_id: Joi.string().optional(),
					original_price: Joi.number().optional(),
					saved_amount: Joi.number().optional(),
					redeemed_count: Joi.number().optional(),
					max_redeems: Joi.string().optional(),
					valid_from: Joi.string().optional(),
					valid_till: Joi.string().optional(),
					validity: Joi.string().optional()
				},

				params: Joi.object({
					id: Joi.string()
				})
			},
			cors: {
				origin: ["*"],
				additionalHeaders: ["cache-control", "x-requested-with"]
			}
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				const updatedOffer = {
					offer_description: request.payload.offer_description,
					offer_price: request.payload.offer_price,
					offer_code: request.payload.offer_code,
					offer_category_id: request.payload.offer_category_id,
					original_price: request.payload.original_price,
					saved_amount: request.payload.saved_amount,
					redeemed_count: request.payload.redeemed_count,
					max_redeems: request.payload.max_redeems,
					valid_from: request.payload.valid_from,
					valid_till: request.payload.valid_till,
					validity: request.payload.validity
				};

				const offerId = request.params.id;

				try {
					await db
						.collection("offers")
						.doc(offerId)
						.set(updatedOffer, {
							merge: true
						});

					return resolve({ message: "Offer edited successfully" });
				} catch (err) {
					console.log(err.message);
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},
	{
		method: "DELETE",
		path: "/api/offers/{id}",
		config: {
			tags: ["api", "offers"],
			description: "Delete offer data by ID",
			notes: "Delete offer data using offer ID",
			validate: {
				params: Joi.object({
					id: Joi.string()
				})
			},
			handler: async (request, h) => {
				let pr = async (resolve, reject) => {
					const offerId = request.params.id;

					try {
						await db
							.collection("offers")
							.doc(offerId)
							.delete();
						return resolve({
							status: "success",
							message: "Offer deleted successfully!"
						});
					} catch (err) {
						console.log(err.message);
						return reject(err);
					}
				};
				return new Promise(pr);
			}
		}
	},
	{
		method: "POST",
		path: "/api/offers/redeem-coupon-code",
		config: {
			tags: ["api", "offers"],
			description: "Redeem coupon code",
			notes: "Post the required offer details to get a new coupon",
			validate: {
				payload: {
					offer_id: Joi.string(),
					user_id: Joi.string(),
					date: Joi.number()
				}
			}
		},
		handler: async (request, h) => {
			let pr = async (resolve, reject) => {
				try {
					const offersDoc = await db
						.collection("offers")
						.doc(request.payload.offer_id)
						.get();
					const offer = { id: offersDoc.id, ...offersDoc.data() };
					console.log(offer);
					var redeemed_count = offer.redeemed_count;
					redeemed_count++;
					if (redeemed_count > offer.max_redeems) {
						return reject({
							message: "Max redeems for the offer have occured"
						});
					} else {
						await db
							.collection("redeemed-offers")
							.doc(request.payload.offer_id)
							.add({
								offer_id: request.payload.offer_id,
								user_id: request.payload.user_id,
								date: request.payload.date
							});
						await db
							.collection("offers")
							.doc(request.payload.offer_id)
							.set({ redeemed_count }, { merge: true });
						return resolve({
							message: "Coupon redeemed successfully!",
							newCoupon
						});
					}
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
		path: "/api/wishlist/{user_id}",
		config: {
			tags: ["api", "Wishlist"],
			description: "Get wishlist data by user id",
			notes: "Use get method to get wishlist data by user id",
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
					var wishlistDoc = await db
						.collection("wishlist")
						.doc(id)
						.get();

					let items = [];

					var itemsSnapshot = await db
						.collection("wishlist")
						.doc(id)
						.collection("items")
						.get();
					itemsSnapshot.forEach((doc) => {
						items.push({ id: doc.id });
					});

					var wishlist = { id: wishlistDoc.id, items: [] };

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
						wishlist.items.push(product_info);
					}
					console.log(wishlist);
					// result

					return resolve({
						status: "success",
						message: "Wishlist data fetched successfully",
						wishlist
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
		path: "/api/wishlist/{user_id}",
		config: {
			tags: ["api", "Wishlist"],
			description: "Add to wishlist",
			notes: "Send product details to add to wishlist",
			validate: {
				payload: {
					product_id: Joi.string()
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
						.set({ product_id: request.payload.product_id });
					return resolve({ message: "Product added to wishlist successfully" });
				} catch (err) {
					return reject(err);
				}
			};
			return new Promise(pr);
		}
	},

	{
		method: "DELETE",
		path: "/api/wishlist/{user_id}/by-product-id/{product_id}",
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

						resolve({ message: "Item deleted from wishlist successfully" });
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
