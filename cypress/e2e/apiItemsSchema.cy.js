describe('API Test - Validate GET /api/items schema', () => {
  it('should return a list of items with correct fields', () => {
    cy.request('/api/items').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

      // Validate the schema of the first item
      const item = response.body[0];
      expect(item).to.have.property('id').to.be.a('number');
      expect(item).to.have.property('name').to.be.a('string');
      expect(item).to.have.property('image_count').to.be.a('number');
      expect(item).to.have.property('color_count').to.be.a('number');
      expect(item).to.have.property('fabric_count').to.be.a('number');
    });
  });
});
