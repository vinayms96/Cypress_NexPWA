/// <reference types="Cypress" />

export default class ListingPage {
    get_product_card_list() {
        return cy.get('.CategoryProductList li')
    }

    get_pagination_ele() {
        return cy.get('.CategoryPagination')
    }

    get_product_item_count() {
        return cy.get('.CategoryPage-ItemsCount')
    }

    get_product_name() {
        return cy.get('p[itemprop=name]')
    }

    get_filter_list() {
        return cy.get('.ProductConfigurableAttributes article')
    }

    get_sort_dropdown() {
        return cy.get('.CategorySort select')
    }

    check_filter($ele) {
        cy.wait(2000)
        cy.wrap($ele).find('a:nth-child(2) > div > input').check({ force: true })
    }

    click_reset_filter() {
        cy.get('.CategoryFilterOverlay-ResetFilter').click()
    }

    get_swatch_filters($list) {
        return cy.wrap($list).find('.ProductConfigurableAttributes-SwatchList')
    }

    get_swatch_dropdownList($list) {
        return cy.wrap($list).find('.ProductConfigurableAttributes-DropDownList')
    }

    get_filter_heading() {
        return cy.get('.CategoryFilterOverlay-Heading')
    }
}