import { Basket } from './Basket';

export class Fruit {
  private readonly basket: Basket;

  constructor(basket: Basket) {
    this.basket = basket;
  }
}
