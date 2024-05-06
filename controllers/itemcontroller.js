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
    const allCategories = await Promise.all([Category.find().sort({name:1}).exec()])
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
    body("price", "Price must be a number").trim().isFloat().escape(),
    body("category.*").escape(),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        const item = new Item({
            name:req.body.name,
            desc: req.body.desc,
            stock: req.body.stock,
            price:req.body.price,
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

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const [item, allItemCatagories]
  });
  
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete POST");
  });
  

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update GET");
  });
  

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item update POST");
  });