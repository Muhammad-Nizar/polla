const express = require('express');
const router = express.Router();
const authorization = require('../utilities/authorization');
const accountsController = require('../controllers/accounts');
const approvalsController = require('../controllers/approvals');
const bodiesController = require('../controllers/bodies');
const domainsController = require('../controllers/domains');
const ownersController = require('../controllers/owners');
const plansController = require('../controllers/plans');
const policiesController = require('../controllers/policies');
const usersController = require('../controllers/users');
const dashboardController = require('../controllers/dashboard');

router.post('/accounts/auth_owner', authorization.any, accountsController.auth_owner);

router.get('/users', authorization.admin, usersController.get_list);
router.get('/users/:id', authorization.admin, usersController.get_details);
router.post('/users', authorization.admin, usersController.post);
router.put('/users', authorization.admin, usersController.put);
router.delete('/users', authorization.admin, usersController.delete);

router.get('/plans', authorization.any, plansController.get_list);
router.get('/plans/:id', authorization.any, plansController.get_details);
router.post('/plans', authorization.any, plansController.post);
router.put('/plans', authorization.admin, plansController.put);

router.get('/owners', authorization.any, ownersController.get_list);
router.get('/owners/:id', authorization.any, ownersController.get_details);
router.post('/owners', authorization.any, ownersController.post);
router.put('/owners', authorization.owner, ownersController.put);
router.delete('/owners', authorization.owner, ownersController.delete);

router.get('/domains', authorization.any, domainsController.get_list);
router.get('/domains/:id', authorization.any, domainsController.get_details);
router.post('/domains', authorization.owner, domainsController.post);
router.put('/domains', authorization.owner, domainsController.put);
router.put('/domains/verfile', authorization.owner, domainsController.verfile);
router.delete('/domains', authorization.owner, domainsController.delete);

router.get('/policies', authorization.any, policiesController.get_list);
router.get('/policies/:id', authorization.any, policiesController.get_details);
router.post('/policies', authorization.owner, policiesController.post);
router.put('/policies', authorization.owner, policiesController.put);
router.delete('/policies', authorization.owner, policiesController.delete);
router.put('/policies/callbacks', authorization.owner, policiesController.callbacks);
router.put('/policies/crawls', authorization.owner, policiesController.crawls);
router.put('/policies/rekey', authorization.owner, policiesController.rekey);
router.post('/policies/crawl', authorization.owner, policiesController.crawl);

router.get('/bodies', authorization.any, bodiesController.get_list);
router.get('/bodies/:id', authorization.any, bodiesController.get_details);
router.post('/bodies', authorization.owner, bodiesController.post);
router.put('/bodies', authorization.owner, bodiesController.put);

router.get('/approvals', authorization.any, approvalsController.get_list);
router.get('/approvals/:id', authorization.any, approvalsController.get_details);
router.post('/approvals/public', authorization.any, approvalsController.postpub);
router.post('/approvals', authorization.any, approvalsController.postenc);
router.post('/approvals/test', authorization.any, approvalsController.test);


router.get('/dashboard/owner', authorization.any, dashboardController.owner);
router.get('/dashboard/domain', authorization.any, dashboardController.domain);
router.get('/dashboard/policy', authorization.any, dashboardController.policy);
router.get('/dashboard/all', authorization.any, dashboardController.all);

module.exports = router;