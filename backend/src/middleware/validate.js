// =============================================================================
// SECTION: Validation Result Middleware
// Works with express-validator: reads the validation result from a request
// and returns a 422 with all field errors if any rule failed.
// Use after calling validationRules() in a route definition:
//   router.post('/', validationRules, validate, handler)
// =============================================================================

'use strict';

const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return all field-level errors so the frontend can highlight them
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

module.exports = { validate };
