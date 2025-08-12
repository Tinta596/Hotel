const chai = require('chai');
const chaiHttp = require('chai-http'); // ✅ CORRECTO
const app = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('debe rechazar un login inválido', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'fake@email.com', password: '123456' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});