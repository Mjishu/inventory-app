const Category = require("../models/categories")
const Item = require("../models/item")
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator")

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
    const [category, allitemsincategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({category:req.params.id}, "name desc price").exec()
    ]);
    if (category ===null){
      res.redirect("/category");
    }

    res.render("category_delete", {
      title: "Category Delete", category:category, category_items:allitemsincategory
    })
  });
  
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allitemsincategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category:req.params.id}, "name desc price").exec()
  ]);
  if(allitemsincategory.length > 0){
    res.render("category_delete", {
      title: "Category Delete", category:category, category_items:allitemsincategory
    });
  }
  else{
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/category")
  }
  
  });
  

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const [category] = await Promise.all([Category.findById(req.params.id).exec(),
    ]);
    if (category === null){
      const err = new Error("Category not found");
      err.status = 404;
      return next(err)
    }

    res.render("category_form", {
      title: "Update Category", category:category
    })
  });
  

exports.category_update_post = [
  body("name", "Name must not be empty").trim().isLength({min:1}).escape(),
  body("desc", 'Description must not be empty').trim().isLength({min:1}).escape(),

  asyncHandler(async(req,res,next) => {
    const errors = validationResult(req);

    const category = new Category({
      name:req.body.name, desc: req.body.desc
    });
    if(!errors.isEmpty()){
      res.render("category_form", {
        title:"Update Book", category: category, errors: errors.array()
      });
      return;
    }else{
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    }
  })
]

