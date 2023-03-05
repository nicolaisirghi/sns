import PagePublications from "../Models/PagePublications.js";

class PagePostsController {

    async getMyPosts(req,res,next){
        try{
            const user = req.user;
            const data  = await PagePublications.find({author: user});
            return res.status(200).json({
                status:200,
                data
            })
        }catch (e)
        {
            next(e);
        }
    }
    // async addPost(req,res,next)
    // {
    //     try{
    //         const user = req.user;
    //         const {data} = req.body;
    //         const post = {
    //             post
    //         }
    //
    //     }catch (e)
    //     {
    //         next(e)
    //     }
    // }
}
export const PagePostsCotrollerInstance = new PagePostsController();