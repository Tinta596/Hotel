import Login from '../../src/views/Login.vue';
import { mount } from 'cypress/vue';

describe('Login', () => {
  it('debe renderizar el título y simular login', () => {
    mount(Login);

    cy.contains('Iniciar Sesión'); // Verifica el título

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');

    // Aquí va el stub, DENTRO del `it(...)`
    const stub = cy.stub().as('loginHandler');

    cy.get('form').invoke('on', 'submit', stub);
    cy.get('button[type="submit"]').click();

    cy.get('@loginHandler').should('have.been.called');
  });
});