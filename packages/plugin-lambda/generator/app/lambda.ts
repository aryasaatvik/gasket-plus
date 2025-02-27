/**
 * AWS Lambda handler for Gasket application
 */
import gasket from './gasket.js';

/**
 * Lambda handler function
 * This exports the handler created by the createHandler action
 */
export const handler = await gasket.actions.createHandler(); 