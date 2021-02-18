/// <reference types="Cypress" />

export default class Header {
    get_account_btn() {
        return cy.get('.Header-Button.Header-Button_type_account')
    }

    get_menu_links() {
        return cy.get('.MenuList li a')
    }

    get_sub_menu_links() {
        return cy.get('.MegaMenuSubLevelContainer a')
    }

    get_footer_links() {
        return cy.get('.Footer-rowone a')
    }

    click_account_btn() {
        cy.get('.Header-Button.Header-Button_type_account').click()
    }

    click_minicart_btn() {
        cy.get('button[aria-label=Minicart]').click()
    }

    get_popup_text_heading() {
        return cy.get('.Overlay_isVisible').find('strong')
    }
}