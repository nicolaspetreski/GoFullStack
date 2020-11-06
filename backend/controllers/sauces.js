const Sauce = require('../models/sauces'); // importation du modèle Sauce
const fs = require('fs'); //importation module node fs (intéraction avec le système de fichier)


exports.createSauce = (req, res, next) => { //données envoyé par le frontend sous forme form-data, il faut donc le transformer en json pour être exploitable
    const sauceObject = JSON.parse(req.body.sauce); //Récupération d'un objet JS
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,  //résolution de l'url de l'image
        //premier segment http, ajout //, resoud l'hote du serveur, ajout du dossier image, et nom du fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() 
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.reactToSauce = (req, res, next) => { //Récupération de l'id de l'utilisateur et de la requête
  if(req.body.like === 1){
		Sauce.updateOne({ _id: req.params.id },  {$inc: {likes: req.body.like++} ,$push: {usersLiked: req.body.userId}})
        .then ((sauce)=> res.status(200).json({ message: 'Liké avec succes !'}))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1){
        Sauce.updateOne({ _id: req.params.id },  {$inc: {dislikes: (req.body.like++)*-1} ,$push: {usersDisliked: req.body.userId}})
        .then ((sauce)=> res.status(200).json({ message: 'Disliké avec succes !'}))
        .catch(error => res.status(400).json({ error }));
    } else { 
        
		Sauce.findOne({_id: req.params.id})
			.then(sauce => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
                    	.then((sauce) => {res.status(200).json({ message: 'Un like de moins !'})}) 
                    	.catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
                    	.then((sauce) => {res.status(200).json({ message: 'Un dislike de moins !'})}) 
                    	.catch(error => res.status(400).json({ error }))  
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};


exports.getOneSauce = (req, res, next) => {
  //Renvoit la sauce avec l'id correspondant
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce)) 
        .catch(error => res.status(404).json({ error })) 
}

exports.modifySauce = (req, res, next) => {  //vérifie si req.file existe
	const sauceObject = req.file ? //il existe : traitement de la nouvelle image
      { ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // il n'existe pas : traitement de l'objet entrant
    } : { ...req.body }; // si req.file n'existe pas, on envoi simplement les éléments
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
			.then(sauce => {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => { // suppression de l'image à remplacer
				Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })  //mise à jour d'une sauce
				.then(() => res.status(200).json({ message: 'Sauce modifiée avec success' }))
				.catch(error => res.status(400).json({ error }));
			});
		}).catch(error => res.status(400).json({ error }))
	} else {
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })  //mise à jour d'une sauce
		.then(() => res.status(200).json({ message: 'Sauce modifiée' }))
		.catch(error => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {  //accès à la sauce corrsepondante à l'id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => { //récupération du nom de fichier
            const filename = sauce.imageUrl.split('/images/')[1];  //Supression du fichier
            fs.unlink(`images/${filename}`, () => { //supression le Sauce de la DB
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => { //Tableau de donnée de sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}