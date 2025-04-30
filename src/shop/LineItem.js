export default class LineItem {
    constructor(product, amount) {
        this.id = null;
        this.product = product;
        this.amount = amount;
        this.price = this.product.price;
        this.owner = null;
    }

    remove() {
        this.owner.removeLineItem(this);
    }

    setAmount(amount) {
        this.amount = amount;
    }
}