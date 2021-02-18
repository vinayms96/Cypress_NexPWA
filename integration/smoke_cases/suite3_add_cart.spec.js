/// <reference types="cypress" />

import ListingPage from "../PageModels/ListingPage"
import Notification from "../PageModels/Notification"
import ProductPage from "../PageModels/ProductPage"

describe('Add to cart from different pages', () => {
    let listingPage, productPage, notification
    let site

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage
        notification = new Notification

        // Fetch the url from JSON file
        cy.fixture('site_details').then($data => {
            site = $data
        })
    })

    beforeEach(() => {
        cy.visit(site.url)
        cy.viewport(1366,768)
    })

    /**
     * Click the first product in listing page
     * Verify the number of products displayed with the count
     */
    it('Add to cart from Product page', () => {
        cy.get('span').contains('Men').click()
        cy.url().should('include','/men.html')
        cy.title().should('eq', 'NexPWA | Men')

        cy.wait(1000)

        cy.get('.CategoryProductList ').find('li')
        .then($prods => {
            var randomNum = Math.floor(Math.random() * 5)
            cy.wrap($prods[randomNum]).scrollIntoView($prods[randomNum]).wait(1000).click()
        })

        cy.wait(1000)
        
        cy.get('.ProductActions').then($list => {
            if($list.get('.GroupedProductsItem')) {
                cy.log('List Found')
                productPage.get_group_options_qty().then($options => {
                    cy.wrap($options[0]).click()
                })
            }
            cy.get('.AddToCart').click()
        })
        cy.get('.Notification_type_success').find('p').should('have.text','Product added to cart!')
    });

})