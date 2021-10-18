const router = require('express').Router();
const Item = require('../model/Items');
const User = require('../model/User');
const verify = require('../validation/verifyToken');

/** List all ToDo items created by the user */
router.get('/myItems', verify, async (req, res) => {
    const userExists = await User.findById(req.user._id);
    if(!userExists) return res.status(400).send({error: ` User not found.`});
    try{
        const userId = userExists._id;
        const items = await Item.find({createdBy: userId});
        return res.status(200).send(items);
    } catch(err){
        res.status(400).send({error: err});
    }
});

/** Fetch user profile */
router.get('/myProfile', verify, async (req, res) => {
    const userExists = await User.findById(req.user._id);
    if(!userExists) return res.status(400).send({error: `User not found.`}); 
    try{
        res.status(200).send({userId: userExists._id, userName: userExists.name, email: userExists.email});
    } catch(err){
        res.status(400).send({error: err});
    }
});


/** Delete a specific ToDo item from my list using title from DB. */
router.delete('/deleteItem/:title', verify, async (req, res) => {
    const item = await Item.findOne({title: req.params.title});
    if(!item) return res.send({error: `Item not found.`, message: `Item  "${req.params.title}" not found.`});
    console.log(item);
    try{
        /** If the item belongs to the user or not. If not the user cannot update the item */
        if(item.createdBy == req.user._id){
            const deletedItem = await Item.deleteOne({title: req.params.title});
            //if(!deletedItem) return res.send({error: `Item not found.`, message: `Item  "${req.params.title}" not found.`})
            res.status(200).json({message: `Item deleted successfully.`});
        }else {
            res.status(401).send({error: `User "${req.user.userName}" is not authorized to update the todo item`});
        }
        
    } catch(err){
        res.status(400).send({error: err});
    }
});

/** Delete all my ToDo items */
router.delete('/deleteAll', verify, async (req, res) => {
    const userExists = await User.findById(req.user._id);
    if(!userExists) return res.status(400).send({error: ` User not found.`});
    try{
        const userId = userExists._id;
        const items = await Item.find({createdBy: userId});
        const itemIds = [];
        items.forEach(item => {
            itemIds.push(item._id);                  
        });
        await Item.deleteMany({ _id: {$in: itemIds}});
        res.status(200).json({message: `All items deleted successfully.`});    
        
    } catch(err){
        res.status(400).send({error: err});
    }
});


module.exports = router