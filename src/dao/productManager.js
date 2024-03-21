import { productModel } from "./models/product.model.js";
export default class productManager {

    async getAllProducts(queryOptions) {
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

    async updateProductById(id, product) {
        const result = await productModel.updateOne({ _id: id }, product);
        return result
    };

    async getProductById(id) {
        const product = await productModel.findById(id);
        return product;
    };
    
    async deleteProductById(id) {
        const result = await productModel.findByIdAndDelete(id)
        return result
    };

}


