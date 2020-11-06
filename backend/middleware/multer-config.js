const multer = require('multer');

// formats fichiers acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// j'indique à multer où enregistrer les fichiers
const storage = multer.diskStorage({ //indique d'enregistrer les fichiers dans le dossiers "images"
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => { //indique d'utiliser le nom d'origine, de remplacer les espaces par des _, et d'ajouter un timestamp
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; //Résout l'extension de fichier approprié
    callback(null, name + Date.now() + '.' + extension);
  }
});

//constante storage ajoutée à multer et gestion uniquement des fichiers images
module.exports = multer({storage: storage}).single('image');