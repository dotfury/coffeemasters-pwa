import Menu from './Menu.js';

const Order = {
    cart: [],
    openDB: async () => {
      return await idb.openDB('cm-storage', 1, {
        async upgrade(db) {
          // create data store
          await db.createObjectStore('order');
        }
      })
    },
    load: async () => {
      const db = await Order.openDB();
      const cart = await db.get('order', 'cart');

      if (cart) {
        try {
          Order.cart = JSON.parse(cart);
          Order.render();
        } catch (e) {
          db.clear('order');
        }
      }
    },
    save: async () => {
      const db = await Order.openDB();
      await db.put('order', JSON.stringify(Order.cart), 'cart');
    },
    loadWS: () => {
        if (localStorage.getItem('cm-cart')) {
            try {
                Order.cart = JSON.parse(localStorage.getItem('cm-cart'));
                Order.render();
            } catch(e) {
                localStorage.removeItem('cm-cart');
            }
        }
    },
    saveWS: () => {
        localStorage.setItem('cm-cart', JSON.stringify(Order.cart));
    },
    add: async id => {
        const product = await Menu.getProductById(id);
        const results = Order.cart.filter(prodInCart => prodInCart.product.id==id);
        if (results.length == 1) {
            results[0].quantity++;
        } else {
            Order.cart.push({product, quantity: 1})
        }
        Order.render();
    },
    remove: (id) => {
        Order.cart = Order.cart.filter(prodInCart => prodInCart.product.id!=id);
        Order.render();
    },
    place: () => {
        alert("Your order will be ready under the number " + 
            parseInt(Math.random()*100));
        Order.cart = [];
        Order.render();
    },
    render: () => {
        Order.save();
        if (Order.cart.length==0) {
            document.querySelector("#order").innerHTML = `
                <p class="empty">Your order is empty</p>
            `;
        } else {
            let html = `
                <h2>Your Order</h2>
                <ul>
            `;
            let total = 0;
            for (let prodInCart of Order.cart) {
                html += `
                    <li>
                        <p class='qty'>${prodInCart.quantity}x</p>
                        <p class='name'>${prodInCart.product.name}</p>
                        <p class='price'>$${prodInCart.product.price.toFixed(2)}</p>
                        <p class='toolbar'>
                            <span class="navlink material-symbols-outlined" onclick="Order.remove(${prodInCart.product.id})">
                                delete
                            </span>
                        </p>
                    </li>
                `;
                total += prodInCart.quantity * prodInCart.product.price;
            }
            html += `
                        <li>
                            <p class='total'>Total</p>
                            <p class='price-total'>$${total.toFixed(2)}</p>
                        </li>
                    </ul>
                     <button onclick="Order.place()">Place Order</button>
                    `;
            document.querySelector("#order").innerHTML = html;
        }
    }
}
window.Order = Order; // make it "public"
export default Order;