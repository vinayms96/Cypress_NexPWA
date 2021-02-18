/// <reference types="Cypress" />

export default class Notification {
    error_msg_ele() {
        return cy.get('.Notification_type_error').find('p')
    }

    success_msg_ele() {
        return cy.get('.Notification_type_success').find('p')
    }
}