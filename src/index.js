const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi');


const app = express()
app.use(express.json())
const port = 3000 
  
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const User = mongoose.model('User', {
    nome: String,
    idade: Number,
    email: String,
    pass: String,
    active: Boolean,
})

app.get('/', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'ID inválido' });
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ error: 'Usuário não encontrado' });
      }
      await User.findByIdAndDelete(req.params.id);
      return res.send({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
      return res.status(500).send({ error: 'Erro ao deletar usuário' });
    }
  });

  app.put('/:id', async (req, res) => {
    const userSchema = Joi.object({
        nome: Joi.string().required(),
        idade: Joi.number().required(),
        email: Joi.string().email().required(),
        pass: Joi.string().required(),
        active: Joi.boolean().required(),
      });

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'ID inválido' });
    }
  
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }
  
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: 'Dados de entrada inválidos' });
    }
  
    const update = {};
    if (req.body.nome) update.nome = req.body.nome;
    if (req.body.idade) update.idade = req.body.idade;
    if (req.body.email) update.email = req.body.email;
    if (req.body.pass) update.pass = req.body.pass;
    if (req.body.active!== undefined) update.active = req.body.active;
  
    try {
      await User.findByIdAndUpdate(req.params.id, update, { new: true });
      return res.send({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
      return res.status(500).send({ error: 'Erro ao atualizar usuário' });
    }
  });

app.post('/', async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
        res.status(400).send({message :'Usuário já existe!'})
    } else {
        const user = new User({
            nome: req.body.nome,
            idade: req.body.idade,
            email: req.body.email,
            pass: req.body.pass,
            active: req.body.active
        })

        try {
            await user.save()
            res.send({message : 'Usuário criado com sucesso!'})
        } catch (err) {
            res.status(500).send(err)
        }
    }
})

app.listen(port, ()=> {  
    console.log('server run');
    mongoose.connect('');


})
