/// <reference types="Cypress"/>

import ListingPage from '../PageModels/ListingPage'

describe('Test Listing Page Functionality', () => {
    let listingPage
    let site

    before(() => {
        listingPage = new ListingPage

        // Fetching the data from JSON file
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

    // Validate the product count
    let product_count
    var validate_count = () => {
        cy.wait(1000)
        listingPage.get_product_card_list()
            .then($list => {
                product_count = $list.length
                listingPage.get_product_item_count().invoke('text').should('include', product_count)
            })
    }

    /**
     * Apply filters and count the number of products displayed with count
     */
    /*    var product_count
        it('Validate the product count', () => {
            // Verify the number of products displayed with the count
            listingPage.get_pagination_ele().scrollIntoView()
            cy.wait(6000)
            listingPage.get_product_card_list()
                .then($list => {
                    product_count = $list.length
                    listingPage.get_product_item_count().invoke('text').should('include', product_count)
                })
        }); */

    /**
     * Apply filters and verify the product_count
     */
    it('Applying filters and verifying the results', () => {
        cy.scrollTo('top')
        cy.wait(2000)

        // Apply first filter
        listingPage.get_filter_list().then($list => {
            listingPage.get_swatch_filters($list).find('a').then($value => {
                cy.wrap($value[0]).click()
                validate_count()
                listingPage.click_reset_filter()
            })
            listingPage.get_swatch_dropdownList($list).find('input').then($value => {
                cy.wrap($value[0]).check({ force: true })
                validate_count()
                listingPage.click_reset_filter()
            })
        })
    })
})