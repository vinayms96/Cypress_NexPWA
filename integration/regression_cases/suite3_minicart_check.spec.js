/// <reference types="Cypress" />

import ListingPage from "../../support/PageModels/ListingPage"
import ProductPage from "../../support/PageModels/ProductPage"
import Notification from "../../support/PageModels/Notification"
import Header from "../../support/PageModels/Header"
import Minicart from "../../support/PageModels/Minicart"

describe('Test Minicart Details', () => {
    let listingPage, productPage, notification, header, minicart
    let site
    let product_name, product_lowPrice
    let pdp_swatch = [], pdp_qty
    let mini_prod_name, mini_lowPrice, swatch = [], mini_qty

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage
        notification = new Notification
        header = new Header
        minicart = new Minicart

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
            product_name = $name.text()
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

        // get_product_swatches()
    }

    /**
     * Fetching the Product details in Minicart
     * Verifying the product details with Product page details
     */
    it('Verify product details in minicart', () => {
        // Add product to cart function call
        addProduct()

        // Navigating to Checkout page and validating
        header.click_minicart_btn()
        minicart.get_minicart_title().should('have.text', 'Shopping Cart')

        // Fetching product details and verifying
        minicart.get_products_list().each($items => {
            cy.wrap($items).find('p[itemprop=name] a').then($products => {
                mini_prod_name = $products.text()
                expect(mini_prod_name).to.be.equal(product_name)
            })
            cy.wrap($items).find('.CartItem-Price data').then($products => {
                mini_lowPrice = $products.text()
                expect(mini_lowPrice).to.be.equal(product_lowPrice)
            })
            // cy.wrap($items).find('.CustomOption .Value').each($swatches => {
            //     swatch.push($swatches.text().trim())
            // })
            cy.wrap($items).find('#item_qty').invoke('attr', 'value').then($value => {
                mini_qty = $value
            })
            cy.wrap('$items').then(_$check => {
                // expect(swatch).to.deep.equal(pdp_swatch)
                expect(mini_qty).to.be.equal(pdp_qty)
            })
        })
    })
})