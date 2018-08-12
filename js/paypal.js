paypal.Button.render({
  // Configure environment
  env: 'sandbox',
  client: {
    sandbox: 'Ac1ZEEdVy64PyHFq0Coifrc4N39ywNTTFLpxXFhQX-jTBm-sRIvhcp8HArhO1jTy5KXvton1We5EiJ9F',
    production: 'demo_production_client_id'
  },
  // Customize button (optional)
  locale: 'en_US',
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
          total: '0.08',
          currency: 'EUR',
          details: {
            subtotal: '0.01',
            tax: '0.07',
            shipping: '0.00',
            handling_fee: '0.00',
            shipping_discount: '-0.00',
            insurance: '0.00'
          }
        },
        custom: '90048630024435',
        description: 'The payment transaction description.',
        item_list: {
          items: [
            {
              name: 'Transport',
              description: 'Brown hat.',
              quantity: '1',
              price: '0.01',
              tax: '0.07',
              sku: '0',
              currency: 'EUR'
            }
          ],
          shipping_address: {
            recipient_name: 'Brian Robinson',
            line1: '4th Floor',
            line2: 'Unit #34',
            city: 'San Jose',
            country_code: 'US',
            postal_code: '95131',
            phone: '011862212345678',
            state: 'CA'
          }
        }
      }],
      note_to_payer: 'Contact us for any questions on your order.',
      "redirect_urls": {
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
      }
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