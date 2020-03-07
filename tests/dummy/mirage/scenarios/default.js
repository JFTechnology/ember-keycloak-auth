export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  server.createList('model-a', 2, {name: 'Model A instance'});
  server.createList('model-b', 2, {name: 'Model B instance'});

}
