/// <reference types="Cypress" />

import Header from "../../support/PageModels/Header"

describe('Test the Website Links', () => {
    let header
    let site
    var failed_links = [], count = 0

    before(() => {
        header = new Header

        cy.fixture('site_details').then($data => {
            site = $data
        })
    })

    beforeEach(() => {
        cy.visit(site.url)
        cy.viewport(1366, 768)
    })

    var check_links = ($links) => {
        cy.wrap($links).invoke('attr', 'href').then($endPoint => {
            cy.request({ url: site.url + $endPoint, failOnStatusCode: false }).then($response => {
                if ($response.status == 200) {
                    expect($response.status).to.eq(200)
                } else {
                    failed_links.push($endPoint)
                    count++
                }
            })
        })
    }

    var print_failed_links = () => {
        cy.get('div').then(_$data => {
            cy.log('"' + count + '" links failed')
            failed_links.forEach($link => {
                cy.log($link)
            })
        })
    }

    /**
     * Verifying the Menu and Sub Menu links
     */
    it('Verify Menu links status', () => {
        header.get_menu_links().each($links => {
            check_links($links)
        })
        print_failed_links()
        header.get_sub_menu_links().each($links => {
            check_links($links)
        })
        print_failed_links()
    })

    /**
     * Verify the Footer links
     */
    it('Verify the Footer links status', () => {
        header.get_footer_links().each($links => {
            check_links($links)
        })
        print_failed_links()
    })
})