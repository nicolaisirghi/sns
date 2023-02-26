import Publications from "../Models/Publications.js";

class PublicationsController {
    getPublications = async function (req, res, next) {
        try {
            const category = req.params.category;
            const publications = await Publications.find({category});
            res.status(200).json({publications});
        } catch (e) {
            next(e)
        }
    };

    getSinglePublication = async function (req, res, next) {
        // const category = req.params.category;
        // const publication =
    }

    addPublication = async function (req, res, next) {
        try {
            console.log("Body : ",req.body)
            const publication = {
                ...req.body.publication,
                category: req.params.category,
                author: req.user,
                date: new Date(),
                fileName: (req.file) ? req.file.originalname : null,
                fileData: (req.file) ? req.file.buffer : null
            };
             const savedPublication = await new Publications(publication).save();
            res.status(200).json({message: "Success",data:savedPublication});
        } catch (e) {
            next(e);
        }
    };
}

export const PublicationsControllerInstance = new PublicationsController();
