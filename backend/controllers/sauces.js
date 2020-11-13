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

exports.getOneSauce = (req, res, next) => { // récupération d'une sauce
	Sauce.findOne({_id: req.params.id})
		.then((sauce) => {res.status(200).json(sauce);})
		.catch(
		(error) => {
			res.status(404).json({
				error: error
			});
		}
	);
};

exports.reactToSauce = (req, res, next) => {// Fonction de likes/dislikes
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 0:// Si je like ou dislike plus
                    if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {// Si je suis quelqu'un qui likait
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);// Je like plus
                        sauce.likes--;
                        break;                                    // Un like de moins
                    }
                    else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {// Si je suis quelqu'un qui dislikait
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);// Je dislike plus
                        sauce.dislikes--;
                        break;
                    }
                case -1:// Si je dislike
                    if ((sauce.usersDisliked.indexOf(req.body.userId) === -1) && (sauce.usersLiked.indexOf(req.body.userId) === -1)) {// Si je ne fait parti des dislikers, ni des likers
                        sauce.dislikes++;// On dislike
                        sauce.usersDisliked.push(req.body.userId);
                        break;
                    }
                case 1:// Si je like, meme logique à l'envers
                    if ((sauce.usersDisliked.indexOf(req.body.userId) === -1) && (sauce.usersLiked.indexOf(req.body.userId) === -1)) {
                        sauce.likes++;
                        sauce.usersLiked.push(req.body.userId);
                        break;}
                        default: // Si aucune des 4 options précédentes n'est vraie, ce message d'erreur apparaîtra
                    throw { error: "Impossible de modifier vos likes, merci de bien vouloir réessayer" };
    }             
            Sauce.updateOne({ _id: req.params.id }, {//Mise à jour des infos suite au switch qui a mis a jour les tableaux et les nombres de like/dislike
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: sauce.likes,
                dislikes: sauce.dislikes,
                _id: req.params.id
            })
                .then(() => res.status(200).json({ message: 'Mis à jour' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
};

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