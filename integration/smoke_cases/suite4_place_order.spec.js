/// <reference types="Cypress"/>

import ListingPage from "../PageModels/ListingPage"
import ProductPage from "../PageModels/ProductPage"
import Notification from "../PageModels/Notification"
import Header from "../PageModels/Header"
import Minicart from "../PageModels/Minicart"
import CheckoutPage from "../PageModels/CheckoutPage"
import OrderSuccess from "../PageModels/OrderSuccess"

describe('Place Order Flow', () => {
    let listingPage, productPage, notification, header, minicart, checkoutPage, orderSuccess
    let site, user

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage
        notification = new Notification
        header = new Header
        minicart = new Minicart
        checkoutPage = new CheckoutPage
        orderSuccess = new OrderSuccess

        // Fetch the url from JSON file
        cy.fixture('site_details').then($data => {
            site = $data
        })
        cy.fixture('profile').then($data => {
            user = $data
        })
    })

    beforeEach(() => {
        cy.visit(site.url)
        cy.viewport(1366, 768)

        // Navigate to the listing page and verify
        cy.get('span').contains('Men').click()
        cy.url().should('include', '/men.html')
        cy.title().should('eq', 'NexPWA | Men')
    })

    it('Place an Order', () => {
        /**
         * Click the first product in listing page
         * Verify the number of products displayed with the count
         */
        cy.wait(2000)
        listingPage.get_product_card_list()
        .then($prods => {
            var randomNum = Math.floor(Math.random() * 5)
            cy.wrap($prods[randomNum]).scrollIntoView($prods[randomNum]).wait(1000).click()
        })
        cy.wait(1000)
        
        // Adding product to cart
        cy.get('.ProductActions').then($list => {
            if($list.get('.GroupedProductsItem')) {
                cy.log('List Found')
                productPage.get_group_options_qty().then($options => {
                    cy.wrap($options[0]).click()
                })
            }
            cy.get('.AddToCart').click()
        })
        notification.success_msg_ele().should('have.text','Product added to cart!')

        // Logging in before going to Checkout
        cy.check_login(user.email, user.password)

        // Navigating to Checkout page and validating
        cy.wait(2000)
        header.click_minicart_btn()
        minicart.get_minicart_title().should('have.text', 'Shopping Cart')
        minicart.click_checkout_btn()
        cy.url().should('include', '/checkout')

        // Navigating to Billing Page
        cy.wait(1000)
        checkoutPage.click_proceed_billing()

        // Placing order through Cash On Delivery
        cy.wait(1000)
        checkoutPage.get_payment_methods().each($method => {
            cy.wrap($method).invoke('text').then($name => {
                if($name.toString() == 'Cash On Delivery') {
                    cy.wrap($method).click()
                    checkoutPage.click_place_order()
                }
            })
        })

        // Verify the Success message
        cy.wait(1000)
        orderSuccess.get_order_id().find('a').invoke('text')
        .then($order_id => {
            cy.log($order_id)
        })
        orderSuccess.get_order_id().invoke('text').then($msg => {
            cy.log($msg)
            expect($msg).to.contains('placed successfully')
        })
    });
})