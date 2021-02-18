/// <reference types="Cypress" />

import ListingPage from "../PageModels/ListingPage"
import ProductPage from "../PageModels/ProductPage"
import Notification from "../PageModels/Notification"
import Header from "../PageModels/Header"
import Minicart from "../PageModels/Minicart"
import CartPage from "../PageModels/CartPage"

describe('Test the Cart page details', () => {
    let listingPage, productPage, notification, header, minicart, cartPage
    let site
    let product_name = [], product_lowPrice
    let pdp_swatch = [], pdp_qty
    let cart_product_name, cart_swatch = [], cart_subtotal, summmary_subtotal

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage
        notification = new Notification
        header = new Header
        minicart = new Minicart
        cartPage = new CartPage

        cy.fixture('site_details').then($data => {
            site = $data
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

    /**
    * Fetching the Product name and price in PDP
    */
    var get_name_price_qty = function () {
        productPage.get_product_name().then($name => {
            product_name.push($name.text())
        })
        productPage.get_product_lowPrice().then($lowPrice => {
            product_lowPrice = $lowPrice.text()
        })
        productPage.get_qty_added().invoke('attr', 'value').then($ele => {
            pdp_qty = $ele
        })
    }

    /**
     * Fetching the swatches selected
     */
    var get_product_swatches = function () {
        cy.get('article:nth-child(1) > .ProductConfigurableAttributes-ExpandableContentButton > span:nth-child(2)').then($swatch => {
            pdp_swatch.push($swatch.text())
        })
        cy.get('article:nth-child(2) > .ProductConfigurableAttributes-ExpandableContentButton > span:nth-child(2)').then($swatch => {
            pdp_swatch.push($swatch.text())
        })
    }

    /**
     * Click the first product in listing page
     * Add product to Cart
     */
    var addProduct = function () {
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

        get_name_price_qty()

        // get_product_swatches_qty()

        // Navigating to Checkout page and validating
        header.click_minicart_btn()
        minicart.get_minicart_title().should('have.text', 'Shopping Cart')

        cartPage.click_view_cart()
        cy.url().should('include', '/cart')
        cartPage.get_cart_header().then($head => {
            expect($head.text()).to.be.equal('Shopping cart')
        })
    }

    /**
     * Check the product details added to cart
     */
    it('Check the Cart product details', () => {
        // Add product to cart function call
        addProduct()

        // Verifying the Product Name, Price and Qty added to Cart
        cartPage.get_product_list().each((_$el, index, $items) => {
            cy.wrap($items).find('p[itemprop="name"] a').then($name => {
                cart_product_name = $name.text()
                expect(cart_product_name).to.be.equal(product_name[index])
            })
            // cy.wrap($items).find('span[class=Value]').each($swatch => {
            //     cart_swatch.push($swatch.text().trim())
            // })
            // cy.wrap($items).then(_$check => {
            //     expect(cart_swatch).to.deep.equal(pdp_swatch)
            // })
            cy.wrap($items).get('.CartPage-Static .CartItem-Qty').find('#item_qty')
            .invoke('attr', 'value').then($quantity => {
                expect($quantity).to.be.equal(pdp_qty)
            })
            cy.wrap($items).get('.CartPage-Static .CartItem-Price').find('data').then($low_price => {
                expect($low_price.text()).to.be.equal(product_lowPrice)
            })
        })
    });
})