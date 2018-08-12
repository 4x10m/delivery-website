function renderPaypal() {
  document.getElementById("paypal-button").innerHTML = "";
paypal.Button.render({
  // Configure environment
  env: 'sandbox',
  client: {
    sandbox: 'Ac1ZEEdVy64PyHFq0Coifrc4N39ywNTTFLpxXFhQX-jTBm-sRIvhcp8HArhO1jTy5KXvton1We5EiJ9F',
    production: 'demo_production_client_id'
  },
  // Customize button (optional)
  locale: 'fr_FR',
  style: {
    size: 'small',
    color: 'gold',
    shape: 'pill',
  },
  // Set up a payment
  payment: function (data, actions) {
    return actions.payment.create({
      transactions: [{
        amount: {
          total: order.totalPrice,
          currency: 'EUR',
          details: {
            subtotal: order.totalPrice,
            tax: '0.00',
            shipping: '0.00',
            handling_fee: '0.00',
            shipping_discount: '-0.00',
            insurance: '0.00'
          }
        },
        custom: '',
        description: 'Paiement de votre livraison d\'objet',
        item_list: {
          items: [
            {
              name: 'Livraison d\'objet',
              description: "Acheminement d'un objet selon les renseignements entrés dans le formulaire de commande.",
              quantity: '1',
              price: order.totalPrice,
              tax: '0.00',
              sku: '0.00',
              currency: 'EUR'
            }
          ]
        }
      }],
      note_to_payer: "N\'hésitez à nous contacter pour de plus ample information",
/*      "redirect_urls": {
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
      }*/
    });
  },
  // Execute the payment
  onAuthorize: function (data, actions) {
    return actions.payment.execute()
      .then(function () {
        order.paid = true;
        document.getElementById("paypal-button").innerHTML = "&#10004; Done";
      });
  }
}, '#paypal-button');
}