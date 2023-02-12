import Publications from "../Models/Publications.js";
 class PublicationsController{
    getPublications = async function (req, res) {
        const category = req.params.category;
        try {
            const publications = await Publications.find({category})
            res.status(200).json({publications})
        } catch (e) {
            res.status(400).json(e)
        }
    }

    addPublication = async function (req, res) {
        const publication = {...req.body.publication, category: req.params.category, date: new Date()};
        try {
            await new Publications(publication).save();

            res.status(200).json({message: "Success"})
        } catch (e) {
            res.status(400).json({error: e})
        }
    }
}
export const PublicationsControllerInstance = new PublicationsController()