import { productModel } from "../models/product_mongo.model.js";
export default class ProductManagerMongo {

    async getAll(queryOptions) {
        const { limit, page, category, sort } = queryOptions;    
        
        const searchQuery = {};
        if (category) {
            searchQuery.category = category;
        }
    
        const sortQuery = {};
        if (sort && sort.price) {
            sortQuery.price = sort.price;
        }    
        
        let products;
        try {
            products = await productModel.paginate(searchQuery, { 
                limit: limit || 10,  
                page: page || 1,     
                sort: sortQuery,
                lean: true
            });
        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
            throw error; 
        }
    
        return products;
    };
 
    async getById(id) {
        let product = await productModel.findById(id).lean();        
        return product
    };

    async saveProduct(product) {
        try {
            let newProduct = new productModel(product);
            let result = await newProduct.save();
            return result;
        } catch (error) {
            console.log('Error: ' + error);
            throw error;
        }
    };

    async updateProduct(id, product) {
        const result = await productModel.updateOne({ _id: id }, product);
        return result
    };

    async deleteProduct(id) {
        const result = await productModel.findByIdAndDelete(id)
        return result
    };
}