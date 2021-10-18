const router = require('express').Router();
const Item = require('../model/Items');
const verify = require('../validation/verifyToken');

router.get('/', (req, res) => {
    res.send({message: `Welcome to ToDoList APIs...`});
});

/** Create a new ToDo item and add it to DB. */
router.post('/addItem', verify, async (req, res) => {
    const item = new Item({
        title: req.body.title,
        description: req.body.description,
        createdBy: req.user._id 
    });

    try{
        const newItem = await item.save();
        res.status(200).json({message: `Item added successfully.`, item: {title: item.title, description: item.description, state: item.state, createdBy: item.createdBy}});
    } catch(err){
        res.status(400).send({error: err});
    }
});

/** List all ToDo items present in the DB */
router.get('/listItems', verify, async(req, res) => {
    try{
        const items = await Item.find();
        res.status(200).json(items);
    } catch(err){
        res.status(400).send({error: err});
    }
});

/** List specific ToDo item with title */
router.get('/getItem/:title', verify, async (req, res) => {
    try{
        const item = await Item.findOne({title: req.params.title});
        if(!item) return res.send({error: `Item not found.`, message: `Item  "${req.params.title}" not found.`})
        res.status(200).json(item);
    } catch(err){
        res.status(400).send({error: err});
    }
});


/** Update an existing ToDo item. */
router.patch('/updateItem/:title', verify, async (req, res) => {
    const item = await Item.findOne({title: req.params.title});
    if(!item) return res.send({error: `Item not found.`, message: `Item  "${req.params.title}" not found.`});
    try{ 
        /** If the item belongs to the user or not. If not the user cannot update the item */
        if(item.createdBy == req.user._id){
            const updatedItem = await Item.updateMany(
                {title: req.params.title}, 
                { $set: {
                    title: req.body.title,
                    description: req.body.description,
                    state: req.body.state
                }
            });    
            res.status(200).json({message: `ToDo_List item "${req.params.title}" updated successfully.`});  
        } else {
            res.status(401).send({error: `User "${req.user.userName}" is not authorized to update the todo item`});
        }  
        
    } catch(err){
        res.status(400).send({error: err});
    }
});

/** Delete all ToDo items from DB. */
router.delete('/deleteAll', verify, async (req, res) => {
    const items = await Item.find({});
    if(!items) return res.send({error: `Items not found.`});
    try{
        /** If the item belongs to the user or not. If not the user cannot update the item */
        if(items.createdBy == req.user._id){
            const deletedItems = await Item.deleteMany({});
            if(!deletedItems) return res.send({message: `No items found. ToDo_List is empty`})
            res.status(200).json({message: `All items deleted successfully.`});
        } else {
            res.status(401).send({error: `User "${req.user.userName}" is not authorized to update the todo item`});
        }  
        
    } catch(err){
        res.status(400).send({error: err});
    }
});





module.exports = router;