const Category = require("../models/categories")
const Item = require("../models/item")
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async(req,res,next)=>{
    const allCategories = await Category.find({}, "name desc")
    .sort({name: 1})
    .exec()

    res.render("category_list", {title:"Category List", category_list:allCategories})
})

exports.category_detail = asyncHandler(async(req,res,next)=>{
    const [category, allItemsCategory ] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({category:req.params.id}, "name price").exec(),
    ]);

    if (category === null){
      const err = new Error("Category Not Found");
      err.status = 404;
      return next(err);
    }
    res.render("category_detail", {
      title: "Category Detail",
      category: category,
      category_items: allItemsCategory
    });
});

exports.category_create_get = asyncHandler(async(req,res,next)=>{
    res.send("Not Implemented: category_create Get")
})

exports.category_create_post = asyncHandler(async(req,res,next)=>{
    res.send("Not Implemented: category_create Get")
})

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category delete GET");
  });
  
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category delete POST");
  });
  

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category update GET");
  });
  

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category update POST");
  });