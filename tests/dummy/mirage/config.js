export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '/api';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/model-as');
  this.get('/model-as/:id');
  this.post('/model-as');

  this.get('/model-bs');
  this.get('/model-bs/:id');
  this.post('/model-bs');

  // addon documentation not handled by mirage
  this.passthrough('/docs/**');
  this.passthrough('/versions.json');

  // POST requests will all be OAuth2 related - so they get passed through to configured Keycloak server
  this.passthrough(request => {
   // console.log(`passthrough ${JSON.stringify(request, null, 2)}`);
    if (request.url === "/model-as" || request.url === "/model-as/1" || request.url === "/model-bs") {
      return false;
    }
    return request.method === "POST" || request.url.startsWith("https://");
  });
}
