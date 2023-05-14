import fs from 'fs'

class ProductManager{
    #products
    #error
    #format
    constructor(path){
        this.path = path
        this.#products = []
        this.#error = undefined
        this.#format = 'utf-8'
    }

    #generateId = () => {
        return (this.#products.length === 0) ? 1 : this.#products[this.#products.length-1].id + 1
    }

    #validateProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock){
            this.#error = `[${title}]: Campo incompleto. Todos los campos son obligatorios.`
        }else{
            const found = this.#products.find(item => item.code === code)
            found ? (this.#error = `[${title}]: El code ya existía.`) : this.#error = undefined
        }
    }

    readProducts = async() => {
        if(fs.existsSync(this.path)){
            let lecture = await fs.promises.readFile(this.path, this.#format)
            return JSON.parse(lecture)
        }else{
            return []
        }
    }

    getProducts = async() => {
        let response = await this.readProducts()
        return console.log(response)
    }
    
    getProductById = async(id) => {
        let products = await this.readProducts()
        const product = products.find(item => item.id === id)
        if (!product) console.log(`ID[${id}] not found`) 
        else console.log(product)
    }
    
    addProducts = async(title, description, price, thumbnail, code, stock) => {
        this.#validateProduct(title, description, price, thumbnail, code, stock)
        this.#error === undefined ? this.#products.push({id: this.#generateId(), title, description, price, thumbnail, code, stock}) : console.log(this.#error)
        await fs.promises.writeFile(this.path, JSON.stringify(this.#products, null, '\t'))
    }

    deleteProduct = async(id) => {
        let products = await this.readProducts()
        const product = products.find(item => item.id === id)
        if (!product) console.log(`El producto con ID[${id}] no existe.`)
        else{
            let filterProduct = products.filter(product => product.id != id)
            await fs.promises.writeFile(this.path, JSON.stringify(filterProduct, null, '\t'))
            return console.log(`El producto con ID[${id}] ha sido eliminado.`)
        }
    }

    updateProduct = async ({ id, ...producto }) => {
        let products = await this.readProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            console.log(`El producto con ID[${id}] no existe.`);
            return;
        }
        products[index] = { id, ...producto };
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, "\t")
        );
    };
}






