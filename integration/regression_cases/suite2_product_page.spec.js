/// <reference types="Cypress" />

import ListingPage from "../PageModels/ListingPage"
import ProductPage from "../PageModels/ProductPage"
import Notification from "../PageModels/Notification"
import Header from "../PageModels/Header"

describe('Test Product Page Functionality', () => {
    let listingPage, productPage, notification, header
    let site, user

    before(() => {
        listingPage = new ListingPage
        productPage = new ProductPage
        notification = new Notification
        header = new Header

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
     * Adding product to Wishlist as Guest User
     */
    it('Add product to Wishlist as Guest', () => {
        // Clicking on the product card
        cy.wait(2000)
        listingPage.get_product_card_list()
        .then($prods => {
            var randomNum = Math.floor(Math.random() * 8)
            cy.wrap($prods[randomNum]).scrollIntoView($prods[randomNum]).wait(1000).click()
        })

        productPage.get_wishlist_icon().children('button').first().then($ele => {
            cy.wrap($ele).invoke('attr','class').should('include','disabled')
        })
        productPage.get_wishlist_icon().children('button').first().click()

        notification.error_msg_ele().should('have.text','Please login to add to whishlist')
    });

    /**
     * Adding product to Wishlist as Logged in User
     */
    it('Add product to Wishlsit as Logged in User', () => {
        // Clicking on the product card
        cy.wait(2000)
        listingPage.get_product_card_list()
        .then($prods => {
            var randomNum = Math.floor(Math.random() * 8)
            cy.wrap($prods[randomNum]).scrollIntoView($prods[randomNum]).wait(1000).click()
        })

        // Logging in to the User Account
        header.click_account_btn()
        cy.get('.Overlay_isVisible').find('strong').should('have.text','Sign in to your account')
        cy.login(user.email, user.password)

        // Navigate to previous page
        cy.go('back')

        // Adding the product to Wishlist and verifying
        cy.wait(500)
        productPage.get_wishlist_icon().children('button').first().then($ele => {
            cy.wrap($ele).invoke('attr','class').should('not.include','disabled')
            cy.wrap($ele).invoke('attr','title').then($title => {expect($title).to.be.equal('Add to Wishlist')})
        })
        productPage.get_wishlist_icon().children('button').first().click()

        cy.wait(4000)
        notification.success_msg_ele().should('have.text','Product has been added to your Wish List!')

        // Removing the product from Wishlist and verifying
        productPage.get_wishlist_icon().children('button').first().then($ele => {
            cy.wrap($ele).invoke('attr','class').should('not.include','disabled')
            cy.wrap($ele).invoke('attr','title').then($title => {expect($title).to.be.equal('Remove from Wishlist')})
        })
        productPage.get_wishlist_icon().children('button').first().click()
        cy.wait(2000)
        notification.success_msg_ele().should('have.text','Product has been removed from your Wish List!')
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