const User = require('../models/user.model.js');

class UserController {

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async postLogin (req, res) {
  // si l'utilisateur est déjà connecté, alors on lui retourne Unauthorized
  if (req.session.userId) {
    res.status(401)
      .send('Already authenticated');
    return;
  }
  // on vérifie l'email et le mot de passe de l'utilisateur
  const user = await User.verifyUser(req.body.email, req.body.password);
  // si on a trouvé un utilisateur correspondant, alors on sauvegarde son ID
  // dans l'objet req.session
  console.log(user);
  if (user) {
    req.session.userId = user.id;
    res.json(user);
    return;
  }

  // si on n'a pas trouvé d'utilisateur, alors on retourne une erreur 401 (unauthorized)
  res.status(401)
    .send('Unknown email or password');
}

async create(req, res){
  try{
    let user = await User.getByEmail(req.body.email, 'email');
    // si on a trouvé un utilisateur correspondant, alors on sauvegarde son ID
    // dans l'objet req.session
    console.log(user);
    if (user) {
      res.status(201)
      .send('User with this email already exist :)'); 
      return;
    }
    user = await User.create(req.body);
    res.json(user);
    return;
  }catch(ex) {
    console.log(ex)
    res.status(500)
      .send(ex);
  }    
}

 async getUsers(req, res){
   console.log('enter')
   try{
    let users = await User.getUsers();
    res.json(users);
    return;
   }catch(ex){
     console.log(ex)
     res.send(ex);
   }
 }

}
module.exports = UserController;
