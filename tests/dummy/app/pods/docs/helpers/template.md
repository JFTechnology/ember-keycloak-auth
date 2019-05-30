## Role helpers

This addon provides two simple helpers.

### `{{in-role 'role' ['resource']}}`

Helper returns true if the current access-token grants the subject realm or resource role permission.

### `{{not-in-role 'role' ['resource']}}`

Helper returns true if the current access-token does not grant the subject realm or resource role permission.
