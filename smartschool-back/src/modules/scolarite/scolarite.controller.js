const service = require('./scolarite.service');

exports.inscrireEtudiant = async (req, res) => {
    try{
        const data = await service.creerInscription(req.body);
        res.status(201).json({message: 'Inscription reussie', data});

        /*const {nom, prenom, email, filiere, niveau } = req.body;
        if(!nom || !prenom || !email || !filiere || !niveau) {
            return res.status(400).json({error: 'Champs manquants: nom,prenom, email, filiere,niveau requis' });
        }
        const result = await service.creerInscription(req.body);
        res.status(201).json({message:'Inscription reussie', data:result});*/

    } catch(err){
    const code = err.message.includes('introuvable') || err.message.includes('invalide')?404 : 400;
    res.status(code).json({error:err.message});
    }
};

exports.getAllInscriptions = async (req, res) => {
    try{
        const data = await service.getInscriptions(req.query);
        res.json({total:data.length, data});
    } catch (err){
        res.status(500).json({error: err.message});
    }
};

exports.getInscription = async (req,res) => {
    try{
        const data = await service.getInscriptionById(req.params.id);
        res.json({data});
    }catch(err){
        res.status(404).json({error: err.message});
    }
};

exports.deleteInscription = async(req,res) => {
    try {
        const data = await service.supprimerInscription(req.params.id);
        res.json(data);
    } catch(err){
        res.status(404).json({error:err.message});
    }
};