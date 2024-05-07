const Item = require("../models/item");
const Category = require("../models/categories")
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require ("express-validator");

exports.index = asyncHandler (async (req,res,next) =>{
    const [numitems, numcategory] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ])

    res.render("index", {
        title: "Inventory Home",
        item_count: numitems,
        category_count: numcategory
    })
})

exports.item_list = asyncHandler(async(req,res,next)=>{
    const allItems = await Item.find({}, "name numInstock price category")
        .sort({name: 1})
        .populate("category")
        .exec();

        res.render("item_list",{title: "Item List", item_list:allItems})
});

exports.item_detail = asyncHandler(async(req,res,next)=>{
    const [items,categories] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
    ]);
    if (items === null){
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }
    res.render("item_detail", {
        name: items.name,
        item: items,
    });
});

exports.item_create_get = asyncHandler(async(req,res,next)=>{ //! So when I take away promise.all it displays the categories, but i still cant get it to work all the way
    const [item,allCategories] = await Promise.all([Item.findById(req.params.id).populate("category").exec(),Category.find().sort({name:1}).exec()])
    console.log(typeof Category.find)
    res.render("item_form", {title: "Create Item", categorys:allCategories})
    //console.log(allCategories)
})

exports.item_create_post = [
    (req,res,next) =>{
        if (!Array.isArray(req.body.category)){
            req.body.category = 
                typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },
    body("name", "Item must contain at least 2 characters")
    .trim().isLength({minLength:3}).escape(),
    body("desc", "Description must be atleast 10 characters").trim().isLength({minLength:10}).escape(),
    body("stock", "Stock must be a number ").trim().isNumeric().escape(),
    body("price", "Price must be a price").trim().escape(),
    body("sku", "sku must be a alphanumeric").trim().isAlphanumeric().escape(),
    body("category.*").escape(),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        const item = new Item({
            name:req.body.name,
            desc: req.body.desc,
            stock: req.body.stock,
            price:req.body.price,
            sku:req.body.sku,
            categorys: req.body.category 
        });
       
        
        if(!errors.isEmpty()){

            const [allCategories] = await Promise.all([
                Category.find().sort({name:1}).exec()
            ]);

            for(const category of allCategories){
                if (item.category.includes(category._id)){
                    category.checked = "true"
                }
            }
            res.render("item_form",{
                title: "Create Item",
                 item:item
                 ,categorys:allCategories
                 , errors:errors.array(),
            });
        } else{
                await item.save();
                res.redirect(item.url)
        }
    })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => { //? Might not need allItemCategories
    const [item, allItemCategories] = await Promise.all([Item.findById(req.params.id).exec(), Category.find({item:req.params.id}, "name").exec(),
  ]);
  if (item === null){
    res.redirect("/items")
  }
  res.render("item_delete",{
    title: "Delete Item", item:item, item_categories:allItemCategories
  })

});
  
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    //const [item, allItemCategories] = await Promise.all([Item.findById(req.params.id).exec(), Category.find({item:req.params.id}, "name").exec(),
    //]);
    await Item.findByIdAndDelete(req.body.itemid);
    res.redirect("/items")
  });
  

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [newItem,allcategories] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),Category.find().sort({name:1}).exec(),
    ]);

    if (newItem === null){
        const err = new Error("Item not found")
        err.status(404);
        return next(err)
    }

    allcategories.forEach((category) =>{
        if(newItem.category.includes(category._id)) category.checked=true;
    });

    res.render("item_form",{
        title:"Update Item", categorys:allcategories, newItem:newItem
    })
  });
  

exports.item_update_post = [
    (req,res,next) =>{
        if (!Array.isArray(req.body.category)){
            req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category]
        }
        next();
    },
    body("name", "Name must not be empty").trim().isLength({min:1}).escape(),
    body("desc", "Description must be atleast 10 characters").trim().isLength({minLength:10}).escape(),
    body("stock", "Stock must be a number ").trim().isNumeric().escape(),
    body("price", "Price must be a price").trim().escape(),
    body("sku", "sku must be a alphanumeric").trim().isAlphanumeric().escape(),
    body("category.*").escape(), //todo Need to create a sku area

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req);

        const newItem = new Item({
            name: req.body.name,
            desc: req.body.desc,
            stock: req.body.stock,
            price: req.body.price,
            sku: req.body.sku,
            category: typeof req.body.category === undefined ? []: req.body.category,
            _id: req.params.id,
        });

        if (!errors.isEmpty()){ //! Errors isn't defined?
            const [items,allcategories] = await Promise.all([Category.find().sort({name:1}).exec(),

            ]);
            for (const category of allcategories){
                if(newItem.category.indexOf(category._id) > -1){
                    category.checked = "true";
                }
            }
            res.render("item_form", {
                name: "Update Item", categorys: allcategories, item:newItem, errors:erros.array(),
            })
            return
        }else{
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, newItem, {});
            res.redirect(updatedItem.url)
        }
    })
]