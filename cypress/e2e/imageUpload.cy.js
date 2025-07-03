import 'cypress-file-upload';

// Utility to check that the image grid is visible
const checkImageVisibility = () => {
  cy.get('[data-cy="image-grid"]').should('exist').and('be.visible');
};

describe('Image Upload End-to-End', () => {
  it('validates product data across API, Product List, and Upload Page', () => {
    // 1. Request API to get initial data
    cy.request('/api/items').then((response) => {
      const apiCount = parseInt(response.body[0].image_count);
      const apiId = parseInt(response.body[0].id);
      const apiName = response.body[0].name;
      const apiItemColorCount = parseInt(response.body[0].color_count);
      const apiItemFabricCount = parseInt(response.body[0].fabric_count);

      // 2. Visit the Product List page
      cy.visit('/');

      // 3. Get ID and compare to API ID
      cy.get('[data-cy="item-id-1"]').invoke('text').then((text) => {
        const domItemId = parseInt(text.trim());
        expect(domItemId).to.eq(apiId);
      });

      // 4. Get product name and compare to API name
      cy.get('[data-cy="shirt-type-1"]').invoke('text').then((text) => {
        const domItemName = text.trim();
        expect(domItemName).to.eq(apiName);
      });

      // 5. Get Nº of Colors and compare to API count
      cy.get('[data-cy="color-count-1"]').invoke('text').then((text) => {
        const domColorCount = parseInt(text.trim());
        expect(domColorCount).to.eq(apiItemColorCount);
      });

      // 6. Get Nº of Fabrics and compare to API count
      cy.get('[data-cy="fabric-count-1"]').invoke('text').then((text) => {
        const domFabricCount = parseInt(text.trim());
        expect(domFabricCount).to.eq(apiItemFabricCount);
      });

      // 7. Get Nº of Images and compare to API count
      cy.get('[data-cy="n-images-on-id-1"]').invoke('text').then((text) => {
        const domCount = parseInt(text.trim());
        expect(domCount).to.eq(apiCount).and.to.equal(0);
      });

      // 8. Click the button to go to the Upload page
      cy.get('[data-cy="edit-images-bttn-1"]').click();

      // 9. Check if the URL is correct
      cy.url().should('include', `/upload.html?itemId=${apiId}`);

      // 10. Check if the ID on the Edit Image page corresponds to the item ID
      cy.get('[data-cy="item_id"]').then(($el) => {
        const itemIdText = parseInt($el[0].nextSibling.textContent.trim());
        expect(itemIdText).to.eq(apiId);
      });

      // 11. Check if the product name corresponds to the API name
      cy.get('[data-cy="item_name"]').then(($el) => {
        const itemNameText = $el[0].nextSibling.textContent.trim();
        expect(itemNameText).to.eq(apiName);
      });

      // 12. Check the count of color headers
      cy.get('[data-cy="color-header"]').then(($colors) => {
        const colorCount = $colors.length;
        expect(colorCount).to.eq(apiItemColorCount);
      });

      // 13. Check the count of fabric headers
      cy.get('[data-cy="fabric-header"]').then(($fabrics) => {
        const fabricCount = $fabrics.length;
        expect(fabricCount).to.eq(apiItemFabricCount);
      });

      // 14. Click the Add button for blue-cotton
      cy.get('[data-cy="add-btn-blue-cotton"]').click();

      // 15. Check if the popup appears
      cy.get('[data-cy="popup-content"]').should('be.visible');

      // 16. Attach an image
      cy.get('.popup input[type="file"]').attachFile('blueColor.png');

      // 17. Click the Upload button
      cy.get('[data-cy="upload-button"]').click();

      // 18. Verify the image grid is visible
      checkImageVisibility();

      // 19. Reload page to see the new image
      cy.reload();

      // 20. Verify the image grid is visible
      checkImageVisibility();

      // 21. Go back to the Product List page
      cy.get('[data-cy="back-to-list"]').click();

      // 22. Update the API count after the image upload
      cy.reload();

      // 23. Check if the image count has increased
      cy.get('[data-cy="n-images-on-id-1"]').invoke('text').then((text) => {
        const domSecondCount = parseInt(text.trim());
        expect(domSecondCount).to.eq(apiCount + 1);
      });
    });
  });
});
