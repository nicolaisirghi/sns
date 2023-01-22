const Publications = require("../Models/Publications")
module.exports.getPublications = async function (req,res){
   const category = req.params.category;
   try{
       const publications = await Publications.find({category})
       res.status(200).json({publications})
   }
   catch (e){
       res.status(400).json(e)
   }
}
module.exports.addPublication = async function(req,res){
    const publication = {...req.body.publication,category:req.params.category,date:new Date()};
    try {
        await new Publications(publication).save();
        res.status(200).json({message:"Succes"})
    }
    catch (e){
        res.status(400).json({error:e})
    }
}