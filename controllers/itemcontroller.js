const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

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
    res.send("Not Implemented: items_detail" + req.params.id)
})

exports.item_create_get = asyncHandler(async(req,res,next)=>{
    res.send("Not Implemented: items_create Get")
})

exports.item_create_post = asyncHandler(async(req,res,next)=>{
    res.send("Not Implemented: items_create Get")
})

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete GET");
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