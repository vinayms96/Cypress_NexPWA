/// <reference types="Cypress" />

import Header from "../PageModels/Header";
import LoginPage from "../PageModels/LoginPage";
import SignupPage from "../PageModels/SignupPage";
import Notification from "../PageModels/Notification"

describe('Test Signup Feature',() => {
    let loginPage, signupPage, header, notification
    let site, user

    before(() => {
        signupPage = new SignupPage
        loginPage = new LoginPage
        header = new Header
        notification = new Notification

        // Fetching the data from JSON file
        cy.fixture('site_details').then($data => {
            site = $data
        })
        cy.fixture('profile').then($data => {
            user = $data
        })
    })

    beforeEach(() => {
        cy.visit(site.url)
        cy.viewport(1366,768)

        header.click_account_btn()
        loginPage.click_create_account()
        cy.get('.MyAccountOverlay-Heading').first('strong').should('have.text','Create new account')
    });

    it('All Fields Validations', () => {
        signupPage.click_signup()

        signupPage.get_firstName_field().next('p').should('have.text','This field is required!')
        signupPage.get_lastName_field().next('p').should('have.text','This field is required!')

        notification.error_msg_ele().should('have.text','Incorrect data! Please resolve all field validation errors.')

        cy.wait(2000)
        signupPage.check_subscribe_box()
        
        signupPage.get_email_field().next('p').should('have.text','This field is required!')
        signupPage.get_password_field().next('p').should('have.text','This field is required!')
        signupPage.get_confirm_password_field().next('p').should('have.text','This field is required!')

        signupPage.uncheck_subscribe_box()
    });

    it('Check password fields', () => {
        // Password validation
        signupPage.set_firstName_field(user.first_name)
        signupPage.set_lastName_field(user.last_name)
        signupPage.set_email_field(user.email)
        signupPage.set_password_field('asdf@1234')
        signupPage.set_confirm_password_field(user.password)
        signupPage.click_signup()

        signupPage.get_password_field().next('p')
        .should('have.text','Password should be at least 8 characters long, include at least on upper case letter, number and symbol!')

        // Clear Fields
        signupPage.get_password_field().clear()
        signupPage.get_confirm_password_field().clear()

        // Password Missmatch
        signupPage.set_password_field(user.password)
        signupPage.set_confirm_password_field('asdf@1234')
        signupPage.click_signup()

        signupPage.get_confirm_password_field().next('p')
        .should('have.text','Password should be at least 8 characters long, include at least on upper case letter, number and symbol!')
    });

    it('Existing user validation', () => {
        signupPage.set_firstName_field(user.first_name)
        signupPage.set_lastName_field(user.last_name)
        signupPage.set_email_field(user.email)
        signupPage.set_password_field(user.password)
        signupPage.set_confirm_password_field(user.password)
        signupPage.click_signup()

        notification.error_msg_ele()
        .should('have.text','A customer with the same email address already exists in an associated website.')
    });
})