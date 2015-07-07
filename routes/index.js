
/*
 * GET home page.
 */
// test for GIT
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};