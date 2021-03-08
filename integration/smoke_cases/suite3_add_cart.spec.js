/// <reference types="cypress" />

import ListingPage from "../../support/PageModels/ListingPage"
import Notification from "../../support/PageModels/Notification"
import ProductPage from "../../support/PageModels/ProductPage"
import Header from "../../support/PageModels/Header"
import SearchListingpage from "../../support/PageModels/SearchListingpage"

describe('Add to cart from different pages', () => {
    let productPage, notification, header, searchListing, listingPage
    let sugg_prod_name, sugg_prod_lowPrice, sugg_prod_highPrice
    let site

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage
        notification = new Notification
        header = new Header
        searchListing = new SearchListingpage

        // Fetch the url from JSON file
        cy.fixture('site_details').then($data => {
            site = $data
        })
    })

    beforeEach(() => {
        cy.visit(site.url)
        cy.viewport(1366, 768)
    })

    // Adding product to cart from PDP
    var add_product_to_cart = () => {
        cy.wait(1000)
        cy.get('.ProductActions').then($list => {
            // cy.wrap($list).find('.ProductActions-GroupedItems ul').children().then($childs => {
            //     cy.log('Check: '+$childs.length)
            // })
            if (typeof $list.find('.GroupedProductsItem') !== 'object') {
                productPage.get_group_options_qty().then($options => {
                    cy.wrap($options[0]).click()
                })
            }
            cy.get('.AddToCart').click()
        })
        notification.success_msg_ele().should('have.text', 'Product added to cart!')
    }

    // Fetch the product details from Search Suggestions
    var get_suggested_prod_details = ($list, randomNum) => {
        cy.wrap($list[randomNum]).scrollIntoView().find('h4').then($name => {
            sugg_prod_name = $name.text()
            cy.log(sugg_prod_name)
        })
        cy.wrap($list[randomNum]).find('span[itemprop=lowPrice]').then($lowPrice => {
            sugg_prod_lowPrice = $lowPrice.text()
            cy.log(sugg_prod_lowPrice)
        })
        cy.wrap($list[randomNum]).find('del[itemprop=highPrice]').then($highPrice => {
            sugg_prod_highPrice = $highPrice.text()
            cy.log(sugg_prod_highPrice)
        })
    }

    /**
     * Add product to cart by navigating from Listing page
     */
    it('Add to cart navigating from Listing page', () => {
        cy.wait(1000)
        cy.get('span').contains('Men').click()
        cy.url().should('include', '/men.html')
        cy.title().should('eq', 'NexPWA | Men')

        cy.wait(1000)

        listingPage.get_product_card_list().then($prods => {
            var randomNum = Math.floor(Math.random() * $prods.length)
            cy.wrap($prods[randomNum]).scrollIntoView().wait(1000).click()
        })

        add_product_to_cart()
    });

    /**
     * Add product to Cart by navigating from Search Suggestion
     */
    it('Add to cart navigating from Search Suggestion List', () => {
        header.set_searchBar_suggestion('men')
        header.get_list_of_suggestion().then($list => {
            let randomProd = Math.floor(Math.random() * $list.length)

            // Fetch the product details before clicking
            get_suggested_prod_details($list, randomProd)

            // Clicking on one of the suggestion
            cy.wrap($list[randomProd]).click()

            add_product_to_cart()
        })
    });

    /**
     * Adding product to cart by navigating from Search Listing page
     */
    it('Add to cart navigating from Search Listing page', () => {
        header.set_searchBar('men')

        cy.wait(1000)

        searchListing.get_product_list().then($prods => {
            var randomNum = Math.floor(Math.random() * $prods.length)
            cy.wrap($prods[randomNum]).scrollIntoView().wait(1000).click()
            // cy.wrap($prods[0]).scrollIntoView().wait(1000).click()
        })

        add_product_to_cart()
    });

})