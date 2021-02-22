/// <reference types="Cypress"/>

import ListingPage from '../PageModels/ListingPage'

describe('Test Listing Page Functionality', () => {
    let listingPage
    let site
    let list_prod_names = [], list_prod_prices = [], list_sorted_names = [], list_sorted_prices = []

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
        cy.intercept('GET', '/men.html', (resp) => {
            cy.log('reloaded')
            if (resp.statusCode == 404) { cy.reload() }
        })
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
        cy.wait(500)
    }

    var fetch_product_names_prices = function () {
        list_prod_names = []
        list_prod_prices = []
        listingPage.get_product_card_list().find('p[itemprop=name]')
            .each(($name, index, _$el) => {
                list_prod_names[index] = $name.text();
            })
        listingPage.get_product_card_list().find('span[itemprop="lowPrice"]')
            .each(($price, index, _$el) => {
                list_prod_prices[index] = $price.text();
            })
    }

    var fetch_sorted_product_names = function () {
        list_sorted_names = []
        listingPage.get_product_card_list().find('p[itemprop=name]')
            .each(($name, index, _$el) => {
                list_sorted_names[index] = $name.text();
            })
    }

    var fetch_sorted_product_prices = function () {
        list_sorted_prices = []
        listingPage.get_product_card_list().find('span[itemprop="lowPrice"]')
            .each(($price, index, _$el) => {
                list_sorted_prices[index] = $price.text();
            })
    }

    var apply_filters = function () {
        // Apply first filter
        listingPage.get_filter_list().then($list => {
            listingPage.get_swatch_filters($list).find('a').then($value => {
                cy.wrap($value[0]).click()
                validate_count()

                cy.wait(1000)
                fetch_product_names_prices()
            })
        })
    }

    /**
     * Apply filters and count the number of products displayed with count
     */
   /*  it('Validate the product count', () => {
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


    var convert_price = function (array) {
        let newArr = []
        array.forEach(($value, index) => {
            newArr[index] = Number($value.replace(/[^0-9.-]+/g, ""))
        })
        return newArr
    }

    /**
     * Applying the Name sorting and verifying the sort feature
     */
    it('Verify the Name Sorting', () => {
        // Apply filters
        apply_filters()

        // Apply the Product Name ASC sort
        listingPage.get_sort_dropdown().children()
            .filter(':contains("Product")').then($nameOptions => {
                cy.wrap($nameOptions[0]).invoke('attr', 'value').then($value => {
                    listingPage.get_sort_dropdown().select($value, { force: true })
                })
            })
        // Verifying the ASC order
        cy.wait(1000)
        fetch_sorted_product_names()
        cy.get('div').should(_$data => {
            expect(list_prod_names.sort()).to.deep.equal(list_sorted_names)
        })

        // After applying Product Name DESC sort
        listingPage.get_sort_dropdown().children()
            .filter(':contains("Product")').then($nameOptions => {
                cy.wrap($nameOptions[1]).invoke('attr', 'value').then($value => {
                    listingPage.get_sort_dropdown().select($value, { force: true })
                })
            })
        // Verifying the DESC order
        cy.wait(1000)
        fetch_sorted_product_names()
        cy.get('div').should(_$data => {
            expect(list_prod_names.reverse()).to.deep.equal(list_sorted_names)
        })
    })

    it('Verify the Price Sorting', () => {
        // Apply filters
        apply_filters()

        // Apply the Price Low to High sort
        listingPage.get_sort_dropdown().children()
            .filter(':contains("Price")').then($nameOptions => {
                cy.wrap($nameOptions[0]).invoke('attr', 'value').then($value => {
                    listingPage.get_sort_dropdown().select($value, { force: true })
                })
            })
        // Verifying the ASC order
        cy.wait(1000)
        fetch_sorted_product_prices()
        cy.get('div').should(_$data => {
            expect(convert_price(list_prod_prices).sort(function (a, b) { return a - b })).to.deep
                .equal(convert_price(list_sorted_prices))
        })

        // Apply the Price High to Low sort
        listingPage.get_sort_dropdown().children()
            .filter(':contains("Price")').then($nameOptions => {
                cy.wrap($nameOptions[1]).invoke('attr', 'value').then($value => {
                    listingPage.get_sort_dropdown().select($value, { force: true })
                })
            })
        // Verifying the ASC order
        cy.wait(1000)
        fetch_sorted_product_prices()
        cy.get('div').should(_$data => {
            expect(convert_price(list_prod_prices).sort(function (a, b) { return b - a })).to.deep
                .equal(convert_price(list_sorted_prices))
        })
    });
})