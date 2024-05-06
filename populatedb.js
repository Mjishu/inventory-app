
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item.js");
  const Category = require("./models/categories.js");
  //const ItemInstance = require("./models/iteminstance");
  
  const items = [];
  const categories = [];
  //const iteminstance = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function categoriesCreate(index, name,desc) {
    const categoriesDetail = {name:name, desc:desc};
    const category = new Category(categoriesDetail);
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, name,desc,numInstock, sku, price,category) { //! Fix the sinside of this
    const itemdetail = {
      name:name,
      desc:desc,
      numInstock:numInstock,
      sku:sku,
      price:price

    };
    if (category != false) itemdetail.category = category;
  
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  async function createCategories() {
    console.log("Adding genres");
    await Promise.all([
      categoriesCreate(0,"Electronics","Includes IOT, Phones, Computers and more!"),
      categoriesCreate(1,"Outdoors", "Tools for yardwork, gardening and more"),
      categoriesCreate(2,"Grocery", "Ingredients for your next tasy meal"),
      categoriesCreate(3,"Stationary", "writing materials and other office supplies"),
      categoriesCreate(4,"Health and Wellness", "Items to keep your body up to date"),
      categoriesCreate(5,"Entertainment", "What will keep you fresh and without boredom"),
    ]);
  }

  async function createItems() {
    console.log("Adding Books");
    await Promise.all([
      itemCreate(0,"Ibanana 24", "Newest Phone that boasts unbelievable power, runs on potassium and charges off sunlight", 14, "983421097654", 1199.99,[categories[0],categories[5]]),
      itemCreate(1,"Outdoor Broom", "To clean up your messes", 3, "746328901234", 19.99, [categories[1]]),
      itemCreate(2,"Banana", "Yellow things that created a new Phone", 100, "583920572816", .59,[categories[2]]),
      itemCreate(3,"Fountain Pen", "Satisfying Pen to take your work to the next level", 12,"109384756291", 6.80,[categories[3]]),
      itemCreate(4,"Heart Rate Monitor", "To watch your levels as you workout", 4, "152321923212",69.99, [categories[0],categories[4]])
      
    ]);
  }
  