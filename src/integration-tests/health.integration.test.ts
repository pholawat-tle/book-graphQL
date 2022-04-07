import * as supertest from 'supertest';
import app from '../app';

describe('/health', () => {

  describe('GET /health/', () => {

    it('should return 200 and ok', async () => {
      const response = await supertest(app)
        .get('/health')
        .expect(200)

      expect(response.body.message).toEqual('ok')
    })

  })

})
