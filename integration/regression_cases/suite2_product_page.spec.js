/// <reference types="Cypress" />

import ListingPage from "../PageModels/ListingPage"
import ProductPage from "../PageModels/ProductPage"

describe('Test Product Page Functionality', () => {
    let listingPage, productPage
    let site

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage

        // Fetch the url from JSON file
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
     * Navigate to PDP and verify if clicked on correct product
     */
    var listing_product_name
    var listing_product_lowPrice, listing_product_highPrice
    it('Verify product name & price in PDP', () => {

        // Fetching the Product name and price in Listing page
        cy.wait(2000)
        listingPage.get_product_card_list()
        .then($prods => {
            var randomNum = Math.floor(Math.random() * 8)

            cy.wrap($prods[randomNum]).find('p[itemprop=name]').then($name => {
                listing_product_name = $name.text()
            })
            cy.wrap($prods[randomNum]).find('span[itemprop=lowPrice]').then($lowPrice => {
                listing_product_lowPrice = $lowPrice.text()
            })
            cy.wrap($prods[randomNum]).find('del[itemprop=highPrice]').then($highPrice => {
                listing_product_highPrice = $highPrice.text()
            })

            cy.wrap($prods[randomNum]).scrollIntoView($prods[randomNum]).wait(1000).click()
        })

        // Verifying the Product name and price in PDP
        productPage.get_product_name().then($name => {
            expect($name.text()).to.be.equal(listing_product_name)
        })
        productPage.get_product_lowPrice().then($lowPrice => {
            expect($lowPrice.text()).to.be.equal(listing_product_lowPrice)
        })
        productPage.get_product_highPrice().then($highPrice => {
            expect($highPrice.text()).to.be.equal(listing_product_highPrice)
        })
    });

    /**
     * Select the swatches and verifying the selected values
     */
/*    var swatch
    it('Verify product swatch selection', () => {
        cy.wait(5000)

        listingPage.get_product_card_list()
            .then($list => {
                // Clicking on the product card
                cy.wrap($list[3]).click()
            })

        productPage.get_product_options().then($ele => {
            if (expect($ele).to.exist) {
                // Selecting the Swatches
                cy.get('.ProductActions-Attributes > article:nth-child(1) > div > div > a:nth-child(1)').click()
                cy.get('.ProductActions-Attributes > article:nth-child(2) > div > div > a:nth-child(1)').click()

                // Verifying the swatches selected
                cy.get('article:nth-child(1) > .ProductConfigurableAttributes-ExpandableContentButton > span:nth-child(2)').then($swatch => {
                    swatch = $swatch.text()
                    cy.get('.ProductConfigurableAttributes-SwatchList > a:nth-child(1) > data').invoke('attr', 'title').should('equal', swatch)
                })
                cy.get('article:nth-child(2) > .ProductConfigurableAttributes-ExpandableContentButton > span:nth-child(2)').then($swatch => {
                    swatch = $swatch.text()
                    cy.get('.ProductConfigurableAttributes-SwatchList > a:nth-child(1) > span').invoke('attr', 'title').should('equal', swatch)
                })
            } else {
                expect(true).to.be.equal(false)
            }
        })
    });
*/
})